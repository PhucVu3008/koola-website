import * as adminNewsletterSubscriberRepository from '../repositories/adminNewsletterSubscriberRepository';
import { buildPaginationMeta } from '../db';

/**
 * Admin Newsletter Subscribers service.
 */

export interface AdminNewsletterSubscriberListQuery {
  status?: 'subscribed' | 'unsubscribed';
  q?: string;
  page: number;
  pageSize: number;
}

/**
 * List newsletter subscribers with pagination.
 */
export const listSubscribers = async (query: AdminNewsletterSubscriberListQuery) => {
  const { status, q, page, pageSize } = query;
  const offset = (page - 1) * pageSize;

  const total = await adminNewsletterSubscriberRepository.countSubscribers({ status, q });
  const subscribers = await adminNewsletterSubscriberRepository.listSubscribers({
    status,
    q,
    limit: pageSize,
    offset,
  });

  return {
    subscribers,
    meta: buildPaginationMeta(page, pageSize, total),
  };
};

/**
 * Patch subscriber status.
 */
export const updateSubscriberStatus = async (
  id: number,
  status: AdminNewsletterSubscriberListQuery['status']
) => {
  return await adminNewsletterSubscriberRepository.updateSubscriberStatus(id, status);
};
