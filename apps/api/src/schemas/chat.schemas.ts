import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  locale: z.enum(['en', 'vi']).default('en'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        text: z.string().max(2000),
      })
    )
    .max(10)
    .default([]),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
