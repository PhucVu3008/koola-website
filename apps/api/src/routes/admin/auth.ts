import { FastifyPluginAsync } from 'fastify';
import * as authController from '../../controllers/authController';

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
