import { FastifyPluginAsync } from 'fastify';
import { queryOne } from '../../db';
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
  NewsletterSubscribeInput,
} from '../../schemas';
import * as SQL from '../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../utils/response';

/**
 * Public Newsletter routes.
 *
 * Mounted at: `/v1/newsletter`
 *
 * Endpoints:
 * - `POST /subscribe`   -> create/update a newsletter subscriber
 * - `POST /unsubscribe` -> unsubscribe by email
 *
 * Security:
 * - Both endpoints are public and rate limited.
 * - All SQL is parameterized.
 */
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

  // Unsubscribe from newsletter
  server.post('/unsubscribe', async (request, reply) => {
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
