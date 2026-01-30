import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import * as emailRepository from '../repositories/emailRepository';
import * as siteSettings from '../utils/siteSettings';

/**
 * Email Service
 *
 * Handles all email sending operations using Nodemailer.
 *
 * Features:
 * - SMTP configuration via environment variables
 * - Email notification logging to database
 * - Dynamic notification email from database (with env fallback)
 * - Error handling and retry logic
 * - Support for HTML and plain text emails
 *
 * Environment Variables Required:
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port
 * - SMTP_SECURE: Use TLS (true/false)
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_FROM: Default sender email address
 * - NOTIFICATION_EMAIL: Fallback email if not set in database
 */

let transporter: Transporter | null = null;

/**
 * Initialize the email transporter.
 * Called automatically on first use.
 */
const getTransporter = (): Transporter => {
  if (!transporter) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('SMTP configuration is incomplete. Check environment variables.');
    }

    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return transporter;
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  type: 'lead_notification' | 'job_application' | 'system';
  metadata?: Record<string, any>;
}

/**
 * Send an email and log the notification to the database.
 *
 * @param options - Email sending options
 * @returns Email notification ID if successful
 * @throws Error if email sending fails after logging
 */
export const sendEmail = async (options: SendEmailOptions): Promise<number> => {
  const { to, subject, text, html, type, metadata } = options;

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

  // Log email notification (status: pending)
  const notificationId = await emailRepository.create({
    type,
    recipient: to,
    subject,
    body: html || text,
    status: 'pending',
    metadata,
  });

  try {
    const transport = getTransporter();

    // Send email
    await transport.sendMail({
      from: fromEmail,
      to,
      subject,
      text,
      html,
    });

    // Update status to 'sent'
    await emailRepository.updateStatus(notificationId, 'sent', new Date());

    return notificationId;
  } catch (error: any) {
    // Update status to 'failed' with error message
    const errorMessage = error?.message || 'Unknown error';
    await emailRepository.updateStatus(notificationId, 'failed', null, errorMessage);

    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

/**
 * Send lead notification email to admin.
 *
 * Email recipient is determined by:
 * 1. Database setting: `notification_email` (preferred)
 * 2. Environment variable: `NOTIFICATION_EMAIL` (fallback)
 *
 * @param lead - Lead data from contact form
 * @returns Email notification ID
 */
export const sendLeadNotification = async (lead: {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source_path?: string;
  created_at: Date;
}): Promise<number> => {
  // Get notification email from database (with env fallback)
  const notificationEmail = await siteSettings.getNotificationEmail();
  const adminPanelUrl = await siteSettings.getAdminPanelUrl();

  const subject = `🔔 New Contact Form Submission - ${lead.full_name}`;

  const text = `
New Contact Form Submission

ID: ${lead.id}
Name: ${lead.full_name}
Email: ${lead.email}
Phone: ${lead.phone || 'N/A'}
Company: ${lead.company || 'N/A'}
Source: ${lead.source_path || 'N/A'}
Submitted at: ${lead.created_at.toISOString()}

Message:
${lead.message || 'No message provided'}

---
View in Admin Panel: ${adminPanelUrl}/leads
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
    .field { margin-bottom: 16px; }
    .field-label { font-weight: 600; color: #6b7280; font-size: 14px; }
    .field-value { margin-top: 4px; padding: 8px 12px; background: white; border-radius: 4px; }
    .message-box { background: white; padding: 16px; border-left: 4px solid #2563eb; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Lead ID</div>
        <div class="field-value">#${lead.id}</div>
      </div>
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${lead.full_name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${lead.email}">${lead.email}</a></div>
      </div>
      ${lead.phone ? `
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
      </div>
      ` : ''}
      ${lead.company ? `
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${lead.company}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="field-label">Source</div>
        <div class="field-value">${lead.source_path || 'Direct'}</div>
      </div>
      <div class="field">
        <div class="field-label">Submitted At</div>
        <div class="field-value">${lead.created_at.toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short',
          timeZone: 'Asia/Ho_Chi_Minh'
        })}</div>
      </div>
      ${lead.message ? `
      <div class="message-box">
        <div class="field-label">Message</div>
        <div style="margin-top: 8px; white-space: pre-wrap;">${lead.message}</div>
      </div>
      ` : ''}
      <a href="${adminPanelUrl}/leads" class="button">
        View in Admin Panel →
      </a>
    </div>
    <div class="footer">
      <p>This is an automated notification from your website contact form.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: notificationEmail,
    subject,
    text,
    html,
    type: 'lead_notification',
    metadata: {
      lead_id: lead.id,
      lead_email: lead.email,
    },
  });
};

/**
 * Test email configuration.
 * Useful for verifying SMTP settings.
 *
 * @param testRecipient - Email address to send test email to
 */
export const sendTestEmail = async (testRecipient: string): Promise<void> => {
  const transport = getTransporter();

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: testRecipient,
    subject: 'Test Email from Koola Website',
    text: 'This is a test email. If you received this, your SMTP configuration is working correctly.',
    html: '<p>This is a test email. If you received this, your SMTP configuration is working correctly.</p>',
  });
};
