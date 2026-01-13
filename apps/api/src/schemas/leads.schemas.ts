import { z } from 'zod';

// ============ LEAD SCHEMAS ============

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

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
