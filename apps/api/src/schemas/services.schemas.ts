import { z } from 'zod';

// ============ SERVICE SCHEMAS ============

/**
 * Querystring schema for listing services.
 *
 * Used by: `GET /v1/services`
 *
 * Pagination:
 * - `page` starts at 1
 * - `pageSize` is capped at 100
 *
 * @example
 * /v1/services?locale=en&page=1&pageSize=9&sort=order
 */
export const serviceListQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  tag: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(9),
  sort: z.enum(['popular', 'order', 'newest']).default('order'),
});

/**
 * Path params schema for service detail.
 *
 * Used by: `GET /v1/services/:slug`
 */
export const serviceSlugParamsSchema = z.object({
  slug: z.string(),
});

/**
 * Querystring schema for service detail.
 *
 * Used by: `GET /v1/services/:slug`
 */
export const serviceSlugQuerySchema = z.object({
  locale: z.string().default('en'),
});

// Admin schemas

/**
 * Schema for creating a service from the admin panel.
 *
 * Notes:
 * - Nested arrays are optional to allow incremental content creation.
 * - IDs in `tags`, `categories`, `related_services`, `related_posts` refer to existing DB rows.
 */
export const adminServiceCreateSchema = z.object({
  locale: z.string().default('en'),
  title: z.string().min(1),
  slug: z.string().min(1),
  slug_group: z.string().optional(), // For linking translations, defaults to slug if not provided
  excerpt: z.string().optional(),
  content_md: z.string().min(1),
  hero_asset_id: z.number().optional(),
  og_asset_id: z.number().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  canonical_url: z.string().optional(),
  sort_order: z.number().default(0),
  tags: z.array(z.number()).optional(),
  categories: z.array(z.number()).optional(),
  deliverables: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        icon_asset_id: z.number().optional(),
        sort_order: z.number().default(0),
      })
    )
    .optional(),
  process_steps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        sort_order: z.number().default(0),
      })
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        sort_order: z.number().default(0),
      })
    )
    .optional(),
  related_services: z.array(z.number()).optional(),
  related_posts: z.array(z.number()).optional(),
});

/**
 * Schema for updating a service from the admin panel.
 *
 * All fields are optional to support PATCH-like semantics.
 */
export const adminServiceUpdateSchema = adminServiceCreateSchema.partial();

export type ServiceListQuery = z.infer<typeof serviceListQuerySchema>;
export type AdminServiceCreateInput = z.infer<typeof adminServiceCreateSchema>;
export type AdminServiceUpdateInput = z.infer<typeof adminServiceUpdateSchema>;
