-- Migration: Backfill slug_group for all services that don't have one yet
-- For English services: slug_group = slug (English slug is the canonical group key)
-- For Vietnamese services: match by sort_order to find the English counterpart

-- Step 1: Set slug_group for English services that don't have one
UPDATE services
SET slug_group = slug
WHERE locale = 'en' AND slug_group IS NULL;

-- Step 2: Set slug_group for Vietnamese services by matching sort_order with English counterpart
UPDATE services vi
SET slug_group = en.slug_group
FROM services en
WHERE vi.locale = 'vi'
  AND en.locale = 'en'
  AND vi.sort_order = en.sort_order
  AND vi.slug_group IS NULL
  AND en.slug_group IS NOT NULL;

-- Step 3: For any remaining services without slug_group, use their own slug
UPDATE services
SET slug_group = slug
WHERE slug_group IS NULL;
