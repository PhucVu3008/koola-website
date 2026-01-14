import * as adminServiceRepository from '../repositories/adminServiceRepository';
import { buildPaginationMeta } from '../db';

/**
 * Admin Services service layer.
 *
 * Responsibilities:
 * - Orchestrate repository calls for admin service management.
 * - Keep business logic out of controllers.
 */

export interface AdminServiceListQuery {
  locale: string;
  status?: 'draft' | 'published' | 'archived';
  page: number;
  pageSize: number;
}

/**
 * List services for the admin UI with pagination.
 */
export const listServices = async (query: AdminServiceListQuery) => {
  const { locale, status, page, pageSize } = query;
  const offset = (page - 1) * pageSize;

  const total = await adminServiceRepository.countServices({ locale, status });
  const services = await adminServiceRepository.listServices({
    locale,
    status,
    limit: pageSize,
    offset,
  });

  return {
    services,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Get a full editable service bundle by id.
 */
export const getServiceById = async (id: number) => {
  return await adminServiceRepository.getServiceBundleById(id);
};

/**
 * Create a service (plus nested arrays if provided).
 */
export const createService = async (input: {
  userId: number;
  data: any;
}) => {
  const { userId, data } = input;

  const id = await adminServiceRepository.createServiceWithNested(
    {
      locale: data.locale,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_md: data.content_md,
      hero_asset_id: data.hero_asset_id,
      og_asset_id: data.og_asset_id,
      status: data.status,
      published_at: data.published_at ?? null,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      canonical_url: data.canonical_url,
      sort_order: data.sort_order ?? 0,
      created_by: userId,
    },
    {
      tags: data.tags,
      categories: data.categories,
      deliverables: data.deliverables,
      process_steps: data.process_steps,
      faqs: data.faqs,
      related_services: data.related_services,
      related_posts: data.related_posts,
    }
  );

  return id;
};

/**
 * Update a service (and optionally replace nested arrays only when provided).
 */
export const updateService = async (input: {
  id: number;
  userId: number;
  data: any;
}) => {
  const { id, userId, data } = input;

  const updatedId = await adminServiceRepository.updateServiceWithNested(
    id,
    {
      locale: data.locale,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_md: data.content_md,
      hero_asset_id: data.hero_asset_id,
      og_asset_id: data.og_asset_id,
      status: data.status,
      published_at: data.published_at ?? null,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      canonical_url: data.canonical_url,
      sort_order: data.sort_order ?? 0,
      updated_by: userId,
    },
    {
      tags: data.tags,
      categories: data.categories,
      deliverables: data.deliverables,
      process_steps: data.process_steps,
      faqs: data.faqs,
      related_services: data.related_services,
      related_posts: data.related_posts,
    }
  );

  return updatedId;
};

/**
 * Delete a service by id.
 */
export const deleteService = async (id: number) => {
  return await adminServiceRepository.deleteServiceById(id);
};
