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

// ============ SIDEBAR QUERIES ============

export const GET_SIDEBAR_CATEGORIES = `
  SELECT c.id, c.name, c.slug, COUNT(pc.post_id) as count
  FROM categories c
  LEFT JOIN post_categories pc ON c.id = pc.category_id
  LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'published' AND p.locale = c.locale
  WHERE c.kind = 'post' AND c.locale = $1
  GROUP BY c.id
  ORDER BY c.sort_order ASC, c.name ASC
`;

export const GET_SIDEBAR_TAGS = `
  SELECT t.id, t.name, t.slug
  FROM tags t
  WHERE t.locale = $1
  ORDER BY t.name ASC
`;

export const GET_SIDEBAR_ADS = `
  SELECT id, name, image_asset_id, target_url, placement
  FROM ads
  WHERE status = 'active' 
    AND placement = $1
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
  ORDER BY sort_order ASC
  LIMIT 3
`;

// ============ PAGES QUERIES ============

export const GET_PAGE_BY_SLUG = `
  SELECT id, locale, slug, title, seo_title, seo_description, hero_asset_id, status, updated_at
  FROM pages
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;

export const GET_PAGE_SECTIONS = `
  SELECT id, section_key, payload, sort_order
  FROM page_sections
  WHERE page_id = $1
  ORDER BY sort_order ASC
`;

// ============ NAV QUERIES ============

export const GET_NAV_ITEMS = `
  SELECT id, label, href, sort_order, parent_id
  FROM nav_items
  WHERE placement = $1 AND locale = $2
  ORDER BY sort_order ASC
`;

// ============ SITE SETTINGS QUERIES ============

export const GET_SITE_SETTINGS = `
  SELECT key, value
  FROM site_settings
  WHERE key IN ('site_meta', 'global_cta', 'social_links', 'contact_info')
`;

// ============ LEADS QUERIES ============

export const CREATE_LEAD = `
  INSERT INTO leads (
    full_name, email, phone, company, message, 
    source_path, utm_source, utm_medium, utm_campaign
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING id, created_at
`;

// ============ NEWSLETTER QUERIES ============

export const SUBSCRIBE_NEWSLETTER = `
  INSERT INTO newsletter_subscribers (email, source_path)
  VALUES ($1, $2)
  ON CONFLICT (email) 
  DO UPDATE SET 
    status = 'subscribed',
    subscribed_at = NOW(),
    unsubscribed_at = NULL
  RETURNING id, email, subscribed_at
`;

export const UNSUBSCRIBE_NEWSLETTER = `
  UPDATE newsletter_subscribers
  SET status = 'unsubscribed', unsubscribed_at = NOW()
  WHERE email = $1
  RETURNING id
`;

// ============ JOBS QUERIES ============

export const LIST_JOBS = `
  SELECT 
    id, locale, title, slug, department, location, 
    employment_type, level, summary, status, published_at
  FROM job_posts
  WHERE locale = $1 AND status = $2
  ORDER BY published_at DESC
`;

export const GET_JOB_BY_SLUG = `
  SELECT 
    id, locale, title, slug, department, location, 
    employment_type, level, summary, responsibilities_md, requirements_md,
    status, published_at, created_at, updated_at
  FROM job_posts
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;

// ============ AUTH QUERIES ============

export const GET_USER_BY_EMAIL = `
  SELECT 
    u.id, u.email, u.password_hash, u.full_name, 
    u.avatar_asset_id, u.is_active,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object('id', r.id, 'name', r.name)
      ) FILTER (WHERE r.id IS NOT NULL), 
      '[]'
    ) as roles
  FROM users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  LEFT JOIN roles r ON ur.role_id = r.id
  WHERE u.email = $1 AND u.is_active = true
  GROUP BY u.id
`;

export const CREATE_REFRESH_TOKEN = `
  INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
  VALUES ($1, $2, $3)
  RETURNING id
`;

export const GET_REFRESH_TOKEN = `
  SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at
  FROM refresh_tokens rt
  WHERE rt.token_hash = $1
`;

export const REVOKE_REFRESH_TOKEN = `
  UPDATE refresh_tokens
  SET revoked_at = NOW()
  WHERE token_hash = $1
`;

export const UPDATE_USER_LAST_LOGIN = `
  UPDATE users
  SET last_login_at = NOW()
  WHERE id = $1
`;
