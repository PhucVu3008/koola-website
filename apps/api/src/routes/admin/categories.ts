import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminTaxonomyController from '../../controllers/adminTaxonomyController';
import { adminCategorySchemas } from '../../swagger/schemas';

const adminCategoriesRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminCategorySchemas.list, handler: adminTaxonomyController.listCategories });
  server.get('/:id', { schema: adminCategorySchemas.getById, handler: adminTaxonomyController.getCategoryById });
  server.post('/', { schema: adminCategorySchemas.create, handler: adminTaxonomyController.createCategory });
  server.put('/:id', { schema: adminCategorySchemas.update, handler: adminTaxonomyController.updateCategory });
  server.delete('/:id', { schema: adminCategorySchemas.delete, handler: adminTaxonomyController.deleteCategory });
};

export default adminCategoriesRoutes;
