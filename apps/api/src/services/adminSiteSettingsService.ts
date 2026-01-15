import * as adminSiteSettingsRepository from '../repositories/adminSiteSettingsRepository';

/**
 * Admin Site Settings service.
 *
 * Business rules:
 * - The current DB schema does not enforce a strict whitelist of keys.
 * - We keep the service minimal: validate existence where needed.
 */

export const listSettings = async () => {
  return await adminSiteSettingsRepository.listSettings();
};

export const getSettingByKey = async (key: string) => {
  return await adminSiteSettingsRepository.getSettingByKey(key);
};

export const upsertSetting = async (key: string, value: unknown) => {
  const savedKey = await adminSiteSettingsRepository.upsertSetting(key, value);
  return savedKey;
};

export const deleteSetting = async (key: string) => {
  const deleted = await adminSiteSettingsRepository.deleteSetting(key);
  return deleted;
};
