import { FastifyPluginAsync } from 'fastify';
import { pool } from '../../../db';
import { successResponse } from '../../../utils/response';

/**
 * Services page aggregate endpoint.
 *
 * Returns hero, midQuote, and CTA data for the services listing page.
 *
 * GET /v1/services/page?locale=en
 */
const servicesPageRoutes: FastifyPluginAsync = async (server) => {
  server.get('/page', async (request, reply) => {
    const { locale = 'en' } = request.query as { locale?: string };

    // Fetch services page content from page_sections
    const pageQuery = `
      SELECT p.id as page_id, ps.section_key, ps.payload
      FROM pages p
      JOIN page_sections ps ON ps.page_id = p.id
      WHERE p.locale = $1 AND p.slug = 'services'
      ORDER BY ps.sort_order ASC
    `;

    const { rows } = await pool.query(pageQuery, [locale]);

    if (rows.length === 0) {
      return reply.code(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Services page not found for this locale',
        },
      });
    }

    // Map sections
    const sections: Record<string, any> = {};
    for (const row of rows) {
      sections[row.section_key] = row.payload;
    }

    // Validate required sections
    const required = ['services_hero', 'services_mid_quote', 'services_cta'];
    const missing = required.filter((key) => !sections[key]);

    if (missing.length > 0) {
      return reply.code(500).send({
        error: {
          code: 'INTERNAL',
          message: `Missing required page sections: ${missing.join(', ')}. Please update seed data.`,
        },
      });
    }

    return reply.send(
      successResponse({
        hero: sections.services_hero,
        midQuote: sections.services_mid_quote,
        cta: sections.services_cta,
      })
    );
  });
};

export default servicesPageRoutes;
