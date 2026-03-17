-- Add linkedin_url and portfolio_url columns to job_applications
-- These fields were referenced in SQL queries but missing from the table

ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS portfolio_url text;
