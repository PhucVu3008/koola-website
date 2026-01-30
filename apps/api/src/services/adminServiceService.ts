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
      slug_group: data.slug_group,
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
      slug_group: data.slug_group,
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

/**
 * Sync/Translate service to other locales
 * 
 * @param id - Source service ID
 * @param targetLocale - Target locale to translate to ('en' or 'vi')
 * @param mode - 'auto' for auto-translate, 'manual' for copy-only
 * @param userId - User ID making the change
 * @returns ID of the created/updated translation
 */
export const syncTranslation = async (input: {
  id: number;
  targetLocale: 'en' | 'vi';
  mode: 'auto' | 'manual';
  userId: number;
}): Promise<number> => {
  const { id, targetLocale, mode, userId } = input;
  
  // Get source service
  const sourceBundle = await adminServiceRepository.getServiceBundleById(id);
  if (!sourceBundle?.service) {
    throw new Error('Source service not found');
  }
  
  const sourceService = sourceBundle.service;
  const sourceLocale = sourceService.locale;
  
  if (sourceLocale === targetLocale) {
    throw new Error('Target locale must be different from source locale');
  }
  
  // Import translation service
  const translationService = await import('./translationService');
  
  // Check if translation already exists
  const siblings = await adminServiceRepository.getServicesBySlugGroup(
    sourceService.slug_group || sourceService.slug
  );
  
  const existingTranslation = siblings.find((s: any) => s.locale === targetLocale);
  
  // Prepare translated data
  let translatedData = {
    title: sourceService.title,
    excerpt: sourceService.excerpt,
    content_md: sourceService.content_md,
    seo_title: sourceService.seo_title || '',
    seo_description: sourceService.seo_description || '',
  };
  
  // Auto-translate if mode is 'auto'
  if (mode === 'auto') {
    translatedData = await translationService.translateServiceData(
      translatedData,
      sourceLocale,
      targetLocale
    );
  }
  
  // Generate slug for target locale
  const translatedSlug = translationService.generateSlugFromTitle(
    translatedData.title,
    targetLocale
  );
  
  const commonData = {
    locale: targetLocale,
    title: translatedData.title,
    slug: translatedSlug,
    slug_group: sourceService.slug_group || sourceService.slug,
    excerpt: translatedData.excerpt,
    content_md: translatedData.content_md,
    hero_asset_id: sourceService.hero_asset_id,
    og_asset_id: sourceService.og_asset_id,
    status: sourceService.status,
    published_at: sourceService.published_at,
    seo_title: translatedData.seo_title || undefined,
    seo_description: translatedData.seo_description || undefined,
    canonical_url: undefined,
    sort_order: sourceService.sort_order,
  };
  
  // Copy nested data
  const nestedData = {
    tags: sourceBundle.tags?.map((t: any) => t.tag_id).filter((id: any) => id != null) || [],
    categories: sourceBundle.categories?.map((c: any) => c.category_id).filter((id: any) => id != null) || [],
    deliverables: sourceBundle.deliverables?.map((d: any) => ({
      title: d.title,
      description: d.description,
      sort_order: d.sort_order,
    })).filter((d: any) => d.title) || [],
    process_steps: sourceBundle.process_steps?.map((p: any) => ({
      title: p.title,
      description: p.description,
      sort_order: p.sort_order,
    })).filter((p: any) => p.title) || [],
    faqs: sourceBundle.faqs?.map((f: any) => ({
      question: f.question,
      answer: f.answer,
      sort_order: f.sort_order,
    })).filter((f: any) => f.question) || [],
    related_services: sourceBundle.related_services?.map((r: any) => r.related_service_id).filter((id: any) => id != null) || [],
    related_posts: sourceBundle.related_posts?.map((r: any) => r.post_id).filter((id: any) => id != null) || [],
  };
  
  // Update or create translation
  if (existingTranslation) {
    // Update existing translation
    await adminServiceRepository.updateServiceWithNested(
      existingTranslation.id,
      {
        ...commonData,
        updated_by: userId,
      },
      nestedData
    );
    return existingTranslation.id;
  } else {
    // Create new translation
    const newId = await adminServiceRepository.createServiceWithNested(
      {
        ...commonData,
        created_by: userId,
      },
      nestedData
    );
    return newId;
  }
};

/**
 * Sync images across all locales with the same slug_group
 * 
 * @param id - Service ID that had its image updated
 * @param userId - User ID making the change
 */
export const syncImagesAcrossLocales = async (id: number, userId: number): Promise<void> => {
  // Get the service
  const bundle = await adminServiceRepository.getServiceBundleById(id);
  if (!bundle?.service) {
    throw new Error('Service not found');
  }
  
  const service = bundle.service;
  const slugGroup = service.slug_group || service.slug;
  
  // Sync images to all services in the same slug_group
  await adminServiceRepository.syncImagesBySlugGroup(
    slugGroup,
    service.hero_asset_id ?? null,
    service.og_asset_id ?? null,
    userId
  );
};
