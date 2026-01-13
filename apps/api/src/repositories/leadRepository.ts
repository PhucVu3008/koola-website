import { queryOne } from '../db';
import * as SQL from '../sql/public/site';
import { LeadCreateInput } from '../schemas/leads.schemas';

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
