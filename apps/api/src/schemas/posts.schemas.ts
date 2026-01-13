import { z } from 'zod';

// ============ POST SCHEMAS ============

export const postListQuerySchema = z.object({
  locale: z.string().default('en'),
  category: z.string().optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});

export const postSlugParamsSchema = z.object({
  slug: z.string(),
});

export const postSlugQuerySchema = z.object({
  locale: z.string().default('en'),
});

// Admin schemas
export const adminPostCreateSchema = z.object({
  locale: z.string().default('en'),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content_md: z.string().min(1),
  hero_asset_id: z.number().optional(),
  og_asset_id: z.number().optional(),
  author_id: z.number().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  canonical_url: z.string().optional(),
  tags: z.array(z.number()).optional(),
  categories: z.array(z.number()).optional(),
  related_posts: z.array(z.number()).optional(),
});

export const adminPostUpdateSchema = adminPostCreateSchema.partial();

export type PostListQuery = z.infer<typeof postListQuerySchema>;
export type AdminPostCreateInput = z.infer<typeof adminPostCreateSchema>;
export type AdminPostUpdateInput = z.infer<typeof adminPostUpdateSchema>;
