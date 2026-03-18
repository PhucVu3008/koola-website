import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { ensureTestAdminUser } from './helpers/seed';
import { createAdminAccessToken } from './helpers/auth';

/**
 * Public jobs API integration tests.
 *
 * Coverage:
 * - list jobs
 * - get job by slug
 * - 404 for non-existent slug
 */
describe('Public Jobs API', () => {
  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();
  });

  /** Seed a published job via admin API. */
  async function seedJob(app: any, token: string) {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/admin/jobs',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        locale: 'en',
        title: 'Senior NodeJS Developer',
        slug: 'senior-nodejs-developer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        employment_type: 'full_time',
        responsibilities_md: '## Role\nBuild awesome things.',
        requirements_md: '- 3+ years NodeJS',
        status: 'published',
      },
    });
    return res.json()?.data;
  }

  it('GET /v1/jobs — returns list (200)', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);
    await seedJob(app, token);

    const res = await app.inject({
      method: 'GET',
      url: '/v1/jobs?locale=en',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /v1/jobs/:slug — returns detail (200)', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);
    await seedJob(app, token);

    const res = await app.inject({
      method: 'GET',
      url: '/v1/jobs/senior-nodejs-developer?locale=en',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.title).toBe('Senior NodeJS Developer');
  });

  it('GET /v1/jobs/:slug — returns 404 for unknown slug', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/v1/jobs/does-not-exist?locale=en',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBeDefined();
  });
});
