import { z } from 'zod';

// ============ LEAD SCHEMAS ============

/**
 * Schema for creating a lead (contact form submission).
 *
 * Used by: `POST /v1/leads`
 *
 * Notes:
 * - This endpoint is rate-limited (see routes) to reduce abuse.
 * - Tracking fields (utm_*) are optional and should be supplied by the frontend when available.
 *
 * @example
 * {
 *   "full_name": "Jane Doe",
 *   "email": "jane@example.com",
 *   "message": "Hello KOOLA",
 *   "source_path": "/contact",
 *   "utm_source": "google",
 *   "utm_medium": "cpc",
 *   "utm_campaign": "brand"
 * }
 */
export const leadCreateSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  source_path: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

/**
 * TypeScript type inferred from {@link leadCreateSchema}.
 */
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
