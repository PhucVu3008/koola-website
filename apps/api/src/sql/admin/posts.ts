// ============ ADMIN POSTS QUERIES ============

/**
 * CREATE_POST
 *
 * Insert a new blog post row.
 *
 * Parameters:
 * - $1 locale
 * - $2 title
 * - $3 slug
 * - $4 excerpt
 * - $5 content_md
 * - $6 hero_asset_id (nullable)
 * - $7 og_asset_id (nullable)
 * - $8 author_id (nullable)
 * - $9 status (content_status)
 * - $10 published_at (nullable timestamptz)
 * - $11 seo_title (nullable)
 * - $12 seo_description (nullable)
 * - $13 canonical_url (nullable)
 * - $14 created_by (user id)
 */
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

/**
 * UPDATE_POST
 *
 * Update an existing post row.
 *
 * Parameters:
 * - $1 id
 * - $2..$13 updated fields
 * - $14 updated_by
 */
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

/**
 * DELETE_POST
 *
 * Delete a post by id.
 *
 * Parameters:
 * - $1 id
 */
export const DELETE_POST = `
  DELETE FROM posts WHERE id = $1
`;
