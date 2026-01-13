import { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth';

const adminRoutes: FastifyPluginAsync = async (server) => {
  // Auth routes (no JWT required)
  await server.register(authRoutes, { prefix: '/auth' });

  // TODO: Add protected admin routes here
  // - /services (CRUD)
  // - /posts (CRUD)
  // - /categories (CRUD)
  // - /tags (CRUD)
  // - /media (upload/list/delete)
  // - /pages and /pages/:id/sections
  // - /nav-items
  // - /site-settings
  // - /leads
  // - /newsletter-subscribers
  // - /ads
  // - /jobs and /job-applications
  // - /users and /roles
};

export default adminRoutes;
