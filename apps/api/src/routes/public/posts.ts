import { FastifyPluginAsync } from 'fastify';
import * as postController from '../../controllers/postController';

/**
 * Public Posts routes.
 *
 * Mounted at: `/v1/posts`
 *
 * Endpoints:
 * - `GET /`      -> list posts (see `postController.listPosts`)
 * - `GET /:slug` -> post detail bundle (see `postController.getPostBySlug`)
 *
 * Validation:
 * - Query/params validation is performed inside controllers via Zod schemas.
 * - Errors are normalized by the global error handler.
 */
const postsRoutes: FastifyPluginAsync = async (server) => {
  // List posts
  server.get('/', {
    handler: postController.listPosts,
  });

  // Get post by slug
  server.get('/:slug', {
    handler: postController.getPostBySlug,
  });
};

export default postsRoutes;
