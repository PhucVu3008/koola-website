// ============ ADMIN SERVICES QUERIES ============

// TODO: Implement CRUD operations for services
// - CREATE_SERVICE
// - UPDATE_SERVICE
// - DELETE_SERVICE
// - UPSERT_SERVICE_DELIVERABLES
// - UPSERT_SERVICE_PROCESS_STEPS
// - UPSERT_SERVICE_FAQS
// - UPSERT_SERVICE_RELATED
// - UPSERT_SERVICE_TAGS
// - UPSERT_SERVICE_CATEGORIES

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

export const DELETE_SERVICE = `
  DELETE FROM services WHERE id = $1
`;
