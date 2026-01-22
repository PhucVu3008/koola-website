/**
 * GET /v1/services/:slug
 *
 * Aggregate endpoint for service detail page.
 * Returns bundled payload with all data needed to render the page.
 *
 * Response shape:
 * {
 *   data: {
 *     service: { id, locale, title, slug, excerpt, content_md, ... },
 *     tags: [...],
 *     categories: [...],
 *     deliverables: [...],
 *     processSteps: [...],
 *     faqs: [...],
 *     relatedServices: [...],
 *     relatedPosts: [...]
 *   }
 * }
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../../db';
import {
  GET_SERVICE_BY_SLUG,
  GET_SERVICE_TAGS,
  GET_SERVICE_CATEGORIES,
  GET_SERVICE_DELIVERABLES,
  GET_SERVICE_PROCESS_STEPS,
  GET_SERVICE_FAQS,
  GET_SERVICE_RELATED_SERVICES,
  GET_SERVICE_RELATED_POSTS,
} from '../../../sql/public/services';
import { successResponse } from '../../../utils/response';
import { NotFoundError } from '../../../utils/errors';

const querySchema = z.object({
  locale: z.string().default('en'),
});

export default async function serviceDetailRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: { slug: string };
    Querystring: z.infer<typeof querySchema>;
  }>('/services/:slug', async (request) => {
    const { slug } = request.params;
    const { locale } = querySchema.parse(request.query);

    // 1. Fetch service base data
    const serviceResult = await pool.query(GET_SERVICE_BY_SLUG, [slug, locale]);

    if (serviceResult.rows.length === 0) {
      throw new NotFoundError(`Service not found: ${slug}`);
    }

    const service = serviceResult.rows[0];
    const serviceId = service.id;

    // 2. Fetch all related data in parallel
    const [
      tagsResult,
      categoriesResult,
      deliverablesResult,
      processStepsResult,
      faqsResult,
      relatedServicesResult,
      relatedPostsResult,
    ] = await Promise.all([
      pool.query(GET_SERVICE_TAGS, [serviceId, locale]),
      pool.query(GET_SERVICE_CATEGORIES, [serviceId, locale]),
      pool.query(GET_SERVICE_DELIVERABLES, [serviceId]),
      pool.query(GET_SERVICE_PROCESS_STEPS, [serviceId]),
      pool.query(GET_SERVICE_FAQS, [serviceId]),
      pool.query(GET_SERVICE_RELATED_SERVICES, [serviceId, locale]),
      pool.query(GET_SERVICE_RELATED_POSTS, [serviceId, locale]),
    ]);

    // 3. Build aggregate payload
    const data = {
      service: {
        id: service.id,
        locale: service.locale,
        title: service.title,
        slug: service.slug,
        excerpt: service.excerpt,
        contentMd: service.content_md,
        heroAssetId: service.hero_asset_id,
        ogAssetId: service.og_asset_id,
        status: service.status,
        publishedAt: service.published_at,
        seoTitle: service.seo_title,
        seoDescription: service.seo_description,
        canonicalUrl: service.canonical_url,
        sortOrder: service.sort_order,
        createdAt: service.created_at,
        updatedAt: service.updated_at,
      },
      tags: tagsResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
      })),
      categories: categoriesResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
      })),
      deliverables: deliverablesResult.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        iconAssetId: row.icon_asset_id,
        sortOrder: row.sort_order,
      })),
      processSteps: processStepsResult.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        sortOrder: row.sort_order,
      })),
      faqs: faqsResult.rows.map((row: any) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        sortOrder: row.sort_order,
      })),
      relatedServices: relatedServicesResult.rows.map((row: any) => ({
        id: row.id,
        locale: row.locale,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        heroAssetId: row.hero_asset_id,
      })),
      relatedPosts: relatedPostsResult.rows.map((row: any) => ({
        id: row.id,
        locale: row.locale,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        heroAssetId: row.hero_asset_id,
        publishedAt: row.published_at,
      })),
    };

    return successResponse(data);
  });
}
