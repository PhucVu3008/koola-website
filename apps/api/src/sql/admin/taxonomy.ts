// ============ ADMIN TAXONOMY QUERIES (Categories & Tags) ============

// Categories
export const LIST_CATEGORIES = `
  SELECT id, locale, kind, name, slug, description, icon_asset_id, sort_order, created_at, updated_at
  FROM categories
  WHERE locale = $1 AND kind = $2
  ORDER BY sort_order ASC, name ASC
`;

export const GET_CATEGORY_BY_ID = `
  SELECT id, locale, kind, name, slug, description, icon_asset_id, sort_order
  FROM categories
  WHERE id = $1
`;

export const CREATE_CATEGORY = `
  INSERT INTO categories (locale, kind, name, slug, description, icon_asset_id, sort_order)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id
`;

export const UPDATE_CATEGORY = `
  UPDATE categories
  SET name = $2, slug = $3, description = $4, icon_asset_id = $5, sort_order = $6, updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

export const DELETE_CATEGORY = `
  DELETE FROM categories WHERE id = $1
`;

// Tags
export const LIST_TAGS = `
  SELECT id, locale, name, slug, created_at
  FROM tags
  WHERE locale = $1
  ORDER BY name ASC
`;

export const GET_TAG_BY_ID = `
  SELECT id, locale, name, slug
  FROM tags
  WHERE id = $1
`;

export const CREATE_TAG = `
  INSERT INTO tags (locale, name, slug)
  VALUES ($1, $2, $3)
  RETURNING id
`;

export const UPDATE_TAG = `
  UPDATE tags
  SET name = $2, slug = $3
  WHERE id = $1
  RETURNING id
`;

export const DELETE_TAG = `
  DELETE FROM tags WHERE id = $1
`;
