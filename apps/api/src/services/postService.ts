import * as postRepository from '../repositories/postRepository';
import * as sidebarRepository from '../repositories/sidebarRepository';
import { PostListQuery } from '../schemas';
import { buildPaginationMeta } from '../db';

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

export const getPostBySlug = async (slug: string, locale: string) => {
  // Get post
  const post = await postRepository.findBySlug(slug, locale);
  if (!post) {
    return null;
  }

  // Get related data in parallel
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
