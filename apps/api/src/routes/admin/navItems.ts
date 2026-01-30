import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminNavItemController from '../../controllers/adminNavItemController';

/**
 * Admin Nav Items routes.
 *
 * Mounted at: `/v1/admin/nav-items`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` or `editor` via `authorize([...])`.
 */
const adminNavItemsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminNavItemController.listNavItems });
  server.get('/:id', { handler: adminNavItemController.getNavItemById });
  server.post('/', { handler: adminNavItemController.createNavItem });
  server.put('/:id', { handler: adminNavItemController.updateNavItem });
  server.delete('/:id', { handler: adminNavItemController.deleteNavItem });
};

export default adminNavItemsRoutes;
