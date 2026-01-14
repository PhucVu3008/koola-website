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
 * - $4 excerpt
 * - $5 content_md
 * - $6 hero_asset_id (nullable)
 * - $7 og_asset_id (nullable)
 * - $8 status (content_status)
 * - $9 published_at (nullable timestamptz)
 * - $10 seo_title (nullable)
 * - $11 seo_description (nullable)
 * - $12 canonical_url (nullable)
 * - $13 sort_order
 * - $14 created_by (user id)
 */
export const CREATE_SERVICE = `
  INSERT INTO services (
    locale, title, slug, excerpt, content_md,
    hero_asset_id, og_asset_id, status, published_at,
    seo_title, seo_description, canonical_url, sort_order,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING id
`;

/**
 * UPDATE_SERVICE
 *
 * Update an existing service row.
 *
 * Parameters:
 * - $1 id
 * - $2..$13 updated fields
 * - $14 updated_by
 */
export const UPDATE_SERVICE = `
  UPDATE services
  SET 
    title = $2,
    slug = $3,
    excerpt = $4,
    content_md = $5,
    hero_asset_id = $6,
    og_asset_id = $7,
    status = $8,
    published_at = $9,
    seo_title = $10,
    seo_description = $11,
    canonical_url = $12,
    sort_order = $13,
    updated_by = $14,
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
