import { beforeEach, describe, expect, it } from 'vitest';
import { buildTestApp } from './helpers/app';
import { resetTestDb } from './helpers/db';
import { createAdminAccessToken } from './helpers/auth';
import { ensureTestAdminUser } from './helpers/seed';

/**
 * Admin Pages + Sections integration tests.
 */
describe('Admin Pages API', { concurrent: false }, () => {
  beforeEach(async () => {
    await resetTestDb();
    await ensureTestAdminUser();
  });

  it('creates a page, creates a section, deletes the section, deletes the page', async () => {
    const app = await buildTestApp();
    const token = createAdminAccessToken(app);

    // Create page
    const createPageRes = await app.inject({
      method: 'POST',
      url: '/v1/admin/pages',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        locale: 'en',
        slug: 'about',
        title: 'About',
        seo_title: 'About KOOLA',
        seo_description: 'About page',
        hero_asset_id: null,
        status: 'draft',
      },
    });

    expect(createPageRes.statusCode).toBe(201);
    const pageId = createPageRes.json()?.data?.id as unknown;
    expect(['string', 'number']).toContain(typeof pageId);

    const pageIdForBody = Number(pageId);
    expect(Number.isFinite(pageIdForBody)).toBe(true);

    // Create section
    const createSectionRes = await app.inject({
      method: 'POST',
      url: `/v1/admin/pages/${pageId}/sections`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        page_id: pageIdForBody,
        section_key: 'hero',
        payload: { headline: 'About KOOLA' },
        sort_order: 0,
      },
    });

    expect(createSectionRes.statusCode).toBe(201);
    const sectionId = createSectionRes.json()?.data?.id as unknown;
    expect(['string', 'number']).toContain(typeof sectionId);

    // Delete section
    const deleteSectionRes = await app.inject({
      method: 'DELETE',
      url: `/v1/admin/pages/${pageId}/sections/${sectionId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(deleteSectionRes.statusCode).toBe(200);
    expect(String(deleteSectionRes.json()?.data?.id)).toBe(String(sectionId));

    // Delete page
    const deletePageRes = await app.inject({
      method: 'DELETE',
      url: `/v1/admin/pages/${pageId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(deletePageRes.statusCode).toBe(200);
    expect(String(deletePageRes.json()?.data?.id)).toBe(String(pageId));
  });
});
