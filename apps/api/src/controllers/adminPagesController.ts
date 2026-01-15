import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminPagesService from '../services/adminPagesService';
import { pool } from '../db';

/**
 * Admin Pages controller.
 *
 * Mounted at:
 * - `/v1/admin/pages`
 * - `/v1/admin/pages/:id/sections`
 */

const pageIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const listPagesQuerySchema = z.object({
  locale: z.string().default('en'),
});

const pageUpsertBodySchema = z.object({
  locale: z.string().default('en'),
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  seo_title: z.string().max(200).nullable().optional(),
  seo_description: z.string().max(500).nullable().optional(),
  hero_asset_id: z.coerce.number().int().positive().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  updated_by: z.coerce.number().int().positive().nullable().optional(),
});

const sectionIdParamsSchema = z.object({
  sectionId: z.coerce.number().int().positive(),
});

const sectionUpsertBodySchema = z.object({
  // `page_id` is optional because it is already in the route param `:id`.
  // If provided, it must match `:id`.
  page_id: z.coerce.number().int().positive().optional(),
  section_key: z.string().min(1).max(200),
  payload: z.unknown(),
  sort_order: z.coerce.number().int().default(0),
});

// -------- Pages --------

/**
 * GET `/v1/admin/pages?locale=en`
 */
export const listPages = async (request: FastifyRequest, reply: FastifyReply) => {
  const { locale } = listPagesQuerySchema.parse(request.query);
  const pages = await adminPagesService.listPages(locale);
  return reply.send(successResponse(pages));
};

/**
 * GET `/v1/admin/pages/:id`
 */
export const getPageById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);
  const page = await adminPagesService.getPageById(id);
  if (!page) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
  }
  return reply.send(successResponse(page));
};

/**
 * Resolve a safe `updated_by` value.
 *
 * Why:
 * - `pages.updated_by` is a FK to `users.id`.
 * - In some environments (tests/isolated DB), the JWT user may not exist in DB,
 *   causing hard failures.
 *
 * Behavior:
 * - Prefer explicit `body.updated_by` if provided.
 * - Otherwise try `request.user.id`.
 * - Only return the candidate if `users.id` exists; else return `null`.
 */
const resolveUpdatedBy = async (request: FastifyRequest, bodyUpdatedBy?: number | null) => {
  const authUserId = (request as any).user?.id;
  const candidate =
    bodyUpdatedBy ?? (typeof authUserId === 'number' ? authUserId : Number(authUserId) || null);

  if (!candidate || !Number.isFinite(candidate)) return null;

  const result = await pool.query<{ id: number }>('SELECT id FROM users WHERE id = $1', [candidate]);
  return result.rows[0] ? candidate : null;
};

export const createPage = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = pageUpsertBodySchema.parse(request.body);

  const updatedBy = await resolveUpdatedBy(request, body.updated_by ?? null);

  const id = await adminPagesService.createPage({
    locale: body.locale,
    slug: body.slug,
    title: body.title,
    seo_title: body.seo_title ?? null,
    seo_description: body.seo_description ?? null,
    hero_asset_id: body.hero_asset_id ?? null,
    status: body.status,
    updated_by: updatedBy,
  });

  if (!id) {
    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to create page'));
  }

  return reply.status(201).send(successResponse({ id }));
};

/**
 * PUT `/v1/admin/pages/:id`
 */
export const updatePage = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);
  const body = pageUpsertBodySchema.parse(request.body);

  const updatedBy = await resolveUpdatedBy(request, body.updated_by ?? null);

  const updatedId = await adminPagesService.updatePage(id, {
    locale: body.locale,
    slug: body.slug,
    title: body.title,
    seo_title: body.seo_title ?? null,
    seo_description: body.seo_description ?? null,
    hero_asset_id: body.hero_asset_id ?? null,
    status: body.status,
    updated_by: updatedBy,
  });

  if (!updatedId) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
  }

  return reply.send(successResponse({ id: updatedId }));
};

/**
 * DELETE `/v1/admin/pages/:id`
 */
export const deletePage = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);
  const rowCount = await adminPagesService.deletePage(id);

  if (!rowCount) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
  }

  return reply.send(successResponse({ id }));
};

// -------- Sections --------

/**
 * GET `/v1/admin/pages/:id/sections`
 */
export const listPageSections = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);

  const result = await adminPagesService.listPageSections(id);
  if (!result.ok) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
  }

  return reply.send(successResponse(result.sections));
};

/**
 * POST `/v1/admin/pages/:id/sections`
 */
export const createPageSection = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);
  const body = sectionUpsertBodySchema.parse(request.body);

  if (typeof body.page_id === 'number' && body.page_id !== id) {
    return reply
      .status(400)
      .send(errorResponse(ErrorCodes.VALIDATION_ERROR, 'page_id must match route page id'));
  }

  const created = await adminPagesService.createPageSection({
    page_id: id,
    section_key: body.section_key,
    payload: body.payload,
    sort_order: body.sort_order,
  });

  if (!created.ok) {
    if (created.error === 'PAGE_NOT_FOUND') {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
    }

    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to create section'));
  }

  return reply.status(201).send(successResponse({ id: created.id }));
};

/**
 * PUT `/v1/admin/pages/:id/sections/:sectionId`
 */
export const updatePageSection = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = pageIdParamsSchema.parse(request.params);
  const { sectionId } = sectionIdParamsSchema.parse(request.params);
  const body = sectionUpsertBodySchema.parse(request.body);

  if (typeof body.page_id === 'number' && body.page_id !== id) {
    return reply
      .status(400)
      .send(errorResponse(ErrorCodes.VALIDATION_ERROR, 'page_id must match route page id'));
  }

  const updated = await adminPagesService.updatePageSection(sectionId, {
    page_id: id,
    section_key: body.section_key,
    payload: body.payload,
    sort_order: body.sort_order,
  });

  if (!updated.ok) {
    if (updated.error === 'NOT_FOUND') {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Section not found'));
    }

    if (updated.error === 'PAGE_NOT_FOUND') {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
    }

    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to update section'));
  }

  return reply.send(successResponse({ id: updated.id }));
};

/**
 * DELETE `/v1/admin/pages/:id/sections/:sectionId`
 *
 * Behavior:
 * - Returns 404 if the page or section does not exist, or if the section does not belong to the page.
 *   (We intentionally do not differentiate to avoid leaking cross-page relationships.)
 * - Returns 200 with `{ id: sectionId }` on successful delete.
 */
export const deletePageSection = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id: pageId } = pageIdParamsSchema.parse(request.params);
  const { sectionId } = sectionIdParamsSchema.parse(request.params);

  const existing = await adminPagesService.getPageSectionById(sectionId);
  const existingPageId = existing ? Number((existing as any).page_id) : null;

  if (!existing || !Number.isFinite(existingPageId) || existingPageId !== pageId) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Section not found'));
  }

  const rowCount = await adminPagesService.deletePageSection(sectionId);
  if (!rowCount) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Section not found'));
  }

  return reply.send(successResponse({ id: sectionId }));
};
