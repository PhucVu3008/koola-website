import { query, queryOne } from '../db';
import * as SQL from '../sql/public/posts';

/**
 * Filters for listing posts.
 *
 * Notes:
 * - Pagination is done via `limit`/`offset`.
 * - `sort` should match allowed API sort options (validated via Zod at the route/controller layer).
 */
interface PostFilters {
  locale: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

/**
 * Count posts matching the provided filters (for pagination meta).
 *
 * @param filters - Listing filters excluding pagination/sort.
 * @returns Total count as a number.
 *
 * @throws Will throw if the database query fails.
 */
export const countPosts = async (filters: Omit<PostFilters, 'sort' | 'limit' | 'offset'>) => {
  const { locale, category, tag, search } = filters;
  
  const [result] = await query<{ total: string }>(SQL.COUNT_POSTS, [
    locale,
    category || null,
    tag || null,
    search || null,
  ]);
  
  return parseInt(result.total);
};

/**
 * List posts using locale + optional taxonomy filters.
 *
 * @param filters - Post list filters including pagination/sort.
 * @returns Array of post records.
 *
 * @throws Will throw if the database query fails.
 */
export const findPosts = async (filters: PostFilters) => {
  const { locale, category, tag, search, sort, limit, offset } = filters;
  
  return await query(SQL.LIST_POSTS, [
    locale,
    category || null,
    tag || null,
    search || null,
    sort || 'newest',
    limit || 10,
    offset || 0,
  ]);
};

/**
 * Fetch a published post by slug + locale.
 *
 * @param slug - Post slug.
 * @param locale - Locale code.
 * @returns Post record or `null` if not found.
 *
 * @throws Will throw if the database query fails.
 */
export const findBySlug = async (slug: string, locale: string) => {
  return await queryOne(SQL.GET_POST_BY_SLUG, [slug, locale]);
};

/**
 * Get tags for a post.
 *
 * @param postId - Post id.
 * @param locale - Locale code.
 * @returns Tag rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getPostTags = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_TAGS, [postId, locale]);
};

/**
 * Get categories for a post.
 *
 * @param postId - Post id.
 * @param locale - Locale code.
 * @returns Category rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getPostCategories = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_CATEGORIES, [postId, locale]);
};

/**
 * Get related posts for a given post.
 *
 * @param postId - Post id.
 * @param locale - Locale code.
 * @returns Related post rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getRelatedPosts = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_RELATED_POSTS, [postId, locale]);
};
