import { FastifyPluginAsync } from 'fastify';
import { query } from '../../db';
import { siteSettingsQuerySchema } from '../../schemas';
import * as SQL from '../../sql/queries';
import { successResponse } from '../../utils/response';

/**
 * Public Site routes.
 *
 * Mounted at: `/v1/site`
 *
 * Endpoint:
 * - `GET /settings?locale=en`
 *
 * Behavior:
 * - Loads key/value site settings from `site_settings`
 * - Loads header/footer navigation items for the requested locale
 * - Returns a bundled payload suitable for building global site chrome
 */
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

    return reply.send(
      successResponse({
        ...settingsObject,
        nav: {
          header: headerNav,
          footer: footerNav,
        },
      })
    );
  });
};

export default siteRoutes;
