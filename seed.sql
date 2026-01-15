-- Seed data for KOOLA development

-- =============================================
-- DEV RESET (safe for local dev only)
-- ---------------------------------------------
-- This seed file is intended for development and local testing.
-- It clears existing rows to provide deterministic IDs and allow
-- re-running `seed.sql` multiple times without residual data.
--
-- If you need to preserve data, remove this block and rely on
-- ON CONFLICT upserts instead.
-- =============================================
TRUNCATE TABLE
  refresh_tokens,
  user_roles,
  users,
  roles,
  service_related_posts,
  service_related,
  service_faqs,
  service_process_steps,
  service_deliverables,
  service_tags,
  service_categories,
  services,
  post_related,
  post_tags,
  post_categories,
  posts,
  categories,
  tags,
  nav_items,
  site_settings,
  newsletter_subscribers,
  leads,
  job_applications,
  job_posts,
  pages,
  page_sections
RESTART IDENTITY CASCADE;

-- Insert roles
INSERT INTO roles (id, name) VALUES 
  (1, 'admin'),
  (2, 'editor')
ON CONFLICT (id) DO NOTHING;

-- Insert admin user (password: admin123)
-- NOTE: This hash was verified in-container with bcrypt (Node 20 + bcrypt).
--       If you change the password, regenerate a bcrypt hash and update it here.
INSERT INTO users (id, email, password_hash, full_name, is_active) VALUES 
  (1, 'admin@koola.com', '$2b$10$rVKnWgM48616HebkrDXLeuGO6KdJmJn3S9mn4POOM9JsmHYrObU3a', 'Admin User', true)
ON CONFLICT (email) DO NOTHING;

-- Assign admin role
INSERT INTO user_roles (user_id, role_id) VALUES 
  (1, 1)
ON CONFLICT DO NOTHING;

-- Insert categories for services
INSERT INTO categories (id, locale, kind, name, slug, description, sort_order) VALUES 
  (1, 'en', 'service', 'AI Solutions', 'ai-solutions', 'Artificial Intelligence solutions', 1),
  (2, 'en', 'service', 'Machine Learning', 'machine-learning', 'Machine Learning services', 2),
  (3, 'en', 'service', 'Data Analytics', 'data-analytics', 'Data Analytics services', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert categories for posts
INSERT INTO categories (id, locale, kind, name, slug, description, sort_order) VALUES 
  (4, 'en', 'post', 'Technology', 'technology', 'Tech articles', 1),
  (5, 'en', 'post', 'AI News', 'ai-news', 'Latest in AI', 2),
  (6, 'en', 'post', 'Tutorials', 'tutorials', 'How-to guides', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert tags
INSERT INTO tags (id, locale, name, slug) VALUES 
  (1, 'en', 'AI', 'ai'),
  (2, 'en', 'Machine Learning', 'machine-learning'),
  (3, 'en', 'Deep Learning', 'deep-learning'),
  (4, 'en', 'NLP', 'nlp'),
  (5, 'en', 'Computer Vision', 'computer-vision')
ON CONFLICT (locale, slug) DO NOTHING;

-- Insert sample services
INSERT INTO services (id, locale, title, slug, excerpt, content_md, status, published_at, sort_order, created_by) VALUES 
  (1, 'en', 'AI Chatbot Development', 'ai-chatbot-development', 
   'Build intelligent chatbots powered by advanced AI', 
   '## AI Chatbot Development\n\nWe create intelligent chatbots that understand natural language and provide human-like responses.\n\n### Key Features\n- Natural Language Understanding\n- Multi-language support\n- Integration with existing systems\n- 24/7 availability',
   'published', NOW(), 1, 1),
  (2, 'en', 'Computer Vision Solutions', 'computer-vision-solutions',
   'Advanced image and video analysis using AI',
   '## Computer Vision Solutions\n\nTransform your visual data into actionable insights.\n\n### Capabilities\n- Object detection\n- Facial recognition\n- Image classification\n- Video analytics',
   'published', NOW(), 2, 1),
  (3, 'en', 'Predictive Analytics', 'predictive-analytics',
   'Data-driven predictions for better business decisions',
   '## Predictive Analytics\n\nLeverage historical data to predict future trends.\n\n### Benefits\n- Improved forecasting\n- Risk assessment\n- Customer behavior prediction\n- Optimization opportunities',
   'published', NOW(), 3, 1)
ON CONFLICT (locale, slug) DO NOTHING;

-- Link services to categories
INSERT INTO service_categories (service_id, category_id) VALUES 
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 2), (3, 3)
ON CONFLICT DO NOTHING;

-- Link services to tags
INSERT INTO service_tags (service_id, tag_id) VALUES 
  (1, 1), (1, 4),
  (2, 1), (2, 5),
  (3, 2), (3, 3)
ON CONFLICT DO NOTHING;

-- Insert service deliverables
INSERT INTO service_deliverables (service_id, title, description, sort_order) VALUES 
  (1, 'Custom Chatbot', 'Fully customized chatbot tailored to your needs', 1),
  (1, 'Integration Support', 'Seamless integration with your existing platforms', 2),
  (1, 'Training & Documentation', 'Comprehensive training and documentation', 3),
  (2, 'CV Model', 'Custom-trained computer vision model', 1),
  (2, 'API Access', 'RESTful API for easy integration', 2),
  (3, 'Predictive Model', 'Trained ML model for predictions', 1),
  (3, 'Dashboard', 'Interactive analytics dashboard', 2)
ON CONFLICT DO NOTHING;

-- Insert service process steps
INSERT INTO service_process_steps (service_id, title, description, sort_order) VALUES 
  (1, 'Discovery', 'Understanding your requirements and use cases', 1),
  (1, 'Design', 'Designing the chatbot conversation flow', 2),
  (1, 'Development', 'Building and training the AI model', 3),
  (1, 'Testing', 'Rigorous testing and refinement', 4),
  (1, 'Deployment', 'Launch and integration', 5),
  (2, 'Consultation', 'Discuss your vision requirements', 1),
  (2, 'Data Collection', 'Gather and prepare training data', 2),
  (2, 'Model Training', 'Train computer vision models', 3),
  (2, 'Integration', 'Integrate into your systems', 4)
ON CONFLICT DO NOTHING;

-- Insert service FAQs
INSERT INTO service_faqs (service_id, question, answer, sort_order) VALUES 
  (1, 'What languages do you support?', 'We support 50+ languages including English, Spanish, Chinese, and more.', 1),
  (1, 'How long does development take?', 'Typical projects take 4-8 weeks depending on complexity.', 2),
  (1, 'Can you integrate with our existing systems?', 'Yes, we can integrate with most platforms including CRM, ERP, and custom systems.', 3),
  (2, 'What accuracy can we expect?', 'Our models typically achieve 95%+ accuracy depending on use case and data quality.', 1),
  (2, 'Do you provide ongoing support?', 'Yes, we offer maintenance and improvement packages.', 2)
ON CONFLICT DO NOTHING;

-- Insert sample posts
INSERT INTO posts (id, locale, title, slug, excerpt, content_md, author_id, status, published_at, created_by) VALUES 
  (1, 'en', 'Introduction to Machine Learning', 'introduction-to-machine-learning',
   'A beginner-friendly guide to understanding machine learning concepts',
   '## Introduction to Machine Learning\n\nMachine learning is revolutionizing how we solve problems...\n\n### What is ML?\nML is a subset of AI that enables systems to learn from data...',
   1, 'published', NOW(), 1),
  (2, 'en', 'Top 10 AI Trends in 2026', 'top-10-ai-trends-2026',
   'Discover the latest trends shaping the AI industry',
   '## Top 10 AI Trends in 2026\n\n1. Generative AI continues to dominate\n2. AI ethics becomes mainstream...',
   1, 'published', NOW(), 1),
  (3, 'en', 'Building Your First Chatbot', 'building-your-first-chatbot',
   'Step-by-step tutorial on creating an AI-powered chatbot',
   '## Building Your First Chatbot\n\nIn this tutorial, we will create a simple chatbot...\n\n### Prerequisites\n- Python 3.8+\n- Basic programming knowledge',
   1, 'published', NOW(), 1)
ON CONFLICT (locale, slug) DO NOTHING;

-- Link posts to categories
INSERT INTO post_categories (post_id, category_id) VALUES 
  (1, 4), (1, 6),
  (2, 5),
  (3, 4), (3, 6)
ON CONFLICT DO NOTHING;

-- Link posts to tags
INSERT INTO post_tags (post_id, tag_id) VALUES 
  (1, 2),
  (2, 1),
  (3, 1), (3, 4)
ON CONFLICT DO NOTHING;

-- Insert navigation items
INSERT INTO nav_items (locale, placement, label, href, sort_order) VALUES 
  ('en', 'header', 'Home', '/', 1),
  ('en', 'header', 'About', '/about', 2),
  ('en', 'header', 'Services', '/services', 3),
  ('en', 'header', 'Blog', '/blog', 4),
  ('en', 'header', 'Contact', '/contact', 5),
  ('en', 'footer', 'Privacy Policy', '/privacy', 1),
  ('en', 'footer', 'Terms of Service', '/terms', 2),
  ('en', 'footer', 'Careers', '/careers', 3)
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO site_settings (key, value) VALUES 
  ('site_meta', '{"title": "KOOLA - AI Solutions", "description": "Leading AI and Machine Learning solutions provider", "keywords": ["AI", "Machine Learning", "Data Science"]}'),
  ('global_cta', '{"label": "Get Started", "link": "/contact"}'),
  ('social_links', '{"twitter": "https://twitter.com/koola", "linkedin": "https://linkedin.com/company/koola", "github": "https://github.com/koola"}'),
  ('contact_info', '{"email": "hello@koola.com", "phone": "+1 (555) 123-4567", "address": "123 AI Street, Tech City, TC 12345"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert sample job posts
INSERT INTO job_posts (id, locale, title, slug, department, location, employment_type, level, summary, responsibilities_md, requirements_md, status, published_at, created_by) VALUES 
  (1, 'en', 'Senior ML Engineer', 'senior-ml-engineer', 'Engineering', 'Remote', 'Full-time', 'Senior',
   'Join our team to build cutting-edge AI solutions',
   '## Responsibilities\n- Design and implement ML models\n- Collaborate with cross-functional teams\n- Optimize model performance',
   '## Requirements\n- 5+ years ML experience\n- Python, TensorFlow, PyTorch\n- Strong communication skills',
   'published', NOW(), 1),
  (2, 'en', 'AI Product Manager', 'ai-product-manager', 'Product', 'Hybrid', 'Full-time', 'Mid-level',
   'Drive AI product strategy and execution',
   '## Responsibilities\n- Define product roadmap\n- Work with engineering and design\n- Analyze market trends',
   '## Requirements\n- 3+ years product management\n- Understanding of AI/ML\n- Strong analytical skills',
   'published', NOW(), 1)
ON CONFLICT (locale, slug) DO NOTHING;

-- =============================================
-- Pages (CMS-style) — seed at least one page so
-- `/v1/pages/:slug` can be verified with a 200
-- =============================================

-- Insert sample pages
INSERT INTO pages (id, locale, slug, title, seo_title, seo_description, status, updated_by)
VALUES
  (
    1,
    'en',
    'about',
    'About KOOLA',
    'About KOOLA — AI Solutions',
    'Learn more about KOOLA, our mission, and how we help teams ship high-quality AI products.',
    'published',
    1
  )
ON CONFLICT (locale, slug) DO NOTHING;

-- Insert page sections (ordered)
INSERT INTO page_sections (page_id, section_key, payload, sort_order)
VALUES
  (
    1,
    'hero',
    '{
      "headline": "We build practical AI that ships.",
      "subheadline": "KOOLA partners with product teams to design, build, and deploy AI solutions with measurable impact.",
      "primary_cta": { "label": "Talk to us", "href": "/contact" },
      "secondary_cta": { "label": "See services", "href": "/services" }
    }'::jsonb,
    1
  ),
  (
    1,
    'content',
    '{
      "content_md": "## Our mission\n\nHelp companies adopt AI responsibly and effectively.\n\n## What we do\n\n- Strategy & discovery\n- Prototyping & MVP\n- Production deployment\n- Enablement & training\n\n## Principles\n\n- Security & privacy first\n- Measurable ROI\n- Maintainable systems"
    }'::jsonb,
    2
  )
ON CONFLICT DO NOTHING;

-- Keep `pages` and `page_sections` identities deterministic
SELECT setval('pages_id_seq', (SELECT MAX(id) FROM pages), true);
SELECT setval('page_sections_id_seq', (SELECT MAX(id) FROM page_sections), true);

-- Set sequences to correct values
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles), true);
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories), true);
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags), true);
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services), true);
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts), true);
SELECT setval('job_posts_id_seq', (SELECT MAX(id) FROM job_posts), true);
