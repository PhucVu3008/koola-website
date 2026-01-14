import { z } from 'zod';

/**
 * Admin taxonomy schemas.
 *
 * Used by:
 * - `/v1/admin/categories`
 * - `/v1/admin/tags`
 */

/**
 * Querystring schema for listing categories.
 *
 * Used by: `GET /v1/admin/categories`
 */
export const adminCategoryListQuerySchema = z.object({
  locale: z.string().default('en'),
  kind: z.enum(['post', 'service', 'job']),
});

/**
 * Schema for creating a category.
 */
export const adminCategoryCreateSchema = z.object({
  locale: z.string().default('en'),
  kind: z.enum(['post', 'service', 'job']),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  icon_asset_id: z.number().int().positive().optional(),
  sort_order: z.number().int().default(0),
});

/**
 * Schema for updating a category.
 *
 * Note:
 * - For simplicity and consistency with other admin modules, routes use PUT semantics
 *   and therefore require the full body. Validation enforces this at the controller.
 */
export const adminCategoryUpdateSchema = adminCategoryCreateSchema.partial();

/**
 * Querystring schema for listing tags.
 *
 * Used by: `GET /v1/admin/tags`
 */
export const adminTagListQuerySchema = z.object({
  locale: z.string().default('en'),
});

/**
 * Schema for creating a tag.
 */
export const adminTagCreateSchema = z.object({
  locale: z.string().default('en'),
  name: z.string().min(1),
  slug: z.string().min(1),
});

/**
 * Schema for updating a tag.
 */
export const adminTagUpdateSchema = adminTagCreateSchema.partial();

export type AdminCategoryListQuery = z.infer<typeof adminCategoryListQuerySchema>;
export type AdminCategoryCreateInput = z.infer<typeof adminCategoryCreateSchema>;
export type AdminCategoryUpdateInput = z.infer<typeof adminCategoryUpdateSchema>;

export type AdminTagListQuery = z.infer<typeof adminTagListQuerySchema>;
export type AdminTagCreateInput = z.infer<typeof adminTagCreateSchema>;
export type AdminTagUpdateInput = z.infer<typeof adminTagUpdateSchema>;
