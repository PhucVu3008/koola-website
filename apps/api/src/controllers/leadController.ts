import { FastifyRequest, FastifyReply } from 'fastify';
import * as leadService from '../services/leadService';
import { LeadCreateInput, leadCreateSchema } from '../schemas';

/**
 * POST `/v1/leads`
 *
 * Create a lead/contact submission.
 *
 * Inputs (body): see `leadCreateSchema`
 * - `full_name` (required)
 * - `email` (required, valid email)
 * - `phone`, `company`, `message` (optional)
 * - `source_path`, `utm_source`, `utm_medium`, `utm_campaign` (optional)
 *
 * Response (201):
 * ```json
 * { "data": { "id": 123, "message": "Thank you for contacting us..." } }
 * ```
 *
 * Errors:
 * - 400 `VALIDATION_ERROR` (invalid body)
 * - 429 rate limit (configured in route)
 *
 * @example
 * POST /v1/leads
 * { "full_name": "Jane", "email": "jane@example.com", "message": "Hi" }
 */
export const createLead = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = leadCreateSchema.parse(request.body) as LeadCreateInput;

  const result = await leadService.createLead(data);

  return reply.status(201).send({
    data: {
      id: result.id,
      message: 'Thank you for contacting us. We will get back to you soon.',
    },
  });
};
