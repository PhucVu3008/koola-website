import { FastifyRequest, FastifyReply } from 'fastify';
import * as leadService from '../services/leadService';
import { LeadCreateInput } from '../schemas';

export const createLead = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as LeadCreateInput;
  
  const result = await leadService.createLead(data);
  
  return reply.status(201).send({
    data: {
      id: result.id,
      message: 'Thank you for contacting us. We will get back to you soon.',
    },
  });
};
