import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../../db';
import { pageQuerySchema } from '../../../schemas';
import * as SQL from '../../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../../utils/response';

/**
 * Careers page aggregation routes.
 *
 * Mounted at: `/v1/pages/careers`
 * Endpoint:
 * - `GET /aggregate?locale=en`
 */
const careersRoutes: FastifyPluginAsync = async (server) => {
  server.get('/aggregate', async (request, reply) => {
    const { locale } = pageQuerySchema.parse(request.query);

    const page = await queryOne(SQL.GET_PAGE_BY_SLUG, ['careers', locale]);
    if (!page) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
    }

    const sections = await query(SQL.GET_PAGE_SECTIONS, [page.id]);

    const byKey = new Map<string, any>();
    for (const s of sections as any[]) {
      if (typeof s.section_key === 'string') byKey.set(s.section_key, s.payload);
    }

    const requiredKeys = [
      'careers_hero',
      'careers_pride',
      'careers_culture',
    ];

    const missing = requiredKeys.filter((k) => !byKey.has(k));
    if (missing.length) {
      return reply
        .status(500)
        .send(
          errorResponse(
            ErrorCodes.INTERNAL_ERROR,
            'Careers page content is not configured in DB',
            {
              missing_section_keys: missing,
              hint:
                'Seed page_sections for slug=careers with the required section_key payloads (see GET /v1/pages/careers/aggregate).',
            }
          )
        );
    }

    const pick = (key: string) => byKey.get(key);

    const payload = {
      hero: pick('careers_hero'),
      pride: pick('careers_pride'),
      culture: pick('careers_culture'),
    };

    return reply.send(successResponse(payload));
  });
};

export default careersRoutes;
