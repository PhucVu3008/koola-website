import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminLeadService from '../services/adminLeadService';

/**
 * Admin Leads controller.
 *
 * Mounted at: `/v1/admin/leads`
 *
 * Endpoints:
 * - `GET /` -> list leads with filtering + pagination
 * - `PATCH /:id/status` -> update lead status
 */

const adminLeadListQuerySchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const leadStatusBodySchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed']),
});

/**
 * GET `/v1/admin/leads`
 */
export const listLeads = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = adminLeadListQuerySchema.parse(request.query);

  const result = await adminLeadService.listLeads({
    status: query.status,
    q: query.q,
    page: query.page,
    pageSize: query.pageSize,
  });

  return reply.send(successResponse(result.leads, result.meta));
};

/**
 * PATCH `/v1/admin/leads/:id/status`
 */
export const patchLeadStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = idParamsSchema.parse(request.params);
  const { status } = leadStatusBodySchema.parse(request.body);

  const updatedId = await adminLeadService.updateLeadStatus(id, status);
  if (!updatedId) {
    return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Lead not found'));
  }

  return reply.send(successResponse({ id: updatedId }));
};
