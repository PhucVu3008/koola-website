import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { ensureTestAdminUser } from './helpers/seed';
import { pool } from '../src/db';
import bcrypt from 'bcrypt';

/**
 * Admin auth integration tests.
 *
 * Coverage:
 * - login success
 * - login with wrong password
 * - login with missing fields
 * - protected route without token
 */
describe('Admin Auth API', () => {
  const TEST_EMAIL = 'admin@test.local';
  const TEST_PASSWORD = 'TestPassword123!';

  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();

    // Set a real bcrypt password so login actually works
    const hash = await bcrypt.hash(TEST_PASSWORD, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = 1', [hash]);
  });

  it('POST /v1/admin/auth/login — success (200)', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/admin/auth/login',
      payload: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
  });

  it('POST /v1/admin/auth/login — wrong password (401)', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/admin/auth/login',
      payload: {
        email: TEST_EMAIL,
        password: 'WrongPassword!',
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().error).toBeDefined();
  });

  it('POST /v1/admin/auth/login — rejects missing fields', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/admin/auth/login',
      payload: { email: TEST_EMAIL },
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.json().error).toBeDefined();
  });

  it('GET /v1/admin/services — rejects without token (401)', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/v1/admin/services?locale=en',
    });

    expect(res.statusCode).toBe(401);
    expect(res.json().error).toBeDefined();
  });
});
