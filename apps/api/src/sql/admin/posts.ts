// ============ ADMIN POSTS QUERIES ============

// TODO: Implement CRUD operations for posts
// - CREATE_POST
// - UPDATE_POST
// - DELETE_POST
// - UPSERT_POST_TAGS
// - UPSERT_POST_CATEGORIES
// - UPSERT_POST_RELATED

export const CREATE_POST = `
  INSERT INTO posts (
    locale, title, slug, excerpt, content_md,
    hero_asset_id, og_asset_id, author_id, status, published_at,
    seo_title, seo_description, canonical_url,
    created_by
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING id
`;

export const UPDATE_POST = `
  UPDATE posts
  SET 
    title = $2,
    slug = $3,
    excerpt = $4,
    content_md = $5,
    hero_asset_id = $6,
    og_asset_id = $7,
    author_id = $8,
    status = $9,
    published_at = $10,
    seo_title = $11,
    seo_description = $12,
    canonical_url = $13,
    updated_by = $14,
    updated_at = NOW()
  WHERE id = $1
  RETURNING id
`;

export const DELETE_POST = `
  DELETE FROM posts WHERE id = $1
`;
