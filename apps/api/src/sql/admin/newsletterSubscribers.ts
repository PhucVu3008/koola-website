// ============ ADMIN NEWSLETTER SUBSCRIBERS QUERIES ============

/**
 * Admin Newsletter Subscribers queries.
 *
 * Scope:
 * - List newsletter subscribers (filter + pagination)
 * - Patch subscriber status
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`).
 */

/**
 * ADMIN_LIST_NEWSLETTER_SUBSCRIBERS
 *
 * Parameters:
 * - $1 status (subscriber_status | null)
 * - $2 search query `q` (text | null)
 * - $3 limit (int)
 * - $4 offset (int)
 */
export const ADMIN_LIST_NEWSLETTER_SUBSCRIBERS = `
  SELECT
    id,
    email,
    status,
    source_path,
    subscribed_at,
    unsubscribed_at
  FROM newsletter_subscribers
  WHERE ($1::text IS NULL OR status = $1::subscriber_status)
    AND (
      $2::text IS NULL
      OR email ILIKE '%' || $2 || '%'
      OR source_path ILIKE '%' || $2 || '%'
    )
  ORDER BY subscribed_at DESC, id DESC
  LIMIT $3 OFFSET $4
`;

/**
 * ADMIN_COUNT_NEWSLETTER_SUBSCRIBERS
 *
 * Parameters:
 * - $1 status (subscriber_status | null)
 * - $2 search query `q` (text | null)
 */
export const ADMIN_COUNT_NEWSLETTER_SUBSCRIBERS = `
  SELECT COUNT(*)::bigint as total
  FROM newsletter_subscribers
  WHERE ($1::text IS NULL OR status = $1::subscriber_status)
    AND (
      $2::text IS NULL
      OR email ILIKE '%' || $2 || '%'
      OR source_path ILIKE '%' || $2 || '%'
    )
`;

/**
 * ADMIN_UPDATE_NEWSLETTER_SUBSCRIBER_STATUS
 *
 * Behavior:
 * - If status becomes `subscribed`, sets `subscribed_at = NOW()` and clears `unsubscribed_at`.
 * - If status becomes `unsubscribed`, sets `unsubscribed_at = NOW()`.
 *
 * Parameters:
 * - $1 subscriber id
 * - $2 status (subscriber_status)
 */
export const ADMIN_UPDATE_NEWSLETTER_SUBSCRIBER_STATUS = `
  UPDATE newsletter_subscribers
  SET
    status = $2::subscriber_status,
    subscribed_at = CASE WHEN $2::subscriber_status = 'subscribed' THEN NOW() ELSE subscribed_at END,
    unsubscribed_at = CASE WHEN $2::subscriber_status = 'unsubscribed' THEN NOW() ELSE NULL END
  WHERE id = $1
  RETURNING id
`;
