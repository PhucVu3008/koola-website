/**
 * Admin Jobs Service
 * 
 * Business logic for job posts management
 */

import * as adminJobRepository from '../repositories/adminJobRepository';

export const listJobs = async (filters: adminJobRepository.JobListFilters) => {
  return await adminJobRepository.listJobs(filters);
};

export const countJobs = async (
  filters: Omit<adminJobRepository.JobListFilters, 'limit' | 'offset'>
) => {
  return await adminJobRepository.countJobs(filters);
};

export const getJobById = async (id: number) => {
  return await adminJobRepository.getJobById(id);
};

export const createJob = async (input: adminJobRepository.JobCreateInput) => {
  return await adminJobRepository.createJob(input);
};

export const updateJob = async (id: number, input: adminJobRepository.JobUpdateInput) => {
  return await adminJobRepository.updateJob(id, input);
};

export const deleteJob = async (id: number) => {
  return await adminJobRepository.deleteJob(id);
};

export const getJobApplications = async (jobId: number) => {
  return await adminJobRepository.getJobApplications(jobId);
};

export const updateApplicationStatus = async (applicationId: number, status: string) => {
  return await adminJobRepository.updateApplicationStatus(applicationId, status);
};
