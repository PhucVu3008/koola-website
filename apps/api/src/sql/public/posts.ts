// ============ POSTS QUERIES ============

export const LIST_POSTS = `
  SELECT 
    p.id, p.locale, p.title, p.slug, p.excerpt, p.hero_asset_id,
    p.status, p.published_at, p.created_at,
    p.author_id,
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
    AND p.status = 'published'
    AND ($2::text IS NULL OR c.slug = $2)
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%' OR p.excerpt ILIKE '%' || $4 || '%')
  GROUP BY p.id
  ORDER BY 
    CASE WHEN $5 = 'newest' THEN p.published_at END DESC,
    CASE WHEN $5 = 'oldest' THEN p.published_at END ASC,
    p.id DESC
  LIMIT $6 OFFSET $7
`;

export const COUNT_POSTS = `
  SELECT COUNT(DISTINCT p.id) as total
  FROM posts p
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN tags t ON pt.tag_id = t.id AND t.locale = p.locale
  LEFT JOIN post_categories pc ON p.id = pc.post_id
  LEFT JOIN categories c ON pc.category_id = c.id AND c.locale = p.locale AND c.kind = 'post'
  WHERE p.locale = $1
    AND p.status = 'published'
    AND ($2::text IS NULL OR c.slug = $2)
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR p.title ILIKE '%' || $4 || '%' OR p.excerpt ILIKE '%' || $4 || '%')
`;

export const GET_POST_BY_SLUG = `
  SELECT 
    p.id, p.locale, p.title, p.slug, p.excerpt, p.content_md, 
    p.hero_asset_id, p.og_asset_id, p.author_id, p.status, p.published_at,
    p.seo_title, p.seo_description, p.canonical_url,
    p.created_at, p.updated_at,
    u.full_name as author_name, u.email as author_email, u.avatar_asset_id as author_avatar_id
  FROM posts p
  LEFT JOIN users u ON p.author_id = u.id
  WHERE p.slug = $1 AND p.locale = $2 AND p.status = 'published'
`;

export const GET_POST_TAGS = `
  SELECT t.id, t.name, t.slug
  FROM tags t
  INNER JOIN post_tags pt ON t.id = pt.tag_id
  WHERE pt.post_id = $1 AND t.locale = $2
`;

export const GET_POST_CATEGORIES = `
  SELECT c.id, c.name, c.slug
  FROM categories c
  INNER JOIN post_categories pc ON c.id = pc.category_id
  WHERE pc.post_id = $1 AND c.locale = $2 AND c.kind = 'post'
`;

export const GET_POST_RELATED_POSTS = `
  SELECT 
    p.id, p.locale, p.title, p.slug, p.excerpt, p.hero_asset_id, p.published_at
  FROM posts p
  INNER JOIN post_related pr ON p.id = pr.related_post_id
  WHERE pr.post_id = $1 AND p.locale = $2 AND p.status = 'published'
  ORDER BY pr.sort_order ASC
  LIMIT 3
`;
