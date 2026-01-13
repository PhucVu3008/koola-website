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
