import * as serviceRepository from '../repositories/serviceRepository';
import * as sidebarRepository from '../repositories/sidebarRepository';
import { ServiceListQuery } from '../schemas';
import { buildPaginationMeta } from '../db';

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

export const getServiceBySlug = async (slug: string, locale: string) => {
  // Get service
  const service = await serviceRepository.findBySlug(slug, locale);
  if (!service) {
    return null;
  }

  // Get related data in parallel
  const [
    tags,
    categories,
    deliverables,
    process_steps,
    faqs,
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
    related_services,
    related_posts,
    sidebar: {
      tags: sidebarTags,
      ads: sidebarAds,
    },
  };
};
