import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminJobController from '../../controllers/adminJobController';
import { adminJobSchemas } from '../../swagger/schemas';

const jobsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminJobSchemas.list, handler: adminJobController.listJobs });
  server.get('/:id', { schema: adminJobSchemas.getById, handler: adminJobController.getJobById });
  server.post('/', { schema: adminJobSchemas.create, handler: adminJobController.createJob });
  server.put('/:id', { schema: adminJobSchemas.update, handler: adminJobController.updateJob });
  server.delete('/:id', { schema: adminJobSchemas.delete, handler: adminJobController.deleteJob });
  server.patch('/:id/status', { schema: adminJobSchemas.updateStatus, handler: adminJobController.updateJobStatus });
  server.get('/:id/applications', { schema: adminJobSchemas.listApplications, handler: adminJobController.getJobApplications });
  server.patch('/:id/applications/:applicationId/status', { schema: adminJobSchemas.updateApplicationStatus, handler: adminJobController.updateApplicationStatus });
};

export default jobsRoutes;
