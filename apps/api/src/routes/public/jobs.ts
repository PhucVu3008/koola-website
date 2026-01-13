import { FastifyPluginAsync } from 'fastify';
import { query, queryOne } from '../../db';
import {
  jobListQuerySchema,
  jobSlugParamsSchema,
  jobSlugQuerySchema,
} from '../../schemas';
import * as SQL from '../../sql/queries';

const jobsRoutes: FastifyPluginAsync = async (server) => {
  // List jobs
  server.get('/', async (request, reply) => {
    const { locale, status } = jobListQuerySchema.parse(request.query);

    const jobs = await query(SQL.LIST_JOBS, [locale, status]);

    return reply.send({
      data: jobs,
    });
  });

  // Get job by slug
  server.get<{ Params: { slug: string }; Querystring: { locale?: string } }>(
    '/:slug',
    async (request, reply) => {
      const { slug } = jobSlugParamsSchema.parse(request.params);
      const { locale } = jobSlugQuerySchema.parse(request.query);

      const job = await queryOne(SQL.GET_JOB_BY_SLUG, [slug, locale]);

      if (!job) {
        return reply.status(404).send({
          error: {
            code: 'NOT_FOUND',
            message: 'Job not found',
          },
        });
      }

      return reply.send({
        data: job,
      });
    }
  );
};

export default jobsRoutes;
