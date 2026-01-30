-- Seed icon_name for existing services
-- Date: 2026-01-29
-- Purpose: Add icon identifiers to all existing services

-- English services
UPDATE services SET icon_name = 'brain' WHERE slug = 'iot-system-integration' AND locale = 'en';
UPDATE services SET icon_name = 'spark' WHERE slug = 'industrial-automation' AND locale = 'en';
UPDATE services SET icon_name = 'cloud' WHERE slug = 'it-infrastructure-solutions' AND locale = 'en';
UPDATE services SET icon_name = 'pen' WHERE slug = 'smart-building-solutions' AND locale = 'en';
UPDATE services SET icon_name = 'cloud' WHERE slug = 'cloud-infrastructure-management' AND locale = 'en';
UPDATE services SET icon_name = 'code' WHERE slug = 'cybersecurity-solutions' AND locale = 'en';
UPDATE services SET icon_name = 'phone' WHERE slug = 'digital-platforms' AND locale = 'en';

-- Vietnamese services
UPDATE services SET icon_name = 'brain' WHERE slug = 'tich-hop-he-thong-iot' AND locale = 'vi';
UPDATE services SET icon_name = 'spark' WHERE slug = 'tu-dong-hoa-cong-nghiep' AND locale = 'vi';
UPDATE services SET icon_name = 'cloud' WHERE slug = 'giai-phap-ha-tang-cntt' AND locale = 'vi';
UPDATE services SET icon_name = 'pen' WHERE slug = 'giai-phap-toa-nha-thong-minh' AND locale = 'vi';
UPDATE services SET icon_name = 'cloud' WHERE slug = 'quan-ly-ha-tang-dam-may' AND locale = 'vi';
UPDATE services SET icon_name = 'code' WHERE slug LIKE '%cybersecurity%' AND locale = 'vi';
UPDATE services SET icon_name = 'phone' WHERE slug = 'digital-platforms' AND locale = 'vi';

-- Verify the results
SELECT id, locale, title, slug, icon_name, sort_order
FROM services 
WHERE status = 'published'
ORDER BY locale, sort_order
LIMIT 20;
