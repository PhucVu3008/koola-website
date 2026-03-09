import { FastifyPluginAsync } from 'fastify';
import * as authController from '../../controllers/authController';
import { checkIPBlocking } from '../../middleware/ipBlocking';
import { adminAuthSchemas } from '../../swagger/schemas';

const authRoutes: FastifyPluginAsync = async (server) => {
  server.post('/login', {
    schema: adminAuthSchemas.login,
    preHandler: [checkIPBlocking],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    handler: authController.login,
  });

  server.post('/refresh', {
    schema: adminAuthSchemas.refresh,
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    handler: authController.refresh,
  });

  server.post('/logout', {
    schema: adminAuthSchemas.logout,
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    handler: authController.logout,
  });
};

export default authRoutes;
