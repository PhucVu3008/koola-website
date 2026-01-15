/**
 * Admin Nav Items queries.
 *
 * Table: `nav_items`
 *
 * Column assumptions (from `db.sql`):
 * - id (bigint)
 * - locale (text, default 'en')
 * - placement (text)
 * - label (text)
 * - href (text)
 * - sort_order (int)
 * - parent_id (bigint, self-referencing FK)
 *
 * Security:
 * - Always parameterize input (`$1..$n`).
 */

/**
 * ADMIN_LIST_NAV_ITEMS
 *
 * List navigation items filtered by `{ locale, placement }`.
 *
 * Parameters:
 * - $1 locale
 * - $2 placement
 */
export const ADMIN_LIST_NAV_ITEMS = `
  SELECT id, locale, placement, label, href, sort_order, parent_id
  FROM nav_items
  WHERE locale = $1 AND placement = $2
  ORDER BY sort_order ASC, id ASC
`;

/**
 * ADMIN_GET_NAV_ITEM_BY_ID
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_GET_NAV_ITEM_BY_ID = `
  SELECT id, locale, placement, label, href, sort_order, parent_id
  FROM nav_items
  WHERE id = $1
`;

/**
 * ADMIN_CREATE_NAV_ITEM
 *
 * Insert a nav item.
 *
 * Parameters:
 * - $1 locale
 * - $2 placement
 * - $3 label
 * - $4 href
 * - $5 sort_order
 * - $6 parent_id (nullable)
 */
export const ADMIN_CREATE_NAV_ITEM = `
  INSERT INTO nav_items (locale, placement, label, href, sort_order, parent_id)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id
`;

/**
 * ADMIN_UPDATE_NAV_ITEM
 *
 * Update a nav item.
 *
 * Parameters:
 * - $1 id
 * - $2 locale
 * - $3 placement
 * - $4 label
 * - $5 href
 * - $6 sort_order
 * - $7 parent_id (nullable)
 */
export const ADMIN_UPDATE_NAV_ITEM = `
  UPDATE nav_items
  SET locale = $2,
      placement = $3,
      label = $4,
      href = $5,
      sort_order = $6,
      parent_id = $7
  WHERE id = $1
  RETURNING id
`;

/**
 * ADMIN_DELETE_NAV_ITEM
 *
 * Delete a nav item by id.
 *
 * Parameters:
 * - $1 id
 */
export const ADMIN_DELETE_NAV_ITEM = `
  DELETE FROM nav_items
  WHERE id = $1
`;

/**
 * ADMIN_CLEAR_CHILD_PARENT_IDS
 *
 * Before deleting a nav item, we must detach its children to avoid FK violation
 * (since `nav_items.parent_id` references `nav_items.id` and no ON DELETE
 * behavior is defined).
 *
 * Parameters:
 * - $1 parent_id
 */
export const ADMIN_CLEAR_CHILD_PARENT_IDS = `
  UPDATE nav_items
  SET parent_id = NULL
  WHERE parent_id = $1
`;
