import { FastifyRequest, FastifyReply } from 'fastify';
import * as adminServiceService from '../services/adminServiceService';
import {
  adminServiceCreateSchema,
  adminServiceUpdateSchema,
} from '../schemas/services.schemas';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';

/**
 * Admin Services controller.
 *
 * Endpoints (mounted at `/v1/admin/services`):
 * - `GET /`      list services (admin)
 * - `GET /:id`   get service bundle by id (admin)
 * - `POST /`     create service + nested children
 * - `PUT /:id`   update service + nested children (replace only provided nested arrays)
 * - `DELETE /:id` delete service
 *
 * Security:
 * - All routes must be protected by `authenticate` and `authorize(['admin','editor'])`.
 */

const adminServiceListQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * GET `/v1/admin/services`
 */
export const listServices = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = adminServiceListQuerySchema.parse(request.query);

  const result = await adminServiceService.listServices({
    locale: query.locale,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  });

  return reply.send(successResponse(result.services, result.meta));
};

/**
 * GET `/v1/admin/services/:id`
 */
export const getServiceById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const data = await adminServiceService.getServiceById(id);
  if (!data) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Service not found'));
  }

  return reply.send(successResponse(data));
};

/**
 * POST `/v1/admin/services`
 */
export const createService = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = adminServiceCreateSchema.parse(request.body);

    const user = request.user as any;
    const userId = Number(user?.id);
    if (!userId || Number.isNaN(userId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    const id = await adminServiceService.createService({ userId, data: body });

    return reply.status(201).send(successResponse({ id }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }
    throw error;
  }
};

/**
 * PUT `/v1/admin/services/:id`
 */
export const updateService = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);
    const body = adminServiceUpdateSchema.parse(request.body);

    const user = request.user as any;
    const userId = Number(user?.id);
    if (!userId || Number.isNaN(userId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    // Enforce required core fields for PUT semantics.
    const required = adminServiceCreateSchema.safeParse(body);
    if (!required.success) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Missing required fields.', {
          issues: required.error.issues,
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }

    const updatedId = await adminServiceService.updateService({ id, userId, data: required.data });
    if (!updatedId) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Service not found'));
    }

    return reply.send(successResponse({ id: updatedId }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }
    throw error;
  }
};

/**
 * DELETE `/v1/admin/services/:id`
 */
export const deleteService = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const ok = await adminServiceService.deleteService(id);
  if (!ok) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Service not found'));
  }

  return reply.send(successResponse({ ok: true }));
};

/**
 * POST `/v1/admin/services/:id/translate`
 *
 * Sync/Translate service to another locale
 */
const translateRequestSchema = z.object({
  targetLocale: z.enum(['en', 'vi']),
  mode: z.enum(['auto', 'manual']),
});

export const translateService = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const body = translateRequestSchema.parse(request.body);

  const user = request.user as any;
  const userId = Number(user?.id);
  if (!userId || Number.isNaN(userId)) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
  }

  try {
    const translatedId = await adminServiceService.syncTranslation({
      id,
      targetLocale: body.targetLocale,
      mode: body.mode,
      userId,
    });

    return reply.send(
      successResponse({
        id: translatedId,
        message: `Service ${body.mode === 'auto' ? 'auto-translated' : 'copied'} to ${body.targetLocale}`,
      })
    );
  } catch (err: any) {
    return reply.status(400).send(errorResponse(ErrorCodes.BAD_REQUEST, err.message));
  }
};

/**
 * POST `/v1/admin/services/:id/sync-images`
 *
 * Sync images across all locales with the same slug_group
 */
export const syncServiceImages = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const user = request.user as any;
  const userId = Number(user?.id);
  if (!userId || Number.isNaN(userId)) {
    return reply
      .status(401)
      .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
  }

  try {
    await adminServiceService.syncImagesAcrossLocales(id, userId);

    return reply.send(
      successResponse({
        ok: true,
        message: 'Images synced across all locales',
      })
    );
  } catch (err: any) {
    return reply.status(400).send(errorResponse(ErrorCodes.BAD_REQUEST, err.message));
  }
};
