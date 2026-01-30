-- Update About Page Images
-- This script updates the image paths for about_intro and about_story sections
-- to use the actual uploaded images instead of placeholders

-- Update English (locale en, page_id = 1)
UPDATE page_sections
SET payload = jsonb_set(
  payload,
  '{image,src}',
  '"/images/about/intro.jpg"'
)
WHERE section_key = 'about_intro'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en');

UPDATE page_sections
SET payload = jsonb_set(
  payload,
  '{image,src}',
  '"/images/about/story.jpg"'
)
WHERE section_key = 'about_story'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en');

-- Update Vietnamese (locale vi, page_id = 2)
UPDATE page_sections
SET payload = jsonb_set(
  payload,
  '{image,src}',
  '"/images/about/intro.jpg"'
)
WHERE section_key = 'about_intro'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi');

UPDATE page_sections
SET payload = jsonb_set(
  payload,
  '{image,src}',
  '"/images/about/story.jpg"'
)
WHERE section_key = 'about_story'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi');

-- Verify the updates
SELECT 
  p.locale,
  ps.section_key,
  ps.payload->'image'->>'src' as image_src,
  ps.payload->'image'->>'alt' as image_alt
FROM page_sections ps
JOIN pages p ON ps.page_id = p.id
WHERE p.slug = 'about'
  AND ps.section_key IN ('about_intro', 'about_story')
ORDER BY p.locale, ps.section_key;
