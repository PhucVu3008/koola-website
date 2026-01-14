// ============ ADMIN TAXONOMY DELETE HELPERS ============

/**
 * This module contains delete helpers that must clean up join tables before
 * deleting taxonomy rows.
 *
 * Why:
 * - Categories/Tags are referenced by join tables (`post_categories`,
 *   `service_categories`, `post_tags`, `service_tags`).
 * - The DB schema uses RESTRICT foreign keys, so deletes must be explicit.
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`).
 */

// Categories

/**
 * ADMIN_DELETE_POST_CATEGORIES_BY_CATEGORY
 *
 * Parameters:
 * - $1 category_id
 */
export const ADMIN_DELETE_POST_CATEGORIES_BY_CATEGORY = `
  DELETE FROM post_categories WHERE category_id = $1
`;

/**
 * ADMIN_DELETE_SERVICE_CATEGORIES_BY_CATEGORY
 *
 * Parameters:
 * - $1 category_id
 */
export const ADMIN_DELETE_SERVICE_CATEGORIES_BY_CATEGORY = `
  DELETE FROM service_categories WHERE category_id = $1
`;

// Tags

/**
 * ADMIN_DELETE_POST_TAGS_BY_TAG
 *
 * Parameters:
 * - $1 tag_id
 */
export const ADMIN_DELETE_POST_TAGS_BY_TAG = `
  DELETE FROM post_tags WHERE tag_id = $1
`;

/**
 * ADMIN_DELETE_SERVICE_TAGS_BY_TAG
 *
 * Parameters:
 * - $1 tag_id
 */
export const ADMIN_DELETE_SERVICE_TAGS_BY_TAG = `
  DELETE FROM service_tags WHERE tag_id = $1
`;
