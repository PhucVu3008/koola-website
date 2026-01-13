import { FastifyRequest, FastifyReply } from 'fastify';
import * as serviceService from '../services/serviceService';
import { ServiceListQuery } from '../schemas';

export const listServices = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as ServiceListQuery;
  
  const result = await serviceService.listServices(query);
  
  return reply.send({
    data: result.services,
    meta: result.meta,
  });
};

export const getServiceBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
  const { slug } = request.params as { slug: string };
  const { locale = 'en' } = request.query as { locale?: string };
  
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
