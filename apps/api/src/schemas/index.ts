/**
 * Schemas aggregator.
 *
 * This module centralizes all Zod schemas used to validate request inputs.
 *
 * Conventions:
 * - Validate *all* external input at the API boundary (route/controller).
 * - Prefer `.parse(...)` so invalid input fails fast with a ZodError.
 * - Zod errors are mapped by the global error handler to:
 *   `400 { error: { code: 'VALIDATION_ERROR', message, details } }`
 *
 * Export strategy:
 * - Most routes import directly from this module (`import { ... } from '../schemas'`).
 * - Feature-specific schemas live in separate files and are re-exported here.
 */

// Barrel export for all schemas
export * from './auth.schemas';
export * from './services.schemas';
export * from './posts.schemas';
export * from './leads.schemas';
export * from './newsletter.schemas';
export * from './taxonomy.schemas';

// Additional schemas for other routes
import { z } from 'zod';

// ============ PAGE SCHEMAS ============

/**
 * Path params for `GET /v1/pages/:slug`.
 */
export const pageSlugParamsSchema = z.object({
  slug: z.string(),
});

/**
 * Querystring for `GET /v1/pages/:slug`.
 */
export const pageQuerySchema = z.object({
  locale: z.string().default('en'),
});

// ============ NAV SCHEMAS ============

/**
 * Querystring for `GET /v1/nav`.
 */
export const navQuerySchema = z.object({
  placement: z.enum(['header', 'footer']),
  locale: z.string().default('en'),
});

// ============ SITE SETTINGS SCHEMAS ============

/**
 * Querystring for `GET /v1/site/settings`.
 */
export const siteSettingsQuerySchema = z.object({
  locale: z.string().default('en'),
});

// ============ JOB SCHEMAS ============

/**
 * Querystring for `GET /v1/jobs`.
 */
export const jobListQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'closed']).default('published'),
});

/**
 * Path params for `GET /v1/jobs/:slug`.
 */
export const jobSlugParamsSchema = z.object({
  slug: z.string(),
});

/**
 * Querystring for `GET /v1/jobs/:slug`.
 */
export const jobSlugQuerySchema = z.object({
  locale: z.string().default('en'),
});

/**
 * Body schema for `POST /v1/jobs/:slug/apply`.
 */
export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  linkedIn: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  coverLetter: z.string().optional(),
});
