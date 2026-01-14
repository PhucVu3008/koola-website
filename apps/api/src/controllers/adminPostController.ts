import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import {
  adminPostCreateSchema,
  adminPostUpdateSchema,
} from '../schemas/posts.schemas';
import * as adminPostService from '../services/adminPostService';

/**
 * Admin Posts controller.
 *
 * Endpoints (mounted at `/v1/admin/posts`):
 * - `GET /`      list posts (admin)
 * - `GET /:id`   get post bundle by id (admin)
 * - `POST /`     create post + nested relations
 * - `PUT /:id`   update post + nested relations (replace only provided nested arrays)
 * - `DELETE /:id` delete post
 *
 * Security:
 * - All routes must be protected by `authenticate` and `authorize(['admin','editor'])`.
 */

const adminPostListQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * GET `/v1/admin/posts`
 */
export const listPosts = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = adminPostListQuerySchema.parse(request.query);

  const result = await adminPostService.listPosts({
    locale: query.locale,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  });

  return reply.send(successResponse(result.posts, result.meta));
};

/**
 * GET `/v1/admin/posts/:id`
 */
export const getPostById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const data = await adminPostService.getPostById(id);
  if (!data) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Post not found'));
  }

  return reply.send(successResponse(data));
};

/**
 * POST `/v1/admin/posts`
 */
export const createPost = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = adminPostCreateSchema.parse(request.body);

  const user = request.user as any;
  const userId = Number(user?.id);
  if (!userId || Number.isNaN(userId)) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
  }

  const id = await adminPostService.createPost({ userId, data: body });
  return reply.status(201).send(successResponse({ id }));
};

/**
 * PUT `/v1/admin/posts/:id`
 */
export const updatePost = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const body = adminPostUpdateSchema.parse(request.body);

  const user = request.user as any;
  const userId = Number(user?.id);
  if (!userId || Number.isNaN(userId)) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
  }

  // Enforce required core fields for PUT semantics.
  const required = adminPostCreateSchema.safeParse(body);
  if (!required.success) {
    return reply.status(400).send(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', {
        issues: required.error.issues,
      })
    );
  }

  const updatedId = await adminPostService.updatePost({ id, userId, data: required.data });
  if (!updatedId) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Post not found'));
  }

  return reply.send(successResponse({ id: updatedId }));
};

/**
 * DELETE `/v1/admin/posts/:id`
 */
export const deletePost = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const ok = await adminPostService.deletePost(id);
  if (!ok) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Post not found'));
  }

  return reply.send(successResponse({ ok: true }));
};
