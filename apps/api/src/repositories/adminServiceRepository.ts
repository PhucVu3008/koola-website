import { PoolClient } from 'pg';
import { query, queryOne, transaction } from '../db';
import * as AdminServicesSQL from '../sql/admin/services';
import * as ServicesCrudSQL from '../sql/admin/servicesCrud';
import * as ServiceDeleteSQL from '../sql/admin/serviceDelete';

/**
 * Admin-facing repository for Services.
 *
 * Responsibilities:
 * - Execute raw SQL (parameterized) needed by `/v1/admin/services` endpoints.
 * - Perform multi-table writes inside a transaction.
 *
 * Notes:
 * - Business rules and request validation belong to service/controller layers.
 * - This repository deliberately uses "replace-all" semantics for nested arrays
 *   (tags/categories/deliverables/steps/faqs/related) to keep updates predictable.
 */

export interface AdminServiceListFilters {
  locale: string;
  status?: 'draft' | 'published' | 'archived';
  limit: number;
  offset: number;
}

export interface AdminServiceCreateRow {
  locale: string;
  title: string;
  slug: string;
  excerpt?: string;
  content_md: string;
  hero_asset_id?: number;
  og_asset_id?: number;
  status: 'draft' | 'published' | 'archived';
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  sort_order: number;
  created_by: number;
}

export interface AdminServiceUpdateRow extends Omit<AdminServiceCreateRow, 'created_by'> {
  updated_by: number;
}

export interface AdminServiceNestedInput {
  tags?: number[];
  categories?: number[];
  deliverables?: Array<{
    title: string;
    description?: string;
    icon_asset_id?: number;
    sort_order?: number;
  }>;
  process_steps?: Array<{
    title: string;
    description?: string;
    sort_order?: number;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
    sort_order?: number;
  }>;
  related_services?: number[];
  related_posts?: number[];
}

/**
 * List services for the admin UI.
 */
export const listServices = async (filters: AdminServiceListFilters) => {
  const { locale, status, limit, offset } = filters;
  return await query(ServicesCrudSQL.ADMIN_LIST_SERVICES, [
    locale,
    status ?? null,
    limit,
    offset,
  ]);
};

/**
 * Count services for admin pagination.
 */
export const countServices = async (filters: Omit<AdminServiceListFilters, 'limit' | 'offset'>) => {
  const { locale, status } = filters;
  const [row] = await query<{ total: string }>(ServicesCrudSQL.ADMIN_COUNT_SERVICES, [
    locale,
    status ?? null,
  ]);
  return Number(row?.total ?? 0);
};

/**
 * Get a single service with full nested payload for editing.
 */
export const getServiceBundleById = async (id: number) => {
  const service = await queryOne(ServicesCrudSQL.ADMIN_GET_SERVICE_BY_ID, [id]);
  if (!service) return null;

  const [tagIds, categoryIds, deliverables, processSteps, faqs, relatedServices, relatedPosts] =
    await Promise.all([
      query<{ id: number }>(ServicesCrudSQL.ADMIN_GET_SERVICE_TAG_IDS, [id]),
      query<{ id: number }>(ServicesCrudSQL.ADMIN_GET_SERVICE_CATEGORY_IDS, [id]),
      query(ServicesCrudSQL.ADMIN_GET_SERVICE_DELIVERABLES, [id]),
      query(ServicesCrudSQL.ADMIN_GET_SERVICE_PROCESS_STEPS, [id]),
      query(ServicesCrudSQL.ADMIN_GET_SERVICE_FAQS, [id]),
      query<{ id: number; sort_order: number }>(
        ServicesCrudSQL.ADMIN_GET_SERVICE_RELATED_SERVICE_IDS,
        [id]
      ),
      query<{ id: number; sort_order: number }>(
        ServicesCrudSQL.ADMIN_GET_SERVICE_RELATED_POST_IDS,
        [id]
      ),
    ]);

  return {
    service,
    tags: tagIds.map((t) => t.id),
    categories: categoryIds.map((c) => c.id),
    deliverables,
    process_steps: processSteps,
    faqs,
    // For now we expose ids-only; sort order is deterministic (array order).
    related_services: relatedServices.map((r) => r.id),
    related_posts: relatedPosts.map((r) => r.id),
  };
};

/**
 * Create a service and (optionally) its nested children in a single transaction.
 */
export const createServiceWithNested = async (
  row: AdminServiceCreateRow,
  nested: AdminServiceNestedInput
) => {
  return await transaction(async (client) => {
    const [{ id }] = await client.query<{ id: number }>(AdminServicesSQL.CREATE_SERVICE, [
      row.locale,
      row.title,
      row.slug,
      row.excerpt ?? null,
      row.content_md,
      row.hero_asset_id ?? null,
      row.og_asset_id ?? null,
      row.status,
      row.published_at ?? null,
      row.seo_title ?? null,
      row.seo_description ?? null,
      row.canonical_url ?? null,
      row.sort_order,
      row.created_by,
    ]).then((r) => r.rows);

    await replaceNested(client, id, nested);

    return id;
  });
};

/**
 * Update a service and (optionally) replace nested children in a transaction.
 */
export const updateServiceWithNested = async (
  id: number,
  row: AdminServiceUpdateRow,
  nested: AdminServiceNestedInput
) => {
  return await transaction(async (client) => {
    const updated = await client
      .query<{ id: number }>(AdminServicesSQL.UPDATE_SERVICE, [
        id,
        row.title,
        row.slug,
        row.excerpt ?? null,
        row.content_md,
        row.hero_asset_id ?? null,
        row.og_asset_id ?? null,
        row.status,
        row.published_at ?? null,
        row.seo_title ?? null,
        row.seo_description ?? null,
        row.canonical_url ?? null,
        row.sort_order,
        row.updated_by,
      ])
      .then((r) => r.rows[0] || null);

    if (!updated) return null;

    await replaceNested(client, id, nested);

    return id;
  });
};

/**
 * Delete a service by id.
 *
 * Note: `service_id` foreign keys do not specify CASCADE in schema.
 * We therefore remove dependent rows first to avoid FK constraint errors.
 *
 * Important FK edge case:
 * - The service may also appear as `service_related.related_service_id` for other services.
 *   We must delete those rows too.
 */
export const deleteServiceById = async (id: number) => {
  return await transaction(async (client) => {
    // Dependent rows where this service is the “owner” (`service_id`).
    await client.query(ServiceDeleteSQL.ADMIN_DELETE_SERVICE_RELATED_POSTS_BY_SERVICE, [id]);

    // Dependent rows where this service is either side of the relation.
    await client.query(ServiceDeleteSQL.ADMIN_DELETE_SERVICE_RELATED_BY_EITHER_SIDE, [id]);

    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_FAQS, [id]);
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_PROCESS_STEPS, [id]);
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_DELIVERABLES, [id]);
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_CATEGORIES, [id]);
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_TAGS, [id]);

    const result = await client.query(AdminServicesSQL.DELETE_SERVICE, [id]);
    return (result.rowCount ?? 0) > 0;
  });
};

/**
 * Replace nested relations for a service.
 *
 * Semantics:
 * - Each nested field is only replaced if it is present on `nested`.
 * - Absence means "do not modify".
 */
const replaceNested = async (
  client: PoolClient,
  serviceId: number,
  nested: AdminServiceNestedInput
) => {
  if (nested.tags) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_TAGS, [serviceId]);
    for (const tagId of nested.tags) {
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_TAG, [serviceId, tagId]);
    }
  }

  if (nested.categories) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_CATEGORIES, [serviceId]);
    for (const categoryId of nested.categories) {
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_CATEGORY, [serviceId, categoryId]);
    }
  }

  if (nested.deliverables) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_DELIVERABLES, [serviceId]);
    for (const d of nested.deliverables) {
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_DELIVERABLE, [
        serviceId,
        d.title,
        d.description ?? null,
        d.icon_asset_id ?? null,
        d.sort_order ?? 0,
      ]);
    }
  }

  if (nested.process_steps) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_PROCESS_STEPS, [serviceId]);
    for (const s of nested.process_steps) {
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_PROCESS_STEP, [
        serviceId,
        s.title,
        s.description ?? null,
        s.sort_order ?? 0,
      ]);
    }
  }

  if (nested.faqs) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_FAQS, [serviceId]);
    for (const f of nested.faqs) {
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_FAQ, [
        serviceId,
        f.question,
        f.answer,
        f.sort_order ?? 0,
      ]);
    }
  }

  if (nested.related_services) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_RELATED_SERVICES, [serviceId]);
    for (let i = 0; i < nested.related_services.length; i++) {
      const relatedId = nested.related_services[i];
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_RELATED_SERVICE, [
        serviceId,
        relatedId,
        i,
      ]);
    }
  }

  if (nested.related_posts) {
    await client.query(ServicesCrudSQL.ADMIN_DELETE_SERVICE_RELATED_POSTS, [serviceId]);
    for (let i = 0; i < nested.related_posts.length; i++) {
      const postId = nested.related_posts[i];
      await client.query(ServicesCrudSQL.ADMIN_INSERT_SERVICE_RELATED_POST, [serviceId, postId, i]);
    }
  }
};
