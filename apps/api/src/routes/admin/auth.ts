import { FastifyPluginAsync } from 'fastify';
import * as authController from '../../controllers/authController';

/**
 * Admin Auth routes.
 *
 * Mounted at: `/v1/admin/auth`
 *
 * Endpoints:
 * - `POST /login`   -> issue access + refresh tokens
 * - `POST /refresh` -> mint a new access token
 * - `POST /logout`  -> revoke refresh tokens
 *
 * Validation:
 * - Body validation is performed inside `authController` using Zod.
 */
const authRoutes: FastifyPluginAsync = async (server) => {
  // Login
  server.post('/login', {
    handler: authController.login,
  });

  // Refresh token
  server.post('/refresh', {
    handler: authController.refresh,
  });

  // Logout
  server.post('/logout', {
    handler: authController.logout,
  });
};

export default authRoutes;
