import * as adminTaxonomyRepository from '../repositories/adminTaxonomyRepository';
import {
  AdminCategoryCreateInput,
  AdminCategoryListQuery,
  AdminTagCreateInput,
  AdminTagListQuery,
} from '../schemas/taxonomy.schemas';

/**
 * Admin taxonomy service.
 *
 * Thin layer to keep controllers simple and consistent with other modules.
 */

// Categories

/**
 * List categories for a locale + kind.
 */
export const listCategories = async (query: AdminCategoryListQuery) => {
  const categories = await adminTaxonomyRepository.listCategories({
    locale: query.locale,
    kind: query.kind,
  });
  return { categories };
};

/**
 * Get a single category by id.
 */
export const getCategoryById = async (id: number) => {
  return await adminTaxonomyRepository.getCategoryById(id);
};

/**
 * Create a category.
 */
export const createCategory = async (data: AdminCategoryCreateInput) => {
  return await adminTaxonomyRepository.createCategory({
    locale: data.locale,
    kind: data.kind,
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon_asset_id: data.icon_asset_id,
    sort_order: data.sort_order,
  });
};

/**
 * Update a category.
 */
export const updateCategory = async (id: number, data: AdminCategoryCreateInput) => {
  return await adminTaxonomyRepository.updateCategory({
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon_asset_id: data.icon_asset_id,
    sort_order: data.sort_order,
  });
};

/**
 * Delete a category by id.
 */
export const deleteCategory = async (id: number) => {
  return await adminTaxonomyRepository.deleteCategoryById(id);
};

// Tags

/**
 * List tags for a locale.
 */
export const listTags = async (query: AdminTagListQuery) => {
  const tags = await adminTaxonomyRepository.listTags({ locale: query.locale });
  return { tags };
};

/**
 * Get a single tag by id.
 */
export const getTagById = async (id: number) => {
  return await adminTaxonomyRepository.getTagById(id);
};

/**
 * Create a tag.
 */
export const createTag = async (data: AdminTagCreateInput) => {
  return await adminTaxonomyRepository.createTag({
    locale: data.locale,
    name: data.name,
    slug: data.slug,
  });
};

/**
 * Update a tag.
 */
export const updateTag = async (id: number, data: AdminTagCreateInput) => {
  return await adminTaxonomyRepository.updateTag({
    id,
    name: data.name,
    slug: data.slug,
  });
};

/**
 * Delete a tag by id.
 */
export const deleteTag = async (id: number) => {
  return await adminTaxonomyRepository.deleteTagById(id);
};
