-- Fix services sort order for home page display
-- Ensure the 6 main services are displayed correctly

-- First, check if "AI services" is a test entry and should be removed or updated
-- Option 1: Delete the test "AI services" entry (id=15)
DELETE FROM services WHERE id = 15 AND slug = 'ai-services' AND excerpt = 'AI services';

-- Option 2: If you want to keep it but move it down, uncomment this instead:
-- UPDATE services SET sort_order = 10 WHERE id = 15;

-- Now fix the sort_order to ensure proper display of the 6 main services
-- Update services to have unique sort_order values 1-6 for the main services

-- Smart Building Solutions should be 4 (currently has duplicate sort_order with deleted AI services)
UPDATE services SET sort_order = 4 WHERE id = 4 AND slug = 'smart-building-solutions';

-- Cloud Infrastructure Management should be 5
UPDATE services SET sort_order = 5 WHERE id = 5 AND slug = 'cloud-infrastructure-management';

-- Cybersecurity Solutions should be 6
UPDATE services SET sort_order = 6 WHERE id = 6 AND slug = 'cybersecurity-solutions';

-- Verify the result
SELECT id, locale, title, slug, sort_order 
FROM services 
WHERE locale = 'en' AND status = 'published'
ORDER BY sort_order ASC
LIMIT 10;
