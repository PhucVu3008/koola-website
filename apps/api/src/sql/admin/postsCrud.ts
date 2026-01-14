// ============ ADMIN POSTS CRUD QUERIES ============

/**
 * This module contains raw SQL used by the Admin Posts CRUD API.
 *
 * Scope:
 * - Admin list/get operations (not public/published-only).
 * - Nested tables:
 *   - `post_tags`, `post_categories`, `post_related`
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`). Never interpolate user input.
 */

/**
 * ADMIN_LIST_POSTS
 *
 * List posts for admin including taxonomy arrays.
 *
 * Parameters:
 * - $1 locale
 * - $2 status (content_status | null)
 * - $3 limit (int)
 * - $4 offset (int)
 */
export const ADMIN_LIST_POSTS = `
  SELECT
    p.id, p.locale, p.title, p.slug, p.excerpt,
    p.hero_asset_id, p.og_asset_id,
    p.author_id,
    p.status, p.published_at,
    p.seo_title, p.seo_description, p.canonical_url,
    p.created_by, p.updated_by,
    p.created_at, p.updated_at,
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
  FROM posts p
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN tags t ON pt.tag_id = t.id AND t.locale = p.locale
  LEFT JOIN post_categories pc ON p.id = pc.post_id
  LEFT JOIN categories c ON pc.category_id = c.id AND c.locale = p.locale AND c.kind = 'post'
  WHERE p.locale = $1
    AND ($2::text IS NULL OR p.status = $2::content_status)
  GROUP BY p.id
  ORDER BY p.updated_at DESC, p.id DESC
  LIMIT $3 OFFSET $4
`;

/**
 * ADMIN_COUNT_POSTS
 *
 * Parameters:
 * - $1 locale
 * - $2 status (content_status | null)
 */
export const ADMIN_COUNT_POSTS = `
  SELECT COUNT(*)::bigint as total
  FROM posts p
  WHERE p.locale = $1
    AND ($2::text IS NULL OR p.status = $2::content_status)
`;

/**
 * ADMIN_GET_POST_BY_ID
 *
 * Fetch a post by id (no status restrictions).
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_GET_POST_BY_ID = `
  SELECT
    id, locale, title, slug, excerpt, content_md,
    hero_asset_id, og_asset_id,
    author_id,
    status, published_at,
    seo_title, seo_description, canonical_url,
    created_by, updated_by,
    created_at, updated_at
  FROM posts
  WHERE id = $1
`;

/**
 * ADMIN_GET_POST_TAG_IDS
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_GET_POST_TAG_IDS = `
  SELECT tag_id as id
  FROM post_tags
  WHERE post_id = $1
  ORDER BY tag_id ASC
`;

/**
 * ADMIN_GET_POST_CATEGORY_IDS
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_GET_POST_CATEGORY_IDS = `
  SELECT category_id as id
  FROM post_categories
  WHERE post_id = $1
  ORDER BY category_id ASC
`;

/**
 * ADMIN_GET_RELATED_POST_IDS
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_GET_RELATED_POST_IDS = `
  SELECT related_post_id as id, sort_order
  FROM post_related
  WHERE post_id = $1
  ORDER BY sort_order ASC, related_post_id ASC
`;

// Replace-all helpers

/**
 * ADMIN_DELETE_POST_TAGS
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_DELETE_POST_TAGS = `
  DELETE FROM post_tags WHERE post_id = $1
`;

/**
 * ADMIN_INSERT_POST_TAG
 *
 * Parameters:
 * - $1 post_id
 * - $2 tag_id
 */
export const ADMIN_INSERT_POST_TAG = `
  INSERT INTO post_tags (post_id, tag_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
`;

/**
 * ADMIN_DELETE_POST_CATEGORIES
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_DELETE_POST_CATEGORIES = `
  DELETE FROM post_categories WHERE post_id = $1
`;

/**
 * ADMIN_INSERT_POST_CATEGORY
 *
 * Parameters:
 * - $1 post_id
 * - $2 category_id
 */
export const ADMIN_INSERT_POST_CATEGORY = `
  INSERT INTO post_categories (post_id, category_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
`;

/**
 * ADMIN_DELETE_POST_RELATED
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_DELETE_POST_RELATED = `
  DELETE FROM post_related WHERE post_id = $1
`;

/**
 * ADMIN_DELETE_POST_RELATED_BY_EITHER_SIDE
 *
 * Similar to services: a post can be referenced by other posts as `related_post_id`.
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_DELETE_POST_RELATED_BY_EITHER_SIDE = `
  DELETE FROM post_related
  WHERE post_id = $1 OR related_post_id = $1
`;

/**
 * ADMIN_INSERT_POST_RELATED
 *
 * Parameters:
 * - $1 post_id
 * - $2 related_post_id
 * - $3 sort_order
 */
export const ADMIN_INSERT_POST_RELATED = `
  INSERT INTO post_related (post_id, related_post_id, sort_order)
  VALUES ($1, $2, $3)
  ON CONFLICT (post_id, related_post_id) DO UPDATE SET sort_order = EXCLUDED.sort_order
`;

/**
 * ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_POST
 *
 * A post can be referenced by services via `service_related_posts.post_id`.
 * This must be cleaned up before deleting a post to avoid FK violations.
 *
 * Parameters:
 * - $1 post_id
 */
export const ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_POST = `
  DELETE FROM service_related_posts
  WHERE post_id = $1
`;
