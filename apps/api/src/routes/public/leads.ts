import { FastifyPluginAsync } from 'fastify';
import * as leadController from '../../controllers/leadController';

/**
 * Public Leads routes.
 *
 * Mounted at: `/v1/leads`
 *
 * Endpoints:
 * - `POST /` -> create a lead/contact submission
 *
 * Rate limiting:
 * - Configured to mitigate abuse of public forms.
 *
 * Validation:
 * - Body validation is performed in `leadController.createLead` via Zod.
 */
const leadsRoutes: FastifyPluginAsync = async (server) => {
  // Create lead (contact form submission)
  server.post('/', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
      },
    },
    handler: leadController.createLead,
  });
};

export default leadsRoutes;
