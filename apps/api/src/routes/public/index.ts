import { FastifyPluginAsync } from 'fastify';
import servicesRoutes from './services';
import postsRoutes from './posts';
import pagesRoutes from './pages';
import navRoutes from './nav';
import siteRoutes from './site';
import leadsRoutes from './leads';
import newsletterRoutes from './newsletter';
import jobsRoutes from './jobs';

/**
 * Public API routes aggregator.
 *
 * Mounted at: `/v1`
 *
 * Responsibilities:
 * - Register all public route modules.
 * - Own the top-level public URL structure (prefix mapping).
 *
 * Notes:
 * - Each sub-route is responsible for request validation (Zod) and returning
 *   the standard response envelope.
 * - Public form endpoints may apply additional rate limiting (per-route).
 */
const publicRoutes: FastifyPluginAsync = async (server) => {
  // Register all public route modules
  await server.register(servicesRoutes, { prefix: '/services' });
  await server.register(postsRoutes, { prefix: '/posts' });
  await server.register(pagesRoutes, { prefix: '/pages' });
  await server.register(navRoutes, { prefix: '/nav' });
  await server.register(siteRoutes, { prefix: '/site' });
  await server.register(leadsRoutes, { prefix: '/leads' });
  await server.register(newsletterRoutes, { prefix: '/newsletter' });
  await server.register(jobsRoutes, { prefix: '/jobs' });
};

export default publicRoutes;
