import { FastifyRequest, FastifyReply } from 'fastify';
import * as postService from '../services/postService';
import {
  PostListQuery,
  postListQuerySchema,
  postSlugParamsSchema,
  postSlugQuerySchema,
} from '../schemas';

/**
 * GET `/v1/posts`
 *
 * List posts with optional filters (taxonomy/search) and pagination.
 *
 * Inputs (querystring):
 * - `locale` (default: `en`)
 * - `tag` (optional: tag slug)
 * - `category` (optional: category slug)
 * - `q` (optional: search term)
 * - `page` (int, >= 1)
 * - `pageSize` (int, 1..100)
 * - `sort` (e.g. `newest`)
 *
 * Response (200):
 * ```json
 * { "data": [], "meta": { "page": 1, "pageSize": 10, "total": 123, "totalPages": 13 } }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` when querystring does not match schema
 *
 * @example
 * GET /v1/posts?locale=en&page=1&pageSize=10&sort=newest
 */
export const listPosts = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = postListQuerySchema.parse(request.query) as PostListQuery;

  const result = await postService.listPosts(query);

  return reply.send({
    data: result.posts,
    meta: result.meta,
  });
};

/**
 * GET `/v1/posts/:slug`
 *
 * Fetch a bundled post detail payload.
 *
 * Inputs:
 * - params: `slug`
 * - query: `locale` (default: `en`)
 *
 * Response (200):
 * ```json
 * {
 *   "data": {
 *     "post": {},
 *     "tags": [],
 *     "categories": [],
 *     "related_posts": [],
 *     "sidebar": { "categories": [], "tags": [], "ads": [] }
 *   }
 * }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` when params/query do not match schema
 * - 404 `NOT_FOUND` when post does not exist
 *
 * @example
 * GET /v1/posts/introduction-to-machine-learning?locale=en
 */
export const getPostBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
  const { slug } = postSlugParamsSchema.parse(request.params);
  const { locale } = postSlugQuerySchema.parse(request.query);

  const result = await postService.getPostBySlug(slug, locale);

  if (!result) {
    return reply.status(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Post not found',
      },
    });
  }

  return reply.send({
    data: result,
  });
};
