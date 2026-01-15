import { pool, query, queryOne, transaction } from '../db';
import * as AdminPagesSQL from '../sql/admin/pages';

/**
 * Admin Pages repository.
 *
 * Responsibilities:
 * - CRUD for `pages`.
 * - CRUD for `page_sections`.
 * - Ensure deletes do not violate FK constraints.
 */

export interface AdminPageRow {
  id: number;
  locale: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  hero_asset_id: number | null;
  status: 'draft' | 'published' | 'archived';
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface AdminPageSectionRow {
  id: number;
  page_id: number;
  section_key: string;
  payload: unknown;
  sort_order: number;
}

export interface AdminCreatePageInput {
  locale: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  hero_asset_id: number | null;
  status: AdminPageRow['status'];
  updated_by: number | null;
}

export interface AdminUpdatePageInput extends AdminCreatePageInput {
  id: number;
}

export interface AdminCreatePageSectionInput {
  page_id: number;
  section_key: string;
  payload: unknown;
  sort_order: number;
}

export interface AdminUpdatePageSectionInput extends AdminCreatePageSectionInput {
  id: number;
}

// -------- Pages --------

export const listPages = async (locale: string) => {
  return await query<AdminPageRow>(AdminPagesSQL.ADMIN_LIST_PAGES, [locale]);
};

export const getPageById = async (id: number) => {
  return await queryOne<AdminPageRow>(AdminPagesSQL.ADMIN_GET_PAGE_BY_ID, [id]);
};

export const createPage = async (input: AdminCreatePageInput) => {
  const row = await queryOne<{ id: number }>(AdminPagesSQL.ADMIN_CREATE_PAGE, [
    input.locale,
    input.slug,
    input.title,
    input.seo_title,
    input.seo_description,
    input.hero_asset_id,
    input.status,
    input.updated_by,
  ]);

  return row?.id ?? null;
};

export const updatePage = async (input: AdminUpdatePageInput) => {
  const row = await queryOne<{ id: number }>(AdminPagesSQL.ADMIN_UPDATE_PAGE, [
    input.id,
    input.locale,
    input.slug,
    input.title,
    input.seo_title,
    input.seo_description,
    input.hero_asset_id,
    input.status,
    input.updated_by,
  ]);

  return row?.id ?? null;
};

/**
 * Delete a page.
 *
 * FK:
 * - `page_sections.page_id` references `pages.id`.
 * - There is no ON DELETE CASCADE in `db.sql`, so we delete sections first.
 */
export const deletePage = async (id: number) => {
  return await transaction(async (client) => {
    await client.query(AdminPagesSQL.ADMIN_DELETE_SECTIONS_BY_PAGE_ID, [id]);
    const result = await client.query(AdminPagesSQL.ADMIN_DELETE_PAGE, [id]);
    return result.rowCount ?? 0;
  });
};

// -------- Page sections --------

export const listPageSections = async (pageId: number) => {
  return await query<AdminPageSectionRow>(AdminPagesSQL.ADMIN_LIST_PAGE_SECTIONS, [pageId]);
};

export const getPageSectionById = async (id: number) => {
  return await queryOne<AdminPageSectionRow>(AdminPagesSQL.ADMIN_GET_PAGE_SECTION_BY_ID, [id]);
};

export const createPageSection = async (input: AdminCreatePageSectionInput) => {
  const row = await queryOne<{ id: number }>(AdminPagesSQL.ADMIN_CREATE_PAGE_SECTION, [
    input.page_id,
    input.section_key,
    input.payload,
    input.sort_order,
  ]);

  return row?.id ?? null;
};

export const updatePageSection = async (input: AdminUpdatePageSectionInput) => {
  const row = await queryOne<{ id: number }>(AdminPagesSQL.ADMIN_UPDATE_PAGE_SECTION, [
    input.id,
    input.page_id,
    input.section_key,
    input.payload,
    input.sort_order,
  ]);

  return row?.id ?? null;
};

export const deletePageSection = async (id: number) => {
  const result = await pool.query(AdminPagesSQL.ADMIN_DELETE_PAGE_SECTION, [id]);
  return result.rowCount ?? 0;
};
