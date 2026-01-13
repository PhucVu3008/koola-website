// Barrel export for all schemas
export * from './auth.schemas';
export * from './services.schemas';
export * from './posts.schemas';
export * from './leads.schemas';
export * from './newsletter.schemas';

// Additional schemas for other routes
import { z } from 'zod';

// ============ PAGE SCHEMAS ============
export const pageSlugParamsSchema = z.object({
  slug: z.string(),
});

export const pageQuerySchema = z.object({
  locale: z.string().default('en'),
});

// ============ NAV SCHEMAS ============
export const navQuerySchema = z.object({
  placement: z.enum(['header', 'footer']),
  locale: z.string().default('en'),
});

// ============ SITE SETTINGS SCHEMAS ============
export const siteSettingsQuerySchema = z.object({
  locale: z.string().default('en'),
});

// ============ JOB SCHEMAS ============
export const jobListQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'closed']).default('published'),
});

export const jobSlugParamsSchema = z.object({
  slug: z.string(),
});

export const jobSlugQuerySchema = z.object({
  locale: z.string().default('en'),
});
