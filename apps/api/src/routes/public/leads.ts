import { FastifyPluginAsync } from 'fastify';
import * as leadController from '../../controllers/leadController';
import { leadSchemas } from '../../swagger/schemas';

const leadsRoutes: FastifyPluginAsync = async (server) => {
  server.post('/', {
    schema: leadSchemas.create,
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
      },
    },
    handler: leadController.createLead,
  });
};

export default leadsRoutes;
