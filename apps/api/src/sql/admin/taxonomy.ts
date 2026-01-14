// ============ ADMIN TAXONOMY QUERIES (Categories & Tags) ============

// Categories

/**
 * LIST_CATEGORIES
 *
 * List categories by `{ locale, kind }`.
 *
 * Parameters:
 * - $1 locale
 * - $2 kind ('post' | 'service' | 'job')
 */
export const LIST_CATEGORIES = `
  SELECT id, locale, kind, name, slug, description, icon_asset_id, sort_order, created_at, updated_at
  FROM categories
  WHERE locale = $1 AND kind = $2
  ORDER BY sort_order ASC, name ASC
`;

/**
 * GET_CATEGORY_BY_ID
 *
 * Fetch a category by id.
 *
 * Parameters:
 * - $1 id
 */
export const GET_CATEGORY_BY_ID = `
  SELECT id, locale, kind, name, slug, description, icon_asset_id, sort_order
  FROM categories
  WHERE id = $1
`;

/**
 * CREATE_CATEGORY
 *
 * Insert a new category.
 *
 * Parameters:
 * - $1 locale
 * - $2 kind
 * - $3 name
 * - $4 slug
 * - $5 description (nullable)
 * - $6 icon_asset_id (nullable)
 * - $7 sort_order
 */
export const CREATE_CATEGORY = `
  INSERT INTO categories (locale, kind, name, slug, description, icon_asset_id, sort_order)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id
`;

/**
 * UPDATE_CATEGORY
 *
 * Update a category.
 *
 * Parameters:
 * - $1 id
 * - $2 name
 * - $3 slug
 * - $4 description (nullable)
 * - $5 icon_asset_id (nullable)
 * - $6 sort_order
 */
export const UPDATE_CATEGORY = `
  UPDATE categories
  SET name = $2, slug = $3, description = $4, icon_asset_id = $5, sort_order = $6, updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

/**
 * DELETE_CATEGORY
 *
 * Delete a category.
 *
 * Parameters:
 * - $1 id
 */
export const DELETE_CATEGORY = `
  DELETE FROM categories WHERE id = $1
`;

// Tags

/**
 * LIST_TAGS
 *
 * List tags for a locale.
 *
 * Parameters:
 * - $1 locale
 */
export const LIST_TAGS = `
  SELECT id, locale, name, slug, created_at
  FROM tags
  WHERE locale = $1
  ORDER BY name ASC
`;

/**
 * GET_TAG_BY_ID
 *
 * Fetch a tag by id.
 *
 * Parameters:
 * - $1 id
 */
export const GET_TAG_BY_ID = `
  SELECT id, locale, name, slug
  FROM tags
  WHERE id = $1
`;

/**
 * CREATE_TAG
 *
 * Insert a tag.
 *
 * Parameters:
 * - $1 locale
 * - $2 name
 * - $3 slug
 */
export const CREATE_TAG = `
  INSERT INTO tags (locale, name, slug)
  VALUES ($1, $2, $3)
  RETURNING id
`;

/**
 * UPDATE_TAG
 *
 * Update a tag.
 *
 * Parameters:
 * - $1 id
 * - $2 name
 * - $3 slug
 */
export const UPDATE_TAG = `
  UPDATE tags
  SET name = $2, slug = $3
  WHERE id = $1
  RETURNING id
`;

/**
 * DELETE_TAG
 *
 * Delete a tag.
 *
 * Parameters:
 * - $1 id
 */
export const DELETE_TAG = `
  DELETE FROM tags WHERE id = $1
`;
