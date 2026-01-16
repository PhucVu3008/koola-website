import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

/**
 * Read and validate environment variables.
 *
 * Notes:
 * - We validate at runtime so misconfigurations fail fast.
 * - `NEXT_PUBLIC_API_BASE_URL` is used by server-side fetchers too.
 */
export const env = (() => {
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables (apps/web): ${parsed.error.message}. ` +
        `Set NEXT_PUBLIC_API_BASE_URL e.g. http://localhost:4000`
    );
  }

  return parsed.data;
})();
