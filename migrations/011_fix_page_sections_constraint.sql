-- Migration 011: Add unique constraint to page_sections
-- This fixes migration 008 which requires ON CONFLICT handling

BEGIN;

-- Add unique constraint on (page_id, section_key)
-- This ensures one section per page per section_key
ALTER TABLE page_sections 
ADD CONSTRAINT page_sections_page_id_section_key_unique 
UNIQUE (page_id, section_key);

COMMIT;
