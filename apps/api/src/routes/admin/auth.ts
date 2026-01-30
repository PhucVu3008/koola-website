import { FastifyPluginAsync } from 'fastify';
import * as authController from '../../controllers/authController';
import { checkIPBlocking } from '../../middleware/ipBlocking';

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
 * Security:
 * - These endpoints are public (no JWT) and MUST be rate limited.
 * - Login endpoint has IP blocking middleware (30s block after 5 failed attempts).
 *
 * Validation:
 * - Body validation is performed inside `authController` using Zod.
 */
const authRoutes: FastifyPluginAsync = async (server) => {
  // Login
  server.post('/login', {
    preHandler: [checkIPBlocking], // Check if IP is blocked before processing
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute',
      },
    },
    handler: authController.login,
  });

  // Refresh token
  server.post('/refresh', {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 minute',
      },
    },
    handler: authController.refresh,
  });

  // Logout
  server.post('/logout', {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 minute',
      },
    },
    handler: authController.logout,
  });
};

export default authRoutes;
