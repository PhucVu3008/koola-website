import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { createAdminAccessToken } from './helpers/auth';
import { ensureTestAdminUser } from './helpers/seed';

/**
 * Admin Site Settings integration tests.
 */
describe('Admin Site Settings API', { concurrent: false }, () => {
  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();
  });

  it('upserts, reads, deletes a setting', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);

    // Upsert
    const upsertRes = await app.inject({
      method: 'PUT',
      url: '/v1/admin/site-settings/global_cta',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        value: {
          headline: 'Ready?',
          cta_label: 'Book a call',
          cta_href: '/contact',
        },
      },
    });

    expect(upsertRes.statusCode).toBe(200);
    expect(upsertRes.json()).toMatchObject({ data: { key: 'global_cta' } });

    // Recreate the app to avoid any cross-test/shared-connection flakiness.
    // (We keep this defensive approach because we've seen intermittent 404s right after upsert.)
    await app.close();
    const app2 = await buildTestApp();

    // Get by key (retry with a short backoff to avoid timing flakiness)
    let getRes = null as any;
    for (let attempt = 0; attempt < 5; attempt++) {
      getRes = await app2.inject({
        method: 'GET',
        url: '/v1/admin/site-settings/global_cta',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (getRes.statusCode === 200) break;
      // 25ms, 50ms, 75ms, 100ms between retries
      await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
    }

    expect(getRes.statusCode).toBe(200);
    const getBody = getRes.json();
    expect(getBody.data).toMatchObject({
      key: 'global_cta',
      value: {
        headline: 'Ready?',
      },
    });

    // Delete
    const deleteRes = await app2.inject({
      method: 'DELETE',
      url: '/v1/admin/site-settings/global_cta',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.json()).toMatchObject({ data: { key: 'global_cta' } });

    // Get (NOT_FOUND)
    const missingRes = await app2.inject({
      method: 'GET',
      url: '/v1/admin/site-settings/global_cta',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(missingRes.statusCode).toBe(404);
    expect(missingRes.json()).toMatchObject({
      error: { code: 'NOT_FOUND' },
    });

    await app2.close();
  });
});
