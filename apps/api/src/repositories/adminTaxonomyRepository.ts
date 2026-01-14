import { PoolClient } from 'pg';
import { query, queryOne, transaction } from '../db';
import * as AdminTaxonomySQL from '../sql/admin/taxonomy';
import * as AdminTaxonomyDeleteSQL from '../sql/admin/taxonomyDelete';

/**
 * Admin-facing repository for Categories/Tags.
 *
 * Responsibilities:
 * - Execute raw SQL for taxonomy CRUD.
 * - Keep all queries parameterized.
 */

export interface AdminCategoryListFilters {
  locale: string;
  kind: 'post' | 'service' | 'job';
}

export interface AdminCategoryCreateRow {
  locale: string;
  kind: 'post' | 'service' | 'job';
  name: string;
  slug: string;
  description?: string;
  icon_asset_id?: number;
  sort_order: number;
}

export interface AdminCategoryUpdateRow extends Omit<AdminCategoryCreateRow, 'locale' | 'kind'> {
  id: number;
}

export interface AdminTagListFilters {
  locale: string;
}

export interface AdminTagCreateRow {
  locale: string;
  name: string;
  slug: string;
}

export interface AdminTagUpdateRow extends Omit<AdminTagCreateRow, 'locale'> {
  id: number;
}

/**
 * Categories
 */
export const listCategories = async (filters: AdminCategoryListFilters) => {
  return await query(AdminTaxonomySQL.LIST_CATEGORIES, [filters.locale, filters.kind]);
};

export const getCategoryById = async (id: number) => {
  return await queryOne(AdminTaxonomySQL.GET_CATEGORY_BY_ID, [id]);
};

export const createCategory = async (row: AdminCategoryCreateRow) => {
  const created = await queryOne<{ id: number }>(AdminTaxonomySQL.CREATE_CATEGORY, [
    row.locale,
    row.kind,
    row.name,
    row.slug,
    row.description ?? null,
    row.icon_asset_id ?? null,
    row.sort_order,
  ]);
  return created?.id ?? null;
};

export const updateCategory = async (row: AdminCategoryUpdateRow) => {
  const updated = await queryOne<{ id: number }>(AdminTaxonomySQL.UPDATE_CATEGORY, [
    row.id,
    row.name,
    row.slug,
    row.description ?? null,
    row.icon_asset_id ?? null,
    row.sort_order,
  ]);
  return updated?.id ?? null;
};

export const deleteCategoryById = async (id: number) => {
  return await transaction(async (client: PoolClient) => {
    // Categories can be referenced by both posts and services.
    await client.query(AdminTaxonomyDeleteSQL.ADMIN_DELETE_POST_CATEGORIES_BY_CATEGORY, [id]);
    await client.query(AdminTaxonomyDeleteSQL.ADMIN_DELETE_SERVICE_CATEGORIES_BY_CATEGORY, [id]);

    const result = await client.query(AdminTaxonomySQL.DELETE_CATEGORY, [id]);
    return (result.rowCount ?? 0) > 0;
  });
};

/**
 * Tags
 */
export const listTags = async (filters: AdminTagListFilters) => {
  return await query(AdminTaxonomySQL.LIST_TAGS, [filters.locale]);
};

export const getTagById = async (id: number) => {
  return await queryOne(AdminTaxonomySQL.GET_TAG_BY_ID, [id]);
};

export const createTag = async (row: AdminTagCreateRow) => {
  const created = await queryOne<{ id: number }>(AdminTaxonomySQL.CREATE_TAG, [
    row.locale,
    row.name,
    row.slug,
  ]);
  return created?.id ?? null;
};

export const updateTag = async (row: AdminTagUpdateRow) => {
  const updated = await queryOne<{ id: number }>(AdminTaxonomySQL.UPDATE_TAG, [
    row.id,
    row.name,
    row.slug,
  ]);
  return updated?.id ?? null;
};

export const deleteTagById = async (id: number) => {
  return await transaction(async (client: PoolClient) => {
    // Tags can be referenced by both posts and services.
    await client.query(AdminTaxonomyDeleteSQL.ADMIN_DELETE_POST_TAGS_BY_TAG, [id]);
    await client.query(AdminTaxonomyDeleteSQL.ADMIN_DELETE_SERVICE_TAGS_BY_TAG, [id]);

    const result = await client.query(AdminTaxonomySQL.DELETE_TAG, [id]);
    return (result.rowCount ?? 0) > 0;
  });
};
