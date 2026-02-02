-- Migration: Add home pages to CMS
-- Purpose: Allow home page management through admin panel
-- Date: 2026-02-02

-- Insert English home page
INSERT INTO pages (locale, slug, title, seo_title, seo_description, status, updated_by, created_at, updated_at)
VALUES (
  'en',
  'home',
  'Home',
  'KOOLA - IT Infrastructure & Cloud Solutions',
  'Transform your business with cutting-edge IT infrastructure and cloud solutions. Expert consulting, implementation, and support.',
  'published',
  1, -- admin user
  NOW(),
  NOW()
);

-- Insert Vietnamese home page
INSERT INTO pages (locale, slug, title, seo_title, seo_description, status, updated_by, created_at, updated_at)
VALUES (
  'vi',
  'home',
  'Trang chủ',
  'KOOLA - Giải pháp Hạ tầng CNTT & Đám mây',
  'Chuyển đổi doanh nghiệp của bạn với các giải pháp hạ tầng CNTT và đám mây tiên tiến. Tư vấn, triển khai và hỗ trợ chuyên nghiệp.',
  'published',
  1, -- admin user
  NOW(),
  NOW()
);

-- Add hero section for English home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'hero',
  jsonb_build_object(
    'title', 'Transform Your Business with Cutting-Edge IT Solutions',
    'subtitle', 'Partner with KOOLA for expert IT infrastructure, cloud solutions, and digital transformation services that drive growth and innovation.',
    'cta_text', 'Get Started',
    'cta_link', '/contact'
  ),
  1
FROM pages
WHERE locale = 'en' AND slug = 'home';

-- Add hero section for Vietnamese home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'hero',
  jsonb_build_object(
    'title', 'Chuyển đổi doanh nghiệp với giải pháp CNTT tiên tiến',
    'subtitle', 'Đồng hành cùng KOOLA với các dịch vụ hạ tầng CNTT, giải pháp đám mây và chuyển đổi số giúp thúc đẩy tăng trưởng và đổi mới.',
    'cta_text', 'Bắt đầu',
    'cta_link', '/contact'
  ),
  1
FROM pages
WHERE locale = 'vi' AND slug = 'home';

-- Add services showcase section for English home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'services_showcase',
  jsonb_build_object(
    'title', 'Our Services',
    'subtitle', 'Comprehensive IT solutions tailored to your business needs'
  ),
  2
FROM pages
WHERE locale = 'en' AND slug = 'home';

-- Add services showcase section for Vietnamese home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'services_showcase',
  jsonb_build_object(
    'title', 'Dịch vụ của chúng tôi',
    'subtitle', 'Giải pháp CNTT toàn diện, phù hợp với nhu cầu doanh nghiệp của bạn'
  ),
  2
FROM pages
WHERE locale = 'vi' AND slug = 'home';

-- Add why choose us section for English home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'why_choose_us',
  jsonb_build_object(
    'title', 'Why Choose KOOLA',
    'items', jsonb_build_array(
      jsonb_build_object('title', 'Expert Team', 'description', 'Certified professionals with years of industry experience', 'icon', 'users'),
      jsonb_build_object('title', '24/7 Support', 'description', 'Round-the-clock technical support and monitoring', 'icon', 'clock'),
      jsonb_build_object('title', 'Proven Track Record', 'description', 'Successfully delivered 200+ projects across industries', 'icon', 'award'),
      jsonb_build_object('title', 'Latest Technology', 'description', 'Implementation of cutting-edge solutions and best practices', 'icon', 'zap')
    )
  ),
  3
FROM pages
WHERE locale = 'en' AND slug = 'home';

-- Add why choose us section for Vietnamese home page
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
SELECT 
  id,
  'why_choose_us',
  jsonb_build_object(
    'title', 'Tại sao chọn KOOLA',
    'items', jsonb_build_array(
      jsonb_build_object('title', 'Đội ngũ chuyên gia', 'description', 'Chuyên gia được chứng nhận với nhiều năm kinh nghiệm', 'icon', 'users'),
      jsonb_build_object('title', 'Hỗ trợ 24/7', 'description', 'Hỗ trợ kỹ thuật và giám sát liên tục', 'icon', 'clock'),
      jsonb_build_object('title', 'Uy tín đã được chứng minh', 'description', 'Đã triển khai thành công 200+ dự án trong nhiều lĩnh vực', 'icon', 'award'),
      jsonb_build_object('title', 'Công nghệ mới nhất', 'description', 'Triển khai các giải pháp tiên tiến và thực tiễn tốt nhất', 'icon', 'zap')
    )
  ),
  3
FROM pages
WHERE locale = 'vi' AND slug = 'home';
