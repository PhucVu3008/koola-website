import * as adminSiteSettingsRepository from '../repositories/adminSiteSettingsRepository';

/**
 * Site Settings Helper
 *
 * Provides convenient access to site settings stored in database.
 * Settings are cached in memory and refreshed periodically.
 */

// Cache for settings to avoid frequent DB queries
let settingsCache: Map<string, any> = new Map();
let lastCacheUpdate: number = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get a setting value by key.
 * Uses in-memory cache with TTL to reduce DB load.
 *
 * @param key - Setting key
 * @param defaultValue - Default value if setting not found
 * @returns Setting value or default
 */
export const getSetting = async (key: string, defaultValue?: any): Promise<any> => {
  // Check cache first
  const now = Date.now();
  if (settingsCache.has(key) && now - lastCacheUpdate < CACHE_TTL) {
    return settingsCache.get(key) ?? defaultValue;
  }

  // Fetch from database
  try {
    const setting = await adminSiteSettingsRepository.getSettingByKey(key);
    if (setting && setting.value !== null) {
      const value = typeof setting.value === 'string' ? setting.value : (setting.value as any);
      settingsCache.set(key, value);
      lastCacheUpdate = now;
      return value;
    }
  } catch (error) {
    console.error(`Failed to get setting "${key}":`, error);
  }

  return defaultValue;
};

/**
 * Get notification email address.
 * Falls back to NOTIFICATION_EMAIL env variable if not set in database.
 *
 * @returns Email address for receiving notifications
 */
export const getNotificationEmail = async (): Promise<string> => {
  const emailFromDb = await getSetting('notification_email');
  if (emailFromDb && typeof emailFromDb === 'string') {
    return emailFromDb;
  }

  // Fallback to environment variable
  const emailFromEnv = process.env.NOTIFICATION_EMAIL;
  if (emailFromEnv) {
    return emailFromEnv;
  }

  throw new Error('Notification email is not configured. Please set it in Admin Settings or NOTIFICATION_EMAIL env variable.');
};

/**
 * Get multiple notification emails (for future multi-recipient support).
 *
 * @returns Array of email addresses
 */
export const getNotificationEmails = async (): Promise<string[]> => {
  const emailsFromDb = await getSetting('notification_emails');
  
  if (emailsFromDb) {
    if (Array.isArray(emailsFromDb)) {
      return emailsFromDb.filter((email) => typeof email === 'string');
    }
    if (typeof emailsFromDb === 'string') {
      // Support comma-separated list
      return emailsFromDb.split(',').map((e) => e.trim()).filter(Boolean);
    }
  }

  // Fallback to single notification email
  const singleEmail = await getNotificationEmail();
  return [singleEmail];
};

/**
 * Clear settings cache.
 * Useful after updating settings to force refresh.
 */
export const clearCache = (): void => {
  settingsCache.clear();
  lastCacheUpdate = 0;
};

/**
 * Get admin panel URL.
 * Falls back to ADMIN_PANEL_URL env variable.
 */
export const getAdminPanelUrl = async (): Promise<string> => {
  const urlFromDb = await getSetting('admin_panel_url');
  if (urlFromDb && typeof urlFromDb === 'string') {
    return urlFromDb;
  }

  return process.env.ADMIN_PANEL_URL || 'http://localhost:3000/en/admin';
};

/**
 * Get site name.
 */
export const getSiteName = async (): Promise<string> => {
  return await getSetting('site_name', 'Your Website');
};

/**
 * Refresh all settings cache from database.
 * Useful for preloading or after bulk updates.
 */
export const refreshCache = async (): Promise<void> => {
  try {
    const allSettings = await adminSiteSettingsRepository.listSettings();
    settingsCache.clear();
    
    for (const setting of allSettings) {
      if (setting.value !== null) {
        settingsCache.set(setting.key, setting.value);
      }
    }
    
    lastCacheUpdate = Date.now();
  } catch (error) {
    console.error('Failed to refresh settings cache:', error);
  }
};
