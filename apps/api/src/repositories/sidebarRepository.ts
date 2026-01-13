import { query } from '../db';
import * as SQL from '../sql/public/sidebar';

export const getCategories = async (locale: string) => {
  return await query(SQL.GET_SIDEBAR_CATEGORIES, [locale]);
};

export const getTags = async (locale: string) => {
  return await query(SQL.GET_SIDEBAR_TAGS, [locale]);
};

export const getAds = async (placement: string) => {
  return await query(SQL.GET_SIDEBAR_ADS, [placement]);
};
