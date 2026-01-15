import { pool, query, queryOne } from '../db';
import * as AdminSiteSettingsSQL from '../sql/admin/siteSettings';

/**
 * Admin Site Settings repository.
 *
 * Responsibilities:
 * - Read/write `site_settings` rows.
 * - Keep all operations parameterized.
 */

export interface AdminSiteSettingRow {
  key: string;
  value: unknown;
  updated_at: string;
}

/**
 * List all settings.
 */
export const listSettings = async () => {
  return await query<AdminSiteSettingRow>(AdminSiteSettingsSQL.ADMIN_LIST_SITE_SETTINGS);
};

/**
 * Get a setting by key.
 */
export const getSettingByKey = async (key: string) => {
  return await queryOne<AdminSiteSettingRow>(AdminSiteSettingsSQL.ADMIN_GET_SITE_SETTING_BY_KEY, [key]);
};

/**
 * Upsert a setting.
 */
export const upsertSetting = async (key: string, value: unknown) => {
  const row = await queryOne<{ key: string }>(AdminSiteSettingsSQL.ADMIN_UPSERT_SITE_SETTING, [key, value]);
  return row?.key ?? null;
};

/**
 * Delete a setting.
 */
export const deleteSetting = async (key: string) => {
  const result = await pool.query(AdminSiteSettingsSQL.ADMIN_DELETE_SITE_SETTING, [key]);
  return result.rowCount ?? 0;
};
