import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminUserController from '../../controllers/adminUserController';
import { adminUserSchemas } from '../../swagger/schemas';

const adminUsersRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);

  server.get('/roles', { schema: adminUserSchemas.listRoles, preHandler: authorize(['admin', 'manager']), handler: adminUserController.listRoles });
  server.get('/', { schema: adminUserSchemas.list, preHandler: authorize(['admin', 'manager']), handler: adminUserController.listUsers });
  server.get('/:id', { schema: adminUserSchemas.getById, preHandler: authorize(['admin', 'manager']), handler: adminUserController.getUserById });
  server.post('/', { schema: adminUserSchemas.create, preHandler: authorize(['admin']), handler: adminUserController.createUser });
  server.put('/:id', { schema: adminUserSchemas.update, preHandler: authorize(['admin']), handler: adminUserController.updateUser });
  server.delete('/:id', { schema: adminUserSchemas.delete, preHandler: authorize(['admin']), handler: adminUserController.deleteUser });
  server.put('/:id/password', { schema: adminUserSchemas.changePassword, preHandler: authorize(['admin']), handler: adminUserController.changeUserPassword });
  server.put('/:id/toggle-active', { schema: adminUserSchemas.toggleActive, preHandler: authorize(['admin']), handler: adminUserController.toggleUserActive });
};

export default adminUsersRoutes;
