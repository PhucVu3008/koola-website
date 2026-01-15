/**
 * Admin Pages queries.
 *
 * Tables:
 * - `pages`
 * - `page_sections`
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`).
 */

/**
 * ADMIN_LIST_PAGES
 *
 * List pages for a locale (all statuses).
 *
 * Parameters:
 * - $1 locale
 */
export const ADMIN_LIST_PAGES = `
  SELECT
    id,
    locale,
    slug,
    title,
    seo_title,
    seo_description,
    hero_asset_id,
    status,
    updated_by,
    created_at,
    updated_at
  FROM pages
  WHERE locale = $1
  ORDER BY updated_at DESC, id DESC
`;

/**
 * ADMIN_GET_PAGE_BY_ID
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_GET_PAGE_BY_ID = `
  SELECT
    id,
    locale,
    slug,
    title,
    seo_title,
    seo_description,
    hero_asset_id,
    status,
    updated_by,
    created_at,
    updated_at
  FROM pages
  WHERE id = $1
`;

/**
 * ADMIN_CREATE_PAGE
 *
 * Parameters:
 * - $1 locale
 * - $2 slug
 * - $3 title
 * - $4 seo_title (nullable)
 * - $5 seo_description (nullable)
 * - $6 hero_asset_id (nullable)
 * - $7 status (content_status)
 * - $8 updated_by (nullable)
 */
export const ADMIN_CREATE_PAGE = `
  INSERT INTO pages (
    locale,
    slug,
    title,
    seo_title,
    seo_description,
    hero_asset_id,
    status,
    updated_by,
    created_at,
    updated_at
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7::content_status, $8, NOW(), NOW())
  RETURNING id
`;

/**
 * ADMIN_UPDATE_PAGE
 *
 * Parameters:
 * - $1 id
 * - $2 locale
 * - $3 slug
 * - $4 title
 * - $5 seo_title (nullable)
 * - $6 seo_description (nullable)
 * - $7 hero_asset_id (nullable)
 * - $8 status (content_status)
 * - $9 updated_by (nullable)
 */
export const ADMIN_UPDATE_PAGE = `
  UPDATE pages
  SET
    locale = $2,
    slug = $3,
    title = $4,
    seo_title = $5,
    seo_description = $6,
    hero_asset_id = $7,
    status = $8::content_status,
    updated_by = $9,
    updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

/**
 * ADMIN_DELETE_PAGE
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_DELETE_PAGE = `
  DELETE FROM pages
  WHERE id = $1
`;

// -------- Page sections --------

/**
 * ADMIN_LIST_PAGE_SECTIONS
 *
 * List sections for a page.
 *
 * Parameters:
 * - $1 page_id
 */
export const ADMIN_LIST_PAGE_SECTIONS = `
  SELECT id, page_id, section_key, payload, sort_order
  FROM page_sections
  WHERE page_id = $1
  ORDER BY sort_order ASC, id ASC
`;

/**
 * ADMIN_GET_PAGE_SECTION_BY_ID
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_GET_PAGE_SECTION_BY_ID = `
  SELECT id, page_id, section_key, payload, sort_order
  FROM page_sections
  WHERE id = $1
`;

/**
 * ADMIN_CREATE_PAGE_SECTION
 *
 * Parameters:
 * - $1 page_id
 * - $2 section_key
 * - $3 payload (jsonb)
 * - $4 sort_order
 */
export const ADMIN_CREATE_PAGE_SECTION = `
  INSERT INTO page_sections (page_id, section_key, payload, sort_order)
  VALUES ($1, $2, $3::jsonb, $4)
  RETURNING id
`;

/**
 * ADMIN_UPDATE_PAGE_SECTION
 *
 * Parameters:
 * - $1 id
 * - $2 page_id
 * - $3 section_key
 * - $4 payload (jsonb)
 * - $5 sort_order
 */
export const ADMIN_UPDATE_PAGE_SECTION = `
  UPDATE page_sections
  SET
    page_id = $2,
    section_key = $3,
    payload = $4::jsonb,
    sort_order = $5
  WHERE id = $1
  RETURNING id
`;

/**
 * ADMIN_DELETE_PAGE_SECTION
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_DELETE_PAGE_SECTION = `
  DELETE FROM page_sections
  WHERE id = $1
`;

/**
 * ADMIN_DELETE_SECTIONS_BY_PAGE_ID
 *
 * Utility query used before deleting a page to avoid FK violations.
 *
 * Parameters:
 * - $1 page_id
 */
export const ADMIN_DELETE_SECTIONS_BY_PAGE_ID = `
  DELETE FROM page_sections
  WHERE page_id = $1
`;
