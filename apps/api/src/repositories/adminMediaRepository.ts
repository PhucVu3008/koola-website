/**
 * Admin Media Repository
 * 
 * Data access layer for media_assets table
 */

import { query } from '../db/index';

interface MediaAsset {
  id: number;
  provider: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_by?: number;
  created_at: Date;
}

/**
 * Create a new media asset record
 */
export const createMedia = async (data: {
  provider: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_by?: number | null;
}): Promise<number> => {
  const sql = `
    INSERT INTO media_assets (
      provider, storage_path, filename, mime_type, size_bytes,
      width, height, alt_text, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  const result = await query(sql, [
    data.provider,
    data.storage_path,
    data.filename,
    data.mime_type,
    data.size_bytes,
    data.width || null,
    data.height || null,
    data.alt_text || null,
    data.created_by || null,
  ]);

  return result[0].id;
};

/**
 * List media assets with pagination
 */
export const listMedia = async (params: {
  page: number;
  pageSize: number;
}): Promise<{ items: MediaAsset[]; total: number }> => {
  const { page, pageSize } = params;
  const offset = (page - 1) * pageSize;

  // Get total count
  const countSql = `SELECT COUNT(*) FROM media_assets`;
  const countResult = await query(countSql);
  const total = parseInt(countResult[0].count);

  // Get paginated items
  const itemsSql = `
    SELECT 
      id, provider, storage_path, filename, mime_type, size_bytes,
      width, height, alt_text, created_by, created_at
    FROM media_assets
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const itemsResult = await query(itemsSql, [pageSize, offset]);

  return {
    items: itemsResult,
    total,
  };
};

/**
 * Get media by ID
 */
export const getMediaById = async (id: number): Promise<MediaAsset | null> => {
  const sql = `
    SELECT 
      id, provider, storage_path, filename, mime_type, size_bytes,
      width, height, alt_text, created_by, created_at
    FROM media_assets
    WHERE id = $1
  `;

  const result = await query(sql, [id]);
  return result[0] || null;
};

/**
 * Delete media (hard delete from DB)
 */
export const deleteMedia = async (id: number): Promise<void> => {
  const sql = `DELETE FROM media_assets WHERE id = $1`;
  await query(sql, [id]);
};
