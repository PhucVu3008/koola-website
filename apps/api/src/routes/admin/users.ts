import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminUserController from '../../controllers/adminUserController';

/**
 * Admin user management routes.
 *
 * Mounted at `/v1/admin/users`
 *
 * Security:
 * - All routes require authentication
 * - Read operations (GET): accessible by 'admin' and 'manager'
 * - Write operations (POST/PUT/DELETE): accessible by 'admin' only
 */
const adminUsersRoutes: FastifyPluginAsync = async (server) => {
  // Apply authentication to all routes
  server.addHook('preHandler', authenticate);

  // List roles - accessible by admin and manager (read-only)
  // IMPORTANT: Must be before /:id route to avoid conflict
  server.get('/roles', {
    preHandler: authorize(['admin', 'manager']),
    handler: adminUserController.listRoles,
  });

  // List users - accessible by admin and manager (read-only)
  server.get('/', {
    preHandler: authorize(['admin', 'manager']),
    handler: adminUserController.listUsers,
  });

  // Get user by ID - accessible by admin and manager (read-only)
  server.get('/:id', {
    preHandler: authorize(['admin', 'manager']),
    handler: adminUserController.getUserById,
  });

  // Create user - admin only
  server.post('/', {
    preHandler: authorize(['admin']),
    handler: adminUserController.createUser,
  });

  // Update user - admin only
  server.put('/:id', {
    preHandler: authorize(['admin']),
    handler: adminUserController.updateUser,
  });

  // Delete user - admin only
  server.delete('/:id', {
    preHandler: authorize(['admin']),
    handler: adminUserController.deleteUser,
  });

  // Change user password - admin only
  server.put('/:id/password', {
    preHandler: authorize(['admin']),
    handler: adminUserController.changeUserPassword,
  });

  // Toggle user active status - admin only
  server.put('/:id/toggle-active', {
    preHandler: authorize(['admin']),
    handler: adminUserController.toggleUserActive,
  });
};

export default adminUsersRoutes;
