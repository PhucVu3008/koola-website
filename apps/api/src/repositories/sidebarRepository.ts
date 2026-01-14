import { query } from '../db';
import * as SQL from '../sql/public/sidebar';

/**
 * Get sidebar categories for a given locale.
 *
 * Intended for blog/resources sidebars.
 *
 * @param locale - Locale code (e.g. `en`).
 * @returns List of categories (DB rows).
 *
 * @throws Will throw if the database query fails.
 */
export const getCategories = async (locale: string) => {
  return await query(SQL.GET_SIDEBAR_CATEGORIES, [locale]);
};

/**
 * Get sidebar tags for a given locale.
 *
 * @param locale - Locale code (e.g. `en`).
 * @returns List of tags (DB rows).
 *
 * @throws Will throw if the database query fails.
 */
export const getTags = async (locale: string) => {
  return await query(SQL.GET_SIDEBAR_TAGS, [locale]);
};

/**
 * Get sidebar ads for a placement.
 *
 * @param placement - Placement identifier (e.g. `services_sidebar`, `posts_sidebar`).
 * @returns List of ad records.
 *
 * @throws Will throw if the database query fails.
 */
export const getAds = async (placement: string) => {
  return await query(SQL.GET_SIDEBAR_ADS, [placement]);
};
