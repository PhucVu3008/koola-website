import { FastifyPluginAsync } from 'fastify';
import { query } from '../../db';
import { navQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';

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
