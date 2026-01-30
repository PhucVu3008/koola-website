import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminNewsletterSubscriberController from '../../controllers/adminNewsletterSubscriberController';

/**
 * Admin Newsletter Subscribers routes.
 *
 * Mounted at: `/v1/admin/newsletter-subscribers`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` or `editor` via `authorize([...])`.
 */
const adminNewsletterSubscribersRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminNewsletterSubscriberController.listSubscribers });
  server.patch('/:id/status', { handler: adminNewsletterSubscriberController.patchSubscriberStatus });
};

export default adminNewsletterSubscribersRoutes;
