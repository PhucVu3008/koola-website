import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  API_BASE_URL_SERVER: z.string().url().optional(),
});

/**
 * Read and validate environment variables.
 *
 * Notes:
 * - `NEXT_PUBLIC_API_BASE_URL` is used by client-side (browser) code.
 * - `API_BASE_URL_SERVER` is used by server-side (SSR/SSG) code inside Docker.
 * - If `API_BASE_URL_SERVER` is not set, falls back to `NEXT_PUBLIC_API_BASE_URL`.
 * - In Docker: NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 (for browser)
 *              API_BASE_URL_SERVER=http://api:4000 (for server inside Docker network)
 */
export const env = (() => {
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    API_BASE_URL_SERVER: process.env.API_BASE_URL_SERVER,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables (apps/web): ${parsed.error.message}. ` +
        `Set NEXT_PUBLIC_API_BASE_URL e.g. http://localhost:4000`
    );
  }

  return parsed.data;
})();
