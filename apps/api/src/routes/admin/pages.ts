import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminPagesController from '../../controllers/adminPagesController';

/**
 * Admin Pages routes.
 *
 * Mounted at: `/v1/admin/pages`
 *
 * Security:
 * - Requires a valid access token (JWT) via `authenticate`.
 * - Requires role `admin` or `editor` via `authorize([...])`.
 */
const adminPagesRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('preHandler', authenticate);
  server.addHook('preHandler', authorize(['admin', 'editor']));

  // Pages
  server.get('/', { handler: adminPagesController.listPages });
  server.get('/:id', { handler: adminPagesController.getPageById });
  server.post('/', { handler: adminPagesController.createPage });
  server.put('/:id', { handler: adminPagesController.updatePage });
  server.delete('/:id', { handler: adminPagesController.deletePage });

  // Sections (nested)
  server.get('/:id/sections', { handler: adminPagesController.listPageSections });
  server.post('/:id/sections', { handler: adminPagesController.createPageSection });
  server.put('/:id/sections/:sectionId', { handler: adminPagesController.updatePageSection });
  server.delete('/:id/sections/:sectionId', { handler: adminPagesController.deletePageSection });
};

export default adminPagesRoutes;
