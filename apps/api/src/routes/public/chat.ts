import type { FastifyPluginAsync } from 'fastify';
import * as chatController from '../../controllers/chatController';

const chatRoutes: FastifyPluginAsync = async (server) => {
  server.post(
    '/',
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute',
        },
      },
    },
    chatController.chat
  );
};

export default chatRoutes;
