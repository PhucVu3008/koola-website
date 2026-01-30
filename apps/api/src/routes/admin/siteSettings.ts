import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminSiteSettingsController from '../../controllers/adminSiteSettingsController';

/**
 * Admin Site Settings routes.
 *
 * Mounted at: `/v1/admin/site-settings`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` (recommended) or `editor`.
 *
 * Note:
 * - If you want to restrict settings management to only `admin`, change
 *   `authorize(['admin', 'editor'])` to `authorize(['admin'])`.
 */
const adminSiteSettingsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { handler: adminSiteSettingsController.listSettings });
  server.get('/:key', { handler: adminSiteSettingsController.getSettingByKey });
  server.put('/:key', { handler: adminSiteSettingsController.upsertSetting });
  server.delete('/:key', { handler: adminSiteSettingsController.deleteSetting });
};

export default adminSiteSettingsRoutes;
