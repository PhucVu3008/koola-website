import { FastifyPluginAsync } from 'fastify';
import * as serviceController from '../../controllers/serviceController';
import servicesPageRoutes from './services/page';
import { serviceSchemas } from '../../swagger/schemas';

const servicesRoutes: FastifyPluginAsync = async (server) => {
  await server.register(servicesPageRoutes);

  server.get('/', { schema: serviceSchemas.list, handler: serviceController.listServices });
  server.get('/:slug', { schema: serviceSchemas.getBySlug, handler: serviceController.getServiceBySlug });
};

export default servicesRoutes;
