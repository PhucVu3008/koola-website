import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminNavItemController from '../../controllers/adminNavItemController';
import { adminNavSchemas } from '../../swagger/schemas';

const adminNavItemsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminNavSchemas.list, handler: adminNavItemController.listNavItems });
  server.get('/:id', { schema: adminNavSchemas.getById, handler: adminNavItemController.getNavItemById });
  server.post('/', { schema: adminNavSchemas.create, handler: adminNavItemController.createNavItem });
  server.put('/:id', { schema: adminNavSchemas.update, handler: adminNavItemController.updateNavItem });
  server.delete('/:id', { schema: adminNavSchemas.delete, handler: adminNavItemController.deleteNavItem });
};

export default adminNavItemsRoutes;
