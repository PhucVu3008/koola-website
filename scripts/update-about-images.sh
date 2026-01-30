#!/bin/bash

# About Images Migration Script
# Updates image paths in database for about_intro and about_story sections

echo "🔧 Updating About page images in database..."
echo ""

# Run the migration
docker-compose exec postgres psql -U koola_user -d koola_db << 'EOF'

-- Update English (locale en)
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

-- Update Vietnamese (locale vi)
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
\echo ''
\echo '✅ Migration completed! Verifying updates...'
\echo ''

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

EOF

echo ""
echo "✨ Done! Check the results above."
echo "🌐 Visit: http://localhost:3000/en/about to see the changes"
