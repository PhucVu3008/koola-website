import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminTaxonomyController from '../../controllers/adminTaxonomyController';
import { adminTagSchemas } from '../../swagger/schemas';

const adminTagsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminTagSchemas.list, handler: adminTaxonomyController.listTags });
  server.get('/:id', { schema: adminTagSchemas.getById, handler: adminTaxonomyController.getTagById });
  server.post('/', { schema: adminTagSchemas.create, handler: adminTaxonomyController.createTag });
  server.put('/:id', { schema: adminTagSchemas.update, handler: adminTaxonomyController.updateTag });
  server.delete('/:id', { schema: adminTagSchemas.delete, handler: adminTaxonomyController.deleteTag });
};

export default adminTagsRoutes;
