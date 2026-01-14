import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminLeadController from '../../controllers/adminLeadController';

/**
 * Admin Leads routes.
 *
 * Mounted at: `/v1/admin/leads`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` or `editor` via `authorize([...])`.
 */
const adminLeadsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'editor']));

  server.get('/', { handler: adminLeadController.listLeads });
  server.patch('/:id/status', { handler: adminLeadController.patchLeadStatus });
};

export default adminLeadsRoutes;
