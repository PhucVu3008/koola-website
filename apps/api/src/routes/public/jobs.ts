import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../db';
import {
  jobListQuerySchema,
  jobSlugParamsSchema,
  jobSlugQuerySchema,
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
};

export default jobsRoutes;
