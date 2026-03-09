import { FastifyInstance } from 'fastify';
import * as adminMediaController from '../../controllers/adminMediaController';
import { adminMediaSchemas } from '../../swagger/schemas';

export default async function adminMediaRoutes(server: FastifyInstance) {
  server.post('/', { schema: adminMediaSchemas.upload, handler: adminMediaController.uploadMedia });
  server.get('/', { schema: adminMediaSchemas.list, handler: adminMediaController.listMedia });
  server.get('/:id', { schema: adminMediaSchemas.getById, handler: adminMediaController.getMediaById });
  server.delete('/:id', { schema: adminMediaSchemas.delete, handler: adminMediaController.deleteMedia });
}
