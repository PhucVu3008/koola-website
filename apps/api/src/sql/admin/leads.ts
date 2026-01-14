// ============ ADMIN LEADS QUERIES ============

/**
 * Admin Leads queries.
 *
 * Scope:
 * - Admin list leads (with filtering + pagination)
 * - Admin patch lead status
 *
 * Security:
 * - Parameterized SQL only (`$1..$n`).
 */

/**
 * ADMIN_LIST_LEADS
 *
 * List leads with optional status filter and free-text search.
 *
 * Parameters:
 * - $1 status (lead_status | null)
 * - $2 search query `q` (text | null)
 * - $3 limit (int)
 * - $4 offset (int)
 */
export const ADMIN_LIST_LEADS = `
  SELECT
    id,
    full_name,
    email,
    phone,
    company,
    message,
    source_path,
    utm_source,
    utm_medium,
    utm_campaign,
    status,
    created_at
  FROM leads
  WHERE ($1::text IS NULL OR status = $1::lead_status)
    AND (
      $2::text IS NULL
      OR full_name ILIKE '%' || $2 || '%'
      OR email ILIKE '%' || $2 || '%'
      OR company ILIKE '%' || $2 || '%'
    )
  ORDER BY created_at DESC, id DESC
  LIMIT $3 OFFSET $4
`;

/**
 * ADMIN_COUNT_LEADS
 *
 * Parameters:
 * - $1 status (lead_status | null)
 * - $2 search query `q` (text | null)
 */
export const ADMIN_COUNT_LEADS = `
  SELECT COUNT(*)::bigint as total
  FROM leads
  WHERE ($1::text IS NULL OR status = $1::lead_status)
    AND (
      $2::text IS NULL
      OR full_name ILIKE '%' || $2 || '%'
      OR email ILIKE '%' || $2 || '%'
      OR company ILIKE '%' || $2 || '%'
    )
`;

/**
 * ADMIN_UPDATE_LEAD_STATUS
 *
 * Parameters:
 * - $1 lead id
 * - $2 status (lead_status)
 */
export const ADMIN_UPDATE_LEAD_STATUS = `
  UPDATE leads
  SET status = $2::lead_status
  WHERE id = $1
  RETURNING id
`;
