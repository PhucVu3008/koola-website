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

/**
 * Public Jobs routes.
 *
 * Mounted at: `/v1/jobs`
 *
 * Endpoints:
 * - `GET /?locale=en&status=published` -> list jobs
 * - `GET /:slug?locale=en` -> job detail
 *
 * Notes:
 * - Query/params are validated with Zod.
 * - Only published jobs are expected to be exposed by default.
 */
const jobsRoutes: FastifyPluginAsync = async (server) => {
  // List jobs
  server.get('/', async (request, reply) => {
    const { locale, status } = jobListQuerySchema.parse(request.query);

    const jobs = await query(SQL.LIST_JOBS, [locale, status]);

    return reply.send(successResponse(jobs));
  });

  // Get job by slug
  server.get<{ Params: { slug: string }; Querystring: { locale?: string } }>(
    '/:slug',
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

  // Submit job application
  server.post<{ 
    Params: { slug: string }; 
    Querystring: { locale?: string };
    Body: unknown;
  }>(
    '/:slug/apply',
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
};

export default jobsRoutes;
