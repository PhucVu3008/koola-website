import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { ensureTestAdminUser } from './helpers/seed';
import { createAdminAccessToken } from './helpers/auth';

/**
 * Public services API integration tests.
 *
 * Coverage:
 * - list services
 * - get service by slug
 * - 404 for non-existent slug
 */
describe('Public Services API', () => {
  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();
  });

  /** Seed a published service via admin API and return its slug. */
  async function seedService(app: any, token: string) {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/admin/services',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        locale: 'en',
        title: 'IoT Integration',
        slug: 'iot-integration',
        excerpt: 'End-to-end IoT solutions',
        content_md: '## IoT Integration\nFull service.',
        status: 'published',
        icon_name: 'Cpu',
      },
    });
    return res.json()?.data;
  }

  it('GET /v1/services — returns list (200)', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);
    await seedService(app, token);

    const res = await app.inject({
      method: 'GET',
      url: '/v1/services?locale=en',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /v1/services/:slug — returns detail (200)', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);
    await seedService(app, token);

    const res = await app.inject({
      method: 'GET',
      url: '/v1/services/iot-integration?locale=en',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.service.title).toBe('IoT Integration');
  });

  it('GET /v1/services/:slug — returns 404 for unknown slug', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/v1/services/does-not-exist?locale=en',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBeDefined();
  });
});
