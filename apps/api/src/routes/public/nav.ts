import { FastifyPluginAsync } from 'fastify';
import { query } from '../../db';
import { navQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';

/**
 * Public Navigation routes.
 *
 * Mounted at: `/v1/nav`
 *
 * Endpoint:
 * - `GET /?placement=header|footer&locale=en`
 *
 * Notes:
 * - Querystring is validated via Zod (`navQuerySchema`).
 * - Returns an ordered list of navigation items for the requested placement.
 */
const navRoutes: FastifyPluginAsync = async (server) => {
  // Get navigation items
  server.get('/', async (request, reply) => {
    const { placement, locale } = navQuerySchema.parse(request.query);

    const items = await query(SQL.GET_NAV_ITEMS, [placement, locale]);

    return reply.send({
      data: items,
    });
  });
};

export default navRoutes;
