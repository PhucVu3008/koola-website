/**
 * Admin Jobs Repository
 * 
 * Database operations for job_posts management
 */

import { query, queryOne } from '../db';
import * as JobsSQL from '../sql/admin/jobs';

export interface JobPost {
  id: number;
  locale: string;
  title: string;
  slug: string;
  slug_group?: string | null;
  department?: string | null;
  location?: string | null;
  employment_type?: string | null;
  level?: string | null;
  summary?: string | null;
  responsibilities_md?: string | null;
  requirements_md?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface JobApplication {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  resume_asset_id?: number | null;
  resume_filename?: string | null;
  resume_path?: string | null;
  cover_letter?: string | null;
  status: string;
  created_at: Date;
}

export interface JobListFilters {
  locale: string;
  status?: 'draft' | 'published' | 'archived' | null;
  limit: number;
  offset: number;
}

export interface JobCreateInput {
  locale: string;
  title: string;
  slug: string;
  slug_group?: string | null;
  department?: string | null;
  location?: string | null;
  employment_type?: string | null;
  level?: string | null;
  summary?: string | null;
  responsibilities_md?: string | null;
  requirements_md?: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date | null;
  created_by?: number | null;
}

export interface JobUpdateInput extends JobCreateInput {
  updated_by?: number | null;
}

/**
 * List job posts with pagination
 */
export const listJobs = async (filters: JobListFilters): Promise<JobPost[]> => {
  const { locale, status, limit, offset } = filters;
  return await query<JobPost>(JobsSQL.LIST_JOBS, [
    locale,
    status ?? null,
    limit,
    offset,
  ]);
};

/**
 * Count job posts
 */
export const countJobs = async (filters: Omit<JobListFilters, 'limit' | 'offset'>): Promise<number> => {
  const { locale, status } = filters;
  const result = await query<{ count: string }>(JobsSQL.COUNT_JOBS, [locale, status ?? null]);
  return Number(result[0]?.count ?? 0);
};

/**
 * Get job post by ID
 */
export const getJobById = async (id: number): Promise<JobPost | null> => {
  return await queryOne<JobPost>(JobsSQL.GET_JOB_BY_ID, [id]);
};

/**
 * Create new job post
 */
export const createJob = async (input: JobCreateInput): Promise<number> => {
  const [row] = await query<{ id: number }>(JobsSQL.CREATE_JOB, [
    input.locale,
    input.title,
    input.slug,
    input.slug_group ?? null,
    input.department ?? null,
    input.location ?? null,
    input.employment_type ?? null,
    input.level ?? null,
    input.summary ?? null,
    input.responsibilities_md ?? null,
    input.requirements_md ?? null,
    input.status,
    input.published_at ?? null,
    input.created_by ?? null,
  ]);
  return row.id;
};

/**
 * Update existing job post
 */
export const updateJob = async (id: number, input: JobUpdateInput): Promise<void> => {
  await query(JobsSQL.UPDATE_JOB, [
    id,
    input.locale,
    input.title,
    input.slug,
    input.slug_group ?? null,
    input.department ?? null,
    input.location ?? null,
    input.employment_type ?? null,
    input.level ?? null,
    input.summary ?? null,
    input.responsibilities_md ?? null,
    input.requirements_md ?? null,
    input.status,
    input.published_at ?? null,
    input.updated_by ?? null,
  ]);
};

/**
 * Delete job post
 */
export const deleteJob = async (id: number): Promise<void> => {
  await query(JobsSQL.DELETE_JOB, [id]);
};

/**
 * Get all applications for a job
 */
export const getJobApplications = async (jobId: number): Promise<JobApplication[]> => {
  return await query<JobApplication>(JobsSQL.GET_JOB_APPLICATIONS, [jobId]);
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (
  applicationId: number,
  status: string
): Promise<void> => {
  await query(JobsSQL.UPDATE_APPLICATION_STATUS, [applicationId, status]);
};

/**
 * Quick update job status (draft/published/archived)
 */
export const updateJobStatus = async (
  id: number,
  status: 'draft' | 'published' | 'archived'
): Promise<{ id: number; status: string; published_at: Date | null } | null> => {
  return await queryOne<{ id: number; status: string; published_at: Date | null }>(
    JobsSQL.UPDATE_JOB_STATUS,
    [id, status]
  );
};
