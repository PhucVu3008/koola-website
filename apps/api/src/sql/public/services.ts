// ============ SERVICES QUERIES ============

export const LIST_SERVICES = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.excerpt, s.hero_asset_id,
    s.status, s.published_at, s.sort_order, s.created_at,
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
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR c.slug = $4)
  GROUP BY s.id
  ORDER BY 
    CASE WHEN $5 = 'order' THEN s.sort_order END ASC,
    CASE WHEN $5 = 'newest' THEN s.published_at END DESC,
    s.id DESC
  LIMIT $6 OFFSET $7
`;

export const COUNT_SERVICES = `
  SELECT COUNT(DISTINCT s.id) as total
  FROM services s
  LEFT JOIN service_tags st ON s.id = st.service_id
  LEFT JOIN tags t ON st.tag_id = t.id AND t.locale = s.locale
  LEFT JOIN service_categories sc ON s.id = sc.service_id
  LEFT JOIN categories c ON sc.category_id = c.id AND c.locale = s.locale AND c.kind = 'service'
  WHERE s.locale = $1
    AND ($2::text IS NULL OR s.status = $2::content_status)
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR c.slug = $4)
`;

export const GET_SERVICE_BY_SLUG = `
  SELECT 
    id, locale, title, slug, excerpt, content_md, 
    hero_asset_id, og_asset_id, status, published_at,
    seo_title, seo_description, canonical_url, sort_order,
    created_at, updated_at
  FROM services
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;

export const GET_SERVICE_TAGS = `
  SELECT t.id, t.name, t.slug
  FROM tags t
  INNER JOIN service_tags st ON t.id = st.tag_id
  WHERE st.service_id = $1 AND t.locale = $2
`;

export const GET_SERVICE_CATEGORIES = `
  SELECT c.id, c.name, c.slug
  FROM categories c
  INNER JOIN service_categories sc ON c.id = sc.category_id
  WHERE sc.service_id = $1 AND c.locale = $2 AND c.kind = 'service'
`;

export const GET_SERVICE_DELIVERABLES = `
  SELECT id, title, description, icon_asset_id, sort_order
  FROM service_deliverables
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

export const GET_SERVICE_PROCESS_STEPS = `
  SELECT id, title, description, sort_order
  FROM service_process_steps
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

export const GET_SERVICE_FAQS = `
  SELECT id, question, answer, sort_order
  FROM service_faqs
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

export const GET_SERVICE_RELATED_SERVICES = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.excerpt, s.hero_asset_id
  FROM services s
  INNER JOIN service_related sr ON s.id = sr.related_service_id
  WHERE sr.service_id = $1 AND s.locale = $2 AND s.status = 'published'
  ORDER BY sr.sort_order ASC
  LIMIT 3
`;

export const GET_SERVICE_RELATED_POSTS = `
  SELECT 
    p.id, p.locale, p.title, p.slug, p.excerpt, p.hero_asset_id, p.published_at
  FROM posts p
  INNER JOIN service_related_posts srp ON p.id = srp.post_id
  WHERE srp.service_id = $1 AND p.locale = $2 AND p.status = 'published'
  ORDER BY srp.sort_order ASC
  LIMIT 3
`;
