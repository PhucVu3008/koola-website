// ============ SITE/NAV/PAGES QUERIES ============

/**
 * GET_PAGE_BY_SLUG
 *
 * Fetch a single published page by `{ slug, locale }`.
 *
 * Parameters:
 * - $1 slug
 * - $2 locale
 */
export const GET_PAGE_BY_SLUG = `
  SELECT id, locale, slug, title, seo_title, seo_description, hero_asset_id, status, updated_at
  FROM pages
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;

/**
 * GET_PAGE_SECTIONS
 *
 * Fetch page sections ordered for rendering.
 *
 * Parameters:
 * - $1 page_id
 */
export const GET_PAGE_SECTIONS = `
  SELECT id, section_key, payload, sort_order
  FROM page_sections
  WHERE page_id = $1
  ORDER BY sort_order ASC
`;

/**
 * GET_NAV_ITEMS
 *
 * Fetch navigation items for a placement and locale.
 *
 * Parameters:
 * - $1 placement ('header'|'footer')
 * - $2 locale
 *
 * Ordering:
 * - `sort_order` ASC
 */
export const GET_NAV_ITEMS = `
  SELECT id, label, href, sort_order, parent_id
  FROM nav_items
  WHERE placement = $1 AND locale = $2
  ORDER BY sort_order ASC
`;

/**
 * GET_SITE_SETTINGS
 *
 * Fetch a subset of settings used for site chrome.
 *
 * Note:
 * - This query is currently not locale-specific; `value` is assumed to be structured JSON.
 */
export const GET_SITE_SETTINGS = `
  SELECT key, value
  FROM site_settings
  WHERE key IN ('site_meta', 'global_cta', 'social_links', 'contact_info')
`;

/**
 * CREATE_LEAD
 *
 * Insert a lead/contact form submission.
 *
 * Parameters:
 * - $1 full_name
 * - $2 email
 * - $3 phone (nullable)
 * - $4 company (nullable)
 * - $5 message (nullable)
 * - $6 source_path (nullable)
 * - $7 utm_source (nullable)
 * - $8 utm_medium (nullable)
 * - $9 utm_campaign (nullable)
 */
export const CREATE_LEAD = `
  INSERT INTO leads (
    full_name, email, phone, company, message, 
    source_path, utm_source, utm_medium, utm_campaign
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING id, created_at
`;

/**
 * LIST_JOBS
 *
 * List job posts for a locale and status.
 *
 * Parameters:
 * - $1 locale
 * - $2 status (job_status)
 */
export const LIST_JOBS = `
  SELECT 
    id, locale, title, slug, department, location, 
    employment_type, level, summary, status, published_at
  FROM job_posts
  WHERE locale = $1 AND status = $2
  ORDER BY published_at DESC
`;

/**
 * GET_JOB_BY_SLUG
 *
 * Fetch a published job by `{ slug, locale }`.
 *
 * Parameters:
 * - $1 slug
 * - $2 locale
 */
export const GET_JOB_BY_SLUG = `
  SELECT 
    id, locale, title, slug, department, location, 
    employment_type, level, summary, responsibilities_md, requirements_md,
    status, published_at, created_at, updated_at
  FROM job_posts
  WHERE slug = $1 AND locale = $2 AND status = 'published'
`;
