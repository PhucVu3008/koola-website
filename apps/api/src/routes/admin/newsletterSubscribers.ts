import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminNewsletterSubscriberController from '../../controllers/adminNewsletterSubscriberController';
import { adminNewsletterSchemas } from '../../swagger/schemas';

const adminNewsletterSubscribersRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminNewsletterSchemas.list, handler: adminNewsletterSubscriberController.listSubscribers });
  server.patch('/:id/status', { schema: adminNewsletterSchemas.patchStatus, handler: adminNewsletterSubscriberController.patchSubscriberStatus });
};

export default adminNewsletterSubscribersRoutes;
