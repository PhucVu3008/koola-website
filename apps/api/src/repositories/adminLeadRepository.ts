import { query, queryOne } from '../db';
import * as AdminLeadsSQL from '../sql/admin/leads';

/**
 * Admin-facing repository for Leads.
 *
 * Responsibilities:
 * - List leads for admin review.
 * - Patch lead status (workflow).
 */

export interface AdminLeadListFilters {
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  q?: string;
  limit: number;
  offset: number;
}

/**
 * List leads for admin.
 */
export const listLeads = async (filters: AdminLeadListFilters) => {
  const { status, q, limit, offset } = filters;
  return await query(AdminLeadsSQL.ADMIN_LIST_LEADS, [status ?? null, q ?? null, limit, offset]);
};

/**
 * Count leads for pagination.
 */
export const countLeads = async (filters: Omit<AdminLeadListFilters, 'limit' | 'offset'>) => {
  const [row] = await query<{ total: string }>(AdminLeadsSQL.ADMIN_COUNT_LEADS, [
    filters.status ?? null,
    filters.q ?? null,
  ]);
  return Number(row?.total ?? 0);
};

/**
 * Patch lead status.
 */
export const updateLeadStatus = async (id: number, status: AdminLeadListFilters['status']) => {
  const updated = await queryOne<{ id: number }>(AdminLeadsSQL.ADMIN_UPDATE_LEAD_STATUS, [
    id,
    status,
  ]);
  return updated?.id ?? null;
};
