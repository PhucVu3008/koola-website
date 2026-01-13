import { query, queryOne } from '../db';
import * as SQL from '../sql/public/posts';

interface PostFilters {
  locale: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

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

export const findBySlug = async (slug: string, locale: string) => {
  return await queryOne(SQL.GET_POST_BY_SLUG, [slug, locale]);
};

export const getPostTags = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_TAGS, [postId, locale]);
};

export const getPostCategories = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_CATEGORIES, [postId, locale]);
};

export const getRelatedPosts = async (postId: number, locale: string) => {
  return await query(SQL.GET_POST_RELATED_POSTS, [postId, locale]);
};
