import { queryOne } from '../db';
import * as SQL from '../sql/public/site';
import { LeadCreateInput } from '../schemas/leads.schemas';

/**
 * Create a new lead/contact submission.
 *
 * Input validation is expected to happen at the controller/route layer using Zod.
 * This repository only performs the DB insert.
 *
 * @param data - Validated lead payload.
 * @returns Inserted lead row (typically contains `{ id }`).
 *
 * @throws Will throw if the database query fails.
 *
 * @example
 * const lead = await leadRepository.create({ full_name, email, message });
 * return lead.id;
 */
export const create = async (data: LeadCreateInput) => {
  return await queryOne(SQL.CREATE_LEAD, [
    data.full_name,
    data.email,
    data.phone || null,
    data.company || null,
    data.message || null,
    data.source_path || null,
    data.utm_source || null,
    data.utm_medium || null,
    data.utm_campaign || null,
  ]);
};
