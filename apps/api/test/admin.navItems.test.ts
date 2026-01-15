import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { createAdminAccessToken } from './helpers/auth';
import { ensureTestAdminUser } from './helpers/seed';

/**
 * Admin Nav Items integration tests.
 *
 * Coverage:
 * - happy path CRUD
 * - unauthorized access
 */
describe('Admin Nav Items API', () => {
  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();
  });

  it('rejects unauthenticated requests', async () => {
    const app = await buildTestApp();

    const res = await app.inject({
      method: 'GET',
      url: '/v1/admin/nav-items?locale=en&placement=header',
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({
      error: { code: 'UNAUTHORIZED' },
    });
  });

  it('creates, lists, updates, deletes a nav item', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);

    // Create
    const createRes = await app.inject({
      method: 'POST',
      url: '/v1/admin/nav-items',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        locale: 'en',
        placement: 'header',
        label: 'Docs',
        href: '/docs',
        sort_order: 10,
        parent_id: null,
      },
    });

    expect(createRes.statusCode).toBe(201);
    const createdId = createRes.json()?.data?.id as unknown;
    expect(['string', 'number']).toContain(typeof createdId);

    // List
    const listRes = await app.inject({
      method: 'GET',
      url: '/v1/admin/nav-items?locale=en&placement=header',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(listRes.statusCode).toBe(200);
    const listBody = listRes.json();
    expect(listBody.data).toBeInstanceOf(Array);
    expect(listBody.data.some((x: any) => String(x.id) === String(createdId))).toBe(true);

    // Update
    const updateRes = await app.inject({
      method: 'PUT',
      url: `/v1/admin/nav-items/${createdId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        locale: 'en',
        placement: 'header',
        label: 'Docs Updated',
        href: '/docs',
        sort_order: 11,
        parent_id: null,
      },
    });

    expect(updateRes.statusCode).toBe(200);
    expect(String(updateRes.json()?.data?.id)).toBe(String(createdId));

    // Delete
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/v1/admin/nav-items/${createdId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(deleteRes.statusCode).toBe(200);
    expect(String(deleteRes.json()?.data?.id)).toBe(String(createdId));
  });
});
