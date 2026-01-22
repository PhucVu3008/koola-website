-- Migration: Add slug_group to services table
-- Description: Group services by content so we can switch between locales

ALTER TABLE services
ADD COLUMN slug_group VARCHAR(100);

CREATE INDEX idx_services_slug_group ON services(slug_group);

COMMENT ON COLUMN services.slug_group IS 'Groups services with same content across different locales (e.g., "iot-system-integration")';

-- Update existing services with slug_group (use English slug as group identifier)
UPDATE services SET slug_group = 'iot-system-integration' WHERE id IN (1, 7);
UPDATE services SET slug_group = 'industrial-automation' WHERE id IN (2, 8);
UPDATE services SET slug_group = 'it-infrastructure-solutions' WHERE id IN (3, 9);
UPDATE services SET slug_group = 'smart-building-solutions' WHERE id IN (4, 10);
UPDATE services SET slug_group = 'cloud-infrastructure-management' WHERE id IN (5, 11);
UPDATE services SET slug_group = 'cybersecurity-solutions' WHERE id IN (6, 12);
