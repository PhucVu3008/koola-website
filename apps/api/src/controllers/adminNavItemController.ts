import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminNavItemService from '../services/adminNavItemService';

/**
 * Admin Nav Items controller.
 *
 * Mounted at: `/v1/admin/nav-items`
 *
 * Endpoints:
 * - `GET /?locale=en&placement=header|footer`
 * - `GET /:id`
 * - `POST /`
 * - `PUT /:id`
 * - `DELETE /:id`
 */

const placementSchema = z.enum(['header', 'footer']);

const listQuerySchema = z.object({
  locale: z.string().default('en'),
  placement: placementSchema,
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const upsertBodySchema = z.object({
  locale: z.string().default('en'),
  placement: placementSchema,
  label: z.string().min(1).max(200),
  href: z.string().min(1).max(2048),
  sort_order: z.coerce.number().int().default(0),
  parent_id: z.coerce.number().int().positive().nullable().optional(),
});

/**
 * GET `/v1/admin/nav-items`
 */
export const listNavItems = async (request: FastifyRequest, reply: FastifyReply) => {
  const { locale, placement } = listQuerySchema.parse(request.query);
  const items = await adminNavItemService.listNavItems(locale, placement);
  return reply.send(successResponse(items));
};

/**
 * GET `/v1/admin/nav-items/:id`
 */
export const getNavItemById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const item = await adminNavItemService.getNavItemById(id);
  if (!item) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Nav item not found'));
  }

  return reply.send(successResponse(item));
};

/**
 * POST `/v1/admin/nav-items`
 */
export const createNavItem = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = upsertBodySchema.parse(request.body);

  const result = await adminNavItemService.createNavItem({
    locale: body.locale,
    placement: body.placement,
    label: body.label,
    href: body.href,
    sort_order: body.sort_order,
    parent_id: body.parent_id ?? null,
  });

  if (!result.ok) {
    if (result.error === 'PARENT_NOT_FOUND') {
      return reply
        .status(400)
        .send(errorResponse(ErrorCodes.VALIDATION_ERROR, 'parent_id does not exist'));
    }

    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to create nav item'));
  }

  return reply.status(201).send(successResponse({ id: result.id }));
};

/**
 * PUT `/v1/admin/nav-items/:id`
 */
export const updateNavItem = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const body = upsertBodySchema.parse(request.body);

  const result = await adminNavItemService.updateNavItem(id, {
    locale: body.locale,
    placement: body.placement,
    label: body.label,
    href: body.href,
    sort_order: body.sort_order,
    parent_id: body.parent_id ?? null,
  });

  if (!result.ok) {
    if (result.error === 'NOT_FOUND') {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Nav item not found'));
    }

    if (result.error === 'PARENT_NOT_FOUND') {
      return reply
        .status(400)
        .send(errorResponse(ErrorCodes.VALIDATION_ERROR, 'parent_id does not exist'));
    }

    if (result.error === 'PARENT_SELF') {
      return reply
        .status(400)
        .send(errorResponse(ErrorCodes.VALIDATION_ERROR, 'parent_id cannot equal id'));
    }

    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to update nav item'));
  }

  return reply.send(successResponse({ id: result.id }));
};

/**
 * DELETE `/v1/admin/nav-items/:id`
 */
export const deleteNavItem = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);

  const rowCount = await adminNavItemService.deleteNavItem(id);
  if (!rowCount) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Nav item not found'));
  }

  return reply.send(successResponse({ id }));
};
