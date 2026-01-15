import { pool } from '../../src/db';

/**
 * Ensure there is a DB user row matching the JWT used by tests.
 *
 * Some admin endpoints set `updated_by` to `request.user.id` which is a FK to
 * `users.id`. When using an isolated test database (no global seed), tests must
 * create that user explicitly.
 *
 * Notes:
 * - Uses `ON CONFLICT` to be safe across multiple test files.
 * - Only inserts the minimum required columns; keep in sync with schema.
 */
export const ensureTestAdminUser = async () => {
  await pool.query(
    `
    INSERT INTO users (id, email, password_hash, full_name, is_active)
    VALUES (1, $1, $2, $3, true)
    ON CONFLICT (id) DO NOTHING;
  `,
    ['admin@test.local', 'test-password-hash-not-used', 'Test Admin']
  );

  await pool.query(
    `
    INSERT INTO roles (id, name)
    VALUES (1, 'admin')
    ON CONFLICT (id) DO NOTHING;
  `
  );

  await pool.query(
    `
    INSERT INTO user_roles (user_id, role_id)
    VALUES (1, 1)
    ON CONFLICT DO NOTHING;
  `
  );
};
