import { FastifyPluginAsync } from 'fastify';
import * as adminServiceController from '../../controllers/adminServiceController';
import { authenticate, authorize } from '../../middleware/auth';
import { adminServiceSchemas } from '../../swagger/schemas';

const adminServicesRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminServiceSchemas.list, handler: adminServiceController.listServices });
  server.get('/:id', { schema: adminServiceSchemas.getById, handler: adminServiceController.getServiceById });
  server.post('/', { schema: adminServiceSchemas.create, handler: adminServiceController.createService });
  server.put('/:id', { schema: adminServiceSchemas.update, handler: adminServiceController.updateService });
  server.delete('/:id', { schema: adminServiceSchemas.delete, handler: adminServiceController.deleteService });
  server.post('/:id/translate', { schema: adminServiceSchemas.translate, handler: adminServiceController.translateService });
  server.post('/:id/sync-images', { schema: adminServiceSchemas.syncImages, handler: adminServiceController.syncServiceImages });
};

export default adminServicesRoutes;
