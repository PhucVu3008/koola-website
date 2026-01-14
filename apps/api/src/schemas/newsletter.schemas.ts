import { z } from 'zod';

// ============ NEWSLETTER SCHEMAS ============

/**
 * Schema for newsletter subscription.
 *
 * Used by: `POST /v1/newsletter/subscribe`
 *
 * @example
 * { "email": "tester@example.com", "source_path": "/blog" }
 */
export const newsletterSubscribeSchema = z.object({
  email: z.string().email(),
  source_path: z.string().optional(),
});

/**
 * Schema for newsletter unsubscription.
 *
 * Used by: `POST /v1/newsletter/unsubscribe`
 *
 * @example
 * { "email": "tester@example.com" }
 */
export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email(),
});

/**
 * TypeScript type inferred from {@link newsletterSubscribeSchema}.
 */
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

/**
 * TypeScript type inferred from {@link newsletterUnsubscribeSchema}.
 */
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>;
