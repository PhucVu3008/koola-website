import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminTaxonomyController from '../../controllers/adminTaxonomyController';

/**
 * Admin Categories routes.
 *
 * Mounted at: `/v1/admin/categories`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin`, `manager`, or `editor` via `authorize([...])`.
 */
const adminCategoriesRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminTaxonomyController.listCategories });
  server.get('/:id', { handler: adminTaxonomyController.getCategoryById });
  server.post('/', { handler: adminTaxonomyController.createCategory });
  server.put('/:id', { handler: adminTaxonomyController.updateCategory });
  server.delete('/:id', { handler: adminTaxonomyController.deleteCategory });
};

export default adminCategoriesRoutes;
