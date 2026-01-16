import { buildServer } from './server';

/**
 * Compatibility wrapper.
 *
 * This project has a single source of truth for Fastify configuration:
 * {@link buildServer} in `server.ts`.
 *
 * Why this file still exists:
 * - Some tooling or older imports may expect `initializeApp()`/default export.
 * - Keeping this thin wrapper avoids configuration drift between multiple
 *   bootstraps (CORS/JWT/rate-limit/error handling).
 */

/**
 * Initialize and return a fully configured Fastify instance.
 *
 * @deprecated Prefer importing `buildServer` from `./server` directly.
 */
export const initializeApp = async () => {
  return await buildServer();
};

/**
 * Default export kept for backward compatibility.
 *
 * Note: This is a Promise to discourage using this default export directly.
 */
const appPromise = buildServer();
export default appPromise;
