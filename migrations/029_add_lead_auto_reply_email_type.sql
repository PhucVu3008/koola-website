-- Add auto-reply and welcome email types to email_type enum
-- Used for auto-confirmation emails sent to users

ALTER TYPE email_type ADD VALUE IF NOT EXISTS 'lead_auto_reply';
ALTER TYPE email_type ADD VALUE IF NOT EXISTS 'job_application_auto_reply';
ALTER TYPE email_type ADD VALUE IF NOT EXISTS 'newsletter_welcome';
