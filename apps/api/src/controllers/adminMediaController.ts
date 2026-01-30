/**
 * Admin Media Controller
 * 
 * Handles media upload, listing, and management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import * as adminMediaService from '../services/adminMediaService';

/**
 * POST `/v1/admin/media`
 * Upload a media file (multipart/form-data)
 */
export const uploadMedia = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'No file uploaded',
        },
      });
    }

    const userId = (request.user as any)?.userId;
    const result = await adminMediaService.uploadMedia({
      file: data,
      userId,
    });

    return reply.code(201).send({ data: result });
  } catch (err: any) {
    return reply.code(500).send({
      error: {
        code: 'INTERNAL',
        message: err.message || 'Failed to upload media',
      },
    });
  }
};

/**
 * GET `/v1/admin/media`
 * List media assets with pagination
 */
export const listMedia = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const query = request.query as any;
    const page = parseInt(query.page || '1');
    const pageSize = parseInt(query.pageSize || '20');

    const result = await adminMediaService.listMedia({ page, pageSize });

    return reply.send({
      data: result.items,
      meta: {
        page,
        pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (err: any) {
    return reply.code(500).send({
      error: {
        code: 'INTERNAL',
        message: err.message || 'Failed to list media',
      },
    });
  }
};

/**
 * GET `/v1/admin/media/:id`
 * Get media asset by ID
 */
export const getMediaById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const media = await adminMediaService.getMediaById(parseInt(id));

    if (!media) {
      return reply.code(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Media not found',
        },
      });
    }

    return reply.send({ data: media });
  } catch (err: any) {
    return reply.code(500).send({
      error: {
        code: 'INTERNAL',
        message: err.message || 'Failed to get media',
      },
    });
  }
};

/**
 * DELETE `/v1/admin/media/:id`
 * Delete media asset
 */
export const deleteMedia = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    await adminMediaService.deleteMedia(parseInt(id));

    return reply.send({
      data: { message: 'Media deleted successfully' },
    });
  } catch (err: any) {
    return reply.code(500).send({
      error: {
        code: 'INTERNAL',
        message: err.message || 'Failed to delete media',
      },
    });
  }
};
