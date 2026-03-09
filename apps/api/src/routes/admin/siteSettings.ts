import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminSiteSettingsController from '../../controllers/adminSiteSettingsController';
import { adminSiteSettingsSchemas } from '../../swagger/schemas';

const adminSiteSettingsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminSiteSettingsSchemas.list, handler: adminSiteSettingsController.listSettings });
  server.get('/:key', { schema: adminSiteSettingsSchemas.getByKey, handler: adminSiteSettingsController.getSettingByKey });
  server.put('/:key', { schema: adminSiteSettingsSchemas.upsert, handler: adminSiteSettingsController.upsertSetting });
  server.delete('/:key', { schema: adminSiteSettingsSchemas.delete, handler: adminSiteSettingsController.deleteSetting });
};

export default adminSiteSettingsRoutes;
