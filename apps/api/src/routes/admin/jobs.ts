/**
 * Admin Jobs Routes
 * 
 * Protected routes for managing job posts and applications
 */

import { FastifyPluginAsync } from 'fastify';
import { authenticate, authorize } from '../../middleware/auth';
import * as adminJobController from '../../controllers/adminJobController';

const jobsRoutes: FastifyPluginAsync = async (server) => {
  // All routes require authentication
  server.addHook('preHandler', authenticate);
  
  // All routes require admin, manager, or editor role
  server.addHook('preHandler', authorize(['admin', 'manager', 'editor']));
  
  // List jobs with pagination
  server.get('/', adminJobController.listJobs);
  
  // Get job by ID
  server.get('/:id', adminJobController.getJobById);
  
  // Create new job
  server.post('/', adminJobController.createJob);
  
  // Update job
  server.put('/:id', adminJobController.updateJob);
  
  // Delete job
  server.delete('/:id', adminJobController.deleteJob);
  
  // Get applications for a job
  server.get('/:id/applications', adminJobController.getJobApplications);
  
  // Update application status
  server.patch('/:id/applications/:applicationId/status', adminJobController.updateApplicationStatus);
};

export default jobsRoutes;
