import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../db';
import {
  jobListQuerySchema,
  jobSlugParamsSchema,
  jobSlugQuerySchema,
  jobApplicationSchema,
} from '../../schemas';
import * as SQL from '../../sql/queries';
import { ErrorCodes, errorResponse, successResponse } from '../../utils/response';
import { jobSchemas } from '../../swagger/schemas';

const jobsRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', { schema: jobSchemas.list }, async (request, reply) => {
    const { locale, status } = jobListQuerySchema.parse(request.query);

    const jobs = await query(SQL.LIST_JOBS, [locale, status]);

    return reply.send(successResponse(jobs));
  });

  server.get<{ Params: { slug: string }; Querystring: { locale?: string } }>(
    '/:slug',
    { schema: jobSchemas.getBySlug },
    async (request, reply) => {
      const { slug } = jobSlugParamsSchema.parse(request.params);
      const { locale } = jobSlugQuerySchema.parse(request.query);

      const job = await queryOne(SQL.GET_JOB_BY_SLUG, [slug, locale]);

      if (!job) {
        return reply
          .status(404)
          .send(errorResponse(ErrorCodes.NOT_FOUND, 'Job not found'));
      }

      return reply.send(successResponse(job));
    }
  );

  server.post<{
    Params: { slug: string };
    Querystring: { locale?: string };
    Body: unknown;
  }>(
    '/:slug/apply',
    {
      schema: jobSchemas.apply,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request, reply) => {
      const { slug } = jobSlugParamsSchema.parse(request.params);
      const { locale } = jobSlugQuerySchema.parse(request.query);

      // First, get the job to ensure it exists and get its ID
      const job = await queryOne(SQL.GET_JOB_BY_SLUG, [slug, locale]);
      if (!job) {
        return reply
          .status(404)
          .send(errorResponse(ErrorCodes.NOT_FOUND, 'Job not found'));
      }

      // Validate application data
      const applicationData = jobApplicationSchema.parse(request.body);

      // TODO: Handle file upload for resume (using fastify-multipart)
      // For now, set resume_asset_id to null
      const resumeAssetId = null;

      // Insert application
      const result = await queryOne(SQL.CREATE_JOB_APPLICATION, [
        job.id,
        applicationData.fullName,
        applicationData.email,
        applicationData.phone,
        applicationData.linkedIn || null,
        applicationData.portfolio || null,
        resumeAssetId,
        applicationData.coverLetter || null,
      ]);

      return reply.status(201).send(
        successResponse({
          id: result.id,
          createdAt: result.created_at,
          message: 'Application submitted successfully',
        })
      );
    }
  );

  server.get('/slug-map', { schema: jobSchemas.slugMap }, async (request, reply) => {
    const query = request.query as { from_slug?: string; from_locale?: string; to_locale?: string };
    
    if (!query.from_slug || !query.from_locale || !query.to_locale) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Missing required query parameters: from_slug, from_locale, to_locale')
      );
    }

    const { from_slug, from_locale, to_locale } = query;

    // Get slug_group from source job
    const sourceJob = await queryOne(
      `SELECT slug_group FROM job_posts WHERE slug = $1 AND locale = $2 AND status = 'published'`,
      [from_slug, from_locale]
    );

    if (!sourceJob || !sourceJob.slug_group) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found or missing slug_group')
      );
    }

    // Find target job with same slug_group in target locale
    const targetJob = await queryOne(
      `SELECT slug FROM job_posts WHERE slug_group = $1 AND locale = $2 AND status = 'published'`,
      [sourceJob.slug_group, to_locale]
    );

    if (!targetJob) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, `No ${to_locale} version found for this job`)
      );
    }

    return reply.send(successResponse({ slug: targetJob.slug }));
  });
};

export default jobsRoutes;
