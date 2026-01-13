// ============ SITE/NAV/PAGES QUERIES ============

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

export const GET_NAV_ITEMS = `
  SELECT id, label, href, sort_order, parent_id
  FROM nav_items
  WHERE placement = $1 AND locale = $2
  ORDER BY sort_order ASC
`;

export const GET_SITE_SETTINGS = `
  SELECT key, value
  FROM site_settings
  WHERE key IN ('site_meta', 'global_cta', 'social_links', 'contact_info')
`;

export const CREATE_LEAD = `
  INSERT INTO leads (
    full_name, email, phone, company, message, 
    source_path, utm_source, utm_medium, utm_campaign
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING id, created_at
`;

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
