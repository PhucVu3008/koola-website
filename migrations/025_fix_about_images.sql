-- Migration 025: Replace placeholder images on About page
-- CTA section: /home/hero-placeholder.svg → /images/about/cta/cta.jpg
-- Team roles: /home/hero-placeholder.svg → /images/team/{role}.jpg

BEGIN;

-- ============================================================
-- 1. FIX CTA IMAGE (EN + VI)
-- ============================================================

UPDATE page_sections
SET payload = jsonb_set(payload, '{image}', '"/images/about/cta/cta.jpg"')
WHERE section_key = 'about_cta'
  AND page_id IN (SELECT id FROM pages WHERE slug = 'about');

-- ============================================================
-- 2. FIX TEAM ROLES IMAGES (EN)
-- ============================================================

UPDATE page_sections
SET payload = jsonb_set(payload, '{roles}', '[
  {"role": "Cloud\nArchitect", "image": "/images/team/iot-architect.jpg"},
  {"role": "Systems\nEngineer", "image": "/images/team/systems-integrator.jpg"},
  {"role": "DevOps\nSpecialist", "image": "/images/team/devops-specialist.jpg"},
  {"role": "Solution\nConsultant", "image": "/images/team/solution-consultant.jpg"},
  {"role": "Automation\nEngineer", "image": "/images/team/automation-engineer.jpg"}
]'::jsonb)
WHERE section_key = 'about_team_roles'
  AND page_id IN (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en');

-- ============================================================
-- 3. FIX TEAM ROLES IMAGES (VI)
-- ============================================================

UPDATE page_sections
SET payload = jsonb_set(payload, '{roles}', '[
  {"role": "Kiến trúc sư\nCloud", "image": "/images/team/iot-architect.jpg"},
  {"role": "Kỹ sư\nHệ thống", "image": "/images/team/systems-integrator.jpg"},
  {"role": "Chuyên viên\nDevOps", "image": "/images/team/devops-specialist.jpg"},
  {"role": "Tư vấn\nGiải pháp", "image": "/images/team/solution-consultant.jpg"},
  {"role": "Kỹ sư\nTự động hóa", "image": "/images/team/automation-engineer.jpg"}
]'::jsonb)
WHERE section_key = 'about_team_roles'
  AND page_id IN (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi');

COMMIT;
