// ============ ADMIN SERVICE DELETE SAFETY QUERIES ============

/**
 * This module contains SQL helpers specifically for deleting services safely.
 *
 * Why this exists:
 * - `service_related` references `services` twice:
 *   - `service_related.service_id` -> the primary service
 *   - `service_related.related_service_id` -> the “target” service
 * - When deleting a service, we must remove rows where the service appears in
 *   either column, otherwise PostgreSQL will reject the delete with a FK error.
 *
 * Security:
 * - Parameterized SQL only.
 */

/**
 * ADMIN_DELETE_SERVICE_RELATED_BY_EITHER_SIDE
 *
 * Delete rows in `service_related` where the service is either the source
 * (`service_id`) or the target (`related_service_id`).
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_RELATED_BY_EITHER_SIDE = `
  DELETE FROM service_related
  WHERE service_id = $1 OR related_service_id = $1
`;

/**
 * ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_SERVICE
 *
 * Parameters:
 * - $1 service_id
 */
export const ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_SERVICE = `
  DELETE FROM service_related_posts
  WHERE service_id = $1
`;
