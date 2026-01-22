import * as serviceRepository from '../repositories/serviceRepository';
import * as sidebarRepository from '../repositories/sidebarRepository';
import { ServiceListQuery } from '../schemas';
import { buildPaginationMeta } from '../db';

/**
 * List published services with optional taxonomy filtering + pagination.
 *
 * This is the business-logic layer for `GET /v1/services`.
 * Input validation (Zod) is expected to happen at the controller/route layer.
 *
 * @param query - Validated service list query (locale, paging, filters).
 * @returns `{ services, meta }` where meta matches the API pagination contract.
 *
 * @throws Will throw if underlying repository/database access fails.
 */
export const listServices = async (query: ServiceListQuery) => {
  const { locale, status, tag, category, page, pageSize, sort } = query;
  const offset = (page - 1) * pageSize;

  // Get total count
  const total = await serviceRepository.countServices({
    locale,
    status,
    tag,
    category,
  });

  // Get services
  const services = await serviceRepository.findServices({
    locale,
    status,
    tag,
    category,
    sort,
    limit: pageSize,
    offset,
  });

  return {
    services,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Fetch a published service detail page payload by slug.
 *
 * This builds the bundled payload required by the public contract:
 * - `service`
 * - `deliverables[]`
 * - `process_steps[]`
 * - `faqs[]`
 * - `related_services[]`
 * - `related_posts[]`
 * - `sidebar` (tags + ads)
 *
 * @param slug - Service slug.
 * @param locale - Locale code (e.g. `en`).
 *
 * @returns Bundled service detail payload, or `null` when the service does not exist.
 *
 * @throws Will throw if underlying repository/database access fails.
 */
export const getServiceBySlug = async (slug: string, locale: string) => {
  // Get service
  const service = await serviceRepository.findBySlug(slug, locale);
  if (!service) {
    return null;
  }

  // Fetch related data in parallel for latency.
  const [
    tags,
    categories,
    deliverables,
    process_steps,
    faqs,
    benefits,
    related_services,
    related_posts,
    sidebarTags,
    sidebarAds,
  ] = await Promise.all([
    serviceRepository.getServiceTags(service.id, locale),
    serviceRepository.getServiceCategories(service.id, locale),
    serviceRepository.getServiceDeliverables(service.id),
    serviceRepository.getServiceProcessSteps(service.id),
    serviceRepository.getServiceFaqs(service.id),
    serviceRepository.getServiceBenefits(service.id),
    serviceRepository.getRelatedServices(service.id, locale),
    serviceRepository.getRelatedPosts(service.id, locale),
    sidebarRepository.getTags(locale),
    sidebarRepository.getAds('service_detail'),
  ]);

  return {
    service,
    tags,
    categories,
    deliverables,
    process_steps,
    faqs,
    benefits,
    related_services,
    related_posts,
    sidebar: {
      tags: sidebarTags,
      ads: sidebarAds,
    },
  };
};
