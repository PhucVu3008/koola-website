/**
 * Admin Media Service
 * 
 * Business logic for media upload and management
 */

import * as adminMediaRepository from '../repositories/adminMediaRepository';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { MultipartFile } from '@fastify/multipart';

// Note: process.cwd() is /workspace (monorepo root)
// API code is in /workspace/apps/api, so uploads go to /workspace/apps/api/uploads
const UPLOAD_DIR = path.join(process.cwd(), 'apps', 'api', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Upload a media file
 */
export const uploadMedia = async (input: {
  file: MultipartFile;
  userId?: number;
}) => {
  const { file, userId } = input;

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(file.filename);
  const newFilename = `${timestamp}-${randomStr}${ext}`;
  const storagePath = `media/${newFilename}`;
  const fullPath = path.join(UPLOAD_DIR, storagePath);

  // Ensure subdirectory exists
  const subDir = path.dirname(fullPath);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }

  // Save file to disk
  await pipeline(file.file, createWriteStream(fullPath));

  // Get file stats
  const stats = fs.statSync(fullPath);

  // Extract alt_text from fields (if provided)
  const fields = file.fields as any;
  const altText = fields?.alt_text?.value || file.filename.replace(ext, '');

  // Save to database
  const mediaId = await adminMediaRepository.createMedia({
    provider: 'local',
    storage_path: storagePath,
    filename: file.filename,
    mime_type: file.mimetype,
    size_bytes: stats.size,
    alt_text: altText,
    created_by: userId || null,
  });

  return {
    id: mediaId,
    filename: file.filename,
    storage_path: storagePath,
    url: `/uploads/${storagePath}`, // Relative URL (frontend will use localhost:4000)
    mime_type: file.mimetype,
    size_bytes: stats.size,
  };
};

/**
 * List media assets with pagination
 */
export const listMedia = async (params: {
  page: number;
  pageSize: number;
}) => {
  const result = await adminMediaRepository.listMedia(params);
  
  // Add URL field to each item
  return {
    items: result.items.map((item: any) => ({
      ...item,
      url: `/uploads/${item.storage_path}`,
    })),
    total: result.total,
  };
};

/**
 * Get media by ID
 */
export const getMediaById = async (id: number) => {
  const media = await adminMediaRepository.getMediaById(id);
  
  if (!media) {
    return null;
  }

  // Add URL field for frontend consumption
  return {
    ...media,
    url: `/uploads/${media.storage_path}`,
  };
};

/**
 * Delete media (soft delete - mark as deleted but keep file)
 */
export const deleteMedia = async (id: number) => {
  const media = await adminMediaRepository.getMediaById(id);
  
  if (!media) {
    throw new Error('Media not found');
  }

  // Delete from database
  await adminMediaRepository.deleteMedia(id);

  // Optionally delete file from disk (commented out for safety)
  // const fullPath = path.join(UPLOAD_DIR, media.storage_path);
  // if (fs.existsSync(fullPath)) {
  //   fs.unlinkSync(fullPath);
  // }
};
