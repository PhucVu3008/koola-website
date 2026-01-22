-- Migration: Add benefits_subtitle to services table
-- Description: Add a subtitle field for the Key Benefits section of each service

ALTER TABLE services
ADD COLUMN benefits_subtitle TEXT;

COMMENT ON COLUMN services.benefits_subtitle IS 'Subtitle text displayed above the benefits cards in service detail page';
