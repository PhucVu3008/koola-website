-- Migration: Add icon_name to services table
-- Date: 2026-01-29
-- Purpose: Store icon identifier for service cards on homepage

-- Add icon_name column to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS icon_name VARCHAR(50);

-- Add comment
COMMENT ON COLUMN services.icon_name IS 'Icon identifier for service card display (e.g., brain, spark, cloud, pen, phone, code)';

-- Update existing services with appropriate icons based on their content
UPDATE services SET icon_name = 'brain' WHERE slug IN ('iot-system-integration', 'iot-system-integration');
UPDATE services SET icon_name = 'spark' WHERE slug IN ('industrial-automation', 'tu-dong-hoa-cong-nghiep');
UPDATE services SET icon_name = 'cloud' WHERE slug IN ('it-infrastructure-solutions', 'giai-phap-ha-tang-cntt', 'cloud-infrastructure-management', 'quan-ly-ha-tang-dam-may');
UPDATE services SET icon_name = 'pen' WHERE slug IN ('smart-building-solutions', 'giai-phap-toa-nha-thong-minh');
UPDATE services SET icon_name = 'code' WHERE slug IN ('cybersecurity-solutions', 'giai-phap-an-ninh-mang');
UPDATE services SET icon_name = 'phone' WHERE slug LIKE '%mobile%' OR slug LIKE '%app%';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_icon_name ON services(icon_name);

-- Verify the update
SELECT id, locale, title, slug, icon_name 
FROM services 
WHERE locale = 'en' AND status = 'published'
ORDER BY sort_order 
LIMIT 10;
