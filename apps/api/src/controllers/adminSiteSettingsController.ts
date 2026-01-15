import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminSiteSettingsService from '../services/adminSiteSettingsService';

/**
 * Admin Site Settings controller.
 *
 * Mounted at: `/v1/admin/site-settings`
 *
 * Endpoints:
 * - `GET /` -> list all settings
 * - `GET /:key` -> get one setting
 * - `PUT /:key` -> upsert (full replace)
 * - `DELETE /:key` -> delete
 */

const keyParamsSchema = z.object({
  key: z.string().min(1).max(200),
});

const upsertBodySchema = z.object({
  value: z.unknown(),
});

/**
 * GET `/v1/admin/site-settings`
 */
export const listSettings = async (_request: FastifyRequest, reply: FastifyReply) => {
  const rows = await adminSiteSettingsService.listSettings();
  return reply.send(successResponse(rows));
};

/**
 * GET `/v1/admin/site-settings/:key`
 */
export const getSettingByKey = async (request: FastifyRequest, reply: FastifyReply) => {
  const { key } = keyParamsSchema.parse(request.params);

  const row = await adminSiteSettingsService.getSettingByKey(key);
  if (!row) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Site setting not found'));
  }

  return reply.send(successResponse(row));
};

/**
 * PUT `/v1/admin/site-settings/:key`
 */
export const upsertSetting = async (request: FastifyRequest, reply: FastifyReply) => {
  const { key } = keyParamsSchema.parse(request.params);
  const { value } = upsertBodySchema.parse(request.body);

  const savedKey = await adminSiteSettingsService.upsertSetting(key, value);
  if (!savedKey) {
    return reply.status(500).send(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Failed to save site setting'));
  }

  return reply.send(successResponse({ key: savedKey }));
};

/**
 * DELETE `/v1/admin/site-settings/:key`
 */
export const deleteSetting = async (request: FastifyRequest, reply: FastifyReply) => {
  const { key } = keyParamsSchema.parse(request.params);

  const deleted = await adminSiteSettingsService.deleteSetting(key);
  if (!deleted) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Site setting not found'));
  }

  return reply.send(successResponse({ key }));
};
