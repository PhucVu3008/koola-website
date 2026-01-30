// ============ ADMIN SERVICES QUERIES ============

/**
 * CREATE_SERVICE
 *
 * Insert a new service row.
 *
 * Parameters:
 * - $1 locale
 * - $2 title
 * - $3 slug
 * - $4 slug_group
 * - $5 excerpt
 * - $6 content_md
 * - $7 hero_asset_id (nullable)
 * - $8 og_asset_id (nullable)
 * - $9 status (content_status)
 * - $10 published_at (nullable timestamptz)
 * - $11 seo_title (nullable)
 * - $12 seo_description (nullable)
 * - $13 canonical_url (nullable)
 * - $14 sort_order
 * - $15 created_by (user id)
 */
export const CREATE_SERVICE = `
  INSERT INTO services (
    locale, title, slug, slug_group, excerpt, content_md,
    hero_asset_id, og_asset_id, status, published_at,
    seo_title, seo_description, canonical_url, sort_order,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING id
`;

/**
 * UPDATE_SERVICE
 *
 * Update an existing service row.
 *
 * Parameters:
 * - $1 id
 * - $2 title
 * - $3 slug
 * - $4 slug_group
 * - $5 excerpt
 * - $6 content_md
 * - $7 hero_asset_id
 * - $8 og_asset_id
 * - $9 status
 * - $10 published_at
 * - $11 seo_title
 * - $12 seo_description
 * - $13 canonical_url
 * - $14 sort_order
 * - $15 updated_by
 */
export const UPDATE_SERVICE = `
  UPDATE services
  SET 
    title = $2,
    slug = $3,
    slug_group = $4,
    excerpt = $5,
    content_md = $6,
    hero_asset_id = $7,
    og_asset_id = $8,
    status = $9,
    published_at = $10,
    seo_title = $11,
    seo_description = $12,
    canonical_url = $13,
    sort_order = $14,
    updated_by = $15,
    updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

/**
 * DELETE_SERVICE
 *
 * Delete a service by id.
 *
 * Parameters:
 * - $1 id
 */
export const DELETE_SERVICE = `
  DELETE FROM services WHERE id = $1
`;

/**
 * GET_SERVICE_BY_SLUG_GROUP
 * 
 * Get all services with the same slug_group (for translation sync)
 * 
 * Parameters:
 * - $1 slug_group
 */
export const GET_SERVICES_BY_SLUG_GROUP = `
  SELECT 
    id, locale, title, slug, slug_group, excerpt, content_md,
    hero_asset_id, og_asset_id, status, published_at,
    seo_title, seo_description, canonical_url, sort_order,
    benefits_subtitle,
    created_at, updated_at, created_by, updated_by
  FROM services
  WHERE slug_group = $1
  ORDER BY locale
`;

/**
 * UPDATE_SERVICE_IMAGE_BY_SLUG_GROUP
 * 
 * Update hero_asset_id and og_asset_id for all services in a slug_group
 * Used when admin uploads image for one locale and wants to sync to all others
 * 
 * Parameters:
 * - $1 hero_asset_id (nullable)
 * - $2 og_asset_id (nullable)
 * - $3 slug_group
 * - $4 updated_by (user id)
 */
export const UPDATE_IMAGES_BY_SLUG_GROUP = `
  UPDATE services
  SET 
    hero_asset_id = $1,
    og_asset_id = $2,
    updated_by = $4,
    updated_at = NOW()
  WHERE slug_group = $3
`;
