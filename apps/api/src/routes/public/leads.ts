import { FastifyPluginAsync } from 'fastify';
import * as leadController from '../../controllers/leadController';

const leadsRoutes: FastifyPluginAsync = async (server) => {
  // Create lead (contact form submission)
  server.post('/', {
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
