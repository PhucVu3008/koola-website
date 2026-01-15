import { defineConfig } from 'vitest/config';

/**
 * Vitest config for KOOLA API.
 *
 * Notes:
 * - We run integration-like tests that call Fastify via `server.inject()`.
 * - Tests should be hermetic and use a dedicated test database when possible.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    hookTimeout: 60_000,
    testTimeout: 60_000,
    pool: 'threads',
  },
});
