/**
 * Admin Site Settings queries.
 *
 * Table: `site_settings`
 * - key (text, PK)
 * - value (jsonb)
 * - updated_at (timestamptz)
 *
 * Notes:
 * - Settings are not locale-specific in the current schema.
 * - All queries are parameterized.
 */

/**
 * ADMIN_LIST_SITE_SETTINGS
 *
 * List all site settings.
 */
export const ADMIN_LIST_SITE_SETTINGS = `
  SELECT key, value, updated_at
  FROM site_settings
  ORDER BY key ASC
`;

/**
 * ADMIN_GET_SITE_SETTING_BY_KEY
 *
 * Parameters:
 * - $1 key
 */
export const ADMIN_GET_SITE_SETTING_BY_KEY = `
  SELECT key, value, updated_at
  FROM site_settings
  WHERE key = $1
`;

/**
 * ADMIN_UPSERT_SITE_SETTING
 *
 * Upsert by primary key.
 *
 * Parameters:
 * - $1 key
 * - $2 value (jsonb)
 */
export const ADMIN_UPSERT_SITE_SETTING = `
  INSERT INTO site_settings (key, value, updated_at)
  VALUES ($1, $2::jsonb, NOW())
  ON CONFLICT (key)
  DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  RETURNING key
`;

/**
 * ADMIN_DELETE_SITE_SETTING
 *
 * Parameters:
 * - $1 key
 */
export const ADMIN_DELETE_SITE_SETTING = `
  DELETE FROM site_settings
  WHERE key = $1
`;
