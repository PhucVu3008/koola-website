import { query, queryOne } from '../db';
import * as AdminNewsletterSubscribersSQL from '../sql/admin/newsletterSubscribers';

/**
 * Admin-facing repository for Newsletter Subscribers.
 */

export interface AdminNewsletterSubscriberListFilters {
  status?: 'subscribed' | 'unsubscribed';
  q?: string;
  limit: number;
  offset: number;
}

/**
 * List newsletter subscribers.
 */
export const listSubscribers = async (filters: AdminNewsletterSubscriberListFilters) => {
  const { status, q, limit, offset } = filters;
  return await query(AdminNewsletterSubscribersSQL.ADMIN_LIST_NEWSLETTER_SUBSCRIBERS, [
    status ?? null,
    q ?? null,
    limit,
    offset,
  ]);
};

/**
 * Count newsletter subscribers.
 */
export const countSubscribers = async (
  filters: Omit<AdminNewsletterSubscriberListFilters, 'limit' | 'offset'>
) => {
  const [row] = await query<{ total: string }>(
    AdminNewsletterSubscribersSQL.ADMIN_COUNT_NEWSLETTER_SUBSCRIBERS,
    [filters.status ?? null, filters.q ?? null]
  );
  return Number(row?.total ?? 0);
};

/**
 * Patch subscriber status.
 */
export const updateSubscriberStatus = async (
  id: number,
  status: AdminNewsletterSubscriberListFilters['status']
) => {
  const updated = await queryOne<{ id: number }>(
    AdminNewsletterSubscribersSQL.ADMIN_UPDATE_NEWSLETTER_SUBSCRIBER_STATUS,
    [id, status]
  );
  return updated?.id ?? null;
};
