import * as postRepository from '../repositories/postRepository';
import * as sidebarRepository from '../repositories/sidebarRepository';
import { PostListQuery } from '../schemas';
import { buildPaginationMeta } from '../db';

/**
 * List published posts with optional taxonomy/search filtering + pagination.
 *
 * This is the business-logic layer for `GET /v1/posts`.
 * Input validation (Zod) is expected to happen at the controller/route layer.
 *
 * @param query - Validated post list query.
 * @returns `{ posts, meta }` where meta matches the API pagination contract.
 *
 * @throws Will throw if underlying repository/database access fails.
 */
export const listPosts = async (query: PostListQuery) => {
  const { locale, category, tag, q, page, pageSize, sort } = query;
  const offset = (page - 1) * pageSize;

  // Get total count
  const total = await postRepository.countPosts({
    locale,
    category,
    tag,
    search: q,
  });

  // Get posts
  const posts = await postRepository.findPosts({
    locale,
    category,
    tag,
    search: q,
    sort,
    limit: pageSize,
    offset,
  });

  return {
    posts,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Fetch a published post detail page payload by slug.
 *
 * This builds the bundled payload required by the public contract:
 * - `post`
 * - `tags[]`
 * - `categories[]`
 * - `related_posts[]`
 * - `sidebar` (categories + tags + ads)
 *
 * @param slug - Post slug.
 * @param locale - Locale code (e.g. `en`).
 * @returns Bundled post detail payload, or `null` when the post does not exist.
 *
 * @throws Will throw if underlying repository/database access fails.
 */
export const getPostBySlug = async (slug: string, locale: string) => {
  // Get post
  const post = await postRepository.findBySlug(slug, locale);
  if (!post) {
    return null;
  }

  // Fetch related data in parallel for latency.
  const [
    tags,
    categories,
    related_posts,
    sidebarCategories,
    sidebarTags,
    sidebarAds,
  ] = await Promise.all([
    postRepository.getPostTags(post.id, locale),
    postRepository.getPostCategories(post.id, locale),
    postRepository.getRelatedPosts(post.id, locale),
    sidebarRepository.getCategories(locale),
    sidebarRepository.getTags(locale),
    sidebarRepository.getAds('post_detail'),
  ]);

  return {
    post,
    tags,
    categories,
    related_posts,
    sidebar: {
      categories: sidebarCategories,
      tags: sidebarTags,
      ads: sidebarAds,
    },
  };
};
