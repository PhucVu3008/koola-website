import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  API_BASE_URL_SERVER: z.string().url().optional(),
  /**
   * Google Analytics 4 Measurement ID.
   * Format: G-XXXXXXXXXX
   * Optional — when absent, GA script is silently skipped (safe for local dev).
   */
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, 'Must match GA4 format: G-XXXXXXXXXX')
    .optional(),
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
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables (apps/web): ${parsed.error.message}. ` +
        `Set NEXT_PUBLIC_API_BASE_URL e.g. http://localhost:4000`
    );
  }

  return parsed.data;
})();

/**
 * Resolve the base URL for uploaded media files served by the API.
 *
 * Problem: `NEXT_PUBLIC_API_BASE_URL` on production is `https://koola.vn/api`
 * (because nginx strips the `/api` prefix before forwarding to Fastify).
 * However, static uploads are served at `/uploads/*` — not under `/api/uploads/*`.
 * Nginx has a separate `location /uploads/` that proxies directly without the prefix.
 *
 * Solution: strip any trailing `/api` path segment from the base URL so the
 * final uploads URL is always `https://koola.vn/uploads/<path>`.
 *
 * Examples:
 *   https://koola.vn/api  → https://koola.vn
 *   http://localhost:4000 → http://localhost:4000  (unchanged, correct for dev)
 *
 * @param storagePath - e.g. "media/1769413291677-il87hb.jpeg"
 * @returns Full URL to the uploaded file
 */
export function resolveUploadUrl(storagePath: string): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  // Strip trailing slash, then strip trailing /api segment if present
  const base = raw.replace(/\/$/, '').replace(/\/api$/, '');
  return `${base}/uploads/${storagePath}`;
}
