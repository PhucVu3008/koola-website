import { z } from 'zod';

// ============ NEWSLETTER SCHEMAS ============

export const newsletterSubscribeSchema = z.object({
  email: z.string().email(),
  source_path: z.string().optional(),
});

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>;
