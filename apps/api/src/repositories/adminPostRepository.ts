import { PoolClient } from 'pg';
import { query, queryOne, transaction } from '../db';
import * as AdminPostsSQL from '../sql/admin/posts';
import * as PostsCrudSQL from '../sql/admin/postsCrud';

/**
 * Admin-facing repository for Posts.
 *
 * Responsibilities:
 * - Execute raw SQL (parameterized) needed by `/v1/admin/posts` endpoints.
 * - Perform multi-table writes inside a transaction.
 *
 * Notes:
 * - This repository uses "replace-all" semantics for nested arrays (tags,
 *   categories, related_posts) to keep updates predictable.
 */

export interface AdminPostListFilters {
  locale: string;
  status?: 'draft' | 'published' | 'archived';
  limit: number;
  offset: number;
}

export interface AdminPostCreateRow {
  locale: string;
  title: string;
  slug: string;
  excerpt?: string;
  content_md: string;
  hero_asset_id?: number;
  og_asset_id?: number;
  author_id?: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  created_by: number;
}

export interface AdminPostUpdateRow extends Omit<AdminPostCreateRow, 'created_by'> {
  updated_by: number;
}

export interface AdminPostNestedInput {
  tags?: number[];
  categories?: number[];
  related_posts?: number[];
}

/**
 * List posts for admin.
 */
export const listPosts = async (filters: AdminPostListFilters) => {
  const { locale, status, limit, offset } = filters;
  return await query(PostsCrudSQL.ADMIN_LIST_POSTS, [locale, status ?? null, limit, offset]);
};

/**
 * Count posts for admin pagination.
 */
export const countPosts = async (filters: Omit<AdminPostListFilters, 'limit' | 'offset'>) => {
  const { locale, status } = filters;
  const [row] = await query<{ total: string }>(PostsCrudSQL.ADMIN_COUNT_POSTS, [
    locale,
    status ?? null,
  ]);
  return Number(row?.total ?? 0);
};

/**
 * Get a single post with full nested payload for editing.
 */
export const getPostBundleById = async (id: number) => {
  const post = await queryOne(PostsCrudSQL.ADMIN_GET_POST_BY_ID, [id]);
  if (!post) return null;

  const [tagIds, categoryIds, related] = await Promise.all([
    query<{ id: number }>(PostsCrudSQL.ADMIN_GET_POST_TAG_IDS, [id]),
    query<{ id: number }>(PostsCrudSQL.ADMIN_GET_POST_CATEGORY_IDS, [id]),
    query<{ id: number; sort_order: number }>(PostsCrudSQL.ADMIN_GET_RELATED_POST_IDS, [id]),
  ]);

  return {
    post,
    tags: tagIds.map((t) => t.id),
    categories: categoryIds.map((c) => c.id),
    related_posts: related.map((r) => r.id),
  };
};

/**
 * Create a post and (optionally) its nested relations in a single transaction.
 */
export const createPostWithNested = async (row: AdminPostCreateRow, nested: AdminPostNestedInput) => {
  return await transaction(async (client) => {
    const created = await client
      .query<{ id: number }>(AdminPostsSQL.CREATE_POST, [
        row.locale,
        row.title,
        row.slug,
        row.excerpt ?? null,
        row.content_md,
        row.hero_asset_id ?? null,
        row.og_asset_id ?? null,
        row.author_id ?? null,
        row.status,
        row.published_at ?? null,
        row.seo_title ?? null,
        row.seo_description ?? null,
        row.canonical_url ?? null,
        row.created_by,
      ])
      .then((r) => r.rows[0] || null);

    if (!created) {
      // Defensive; INSERT ... RETURNING should always return.
      throw new Error('Failed to create post');
    }

    await replaceNested(client, created.id, nested);

    return created.id;
  });
};

/**
 * Update a post and (optionally) replace nested relations.
 */
export const updatePostWithNested = async (
  id: number,
  row: AdminPostUpdateRow,
  nested: AdminPostNestedInput
) => {
  return await transaction(async (client) => {
    const updated = await client
      .query<{ id: number }>(AdminPostsSQL.UPDATE_POST, [
        id,
        row.title,
        row.slug,
        row.excerpt ?? null,
        row.content_md,
        row.hero_asset_id ?? null,
        row.og_asset_id ?? null,
        row.author_id ?? null,
        row.status,
        row.published_at ?? null,
        row.seo_title ?? null,
        row.seo_description ?? null,
        row.canonical_url ?? null,
        row.updated_by,
      ])
      .then((r) => r.rows[0] || null);

    if (!updated) return null;

    await replaceNested(client, id, nested);

    return id;
  });
};

/**
 * Delete a post by id.
 *
 * FK edge cases:
 * - The post may appear as `post_related.related_post_id` for other posts.
 * - The post may be referenced by services via `service_related_posts.post_id`.
 */
export const deletePostById = async (id: number) => {
  return await transaction(async (client) => {
    // Remove service relations referencing this post.
    await client.query(PostsCrudSQL.ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_POST, [id]);

    // Remove relations where this post appears on either side.
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_RELATED_BY_EITHER_SIDE, [id]);

    // Remove taxonomy join rows.
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_CATEGORIES, [id]);
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_TAGS, [id]);

    const result = await client.query(AdminPostsSQL.DELETE_POST, [id]);
    return (result.rowCount ?? 0) > 0;
  });
};

/**
 * Replace nested relations for a post.
 *
 * Semantics:
 * - Each nested field is only replaced if it is present on `nested`.
 * - Absence means "do not modify".
 */
const replaceNested = async (client: PoolClient, postId: number, nested: AdminPostNestedInput) => {
  if (nested.tags) {
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_TAGS, [postId]);
    for (const tagId of nested.tags) {
      await client.query(PostsCrudSQL.ADMIN_INSERT_POST_TAG, [postId, tagId]);
    }
  }

  if (nested.categories) {
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_CATEGORIES, [postId]);
    for (const categoryId of nested.categories) {
      await client.query(PostsCrudSQL.ADMIN_INSERT_POST_CATEGORY, [postId, categoryId]);
    }
  }

  if (nested.related_posts) {
    await client.query(PostsCrudSQL.ADMIN_DELETE_POST_RELATED, [postId]);

    for (let i = 0; i < nested.related_posts.length; i++) {
      const relatedId = nested.related_posts[i];
      await client.query(PostsCrudSQL.ADMIN_INSERT_POST_RELATED, [postId, relatedId, i]);
    }
  }
};
