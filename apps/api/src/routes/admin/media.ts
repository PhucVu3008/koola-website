import { FastifyInstance } from 'fastify';
import * as adminMediaController from '../../controllers/adminMediaController';
import { adminMediaSchemas } from '../../swagger/schemas';
import { authenticate, authorize } from '../../middleware/auth';

export default async function adminMediaRoutes(server: FastifyInstance) {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.post('/', { schema: adminMediaSchemas.upload, handler: adminMediaController.uploadMedia });
  server.get('/', { schema: adminMediaSchemas.list, handler: adminMediaController.listMedia });
  server.get('/:id', { schema: adminMediaSchemas.getById, handler: adminMediaController.getMediaById });
  server.delete('/:id', { schema: adminMediaSchemas.delete, handler: adminMediaController.deleteMedia });
}
