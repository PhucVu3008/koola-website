import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../../db';
import { pageQuerySchema } from '../../../schemas';
import * as SQL from '../../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../../utils/response';

/**
 * About page aggregation routes.
 *
 * Mounted at: `/v1/pages/about`
 * Endpoint:
 * - `GET /aggregate?locale=en`
 */
const aboutRoutes: FastifyPluginAsync = async (server) => {
  server.get('/aggregate', async (request, reply) => {
    const { locale } = pageQuerySchema.parse(request.query);

    const page = await queryOne(SQL.GET_PAGE_BY_SLUG, ['about', locale]);
    if (!page) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
    }

    const sections = await query(SQL.GET_PAGE_SECTIONS, [page.id]);

    const byKey = new Map<string, any>();
    for (const s of sections as any[]) {
      if (typeof s.section_key === 'string') byKey.set(s.section_key, s.payload);
    }

    const requiredKeys = [
      'about_intro',
      'about_story',
      'about_milestone',
      'about_team_roles',
      'about_trusted',
      'about_testimonials',
      'about_timeline',
      'about_performance',
      'about_cta',
    ];

    const missing = requiredKeys.filter((k) => !byKey.has(k));
    if (missing.length) {
      return reply
        .status(500)
        .send(
          errorResponse(
            ErrorCodes.INTERNAL_ERROR,
            'About page content is not configured in DB',
            {
              missing_section_keys: missing,
              hint:
                'Seed page_sections for slug=about with the required section_key payloads (see GET /v1/pages/about/aggregate).',
            }
          )
        );
    }

    const pick = (key: string) => byKey.get(key);

    const payload = {
      intro: pick('about_intro'),
      story: pick('about_story'),
      milestone: pick('about_milestone'),
      team: pick('about_team_roles'),
      trusted: pick('about_trusted'),
      testimonials: pick('about_testimonials'),
      timeline: pick('about_timeline'),
      performance: pick('about_performance'),
      cta: pick('about_cta'),
    };

    return reply.send(successResponse(payload));
  });
};

export default aboutRoutes;
