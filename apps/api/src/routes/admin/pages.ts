import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminPagesController from '../../controllers/adminPagesController';
import { adminPageSchemas } from '../../swagger/schemas';

const adminPagesRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));

  server.get('/', { schema: adminPageSchemas.list, handler: adminPagesController.listPages });
  server.get('/:id', { schema: adminPageSchemas.getById, handler: adminPagesController.getPageById });
  server.post('/', { schema: adminPageSchemas.create, handler: adminPagesController.createPage });
  server.put('/:id', { schema: adminPageSchemas.update, handler: adminPagesController.updatePage });
  server.delete('/:id', { schema: adminPageSchemas.delete, handler: adminPagesController.deletePage });

  server.get('/:id/sections', { schema: adminPageSchemas.listSections, handler: adminPagesController.listPageSections });
  server.post('/:id/sections', { schema: adminPageSchemas.createSection, handler: adminPagesController.createPageSection });
  server.put('/:id/sections/:sectionId', { schema: adminPageSchemas.updateSection, handler: adminPagesController.updatePageSection });
  server.delete('/:id/sections/:sectionId', { schema: adminPageSchemas.deleteSection, handler: adminPagesController.deletePageSection });
};

export default adminPagesRoutes;
