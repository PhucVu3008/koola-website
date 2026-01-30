/**
 * Admin Media Routes
 * 
 * POST /v1/admin/media - Upload media file
 * GET /v1/admin/media - List media assets
 * GET /v1/admin/media/:id - Get media by ID
 * DELETE /v1/admin/media/:id - Delete media
 */

import { FastifyInstance } from 'fastify';
import * as adminMediaController from '../../controllers/adminMediaController';

export default async function adminMediaRoutes(server: FastifyInstance) {
  // Upload media file (multipart/form-data)
  server.post('/', { 
    handler: adminMediaController.uploadMedia 
  });

  // List media assets (with pagination)
  server.get('/', { 
    handler: adminMediaController.listMedia 
  });

  // Get media by ID
  server.get('/:id', { 
    handler: adminMediaController.getMediaById 
  });

  // Delete media
  server.delete('/:id', { 
    handler: adminMediaController.deleteMedia 
  });
}
