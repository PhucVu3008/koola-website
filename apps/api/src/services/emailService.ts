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
  type: 'lead_notification' | 'lead_auto_reply' | 'job_application' | 'job_application_auto_reply' | 'newsletter_welcome' | 'system';
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
 * Send job application notification email to admin.
 *
 * Email recipient is determined by:
 * 1. Database setting: `notification_email` (preferred)
 * 2. Environment variable: `NOTIFICATION_EMAIL` (fallback)
 *
 * @param application - Job application data
 * @returns Email notification ID
 */
export const sendJobApplicationNotification = async (application: {
  id: number;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  linked_in?: string | null;
  portfolio?: string | null;
  cover_letter?: string | null;
  created_at: Date;
}): Promise<number> => {
  const notificationEmail = await siteSettings.getNotificationEmail();
  const adminPanelUrl = await siteSettings.getAdminPanelUrl();

  const subject = `📋 New Job Application - ${application.full_name} for ${application.job_title}`;

  const text = `
New Job Application

ID: ${application.id}
Position: ${application.job_title}
Name: ${application.full_name}
Email: ${application.email}
Phone: ${application.phone}
LinkedIn: ${application.linked_in || 'N/A'}
Portfolio: ${application.portfolio || 'N/A'}
Submitted at: ${application.created_at.toISOString()}

Cover Letter:
${application.cover_letter || 'No cover letter provided'}

---
View in Admin Panel: ${adminPanelUrl}/jobs
  `.trim();

  const html = buildJobApplicationHtml(application, adminPanelUrl);

  return await sendEmail({
    to: notificationEmail,
    subject,
    text,
    html,
    type: 'job_application',
    metadata: {
      application_id: application.id,
      applicant_email: application.email,
      job_title: application.job_title,
    },
  });
};

/** Build HTML email for job application notification. */
const buildJobApplicationHtml = (application: {
  id: number;
  job_title: string;
  full_name: string;
  email: string;
  phone: string;
  linked_in?: string | null;
  portfolio?: string | null;
  cover_letter?: string | null;
  created_at: Date;
}, adminPanelUrl: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
    .field { margin-bottom: 16px; }
    .field-label { font-weight: 600; color: #6b7280; font-size: 14px; }
    .field-value { margin-top: 4px; padding: 8px 12px; background: white; border-radius: 4px; }
    .message-box { background: white; padding: 16px; border-left: 4px solid #7c3aed; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">📋 New Job Application</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">Position: ${application.job_title}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Application ID</div>
        <div class="field-value">#${application.id}</div>
      </div>
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${application.full_name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${application.email}">${application.email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value"><a href="tel:${application.phone}">${application.phone}</a></div>
      </div>
      ${application.linked_in ? `
      <div class="field">
        <div class="field-label">LinkedIn</div>
        <div class="field-value"><a href="${application.linked_in}" target="_blank">${application.linked_in}</a></div>
      </div>
      ` : ''}
      ${application.portfolio ? `
      <div class="field">
        <div class="field-label">Portfolio</div>
        <div class="field-value"><a href="${application.portfolio}" target="_blank">${application.portfolio}</a></div>
      </div>
      ` : ''}
      <div class="field">
        <div class="field-label">Submitted At</div>
        <div class="field-value">${application.created_at.toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Ho_Chi_Minh'
        })}</div>
      </div>
      ${application.cover_letter ? `
      <div class="message-box">
        <div class="field-label">Cover Letter</div>
        <div style="margin-top: 8px; white-space: pre-wrap;">${application.cover_letter}</div>
      </div>
      ` : ''}
      <a href="${adminPanelUrl}/jobs" class="button">
        View in Admin Panel →
      </a>
    </div>
    <div class="footer">
      <p>This is an automated notification from your website careers page.</p>
    </div>
  </div>
</body>
</html>
`.trim();

/**
 * Send auto-reply confirmation email to the person who submitted the contact form.
 *
 * Bilingual email (Vietnamese primary, English below).
 * Confirms receipt and sets expectation of 48 business-hour response time.
 *
 * @param lead - Lead data (name + email are required)
 * @returns Email notification ID
 */
export const sendLeadAutoReply = async (lead: {
  full_name: string;
  email: string;
}): Promise<number> => {
  const subject = 'KOOLA — Chúng tôi đã nhận được thông tin của bạn | We have received your inquiry';

  const text = `
Xin chào ${lead.full_name},

Cảm ơn bạn đã liên hệ với KOOLA!

Chúng tôi đã nhận được thông tin của bạn và đội ngũ của chúng tôi sẽ xem xét yêu cầu trong thời gian sớm nhất. Bạn sẽ nhận được phản hồi trong vòng 48 giờ làm việc.

Nếu có bất kỳ câu hỏi gấp nào, vui lòng liên hệ trực tiếp qua:
- Email: info@koola.vn
- Điện thoại: 0941 508 468

Trân trọng,
Đội ngũ KOOLA

---

ENGLISH VERSION BELOW

Dear ${lead.full_name},

Thank you for reaching out to KOOLA!

We have received your inquiry and our team will review it as soon as possible. You can expect a response within 48 business hours.

If you have any urgent questions, please contact us directly:
- Email: info@koola.vn
- Phone: 0941 508 468

Best regards,
The KOOLA Team

--
KOOLA
58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam
Website: https://koola.vn
  `.trim();

  const html = buildLeadAutoReplyHtml(lead);

  return await sendEmail({
    to: lead.email,
    subject,
    text,
    html,
    type: 'lead_auto_reply',
    metadata: {
      lead_email: lead.email,
      lead_name: lead.full_name,
    },
  });
};

/** Build HTML auto-reply email for contact form submission. */
const buildLeadAutoReplyHtml = (lead: { full_name: string; email: string }): string => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #1e293b; background: #f1f5f9; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .brand-bar { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 32px 28px; text-align: center; }
    .brand-bar h1 { margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px; }
    .brand-bar p { margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; }
    .body-section { padding: 32px; }
    .greeting { font-size: 17px; font-weight: 600; color: #1e293b; margin: 0 0 16px; }
    .body-text { font-size: 15px; color: #475569; margin: 0 0 16px; }
    .highlight-box { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 15px; color: #1e40af; font-weight: 500; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
    .lang-label { display: inline-block; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 16px; }
    .contact-row { display: flex; align-items: center; margin: 8px 0; font-size: 14px; color: #475569; }
    .contact-row a { color: #2563eb; text-decoration: none; }
    .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sig-name { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; }
    .sig-title { font-size: 13px; color: #64748b; margin: 2px 0 0; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
    .footer a { color: #2563eb; text-decoration: none; }
    .social-links { margin-top: 12px; }
    .social-links a { display: inline-block; margin: 0 6px; color: #64748b; font-size: 13px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <!-- Brand Header -->
      <div class="brand-bar">
        <h1>KOOLA</h1>
        <p>Technology &amp; Digital Solutions</p>
      </div>

      <!-- Vietnamese Section -->
      <div class="body-section">
        <p class="greeting">Xin chào ${lead.full_name},</p>
        <p class="body-text">Cảm ơn bạn đã liên hệ với <strong>KOOLA</strong>! Chúng tôi rất vui khi nhận được thông tin từ bạn.</p>
        <p class="body-text">Đội ngũ của chúng tôi đã nhận được yêu cầu và sẽ xem xét trong thời gian sớm nhất.</p>

        <div class="highlight-box">
          <p>⏱ Bạn sẽ nhận được phản hồi trong vòng <strong>48 giờ làm việc</strong>.</p>
        </div>

        <p class="body-text">Nếu có bất kỳ câu hỏi gấp nào, vui lòng liên hệ trực tiếp:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #2563eb; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Điện thoại: <a href="tel:0941508468" style="color: #2563eb; text-decoration: none;">0941 508 468</a></p>
        </div>

        <hr class="divider">

        <!-- English Section -->
        <span class="lang-label">English version below</span>

        <p class="greeting">Dear ${lead.full_name},</p>
        <p class="body-text">Thank you for reaching out to <strong>KOOLA</strong>! We appreciate your interest and are glad to hear from you.</p>
        <p class="body-text">Our team has received your inquiry and will review it promptly.</p>

        <div class="highlight-box">
          <p>⏱ You can expect a response within <strong>48 business hours</strong>.</p>
        </div>

        <p class="body-text">For any urgent matters, feel free to contact us directly:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #2563eb; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Phone: <a href="tel:0941508468" style="color: #2563eb; text-decoration: none;">0941 508 468</a></p>
        </div>

        <!-- Signature -->
        <div class="signature">
          <p class="sig-name">Đội ngũ KOOLA | The KOOLA Team</p>
          <p class="sig-title">Technology &amp; Digital Solutions</p>
          <div style="margin-top: 12px; font-size: 13px; color: #64748b; line-height: 1.6;">
            <p style="margin: 2px 0;">🌐 <a href="https://koola.vn" style="color: #2563eb; text-decoration: none;">koola.vn</a></p>
            <p style="margin: 2px 0;">📍 58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
        <p style="margin-top: 4px;">This is an automated email. Please do not reply directly.</p>
        <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} KOOLA. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

/**
 * Send auto-reply confirmation email to a job applicant.
 *
 * Bilingual email (Vietnamese primary, English below).
 * Confirms receipt and sets expectation of 48 business-hour response time.
 *
 * @param application - Applicant data + job title
 * @returns Email notification ID
 */
export const sendJobApplicationAutoReply = async (application: {
  full_name: string;
  email: string;
  job_title: string;
}): Promise<number> => {
  const subject = 'KOOLA — Chúng tôi đã nhận được hồ sơ ứng tuyển của bạn | We have received your application';

  const text = `
Xin chào ${application.full_name},

Cảm ơn bạn đã ứng tuyển vị trí "${application.job_title}" tại KOOLA!

Chúng tôi đã nhận được hồ sơ của bạn và đội ngũ tuyển dụng sẽ xem xét trong thời gian sớm nhất. Bạn sẽ nhận được phản hồi trong vòng 48 giờ làm việc.

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ trực tiếp qua:
- Email: info@koola.vn
- Điện thoại: 0941 508 468

Trân trọng,
Đội ngũ Tuyển dụng KOOLA

---

ENGLISH VERSION BELOW

Dear ${application.full_name},

Thank you for applying for the "${application.job_title}" position at KOOLA!

We have received your application and our recruitment team will review it as soon as possible. You can expect to hear back from us within 48 business hours.

If you have any questions, please contact us directly:
- Email: info@koola.vn
- Phone: 0941 508 468

Best regards,
KOOLA Recruitment Team

--
KOOLA
58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam
Website: https://koola.vn
  `.trim();

  const html = buildJobApplicationAutoReplyHtml(application);

  return await sendEmail({
    to: application.email,
    subject,
    text,
    html,
    type: 'job_application_auto_reply',
    metadata: {
      applicant_email: application.email,
      applicant_name: application.full_name,
      job_title: application.job_title,
    },
  });
};

/** Build HTML auto-reply email for job application. */
const buildJobApplicationAutoReplyHtml = (application: {
  full_name: string;
  email: string;
  job_title: string;
}): string => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #1e293b; background: #f1f5f9; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .brand-bar { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px 32px 28px; text-align: center; }
    .brand-bar h1 { margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px; }
    .brand-bar p { margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; }
    .body-section { padding: 32px; }
    .greeting { font-size: 17px; font-weight: 600; color: #1e293b; margin: 0 0 16px; }
    .body-text { font-size: 15px; color: #475569; margin: 0 0 16px; }
    .position-badge { display: inline-block; background: #f5f3ff; color: #6d28d9; font-weight: 600; font-size: 14px; padding: 6px 14px; border-radius: 6px; margin: 4px 0 16px; }
    .highlight-box { background: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 15px; color: #5b21b6; font-weight: 500; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
    .lang-label { display: inline-block; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 16px; }
    .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sig-name { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; }
    .sig-title { font-size: 13px; color: #64748b; margin: 2px 0 0; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
    .footer a { color: #7c3aed; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand-bar">
        <h1>KOOLA</h1>
        <p>Careers &amp; Recruitment</p>
      </div>
      <div class="body-section">
        <p class="greeting">Xin chào ${application.full_name},</p>
        <p class="body-text">Cảm ơn bạn đã ứng tuyển tại <strong>KOOLA</strong>! Chúng tôi rất vui khi nhận được hồ sơ của bạn cho vị trí:</p>
        <div class="position-badge">📋 ${application.job_title}</div>
        <p class="body-text">Đội ngũ tuyển dụng của chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn trong thời gian sớm nhất.</p>
        <div class="highlight-box">
          <p>⏱ Bạn sẽ nhận được phản hồi trong vòng <strong>48 giờ làm việc</strong>.</p>
        </div>
        <p class="body-text">Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ trực tiếp:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #7c3aed; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Điện thoại: <a href="tel:0941508468" style="color: #7c3aed; text-decoration: none;">0941 508 468</a></p>
        </div>
        <hr class="divider">
        <span class="lang-label">English version below</span>
        <p class="greeting">Dear ${application.full_name},</p>
        <p class="body-text">Thank you for applying at <strong>KOOLA</strong>! We are pleased to have received your application for the position:</p>
        <div class="position-badge">📋 ${application.job_title}</div>
        <p class="body-text">Our recruitment team will review your application and get back to you as soon as possible.</p>
        <div class="highlight-box">
          <p>⏱ You can expect to hear back within <strong>48 business hours</strong>.</p>
        </div>
        <p class="body-text">If you have any questions, feel free to contact us directly:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #7c3aed; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Phone: <a href="tel:0941508468" style="color: #7c3aed; text-decoration: none;">0941 508 468</a></p>
        </div>
        <div class="signature">
          <p class="sig-name">Đội ngũ Tuyển dụng KOOLA | KOOLA Recruitment Team</p>
          <p class="sig-title">Careers &amp; Recruitment</p>
          <div style="margin-top: 12px; font-size: 13px; color: #64748b; line-height: 1.6;">
            <p style="margin: 2px 0;">🌐 <a href="https://koola.vn" style="color: #7c3aed; text-decoration: none;">koola.vn</a></p>
            <p style="margin: 2px 0;">📍 58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
        <p style="margin-top: 4px;">This is an automated email. Please do not reply directly.</p>
        <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} KOOLA. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

/**
 * Send welcome email to a new newsletter subscriber.
 *
 * Bilingual (Vietnamese primary, English below).
 *
 * @param subscriber - Subscriber email address
 * @returns Email notification ID
 */
export const sendNewsletterWelcome = async (subscriber: {
  email: string;
}): Promise<number> => {
  const subject = 'KOOLA — Chào mừng bạn đã đăng ký nhận tin! | Welcome to our newsletter!';

  const text = `
Xin chào,

Cảm ơn bạn đã đăng ký nhận thông tin từ KOOLA!

Từ giờ, bạn sẽ nhận được những cập nhật mới nhất về dịch vụ, xu hướng công nghệ và các cơ hội hợp tác từ chúng tôi.

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ:
- Email: info@koola.vn
- Điện thoại: 0941 508 468

Trân trọng,
Đội ngũ KOOLA

---

ENGLISH VERSION BELOW

Hello,

Thank you for subscribing to KOOLA's newsletter!

From now on, you will receive the latest updates on our services, technology trends, and partnership opportunities.

If you have any questions, feel free to contact us:
- Email: info@koola.vn
- Phone: 0941 508 468

Best regards,
The KOOLA Team

--
KOOLA
58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam
Website: https://koola.vn
  `.trim();

  const html = buildNewsletterWelcomeHtml(subscriber);

  return await sendEmail({
    to: subscriber.email,
    subject,
    text,
    html,
    type: 'newsletter_welcome',
    metadata: { subscriber_email: subscriber.email },
  });
};

/** Build HTML welcome email for newsletter subscriber. */
const buildNewsletterWelcomeHtml = (_subscriber: { email: string }): string => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #1e293b; background: #f1f5f9; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .brand-bar { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 32px 28px; text-align: center; }
    .brand-bar h1 { margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px; }
    .brand-bar p { margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; }
    .body-section { padding: 32px; }
    .greeting { font-size: 17px; font-weight: 600; color: #1e293b; margin: 0 0 16px; }
    .body-text { font-size: 15px; color: #475569; margin: 0 0 16px; }
    .highlight-box { background: #ecfdf5; border-left: 4px solid #059669; border-radius: 0 8px 8px 0; padding: 16px 20px; margin: 24px 0; }
    .highlight-box p { margin: 0; font-size: 15px; color: #065f46; font-weight: 500; }
    .benefits { margin: 20px 0; padding: 0; }
    .benefits li { list-style: none; padding: 6px 0; font-size: 14px; color: #475569; }
    .benefits li::before { content: "✓ "; color: #059669; font-weight: 700; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
    .lang-label { display: inline-block; background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 16px; }
    .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sig-name { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; }
    .sig-title { font-size: 13px; color: #64748b; margin: 2px 0 0; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
    .footer a { color: #059669; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand-bar">
        <h1>KOOLA</h1>
        <p>Newsletter</p>
      </div>
      <div class="body-section">
        <p class="greeting">Xin chào,</p>
        <p class="body-text">Cảm ơn bạn đã đăng ký nhận thông tin từ <strong>KOOLA</strong>! 🎉</p>

        <div class="highlight-box">
          <p>Bạn sẽ nhận được những cập nhật mới nhất từ chúng tôi.</p>
        </div>

        <p class="body-text">Những gì bạn sẽ nhận được:</p>
        <ul class="benefits">
          <li>Cập nhật dịch vụ và giải pháp công nghệ mới</li>
          <li>Xu hướng công nghệ và chuyển đổi số</li>
          <li>Cơ hội hợp tác và ưu đãi đặc biệt</li>
        </ul>

        <p class="body-text">Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #059669; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Điện thoại: <a href="tel:0941508468" style="color: #059669; text-decoration: none;">0941 508 468</a></p>
        </div>

        <hr class="divider">

        <span class="lang-label">English version below</span>

        <p class="greeting">Hello,</p>
        <p class="body-text">Thank you for subscribing to <strong>KOOLA</strong>'s newsletter! 🎉</p>

        <div class="highlight-box">
          <p>You will receive the latest updates from us.</p>
        </div>

        <p class="body-text">What you can expect:</p>
        <ul class="benefits">
          <li>New services and technology solutions</li>
          <li>Technology trends and digital transformation insights</li>
          <li>Partnership opportunities and special offers</li>
        </ul>

        <p class="body-text">If you have any questions, feel free to contact us:</p>
        <div style="margin: 12px 0 0;">
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:info@koola.vn" style="color: #059669; text-decoration: none;">info@koola.vn</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #475569;">📞 Phone: <a href="tel:0941508468" style="color: #059669; text-decoration: none;">0941 508 468</a></p>
        </div>

        <div class="signature">
          <p class="sig-name">Đội ngũ KOOLA | The KOOLA Team</p>
          <p class="sig-title">Technology &amp; Digital Solutions</p>
          <div style="margin-top: 12px; font-size: 13px; color: #64748b; line-height: 1.6;">
            <p style="margin: 2px 0;">🌐 <a href="https://koola.vn" style="color: #059669; text-decoration: none;">koola.vn</a></p>
            <p style="margin: 2px 0;">📍 58 Đường 3, Thôn 4, Đức Hạnh, Đức Linh, Bình Thuận, Việt Nam</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>Email này được gửi tự động. Vui lòng không trả lời trực tiếp.</p>
        <p style="margin-top: 4px;">This is an automated email. Please do not reply directly.</p>
        <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} KOOLA. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

/**
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
