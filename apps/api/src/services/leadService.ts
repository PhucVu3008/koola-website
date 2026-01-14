import * as leadRepository from '../repositories/leadRepository';
import { LeadCreateInput } from '../schemas';

/**
 * Create a lead/contact form submission.
 *
 * This service is intentionally thin in the current project:
 * - validation is done at the controller/route boundary via Zod
 * - persistence is handled by the repository
 *
 * @param data - Validated lead payload.
 * @returns Inserted lead record (typically `{ id }`).
 *
 * @throws Will throw if underlying repository/database access fails.
 */
export const createLead = async (data: LeadCreateInput) => {
  return await leadRepository.create(data);
};
