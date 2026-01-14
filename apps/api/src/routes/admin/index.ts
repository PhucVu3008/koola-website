import { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth';
import servicesRoutes from './services';
import postsRoutes from './posts';
import categoriesRoutes from './categories';
import tagsRoutes from './tags';
import leadsRoutes from './leads';
import newsletterSubscribersRoutes from './newsletterSubscribers';

/**
 * Admin routes aggregator.
 *
 * Mounted at: `/v1/admin`
 *
 * Responsibilities:
 * - Register all admin route modules.
 * - Own the top-level admin URL structure (prefix mapping).
 *
 * Security model:
 * - `/auth/*` endpoints are unauthenticated (login/refresh/logout) but must be
 *   carefully rate-limited at the route level if exposed publicly.
 * - All other admin routes should be protected using `authenticate` and
 *   `authorize([...roles])` middleware.
 *
 * Extend here:
 * - When adding admin CRUD routes (services/posts/taxonomy/media/etc.), register
 *   them in this file with a clear prefix.
 */
const adminRoutes: FastifyPluginAsync = async (server) => {
  // Auth routes (no JWT required)
  await server.register(authRoutes, { prefix: '/auth' });

  // Protected CRUD routes
  await server.register(servicesRoutes, { prefix: '/services' });
  await server.register(postsRoutes, { prefix: '/posts' });
  await server.register(categoriesRoutes, { prefix: '/categories' });
  await server.register(tagsRoutes, { prefix: '/tags' });
  await server.register(leadsRoutes, { prefix: '/leads' });
  await server.register(newsletterSubscribersRoutes, { prefix: '/newsletter-subscribers' });
};

export default adminRoutes;
