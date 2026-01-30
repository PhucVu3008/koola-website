// ============ SERVICES QUERIES ============

/**
 * LIST_SERVICES
 *
 * List published/draft services for a locale with optional taxonomy filters.
 *
 * Parameters:
 * - $1 locale (text)
 * - $2 status (content_status | null)
 * - $3 tag slug (text | null)
 * - $4 category slug (text | null)
 * - $5 sort ('order' | 'newest')
 * - $6 limit (int)
 * - $7 offset (int)
 *
 * Sorting:
 * - sort='order' => `services.sort_order` ASC
 * - sort='newest' => `services.published_at` DESC
 *
 * Security:
 * - Parameterized SQL only (no string interpolation).
 */
export const LIST_SERVICES = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.excerpt, s.hero_asset_id, s.icon_name,
    s.status, s.published_at, s.sort_order, s.created_at,
    -- Construct hero image URL from media_assets
    CASE 
      WHEN m.id IS NOT NULL THEN CONCAT('/uploads/', m.storage_path)
      ELSE NULL
    END as hero_image_url,
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
  LEFT JOIN media_assets m ON s.hero_asset_id = m.id
  LEFT JOIN service_tags st ON s.id = st.service_id
  LEFT JOIN tags t ON st.tag_id = t.id AND t.locale = s.locale
  LEFT JOIN service_categories sc ON s.id = sc.service_id
  LEFT JOIN categories c ON sc.category_id = c.id AND c.locale = s.locale AND c.kind = 'service'
  WHERE s.locale = $1
    AND (
      $2::text IS NULL AND s.status = 'published' -- Default to published when no status filter
      OR s.status = $2::content_status
    )
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR c.slug = $4)
  GROUP BY s.id, m.id, m.storage_path
  ORDER BY 
    CASE WHEN $5 = 'order' THEN s.sort_order END ASC,
    CASE WHEN $5 = 'newest' THEN s.published_at END DESC,
    s.id DESC
  LIMIT $6 OFFSET $7
`;

/**
 * COUNT_SERVICES
 *
 * Count distinct services for pagination.
 *
 * Parameters:
 * - $1 locale
 * - $2 status (content_status | null)
 * - $3 tag slug (text | null)
 * - $4 category slug (text | null)
 */
export const COUNT_SERVICES = `
  SELECT COUNT(DISTINCT s.id) as total
  FROM services s
  LEFT JOIN service_tags st ON s.id = st.service_id
  LEFT JOIN tags t ON st.tag_id = t.id AND t.locale = s.locale
  LEFT JOIN service_categories sc ON s.id = sc.service_id
  LEFT JOIN categories c ON sc.category_id = c.id AND c.locale = s.locale AND c.kind = 'service'
  WHERE s.locale = $1
    AND (
      $2::text IS NULL AND s.status = 'published' -- Default to published when no status filter
      OR s.status = $2::content_status
    )
    AND ($3::text IS NULL OR t.slug = $3)
    AND ($4::text IS NULL OR c.slug = $4)
`;

/**
 * GET_SERVICE_BY_SLUG
 *
 * Fetch a single published service by `{ slug, locale }`.
 *
 * Parameters:
 * - $1 slug
 * - $2 locale
 */
export const GET_SERVICE_BY_SLUG = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.slug_group, s.excerpt, s.content_md, s.benefits_subtitle,
    s.hero_asset_id, s.og_asset_id, s.status, s.published_at,
    s.seo_title, s.seo_description, s.canonical_url, s.sort_order,
    s.created_at, s.updated_at,
    -- Construct hero image URL from media_assets
    CASE 
      WHEN m_hero.id IS NOT NULL THEN CONCAT('/uploads/', m_hero.storage_path)
      ELSE NULL
    END as hero_image_url,
    -- Construct OG image URL from media_assets
    CASE 
      WHEN m_og.id IS NOT NULL THEN CONCAT('/uploads/', m_og.storage_path)
      ELSE NULL
    END as og_image_url
  FROM services s
  LEFT JOIN media_assets m_hero ON s.hero_asset_id = m_hero.id
  LEFT JOIN media_assets m_og ON s.og_asset_id = m_og.id
  WHERE s.slug = $1 AND s.locale = $2 AND s.status = 'published'
`;

/**
 * GET_SERVICE_TAGS
 *
 * Fetch tags for a service.
 *
 * Parameters:
 * - $1 service_id
 * - $2 locale
 */
export const GET_SERVICE_TAGS = `
  SELECT t.id, t.name, t.slug
  FROM tags t
  INNER JOIN service_tags st ON t.id = st.tag_id
  WHERE st.service_id = $1 AND t.locale = $2
`;

/**
 * GET_SERVICE_CATEGORIES
 *
 * Fetch categories for a service.
 *
 * Parameters:
 * - $1 service_id
 * - $2 locale
 */
export const GET_SERVICE_CATEGORIES = `
  SELECT c.id, c.name, c.slug
  FROM categories c
  INNER JOIN service_categories sc ON c.id = sc.category_id
  WHERE sc.service_id = $1 AND c.locale = $2 AND c.kind = 'service'
`;

/**
 * GET_SERVICE_DELIVERABLES
 *
 * Fetch deliverables ordered by `sort_order`.
 *
 * Parameters:
 * - $1 service_id
 */
export const GET_SERVICE_DELIVERABLES = `
  SELECT id, title, description, icon_asset_id, sort_order
  FROM service_deliverables
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

/**
 * GET_SERVICE_PROCESS_STEPS
 *
 * Fetch process steps ordered by `sort_order`.
 *
 * Parameters:
 * - $1 service_id
 */
export const GET_SERVICE_PROCESS_STEPS = `
  SELECT id, title, description, sort_order
  FROM service_process_steps
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

/**
 * GET_SERVICE_FAQS
 *
 * Fetch FAQs ordered by `sort_order`.
 *
 * Parameters:
 * - $1 service_id
 */
export const GET_SERVICE_FAQS = `
  SELECT id, question, answer, sort_order
  FROM service_faqs
  WHERE service_id = $1
  ORDER BY sort_order ASC
`;

/**
 * GET_SERVICE_BENEFITS
 *
 * Fetch key benefits ordered by `sort_order`.
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
 * GET_SERVICE_RELATED_SERVICES
 *
 * Fetch up to 3 related services for a service.
 *
 * Parameters:
 * - $1 service_id
 * - $2 locale
 *
 * Ordering:
 * - `service_related.sort_order` ASC
 */
export const GET_SERVICE_RELATED_SERVICES = `
  SELECT 
    s.id, s.locale, s.title, s.slug, s.excerpt, s.hero_asset_id
  FROM services s
  INNER JOIN service_related sr ON s.id = sr.related_service_id
  WHERE sr.service_id = $1 AND s.locale = $2 AND s.status = 'published'
  ORDER BY sr.sort_order ASC
  LIMIT 3
`;

/**
 * GET_SERVICE_RELATED_POSTS
 *
 * Fetch up to 3 related posts for a service.
 *
 * Parameters:
 * - $1 service_id
 * - $2 locale
 *
 * Ordering:
 * - `service_related_posts.sort_order` ASC
 */
export const GET_SERVICE_RELATED_POSTS = `
  SELECT 
    p.id, p.locale, p.title, p.slug, p.excerpt, p.hero_asset_id, p.published_at
  FROM posts p
  INNER JOIN service_related_posts srp ON p.id = srp.post_id
  WHERE srp.service_id = $1 AND p.locale = $2 AND p.status = 'published'
  ORDER BY srp.sort_order ASC
  LIMIT 3
`;

/**
 * GET_SERVICE_ALTERNATE_SLUG
 *
 * Get the slug for the same service in a different locale.
 * Used for locale switching on service detail pages.
 *
 * Parameters:
 * - $1 slug_group
 * - $2 target_locale
 */
export const GET_SERVICE_ALTERNATE_SLUG = `
  SELECT slug
  FROM services
  WHERE slug_group = $1 AND locale = $2 AND status = 'published'
  LIMIT 1
`;
