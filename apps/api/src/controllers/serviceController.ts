import { FastifyRequest, FastifyReply } from 'fastify';
import * as serviceService from '../services/serviceService';
import {
  ServiceListQuery,
  serviceListQuerySchema,
  serviceSlugParamsSchema,
  serviceSlugQuerySchema,
} from '../schemas';

/**
 * GET `/v1/services`
 *
 * List services with optional filters and pagination.
 *
 * Inputs (querystring):
 * - `locale` (default: `en`)
 * - `status` (optional: `draft|published|archived`)
 * - `tag` (optional: tag slug)
 * - `category` (optional: category slug)
 * - `page` (int, >= 1)
 * - `pageSize` (int, 1..100)
 * - `sort` (e.g. `order|newest` depending on schema)
 *
 * Response (200):
 * ```json
 * { "data": [], "meta": { "page": 1, "pageSize": 9, "total": 123, "totalPages": 14 } }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` when querystring does not match schema
 *
 * @example
 * GET /v1/services?locale=en&page=1&pageSize=9&sort=order
 */
export const listServices = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = serviceListQuerySchema.parse(request.query) as ServiceListQuery;

  const result = await serviceService.listServices(query);

  return reply.send({
    data: result.services,
    meta: result.meta,
  });
};

/**
 * GET `/v1/services/:slug`
 *
 * Fetch a bundled service detail payload.
 *
 * Inputs:
 * - params: `slug` (string)
 * - query: `locale` (default: `en`)
 *
 * Response (200):
 * ```json
 * {
 *   "data": {
 *     "service": {},
 *     "tags": [],
 *     "categories": [],
 *     "deliverables": [],
 *     "process_steps": [],
 *     "faqs": [],
 *     "related_services": [],
 *     "related_posts": [],
 *     "sidebar": { "tags": [], "ads": [] }
 *   }
 * }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` when params/query do not match schema
 * - 404 `NOT_FOUND` when service does not exist
 *
 * @example
 * GET /v1/services/ai-chatbot-development?locale=en
 */
export const getServiceBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
  const { slug } = serviceSlugParamsSchema.parse(request.params);
  const { locale } = serviceSlugQuerySchema.parse(request.query);

  const result = await serviceService.getServiceBySlug(slug, locale);

  if (!result) {
    return reply.status(404).send({
      error: {
        code: 'NOT_FOUND',
        message: 'Service not found',
      },
    });
  }

  return reply.send({
    data: result,
  });
};
