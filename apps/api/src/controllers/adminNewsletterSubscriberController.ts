import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminNewsletterSubscriberService from '../services/adminNewsletterSubscriberService';

/**
 * Admin Newsletter Subscribers controller.
 *
 * Mounted at: `/v1/admin/newsletter-subscribers`
 *
 * Endpoints:
 * - `GET /` -> list subscribers with filtering + pagination
 * - `PATCH /:id/status` -> update subscriber status
 */

const listQuerySchema = z.object({
  status: z.enum(['subscribed', 'unsubscribed']).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const patchStatusBodySchema = z.object({
  status: z.enum(['subscribed', 'unsubscribed']),
});

/**
 * GET `/v1/admin/newsletter-subscribers`
 */
export const listSubscribers = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = listQuerySchema.parse(request.query);

  const result = await adminNewsletterSubscriberService.listSubscribers({
    status: query.status,
    q: query.q,
    page: query.page,
    pageSize: query.pageSize,
  });

  return reply.send(successResponse(result.subscribers, result.meta));
};

/**
 * PATCH `/v1/admin/newsletter-subscribers/:id/status`
 */
export const patchSubscriberStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const { status } = patchStatusBodySchema.parse(request.body);

  const updatedId = await adminNewsletterSubscriberService.updateSubscriberStatus(id, status);
  if (!updatedId) {
    return reply
      .status(404)
      .send(errorResponse(ErrorCodes.NOT_FOUND, 'Newsletter subscriber not found'));
  }

  return reply.send(successResponse({ id: updatedId }));
};
