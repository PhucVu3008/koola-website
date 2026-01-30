-- Migration: Seed Email Notification Settings
-- Purpose: Add default notification_email setting
-- Created: 2026-01-30

-- Insert notification email setting (if not exists)
INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'notification_email',
  '"admin@yourwebsite.com"'::jsonb,
  NOW()
)
ON CONFLICT (key) DO NOTHING;

-- Insert admin panel URL setting (if not exists)
INSERT INTO site_settings (key, value, updated_at)
VALUES (
  'admin_panel_url',
  '"http://localhost:3000/en/admin"'::jsonb,
  NOW()
)
ON CONFLICT (key) DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE site_settings IS 'Global site configuration stored as key-value pairs';

-- Note: notification_email value should be a valid email address in JSON format
-- Example: "admin@example.com"
-- Admin can update this via Admin Panel > Settings
