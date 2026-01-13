import { FastifyPluginAsync } from 'fastify';
import { query } from '../../db';
import { siteSettingsQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';

const siteRoutes: FastifyPluginAsync = async (server) => {
  // Get site settings
  server.get('/settings', async (request, reply) => {
    const { locale } = siteSettingsQuerySchema.parse(request.query);

    const settings = await query(SQL.GET_SITE_SETTINGS, []);

    // Convert array of key-value pairs to object
    const settingsObject = settings.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    // Get header and footer nav
    const [headerNav, footerNav] = await Promise.all([
      query(SQL.GET_NAV_ITEMS, ['header', locale]),
      query(SQL.GET_NAV_ITEMS, ['footer', locale]),
    ]);

    return reply.send({
      data: {
        ...settingsObject,
        nav: {
          header: headerNav,
          footer: footerNav,
        },
      },
    });
  });
};

export default siteRoutes;
