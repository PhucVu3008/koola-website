import * as leadRepository from '../repositories/leadRepository';
import { LeadCreateInput } from '../schemas';

export const createLead = async (data: LeadCreateInput) => {
  return await leadRepository.create(data);
};
