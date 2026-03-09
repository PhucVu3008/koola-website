import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminPostController from '../../controllers/adminPostController';
import { adminPostSchemas } from '../../swagger/schemas';

const adminPostsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminPostSchemas.list, handler: adminPostController.listPosts });
  server.get('/:id', { schema: adminPostSchemas.getById, handler: adminPostController.getPostById });
  server.post('/', { schema: adminPostSchemas.create, handler: adminPostController.createPost });
  server.put('/:id', { schema: adminPostSchemas.update, handler: adminPostController.updatePost });
  server.delete('/:id', { schema: adminPostSchemas.delete, handler: adminPostController.deletePost });
};

export default adminPostsRoutes;
