import { query, queryOne } from '../db';
import * as SQL from '../sql/public/services';

/**
 * Filters for listing services.
 *
 * Notes:
 * - Pagination is `limit`/`offset`.
 * - `sort` should be validated at the API boundary (Zod) to supported values.
 */
interface ServiceFilters {
  locale: string;
  status?: string;
  tag?: string;
  category?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

/**
 * Count services matching the provided filters (for pagination).
 *
 * @param filters - Listing filters excluding pagination/sort.
 * @returns Total count as a number.
 *
 * @throws Will throw if the database query fails.
 */
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

/**
 * List services using locale + optional taxonomy filters.
 *
 * @param filters - Service list filters including pagination/sort.
 * @returns Array of service records.
 *
 * @throws Will throw if the database query fails.
 */
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

/**
 * Fetch a published service by slug + locale.
 *
 * @param slug - Service slug.
 * @param locale - Locale code.
 * @returns Service row or `null` if not found.
 *
 * @throws Will throw if the database query fails.
 */
export const findBySlug = async (slug: string, locale: string) => {
  return await queryOne(SQL.GET_SERVICE_BY_SLUG, [slug, locale]);
};

/**
 * Get tags for a service.
 *
 * @param serviceId - Service id.
 * @param locale - Locale code.
 * @returns Tag rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceTags = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_TAGS, [serviceId, locale]);
};

/**
 * Get categories for a service.
 *
 * @param serviceId - Service id.
 * @param locale - Locale code.
 * @returns Category rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceCategories = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_CATEGORIES, [serviceId, locale]);
};

/**
 * Get deliverables for a service.
 *
 * @param serviceId - Service id.
 * @returns Deliverable rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceDeliverables = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_DELIVERABLES, [serviceId]);
};

/**
 * Get process steps for a service.
 *
 * @param serviceId - Service id.
 * @returns Process step rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceProcessSteps = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_PROCESS_STEPS, [serviceId]);
};

/**
 * Get FAQs for a service.
 *
 * @param serviceId - Service id.
 * @returns FAQ rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceFaqs = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_FAQS, [serviceId]);
};

/**
 * Get key benefits for a service.
 *
 * @param serviceId - Service id.
 * @returns Benefit rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceBenefits = async (serviceId: number) => {
  return await query(SQL.GET_SERVICE_BENEFITS, [serviceId]);
};

/**
 * Get related services for a service.
 *
 * @param serviceId - Service id.
 * @param locale - Locale code.
 * @returns Related service rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getRelatedServices = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_RELATED_SERVICES, [serviceId, locale]);
};

/**
 * Get related posts for a service.
 *
 * @param serviceId - Service id.
 * @param locale - Locale code.
 * @returns Related post rows.
 *
 * @throws Will throw if the database query fails.
 */
export const getRelatedPosts = async (serviceId: number, locale: string) => {
  return await query(SQL.GET_SERVICE_RELATED_POSTS, [serviceId, locale]);
};

/**
 * Get the slug for the same service in a different locale.
 * Used for locale switching on service detail pages.
 *
 * @param slugGroup - The slug_group identifier.
 * @param targetLocale - Target locale code (e.g., 'en', 'vi').
 * @returns The slug in the target locale, or null if not found.
 *
 * @throws Will throw if the database query fails.
 */
export const getServiceAlternateSlug = async (slugGroup: string, targetLocale: string): Promise<string | null> => {
  const rows = await query<{ slug: string }>(SQL.GET_SERVICE_ALTERNATE_SLUG, [slugGroup, targetLocale]);
  return rows.length > 0 ? rows[0].slug : null;
};
