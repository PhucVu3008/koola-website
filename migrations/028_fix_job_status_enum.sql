-- Migration 028: Rename job_status enum value 'closed' → 'archived'
-- Aligns DB enum with application code which uses 'archived' everywhere

ALTER TYPE job_status RENAME VALUE 'closed' TO 'archived';
