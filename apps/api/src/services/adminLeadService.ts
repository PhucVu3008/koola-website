import * as adminLeadRepository from '../repositories/adminLeadRepository';
import { buildPaginationMeta } from '../db';

/**
 * Admin Leads service.
 *
 * Business rules:
 * - Provide pagination meta for list endpoint.
 */

export interface AdminLeadListQuery {
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  q?: string;
  page: number;
  pageSize: number;
}

/**
 * List leads with pagination.
 */
export const listLeads = async (query: AdminLeadListQuery) => {
  const { status, q, page, pageSize } = query;
  const offset = (page - 1) * pageSize;

  const total = await adminLeadRepository.countLeads({ status, q });
  const leads = await adminLeadRepository.listLeads({ status, q, limit: pageSize, offset });

  return {
    leads,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Patch a lead's status.
 */
export const updateLeadStatus = async (id: number, status: AdminLeadListQuery['status']) => {
  return await adminLeadRepository.updateLeadStatus(id, status);
};
