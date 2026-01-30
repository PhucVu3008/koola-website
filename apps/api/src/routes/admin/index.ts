import { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth';
import usersRoutes from './users';
import servicesRoutes from './services';
import postsRoutes from './posts';
import categoriesRoutes from './categories';
import tagsRoutes from './tags';
import leadsRoutes from './leads';
import newsletterSubscribersRoutes from './newsletterSubscribers';
import navItemsRoutes from './navItems';
import siteSettingsRoutes from './siteSettings';
import pagesRoutes from './pages';
import mediaRoutes from './media';

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

  // User management routes (admin/manager access)
  await server.register(usersRoutes, { prefix: '/users' });

  // Protected CRUD routes
  await server.register(servicesRoutes, { prefix: '/services' });
  await server.register(postsRoutes, { prefix: '/posts' });
  await server.register(categoriesRoutes, { prefix: '/categories' });
  await server.register(tagsRoutes, { prefix: '/tags' });
  await server.register(leadsRoutes, { prefix: '/leads' });
  await server.register(newsletterSubscribersRoutes, { prefix: '/newsletter-subscribers' });
  await server.register(navItemsRoutes, { prefix: '/nav-items' });
  await server.register(siteSettingsRoutes, { prefix: '/site-settings' });
  await server.register(pagesRoutes, { prefix: '/pages' });
  await server.register(mediaRoutes, { prefix: '/media' });
};

export default adminRoutes;
