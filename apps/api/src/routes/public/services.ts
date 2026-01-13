import { FastifyPluginAsync } from 'fastify';
import * as serviceController from '../../controllers/serviceController';

const servicesRoutes: FastifyPluginAsync = async (server) => {
  // List services
  server.get('/', {
    handler: serviceController.listServices,
  });

  // Get service by slug
  server.get('/:slug', {
    handler: serviceController.getServiceBySlug,
  });
};

export default servicesRoutes;
