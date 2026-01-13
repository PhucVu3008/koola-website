import { FastifyPluginAsync } from 'fastify';
import { queryOne } from '../../db';
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  NewsletterSubscribeInput,
} from '../../schemas';
import * as SQL from '../../sql/queries';

const newsletterRoutes: FastifyPluginAsync = async (server) => {
  // Subscribe to newsletter
  server.post<{ Body: NewsletterSubscribeInput }>('/subscribe', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '1 minute',
      },
    },
    handler: async (request, reply) => {
      const data = newsletterSubscribeSchema.parse(request.body);

      const subscriber = await queryOne(SQL.SUBSCRIBE_NEWSLETTER, [
        data.email,
        data.source_path || null,
      ]);

      return reply.status(201).send({
        data: {
          id: subscriber.id,
          message: 'Successfully subscribed to newsletter',
        },
      });
    },
  });

  // Unsubscribe from newsletter
  server.post('/unsubscribe', async (request, reply) => {
    const data = newsletterUnsubscribeSchema.parse(request.body);

    const result = await queryOne(SQL.UNSUBSCRIBE_NEWSLETTER, [data.email]);

    if (!result) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Email not found in subscribers list',
        },
      });
    }

    return reply.send({
      data: {
        message: 'Successfully unsubscribed from newsletter',
      },
    });
  });
};

export default newsletterRoutes;
