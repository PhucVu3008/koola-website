import { query, queryOne } from '../db';
import * as SQL from '../sql/public/services';

interface ServiceFilters {
  locale: string;
  status?: string;
  tag?: string;
  category?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export const countServices = async (filters: Omit<ServiceFilters, 'sort' | 'limit' | 'offset'>) => {
  const { locale, status, tag, category } = filters;
  
  const [result] = await query<{ total: string }>(SQL.COUNT_SERVICES, [
    locale,
    status || null,
    tag || null,
    category || null,
  ]);
  
  return parseInt(result.total);
};

export const findServices = async (filters: ServiceFilters) => {
  const { locale, status, tag, category, sort, limit, offset } = filters;
  
  return await query(SQL.LIST_SERVICES, [
    locale,
    status || null,
    tag || null,
    category || null,
    sort || 'order',
    limit || 10,
    offset || 0,
  ]);
};

export const findBySlug = async (slug: string, locale: string) => {
  return await queryOne(SQL.GET_SERVICE_BY_SLUG, [slug, locale]);
};

export const getServiceTags = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_TAGS, [serviceId, locale]);
};

export const getServiceCategories = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_CATEGORIES, [serviceId, locale]);
};

export const getServiceDeliverables = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_DELIVERABLES, [serviceId]);
};

export const getServiceProcessSteps = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_PROCESS_STEPS, [serviceId]);
};

export const getServiceFaqs = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_FAQS, [serviceId]);
};

export const getRelatedServices = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_RELATED_SERVICES, [serviceId, locale]);
};

export const getRelatedPosts = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_RELATED_POSTS, [serviceId, locale]);
};
