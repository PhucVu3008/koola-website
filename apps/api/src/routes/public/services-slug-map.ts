/**
 * GET /v1/services/slug-map?from_slug=X&from_locale=Y&to_locale=Z
 *
 * Returns the equivalent slug in a different locale for service detail pages.
 * Used for locale switching.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import * as serviceRepository from '../../repositories/serviceRepository';
import { successResponse, errorResponse } from '../../utils/response';

const querySchema = z.object({
  from_slug: z.string().min(1),
  from_locale: z.string().length(2),
  to_locale: z.string().length(2),
});

export default async function (fastify: FastifyInstance) {
  fastify.get('/slug-map', async (request, reply) => {
    const parsed = querySchema.safeParse(request.query);

    if (!parsed.success) {
      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Invalid query parameters', {
          issues: parsed.error.issues,
        })
      );
    }

    const { from_slug, from_locale, to_locale } = parsed.data;

    try {
      // Get the service in the from_locale to find slug_group
      const service = await serviceRepository.findBySlug(from_slug, from_locale);
      
      if (!service || !service.slug_group) {
        return reply.status(404).send(
          errorResponse('NOT_FOUND', 'Service not found')
        );
      }

      // Get the alternate slug in to_locale
      const alternateSlug = await serviceRepository.getServiceAlternateSlug(
        service.slug_group,
        to_locale
      );

      if (!alternateSlug) {
        return reply.status(404).send(
          errorResponse('NOT_FOUND', `Service not available in locale: ${to_locale}`)
        );
      }

      return reply.send(
        successResponse({
          from_slug,
          from_locale,
          to_slug: alternateSlug,
          to_locale,
        })
      );
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send(
        errorResponse('INTERNAL_ERROR', 'Failed to map slug')
      );
    }
  });
}
