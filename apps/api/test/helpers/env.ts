/**
 * Ensure test environment variables are set.
 *
 * Constraints:
 * - We default to local dev values for tests.
 * - For CI / docker, you should pass real secrets via env.
 */
export const ensureTestEnv = () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';

  // The API currently contains a fallback secret; tests should be explicit anyway.
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
  process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

  // DB env is optional for pure route wiring tests.
  // If a test hits DB, it must provide DATABASE_URL.
};
