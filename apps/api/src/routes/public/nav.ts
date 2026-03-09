import { FastifyPluginAsync } from 'fastify';
import { query } from '../../db';
import { navQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';
import { successResponse } from '../../utils/response';
import { navSchemas } from '../../swagger/schemas';

const navRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', { schema: navSchemas.list }, async (request, reply) => {
    const { placement, locale } = navQuerySchema.parse(request.query);

    const items = await query(SQL.GET_NAV_ITEMS, [placement, locale]);

    return reply.send(successResponse(items));
  });
};

export default navRoutes;
