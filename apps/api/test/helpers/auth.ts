import type { FastifyInstance } from 'fastify';

/**
 * Create a test access token for admin routes.
 *
 * Why we do this instead of calling `/v1/admin/auth/login`:
 * - Keeps tests fast.
 * - Avoids depending on seed data/password hashing or refresh-token persistence.
 *
 * Constraints:
 * - This matches what `authenticate`/`authorize` expects (`request.user.roles[].name`).
 *
 * Important:
 * - Some admin endpoints write `updated_by` (FK -> `users.id`). Tests must ensure
 *   the referenced user exists (see `ensureTestAdminUser()`).
 */
export const createAdminAccessToken = (server: FastifyInstance) => {
  return server.jwt.sign({
    id: 1,
    email: 'admin@test.local',
    roles: [{ id: 1, name: 'admin' }],
  });
};
