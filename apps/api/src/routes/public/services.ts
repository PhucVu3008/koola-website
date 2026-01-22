import { FastifyPluginAsync } from 'fastify';
import * as serviceController from '../../controllers/serviceController';
import servicesPageRoutes from './services/page';

/**
 * Public Services routes.
 *
 * Mounted at: `/v1/services`
 *
 * Endpoints:
 * - `GET /page`  -> services page aggregate (see `services/page.ts`)
 * - `GET /`      -> list services (see `serviceController.listServices`)
 * - `GET /:slug` -> service detail bundle (see `serviceController.getServiceBySlug`)
 *
 * Validation:
 * - Query/params validation is performed inside controllers via Zod schemas.
 * - Errors are normalized by the global error handler.
 */
const servicesRoutes: FastifyPluginAsync = async (server) => {
  // Services page aggregate
  await server.register(servicesPageRoutes);

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
