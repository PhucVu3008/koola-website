import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminLeadController from '../../controllers/adminLeadController';
import { adminLeadSchemas } from '../../swagger/schemas';

const adminLeadsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminLeadSchemas.list, handler: adminLeadController.listLeads });
  server.patch('/:id/status', { schema: adminLeadSchemas.patchStatus, handler: adminLeadController.patchLeadStatus });
};

export default adminLeadsRoutes;
