import { FastifyPluginAsync } from 'fastify';
import { queryOne } from '../../db';
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  NewsletterSubscribeInput,
} from '../../schemas';
import * as SQL from '../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../utils/response';
import { newsletterSchemas } from '../../swagger/schemas';
import * as emailService from '../../services/emailService';

const newsletterRoutes: FastifyPluginAsync = async (server) => {
  server.post<{ Body: NewsletterSubscribeInput }>('/subscribe', {
    schema: newsletterSchemas.subscribe,
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

      // Send welcome email (async, non-blocking)
      emailService
        .sendNewsletterWelcome({ email: data.email })
        .catch((error) => {
          console.error('Failed to send newsletter welcome email:', error.message);
        });

      return reply
        .status(201)
        .send(
          successResponse({
            id: subscriber.id,
            message: 'Successfully subscribed to newsletter',
          })
        );
    },
  });

  server.post('/unsubscribe', { schema: newsletterSchemas.unsubscribe }, async (request, reply) => {
    const data = newsletterUnsubscribeSchema.parse(request.body);

    const result = await queryOne(SQL.UNSUBSCRIBE_NEWSLETTER, [data.email]);

    if (!result) {
      return reply
        .status(404)
        .send(
          errorResponse(
            ErrorCodes.NOT_FOUND,
            'Email not found in subscribers list'
          )
        );
    }

    return reply.send(
      successResponse({
        message: 'Successfully unsubscribed from newsletter',
      })
    );
  });
};

export default newsletterRoutes;
