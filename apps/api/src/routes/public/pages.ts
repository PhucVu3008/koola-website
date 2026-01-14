import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../db';
import { pageSlugParamsSchema, pageQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../utils/response';

/**
 * Public Pages routes.
 *
 * Mounted at: `/v1/pages`
 *
 * Endpoint:
 * - `GET /:slug?locale=en` -> returns `{ page, sections[] }`
 *
 * Validation:
 * - Path params and querystring are validated with Zod.
 *
 * Errors:
 * - 404 `NOT_FOUND` when page does not exist.
 */
const pagesRoutes: FastifyPluginAsync = async (server) => {
  // Get page by slug
  server.get<{ Params: { slug: string }; Querystring: { locale?: string } }>(
    '/:slug',
    async (request, reply) => {
      const { slug } = pageSlugParamsSchema.parse(request.params);
      const { locale } = pageQuerySchema.parse(request.query);

      // Get page
      const page = await queryOne(SQL.GET_PAGE_BY_SLUG, [slug, locale]);
      if (!page) {
        return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Page not found'));
      }

      // Get page sections
      const sections = await query(SQL.GET_PAGE_SECTIONS, [page.id]);

      return reply.send(
        successResponse({
          page,
          sections,
        })
      );
    }
  );
};

export default pagesRoutes;
