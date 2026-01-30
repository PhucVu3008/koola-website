import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminPostController from '../../controllers/adminPostController';

/**
 * Admin Posts routes.
 *
 * Mounted at: `/v1/admin/posts`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin`, `manager`, or `editor` via `authorize([...])`.
 */
const adminPostsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminPostController.listPosts });
  server.get('/:id', { handler: adminPostController.getPostById });
  server.post('/', { handler: adminPostController.createPost });
  server.put('/:id', { handler: adminPostController.updatePost });
  server.delete('/:id', { handler: adminPostController.deletePost });
};

export default adminPostsRoutes;
