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
 * - $9 icon_name (nullable)
 * - $10 benefits_subtitle (nullable)
 * - $11 status (content_status)
 * - $12 published_at (nullable timestamptz)
 * - $13 seo_title (nullable)
 * - $14 seo_description (nullable)
 * - $15 canonical_url (nullable)
 * - $16 sort_order
 * - $17 created_by (user id)
 */
export const CREATE_SERVICE = `
  INSERT INTO services (
    locale, title, slug, slug_group, excerpt, content_md,
    hero_asset_id, og_asset_id, icon_name, benefits_subtitle,
    status, published_at,
    seo_title, seo_description, canonical_url, sort_order,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
 * - $9 icon_name
 * - $10 benefits_subtitle
 * - $11 status
 * - $12 published_at
 * - $13 seo_title
 * - $14 seo_description
 * - $15 canonical_url
 * - $16 sort_order
 * - $17 updated_by
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
    icon_name = $9,
    benefits_subtitle = $10,
    status = $11,
    published_at = $12,
    seo_title = $13,
    seo_description = $14,
    canonical_url = $15,
    sort_order = $16,
    updated_by = $17,
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

/**
 * GET_SERVICE_BENEFITS
 * 
 * Get all benefits for a service ordered by sort_order
 * 
 * Parameters:
 * - $1 service_id
 */
export const GET_SERVICE_BENEFITS = `
  SELECT id, title, description, icon_name, sort_order
  FROM service_benefits
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

/**
 * DELETE_SERVICE_BENEFITS
 * 
 * Delete all benefits for a service
 * Used before inserting updated benefits
 * 
 * Parameters:
 * - $1 service_id
 */
export const DELETE_SERVICE_BENEFITS = `
  DELETE FROM service_benefits
  WHERE service_id = $1
`;

/**
 * INSERT_SERVICE_BENEFIT
 * 
 * Insert a new benefit for a service
 * 
 * Parameters:
 * - $1 service_id
 * - $2 title
 * - $3 description (nullable)
 * - $4 icon_name (nullable)
 * - $5 sort_order
 */
export const INSERT_SERVICE_BENEFIT = `
  INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order)
  VALUES ($1, $2, $3, $4, $5)
`;
