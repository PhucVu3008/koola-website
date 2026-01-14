import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminTaxonomyService from '../services/adminTaxonomyService';
import {
  adminCategoryCreateSchema,
  adminCategoryListQuerySchema,
  adminTagCreateSchema,
  adminTagListQuerySchema,
} from '../schemas/taxonomy.schemas';

/**
 * Admin Taxonomy controller.
 *
 * Endpoints:
 * - Categories (mounted at `/v1/admin/categories`)
 *   - `GET /`      list categories by `{ locale, kind }`
 *   - `GET /:id`   get category by id
 *   - `POST /`     create category
 *   - `PUT /:id`   update category (PUT semantics => full body required)
 *   - `DELETE /:id` delete category
 *
 * - Tags (mounted at `/v1/admin/tags`)
 *   - `GET /`      list tags by `{ locale }`
 *   - `GET /:id`   get tag by id
 *   - `POST /`     create tag
 *   - `PUT /:id`   update tag (PUT semantics => full body required)
 *   - `DELETE /:id` delete tag
 */

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Convert a Postgres unique violation into a consistent 409 response.
 */
const handleUniqueViolation = (err: unknown, reply: FastifyReply) => {
  const e = err as any;

  // Postgres unique violation.
  if (e?.code !== '23505') return false;

  // `constraint` is provided by `pg` for many constraint errors.
  const constraint = String(e?.constraint ?? '');

  if (constraint === 'uq_tags_locale_slug') {
    reply.status(409).send(
      errorResponse(ErrorCodes.CONFLICT, 'Tag slug already exists for this locale', {
        field: 'slug',
        constraint,
      })
    );
    return true;
  }

  if (constraint === 'uq_categories_locale_kind_slug') {
    reply.status(409).send(
      errorResponse(ErrorCodes.CONFLICT, 'Category slug already exists for this locale and kind', {
        field: 'slug',
        constraint,
      })
    );
    return true;
  }

  // Fallback for other unique constraints.
  reply.status(409).send(
    errorResponse(ErrorCodes.CONFLICT, 'Duplicate key value violates a unique constraint', {
      constraint,
    })
  );
  return true;
};

// ===== Categories =====

/**
 * GET `/v1/admin/categories`
 */
export const listCategories = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = adminCategoryListQuerySchema.parse(request.query);
  const result = await adminTaxonomyService.listCategories(query);
  return reply.send(successResponse(result.categories));
};

/**
 * GET `/v1/admin/categories/:id`
 */
export const getCategoryById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const category = await adminTaxonomyService.getCategoryById(id);
  if (!category) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Category not found'));
  }
  return reply.send(successResponse(category));
};

/**
 * POST `/v1/admin/categories`
 */
export const createCategory = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = adminCategoryCreateSchema.parse(request.body);
    const id = await adminTaxonomyService.createCategory(body);
    return reply.status(201).send(successResponse({ id }));
  } catch (err) {
    if (handleUniqueViolation(err, reply)) return;
    throw err;
  }
};

/**
 * PUT `/v1/admin/categories/:id`
 */
export const updateCategory = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  // Enforce required core fields for PUT semantics.
  const required = adminCategoryCreateSchema.safeParse(request.body);
  if (!required.success) {
    return reply.status(400).send(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', {
        issues: required.error.issues,
      })
    );
  }

  try {
    const updatedId = await adminTaxonomyService.updateCategory(id, required.data);
    if (!updatedId) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Category not found'));
    }

    return reply.send(successResponse({ id: updatedId }));
  } catch (err) {
    if (handleUniqueViolation(err, reply)) return;
    throw err;
  }
};

/**
 * DELETE `/v1/admin/categories/:id`
 */
export const deleteCategory = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const ok = await adminTaxonomyService.deleteCategory(id);
  if (!ok) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Category not found'));
  }

  return reply.send(successResponse({ ok: true }));
};

// ===== Tags =====

/**
 * GET `/v1/admin/tags`
 */
export const listTags = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = adminTagListQuerySchema.parse(request.query);
  const result = await adminTaxonomyService.listTags(query);
  return reply.send(successResponse(result.tags));
};

/**
 * GET `/v1/admin/tags/:id`
 */
export const getTagById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const tag = await adminTaxonomyService.getTagById(id);
  if (!tag) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Tag not found'));
  }
  return reply.send(successResponse(tag));
};

/**
 * POST `/v1/admin/tags`
 */
export const createTag = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = adminTagCreateSchema.parse(request.body);
    const id = await adminTaxonomyService.createTag(body);
    return reply.status(201).send(successResponse({ id }));
  } catch (err) {
    if (handleUniqueViolation(err, reply)) return;
    throw err;
  }
};

/**
 * PUT `/v1/admin/tags/:id`
 */
export const updateTag = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  // Enforce required core fields for PUT semantics.
  const required = adminTagCreateSchema.safeParse(request.body);
  if (!required.success) {
    return reply.status(400).send(
      errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', {
        issues: required.error.issues,
      })
    );
  }

  try {
    const updatedId = await adminTaxonomyService.updateTag(id, required.data);
    if (!updatedId) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Tag not found'));
    }

    return reply.send(successResponse({ id: updatedId }));
  } catch (err) {
    if (handleUniqueViolation(err, reply)) return;
    throw err;
  }
};

/**
 * DELETE `/v1/admin/tags/:id`
 */
export const deleteTag = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const ok = await adminTaxonomyService.deleteTag(id);
  if (!ok) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Tag not found'));
  }

  return reply.send(successResponse({ ok: true }));
};
