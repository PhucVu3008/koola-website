import { FastifyPluginAsync } from 'fastify';
import * as postController from '../../controllers/postController';

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
