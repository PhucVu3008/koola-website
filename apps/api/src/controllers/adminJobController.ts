/**
 * Admin Jobs Controller
 * 
 * Handles HTTP requests for job posts management
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ErrorCodes, errorResponse, successResponse } from '../utils/response';
import * as adminJobService from '../services/adminJobService';

// Validation schemas
const listJobsQuerySchema = z.object({
  locale: z.string().default('en'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

const jobIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const jobCreateSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  slug_group: z.string().max(100).optional().nullable(),
  department: z.string().max(100).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  employment_type: z.string().max(50).optional().nullable(),
  level: z.string().max(50).optional().nullable(),
  summary: z.string().max(500).optional().nullable(),
  responsibilities_md: z.string().optional().nullable(),
  requirements_md: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  created_by: z.coerce.number().int().positive().optional().nullable(),
});

const jobUpdateSchema = jobCreateSchema.extend({
  updated_by: z.coerce.number().int().positive().optional().nullable(),
});

const updateJobStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
});

const applicationIdParamsSchema = z.object({
  applicationId: z.coerce.number().int().positive(),
});

const updateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted']),
});

const listAllApplicationsQuerySchema = z.object({
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted']).optional(),
  job_id: z.coerce.number().int().positive().optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * GET /v1/admin/jobs
 * List job posts with pagination
 */
export const listJobs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { locale, status, page, pageSize } = listJobsQuerySchema.parse(request.query);
    
    const offset = (page - 1) * pageSize;
    
    const [jobs, total] = await Promise.all([
      adminJobService.listJobs({ locale, status, limit: pageSize, offset }),
      adminJobService.countJobs({ locale, status }),
    ]);
    
    return reply.send(
      successResponse(jobs, {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid query parameters', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * GET /v1/admin/jobs/:id
 * Get job post by ID
 */
export const getJobById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    
    const job = await adminJobService.getJobById(id);
    
    if (!job) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }
    
    return reply.send(successResponse(job));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid job ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * POST /v1/admin/jobs
 * Create new job post
 */
export const createJob = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = jobCreateSchema.parse(request.body);
    
    // Set published_at if status is published
    const published_at = body.status === 'published' ? new Date() : null;
    
    const jobId = await adminJobService.createJob({
      ...body,
      published_at,
    });
    
    return reply.status(201).send(
      successResponse({ id: jobId })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed. Please check required fields.',
          {
            issues: error.issues,
            requiredFields: ['locale', 'title', 'slug'],
          }
        )
      );
    }
    throw error;
  }
};

/**
 * PUT /v1/admin/jobs/:id
 * Update existing job post
 */
export const updateJob = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    const body = jobUpdateSchema.parse(request.body);
    
    // Check if job exists
    const existingJob = await adminJobService.getJobById(id);
    if (!existingJob) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }
    
    // Set published_at if status changed to published
    const published_at = body.status === 'published' && existingJob.status !== 'published'
      ? new Date()
      : existingJob.published_at;
    
    await adminJobService.updateJob(id, {
      ...body,
      published_at,
    });
    
    return reply.send(
      successResponse({ id })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed. Please check required fields.',
          {
            issues: error.issues,
            requiredFields: ['locale', 'title', 'slug'],
          }
        )
      );
    }
    throw error;
  }
};

/**
 * DELETE /v1/admin/jobs/:id
 * Delete job post
 */
export const deleteJob = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    
    // Check if job exists
    const existingJob = await adminJobService.getJobById(id);
    if (!existingJob) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }
    
    await adminJobService.deleteJob(id);
    
    return reply.send(
      successResponse({ id })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid job ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * PATCH /v1/admin/jobs/:id/status
 * Quick status toggle for a job post
 */
export const updateJobStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    const { status } = updateJobStatusSchema.parse(request.body);

    const result = await adminJobService.updateJobStatus(id, status);

    if (!result) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }

    return reply.send(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid status', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * GET /v1/admin/jobs/:id/applications
 * Get all applications for a job
 */
export const getJobApplications = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    
    // Check if job exists
    const existingJob = await adminJobService.getJobById(id);
    if (!existingJob) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }
    
    const applications = await adminJobService.getJobApplications(id);
    
    return reply.send(successResponse(applications));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid job ID', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};

/**
 * PATCH /v1/admin/jobs/:id/applications/:applicationId/status
 * Update application status
 */
export const updateApplicationStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = jobIdParamsSchema.parse(request.params);
    const { applicationId } = applicationIdParamsSchema.parse(request.params);
    const { status } = updateApplicationStatusSchema.parse(request.body);
    
    // Check if job exists
    const existingJob = await adminJobService.getJobById(id);
    if (!existingJob) {
      return reply.status(404).send(
        errorResponse(ErrorCodes.NOT_FOUND, 'Job not found')
      );
    }
    
    await adminJobService.updateApplicationStatus(applicationId, status);

    return reply.send(
      successResponse({ id: applicationId, status })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed',
          {
            issues: error.issues,
          }
        )
      );
    }
    throw error;
  }
};

/**
 * GET /v1/admin/jobs/applications
 * List all applications across all jobs with filters and pagination
 */
export const listAllApplications = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { status, job_id, search, page, pageSize } = listAllApplicationsQuerySchema.parse(request.query);

    const offset = (page - 1) * pageSize;

    const [applications, total] = await Promise.all([
      adminJobService.listAllApplications({ status, jobId: job_id, search, limit: pageSize, offset }),
      adminJobService.countAllApplications({ status, jobId: job_id, search }),
    ]);

    return reply.send(
      successResponse(applications, {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      })
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid query parameters', {
          issues: error.issues,
        })
      );
    }
    throw error;
  }
};
