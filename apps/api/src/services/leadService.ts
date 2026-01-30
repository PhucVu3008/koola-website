import * as leadRepository from '../repositories/leadRepository';
import * as emailService from './emailService';
import { LeadCreateInput } from '../schemas';

/**
 * Create a lead/contact form submission.
 *
 * This service:
 * - validation is done at the controller/route boundary via Zod
 * - persistence is handled by the repository
 * - sends email notification to admin (async, non-blocking)
 *
 * @param data - Validated lead payload.
 * @returns Inserted lead record (typically `{ id }`).
 *
 * @throws Will throw if underlying repository/database access fails.
 *
 * Email Notification:
 * - Sent asynchronously (does not block response)
 * - Failure to send email does not fail the lead creation
 * - Email failures are logged to email_notifications table
 */
export const createLead = async (data: LeadCreateInput) => {
  // Create lead in database
  const lead = await leadRepository.create(data);

  // Send email notification asynchronously (non-blocking)
  // We don't await this to avoid blocking the response
  emailService
    .sendLeadNotification({
      id: lead.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source_path: data.source_path,
      created_at: new Date(),
    })
    .catch((error) => {
      // Log error but don't fail the request
      console.error('Failed to send lead notification email:', error.message);
    });

  return lead;
};
