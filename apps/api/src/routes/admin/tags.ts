import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminTaxonomyController from '../../controllers/adminTaxonomyController';

/**
 * Admin Tags routes.
 *
 * Mounted at: `/v1/admin/tags`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` or `editor` via `authorize([...])`.
 */
const adminTagsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'editor']));

  server.get('/', { handler: adminTaxonomyController.listTags });
  server.get('/:id', { handler: adminTaxonomyController.getTagById });
  server.post('/', { handler: adminTaxonomyController.createTag });
  server.put('/:id', { handler: adminTaxonomyController.updateTag });
  server.delete('/:id', { handler: adminTaxonomyController.deleteTag });
};

export default adminTagsRoutes;
