import { FastifyPluginAsync } from 'fastify';
import * as postController from '../../controllers/postController';
import { postSchemas } from '../../swagger/schemas';

const postsRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', { schema: postSchemas.list, handler: postController.listPosts });
  server.get('/:slug', { schema: postSchemas.getBySlug, handler: postController.getPostBySlug });
};

export default postsRoutes;
