// ============ ADMIN SERVICES CRUD QUERIES ============

/**
 * This module contains raw SQL used by the Admin Services CRUD API.
 *
 * Scope:
 * - Admin list/get operations (not public/published-only).
 * - Nested child tables for a service:
 *   - `service_tags`, `service_categories`
 *   - `service_deliverables`, `service_process_steps`, `service_faqs`
 *   - `service_related`, `service_related_posts`
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`). Never interpolate user input.
 */

// Services (admin listing / get by id)

/**
 * ADMIN_LIST_SERVICES
 *
 * List services for admin including taxonomy arrays.
 *
 * Parameters:
 * - $1 locale
 * - $2 status (content_status | null)
 * - $3 limit (int)
 * - $4 offset (int)
 */
export const ADMIN_LIST_SERVICES = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.slug_group, s.excerpt, s.content_md,
    s.hero_asset_id, s.og_asset_id,
    s.status, s.published_at,
    s.seo_title, s.seo_description, s.canonical_url,
    s.sort_order,
    s.created_by, s.updated_by,
    s.created_at, s.updated_at,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
      ) FILTER (WHERE t.id IS NOT NULL),
      '[]'
    ) as tags,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'
    ) as categories
  FROM services s
  LEFT JOIN service_tags st ON s.id = st.service_id
  LEFT JOIN tags t ON st.tag_id = t.id AND t.locale = s.locale
  LEFT JOIN service_categories sc ON s.id = sc.service_id
  LEFT JOIN categories c ON sc.category_id = c.id AND c.locale = s.locale AND c.kind = 'service'
  WHERE s.locale = $1
    AND ($2::text IS NULL OR s.status = $2::content_status)
  GROUP BY s.id
  ORDER BY s.updated_at DESC, s.id DESC
  LIMIT $3 OFFSET $4
`;

/**
 * ADMIN_COUNT_SERVICES
 *
 * Count services for admin pagination.
 *
 * Parameters:
 * - $1 locale
 * - $2 status (content_status | null)
 */
export const ADMIN_COUNT_SERVICES = `
  SELECT COUNT(*)::bigint as total
  FROM services s
  WHERE s.locale = $1
    AND ($2::text IS NULL OR s.status = $2::content_status)
`;

/**
 * ADMIN_GET_SERVICE_BY_ID
 *
 * Fetch a service row by id (no status restrictions).
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_GET_SERVICE_BY_ID = `
  SELECT 
    id, locale, title, slug, slug_group, excerpt, content_md,
    hero_asset_id, og_asset_id,
    status, published_at,
    seo_title, seo_description, canonical_url,
    sort_order,
    created_by, updated_by,
    created_at, updated_at
  FROM services
  WHERE id = $1
`;

// Taxonomy (ids only)

/**
 * ADMIN_GET_SERVICE_TAG_IDS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_TAG_IDS = `
  SELECT tag_id as id
  FROM service_tags
  WHERE service_id = $1
  ORDER BY tag_id ASC
`;

/**
 * ADMIN_GET_SERVICE_CATEGORY_IDS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_CATEGORY_IDS = `
  SELECT category_id as id
  FROM service_categories
  WHERE service_id = $1
  ORDER BY category_id ASC
`;

// Child tables

/**
 * ADMIN_GET_SERVICE_DELIVERABLES
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_DELIVERABLES = `
  SELECT id, title, description, icon_asset_id, sort_order
  FROM service_deliverables
  WHERE service_id = $1
  ORDER BY sort_order ASC, id ASC
`;

/**
 * ADMIN_GET_SERVICE_PROCESS_STEPS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_PROCESS_STEPS = `
  SELECT id, title, description, sort_order
  FROM service_process_steps
  WHERE service_id = $1
  ORDER BY sort_order ASC, id ASC
`;

/**
 * ADMIN_GET_SERVICE_FAQS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_FAQS = `
  SELECT id, question, answer, sort_order
  FROM service_faqs
  WHERE service_id = $1
  ORDER BY sort_order ASC, id ASC
`;

/**
 * ADMIN_GET_SERVICE_RELATED_SERVICE_IDS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_RELATED_SERVICE_IDS = `
  SELECT related_service_id as id, sort_order
  FROM service_related
  WHERE service_id = $1
  ORDER BY sort_order ASC, related_service_id ASC
`;

/**
 * ADMIN_GET_SERVICE_RELATED_POST_IDS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_GET_SERVICE_RELATED_POST_IDS = `
  SELECT post_id as id, sort_order
  FROM service_related_posts
  WHERE service_id = $1
  ORDER BY sort_order ASC, post_id ASC
`;

// Replace-all helpers for nested updates

/**
 * ADMIN_DELETE_SERVICE_TAGS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_TAGS = `
  DELETE FROM service_tags WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_TAG
 *
 * Parameters:
 * - $1 service_id
 * - $2 tag_id
 */
export const ADMIN_INSERT_SERVICE_TAG = `
  INSERT INTO service_tags (service_id, tag_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
`;

/**
 * ADMIN_DELETE_SERVICE_CATEGORIES
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_CATEGORIES = `
  DELETE FROM service_categories WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_CATEGORY
 *
 * Parameters:
 * - $1 service_id
 * - $2 category_id
 */
export const ADMIN_INSERT_SERVICE_CATEGORY = `
  INSERT INTO service_categories (service_id, category_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
`;

/**
 * ADMIN_DELETE_SERVICE_DELIVERABLES
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_DELIVERABLES = `
  DELETE FROM service_deliverables WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_DELIVERABLE
 *
 * Parameters:
 * - $1 service_id
 * - $2 title
 * - $3 description
 * - $4 icon_asset_id
 * - $5 sort_order
 */
export const ADMIN_INSERT_SERVICE_DELIVERABLE = `
  INSERT INTO service_deliverables (service_id, title, description, icon_asset_id, sort_order)
  VALUES ($1, $2, $3, $4, $5)
`;

/**
 * ADMIN_DELETE_SERVICE_PROCESS_STEPS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_PROCESS_STEPS = `
  DELETE FROM service_process_steps WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_PROCESS_STEP
 *
 * Parameters:
 * - $1 service_id
 * - $2 title
 * - $3 description
 * - $4 sort_order
 */
export const ADMIN_INSERT_SERVICE_PROCESS_STEP = `
  INSERT INTO service_process_steps (service_id, title, description, sort_order)
  VALUES ($1, $2, $3, $4)
`;

/**
 * ADMIN_DELETE_SERVICE_FAQS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_FAQS = `
  DELETE FROM service_faqs WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_FAQ
 *
 * Parameters:
 * - $1 service_id
 * - $2 question
 * - $3 answer
 * - $4 sort_order
 */
export const ADMIN_INSERT_SERVICE_FAQ = `
  INSERT INTO service_faqs (service_id, question, answer, sort_order)
  VALUES ($1, $2, $3, $4)
`;

/**
 * ADMIN_DELETE_SERVICE_RELATED_SERVICES
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_RELATED_SERVICES = `
  DELETE FROM service_related WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_RELATED_SERVICE
 *
 * Parameters:
 * - $1 service_id
 * - $2 related_service_id
 * - $3 sort_order
 */
export const ADMIN_INSERT_SERVICE_RELATED_SERVICE = `
  INSERT INTO service_related (service_id, related_service_id, sort_order)
  VALUES ($1, $2, $3)
  ON CONFLICT (service_id, related_service_id) DO UPDATE SET sort_order = EXCLUDED.sort_order
`;

/**
 * ADMIN_DELETE_SERVICE_RELATED_POSTS
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_RELATED_POSTS = `
  DELETE FROM service_related_posts WHERE service_id = $1
`;

/**
 * ADMIN_INSERT_SERVICE_RELATED_POST
 *
 * Parameters:
 * - $1 service_id
 * - $2 post_id
 * - $3 sort_order
 */
export const ADMIN_INSERT_SERVICE_RELATED_POST = `
  INSERT INTO service_related_posts (service_id, post_id, sort_order)
  VALUES ($1, $2, $3)
  ON CONFLICT (service_id, post_id) DO UPDATE SET sort_order = EXCLUDED.sort_order
`;
