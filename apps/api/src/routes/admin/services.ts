import { FastifyPluginAsync } from 'fastify';
import * as adminServiceController from '../../controllers/adminServiceController';
import { authenticate, authorize } from '../../middleware/auth';

/**
 * Admin Services routes.
 *
 * Mounted at: `/v1/admin/services`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin`, `manager`, or `editor` via `authorize([...])`.
 */
const adminServicesRoutes: FastifyPluginAsync = async (server) => {
  // Protect all endpoints under this router.
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminServiceController.listServices });
  server.get('/:id', { handler: adminServiceController.getServiceById });
  server.post('/', { handler: adminServiceController.createService });
  server.put('/:id', { handler: adminServiceController.updateService });
  server.delete('/:id', { handler: adminServiceController.deleteService });
  
  // Translation sync endpoints
  server.post('/:id/translate', { handler: adminServiceController.translateService });
  server.post('/:id/sync-images', { handler: adminServiceController.syncServiceImages });
};

export default adminServicesRoutes;
