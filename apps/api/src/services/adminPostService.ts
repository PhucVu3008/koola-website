import * as adminPostRepository from '../repositories/adminPostRepository';
import { buildPaginationMeta } from '../db';

/**
 * Admin Posts service layer.
 *
 * Responsibilities:
 * - Orchestrate repository calls for admin post management.
 * - Keep business logic out of controllers.
 */

export interface AdminPostListQuery {
  locale: string;
  status?: 'draft' | 'published' | 'archived';
  page: number;
  pageSize: number;
}

/**
 * List posts for the admin UI with pagination.
 */
export const listPosts = async (query: AdminPostListQuery) => {
  const { locale, status, page, pageSize } = query;
  const offset = (page - 1) * pageSize;

  const total = await adminPostRepository.countPosts({ locale, status });
  const posts = await adminPostRepository.listPosts({ locale, status, limit: pageSize, offset });

  return {
    posts,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Get a full editable post bundle by id.
 */
export const getPostById = async (id: number) => {
  return await adminPostRepository.getPostBundleById(id);
};

/**
 * Create a post (plus nested arrays if provided).
 */
export const createPost = async (input: { userId: number; data: any }) => {
  const { userId, data } = input;

  const id = await adminPostRepository.createPostWithNested(
    {
      locale: data.locale,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_md: data.content_md,
      hero_asset_id: data.hero_asset_id,
      og_asset_id: data.og_asset_id,
      author_id: data.author_id,
      status: data.status,
      published_at: data.published_at ?? null,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      canonical_url: data.canonical_url,
      created_by: userId,
    },
    {
      tags: data.tags,
      categories: data.categories,
      related_posts: data.related_posts,
    }
  );

  return id;
};

/**
 * Update a post (and optionally replace nested arrays only when provided).
 */
export const updatePost = async (input: { id: number; userId: number; data: any }) => {
  const { id, userId, data } = input;

  const updatedId = await adminPostRepository.updatePostWithNested(
    id,
    {
      locale: data.locale,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_md: data.content_md,
      hero_asset_id: data.hero_asset_id,
      og_asset_id: data.og_asset_id,
      author_id: data.author_id,
      status: data.status,
      published_at: data.published_at ?? null,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      canonical_url: data.canonical_url,
      updated_by: userId,
    },
    {
      tags: data.tags,
      categories: data.categories,
      related_posts: data.related_posts,
    }
  );

  return updatedId;
};

/**
 * Delete a post by id.
 */
export const deletePost = async (id: number) => {
  return await adminPostRepository.deletePostById(id);
};
