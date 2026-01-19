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
  (1, 'en', 'service', 'IT Solutions', 'it-solutions', 'Information Technology solutions and consulting', 1),
  (2, 'en', 'service', 'IoT Services', 'iot-services', 'Internet of Things implementation and integration', 2),
  (3, 'en', 'service', 'Automation', 'automation', 'Business process and industrial automation', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert categories for posts
INSERT INTO categories (id, locale, kind, name, slug, description, sort_order) VALUES 
  (4, 'en', 'post', 'Technology', 'technology', 'Tech articles and insights', 1),
  (5, 'en', 'post', 'IoT News', 'iot-news', 'Latest in Internet of Things', 2),
  (6, 'en', 'post', 'Tutorials', 'tutorials', 'How-to guides and best practices', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert tags
INSERT INTO tags (id, locale, name, slug) VALUES 
  (1, 'en', 'IoT', 'iot'),
  (2, 'en', 'Automation', 'automation'),
  (3, 'en', 'Cloud Computing', 'cloud-computing'),
  (4, 'en', 'Smart Systems', 'smart-systems'),
  (5, 'en', 'Industry 4.0', 'industry-4-0')
ON CONFLICT (locale, slug) DO NOTHING;

-- Insert sample services
INSERT INTO services (id, locale, title, slug, excerpt, content_md, status, published_at, sort_order, created_by) VALUES 
  (1, 'en', 'IoT System Integration', 'iot-system-integration', 
   'Connect and automate your devices with intelligent IoT solutions', 
   '## IoT System Integration\n\nWe design and implement comprehensive IoT ecosystems that connect your devices, sensors, and systems.\n\n### Key Features\n- Device connectivity and management\n- Real-time data collection and monitoring\n- Cloud integration\n- Scalable infrastructure',
   'published', NOW(), 1, 1),
  (2, 'en', 'Industrial Automation', 'industrial-automation',
   'Optimize production with smart automation systems',
   '## Industrial Automation\n\nTransform your manufacturing and operations with intelligent automation.\n\n### Capabilities\n- PLC programming\n- SCADA systems\n- Process optimization\n- Predictive maintenance',
   'published', NOW(), 2, 1),
  (3, 'en', 'IT Infrastructure Solutions', 'it-infrastructure-solutions',
   'Build reliable and scalable IT infrastructure for your business',
   '## IT Infrastructure Solutions\n\nEnterprise-grade IT infrastructure design, deployment, and management.\n\n### Services\n- Network design and implementation\n- Cloud migration and management\n- Server infrastructure\n- Security and compliance',
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
  (1, 'IoT Platform', 'Complete IoT platform tailored to your needs', 1),
  (1, 'Device Integration', 'Seamless integration with your existing devices', 2),
  (1, 'Dashboard & Analytics', 'Real-time monitoring and analytics dashboard', 3),
  (2, 'Automation System', 'Custom-designed automation solution', 1),
  (2, 'Control Systems', 'Advanced PLC and SCADA implementation', 2),
  (3, 'Infrastructure Design', 'Complete IT infrastructure architecture', 1),
  (3, 'Cloud Services', 'Cloud migration and management services', 2)
ON CONFLICT DO NOTHING;

-- Insert service process steps
INSERT INTO service_process_steps (service_id, title, description, sort_order) VALUES 
  (1, 'Discovery', 'Understanding your IoT requirements and use cases', 1),
  (1, 'Architecture Design', 'Designing the IoT system architecture', 2),
  (1, 'Implementation', 'Building and deploying the IoT solution', 3),
  (1, 'Testing', 'Comprehensive testing and quality assurance', 4),
  (1, 'Launch & Support', 'Deployment and ongoing support', 5),
  (2, 'Assessment', 'Evaluate your current processes and systems', 1),
  (2, 'Solution Design', 'Design automation strategy and architecture', 2),
  (2, 'Implementation', 'Install and configure automation systems', 3),
  (2, 'Training', 'Train your team on new systems', 4)
ON CONFLICT DO NOTHING;

-- Insert service FAQs
INSERT INTO service_faqs (service_id, question, answer, sort_order) VALUES 
  (1, 'What IoT protocols do you support?', 'We support MQTT, HTTP/REST, CoAP, and other industry-standard protocols for maximum compatibility.', 1),
  (1, 'How long does IoT implementation take?', 'Typical IoT projects take 6-12 weeks depending on scale and complexity.', 2),
  (1, 'Can you integrate with our existing systems?', 'Yes, we specialize in integrating IoT solutions with existing enterprise systems including ERP, CRM, and custom platforms.', 3),
  (2, 'What industries do you serve?', 'We serve manufacturing, logistics, agriculture, energy, and various other industries requiring automation.', 1),
  (2, 'Do you provide ongoing maintenance?', 'Yes, we offer comprehensive maintenance and support packages for all automation systems.', 2)
ON CONFLICT DO NOTHING;

-- Insert sample posts
INSERT INTO posts (id, locale, title, slug, excerpt, content_md, author_id, status, published_at, created_by) VALUES 
  (1, 'en', 'Introduction to Industrial IoT', 'introduction-to-industrial-iot',
   'A comprehensive guide to understanding Industrial Internet of Things',
   '## Introduction to Industrial IoT\n\nIndustrial IoT is transforming manufacturing and operations...\n\n### What is IIoT?\nIIoT connects industrial equipment and systems to enable data-driven decision making...',
   1, 'published', NOW(), 1),
  (2, 'en', 'Top 10 Automation Trends in 2026', 'top-10-automation-trends-2026',
   'Discover the latest trends shaping industrial automation',
   '## Top 10 Automation Trends in 2026\n\n1. Edge computing in manufacturing\n2. Collaborative robots becoming mainstream...',
   1, 'published', NOW(), 1),
  (3, 'en', 'Building Your First IoT Solution', 'building-your-first-iot-solution',
   'Step-by-step tutorial on creating an IoT system',
   '## Building Your First IoT Solution\n\nIn this tutorial, we will create a simple IoT monitoring system...\n\n### Prerequisites\n- Basic electronics knowledge\n- Understanding of networking',
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
  (1, 1),
  (2, 2),
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
  ('site_meta', '{"title": "KOOLA - IT, IoT & Automation Solutions", "description": "Leading provider of Information Technology, IoT, and Automation solutions for individuals and enterprises", "keywords": ["IT Solutions", "IoT", "Automation", "Smart Systems", "Industry 4.0"]}'),
  ('global_cta', '{"label": "Get Started", "link": "/contact"}'),
  ('social_links', '{"twitter": "https://twitter.com/koola", "linkedin": "https://linkedin.com/company/koola", "github": "https://github.com/koola"}'),
  ('contact_info', '{"email": "hello@koola.com", "phone": "+1 (555) 123-4567", "address": "123 Tech Street, Innovation City, IC 12345"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert sample job posts
INSERT INTO job_posts (id, locale, title, slug, department, location, employment_type, level, summary, responsibilities_md, requirements_md, status, published_at, created_by) VALUES 
  (1, 'en', 'Senior IoT Engineer', 'senior-iot-engineer', 'Engineering', 'Remote', 'Full-time', 'Senior',
   'Join our team to build cutting-edge IoT solutions',
   '## Responsibilities\n- Design and implement IoT systems\n- Collaborate with cross-functional teams\n- Optimize system performance and reliability',
   '## Requirements\n- 5+ years IoT experience\n- Strong knowledge of IoT protocols (MQTT, CoAP)\n- Experience with embedded systems\n- Strong communication skills',
   'published', NOW(), 1),
  (2, 'en', 'Automation Engineer', 'automation-engineer', 'Engineering', 'Hybrid', 'Full-time', 'Mid-level',
   'Drive industrial automation projects',
   '## Responsibilities\n- Design automation solutions\n- PLC/SCADA programming\n- Work with clients on-site',
   '## Requirements\n- 3+ years automation experience\n- PLC programming skills\n- Understanding of industrial processes\n- Strong analytical skills',
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
    'About KOOLA — IT, IoT & Automation Solutions',
    'Learn more about KOOLA, our mission to deliver innovative IT, IoT, and Automation solutions for businesses and individuals.',
    'published',
    1
  ),
  (
    2,
    'vi',
    'about',
    'Về KOOLA',
    'Về KOOLA — Giải Pháp IT, IoT & Tự Động Hóa',
    'Tìm hiểu về KOOLA, sứ mệnh của chúng tôi trong việc cung cấp các giải pháp IT, IoT và Tự động hóa sáng tạo cho doanh nghiệp và cá nhân.',
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
      "headline": "We deliver innovative IT, IoT, and Automation solutions.",
      "subheadline": "KOOLA partners with individuals and enterprises to design, build, and deploy technology solutions that drive efficiency and innovation.",
      "primary_cta": { "label": "Talk to us", "href": "/contact" },
      "secondary_cta": { "label": "See services", "href": "/services" }
    }'::jsonb,
    1
  ),
  (
    1,
    'content',
    '{
      "content_md": "## Our mission\n\nHelp businesses and individuals adopt modern technology solutions effectively.\n\n## What we do\n\n- IT infrastructure and consulting\n- IoT system integration\n- Industrial and business automation\n- Digital transformation\n\n## Principles\n\n- Reliability and quality first\n- Measurable results\n- Scalable and maintainable solutions"
    }'::jsonb,
    2
  ),
  (
    1,
    'about_intro',
    '{
      "label": "WHO WE ARE",
      "headline": "Pioneering the Future of Connected Intelligence",
      "paragraphs": [
        "KOOLA is where innovation meets execution. For over a decade, we have been transforming businesses through intelligent automation, seamless IoT integration, and robust IT infrastructure. We do not just implement technology—we architect digital ecosystems that evolve with your business.",
        "Born from the vision of forward-thinking engineers and entrepreneurs, KOOLA was founded on a simple yet powerful principle: technology should empower, not complicate. Today, we partner with forward-looking organizations across industries to turn complex challenges into competitive advantages."
      ],
      "image": {
        "src": "/home/hero-placeholder.svg",
        "alt": "KOOLA innovation team"
      }
    }'::jsonb,
    10
  ),
  (
    1,
    'about_story',
    '{
      "label": "OUR JOURNEY",
      "paragraphs": [
        "What started as a small team of engineers solving connectivity problems has grown into a full-spectrum technology solutions provider. We have witnessed firsthand how the convergence of IT, IoT, and automation can unlock unprecedented efficiency and innovation.",
        "Every project we undertake is guided by three core pillars: precision in execution, transparency in communication, and obsession with measurable outcomes. Our clients do not just get solutions—they gain a technology partner invested in their long-term success."
      ],
      "image": {
        "src": "/home/hero-placeholder.svg",
        "alt": "KOOLA growth story"
      }
    }'::jsonb,
    20
  ),
  (
    1,
    'about_milestone',
    '{
      "label": "Our Impact",
      "headline": "Over 1,500 successful deployments across 15 countries, serving enterprises from startups to Fortune 500 companies",
      "iconAlt": "Global excellence badge"
    }'::jsonb,
    30
  ),
  (
    1,
    'about_team_roles',
    '{
      "title": "Our multidisciplinary team of IoT architects, automation specialists, full-stack developers, and systems engineers collaborate to deliver end-to-end solutions that drive real business transformation",
      "intro": "",
      "ctaLabel": "Join our team",
      "ctaHref": "/careers",
      "roles": [
        { "role": "IoT\nArchitects", "image": "/home/hero-placeholder.svg" },
        { "role": "Automation\nEngineers", "image": "/home/hero-placeholder.svg" },
        { "role": "Systems\nIntegrators", "image": "/home/hero-placeholder.svg" },
        { "role": "DevOps\nSpecialists", "image": "/home/hero-placeholder.svg" },
        { "role": "Solution\nConsultants", "image": "/home/hero-placeholder.svg" }
      ]
    }'::jsonb,
    40
  ),
  (
    1,
    'about_trusted',
    '{
      "title": "Trusted by industry leaders from manufacturing giants to innovative tech startups—including global brands like Microsoft, Google, and Sony",
      "subtitle": "",
      "ctaLabel": "View case studies",
      "ctaHref": "/services",
      "logos": ["microsoft", "google", "slack", "lg", "sony"]
    }'::jsonb,
    50
  ),
  (
    1,
    'about_testimonials',
    '{
      "title": "",
      "subtitle": "",
      "helper": "",
      "items": [
        { "stars": 5, "quote": "KOOLA transformed our manufacturing floor with an IoT solution that reduced downtime by 40% and gave us real-time visibility we never had before. Their team understood our industry challenges from day one.", "name": "Michael Chen\nOperations Director, Industrial Corp" },
        { "stars": 5, "quote": "The automation system KOOLA designed for our warehouse operations exceeded all expectations. ROI was achieved in under 8 months, and the system scales beautifully as we grow.", "name": "Sarah Martinez\nCOO, LogiTech Solutions" },
        { "stars": 5, "quote": "Working with KOOLA felt like having an extension of our own team. Their IT infrastructure design was thorough, their execution flawless, and their support continues to be exceptional.", "name": "David Thompson\nCTO, FinanceHub" },
        { "stars": 5, "quote": "From concept to deployment, KOOLA delivered a smart building solution that is both innovative and practical. The energy savings alone justified the investment, but the occupant experience improvements are what truly set it apart.", "name": "Jennifer Lee\nFacilities Manager, GreenTech Campus" }
      ]
    }'::jsonb,
    60
  ),
  (
    1,
    'about_timeline',
    '{
      "label": "Our Evolution",
      "items": [
        { "year": "2015", "title": "", "description": "Founded by a team of engineers passionate about bridging the gap between hardware and software. Completed our first industrial IoT deployment for a manufacturing client." },
        { "year": "2019", "title": "", "description": "Expanded to full-spectrum automation services. Launched our proprietary IoT platform that now powers solutions across 8 countries. Team grew to 50+ specialists." },
        { "year": "2024", "title": "", "description": "Reached 1,500+ successful deployments milestone. Opened innovation lab focused on edge computing and AI-enhanced automation. Recognized as Industry 4.0 solutions leader in Southeast Asia." }
      ]
    }'::jsonb,
    70
  ),
  (
    1,
    'about_performance',
    '{
      "description": "Our commitment to excellence has earned us an industry-leading client satisfaction rate of 96%, with an average project delivery time 30% faster than industry standards—all while maintaining zero-compromise quality.",
      "percent": 96
    }'::jsonb,
    80
  ),
  (
    1,
    'about_cta',
    '{
      "title": "Ready to Transform Your Operations?",
      "subtitle": "Whether you are looking to modernize your IT infrastructure, implement intelligent IoT solutions, or automate critical business processes, KOOLA brings the expertise, technology, and partnership approach to make it happen. Let us turn your digital transformation vision into reality.",
      "ctaLabel": "Start your project",
      "ctaHref": "/contact",
      "image": "/home/hero-placeholder.svg"
    }'::jsonb,
    90
  ),
  -- Vietnamese page sections for page_id = 2
  (
    2,
    'hero',
    '{
      "headline": "Chúng tôi cung cấp các giải pháp IT, IoT và Tự động hóa tiên tiến.",
      "subheadline": "KOOLA hợp tác cùng cá nhân và doanh nghiệp để thiết kế, xây dựng và triển khai các giải pháp công nghệ thúc đẩy hiệu quả và đổi mới.",
      "primary_cta": { "label": "Liên hệ ngay", "href": "/contact" },
      "secondary_cta": { "label": "Xem dịch vụ", "href": "/services" }
    }'::jsonb,
    1
  ),
  (
    2,
    'content',
    '{
      "content_md": "## Sứ mệnh của chúng tôi\n\nGiúp doanh nghiệp và cá nhân áp dụng các giải pháp công nghệ hiện đại một cách hiệu quả.\n\n## Chúng tôi làm gì\n\n- Tư vấn và triển khai hạ tầng IT\n- Tích hợp hệ thống IoT\n- Tự động hóa công nghiệp và doanh nghiệp\n- Chuyển đổi số toàn diện\n\n## Nguyên tắc hoạt động\n\n- Ưu tiên độ tin cậy và chất lượng\n- Kết quả đo lường được\n- Giải pháp có khả năng mở rộng và bảo trì"
    }'::jsonb,
    2
  ),
  (
    2,
    'about_intro',
    '{
      "label": "CHÚNG TÔI LÀ AI",
      "headline": "Tiên phong kiến tạo tương lai kết nối thông minh",
      "paragraphs": [
        "KOOLA là nơi sự đổi mới gặp gỡ khả năng thực thi. Hơn một thập kỷ qua, chúng tôi đã chuyển đổi doanh nghiệp thông qua tự động hóa thông minh, tích hợp IoT liền mạch và hạ tầng IT vững chắc. Chúng tôi không chỉ triển khai công nghệ—chúng tôi kiến trúc các hệ sinh thái số phát triển cùng doanh nghiệp của bạn.",
        "Sinh ra từ tầm nhìn của các kỹ sư và doanh nhân có tư duy tiến bộ, KOOLA được thành lập dựa trên nguyên tắc đơn giản nhưng mạnh mẽ: công nghệ nên trao quyền, không phức tạp hóa. Ngày nay, chúng tôi hợp tác với các tổ chức có tầm nhìn xa trông rộng để biến những thách thức phức tạp thành lợi thế cạnh tranh."
      ],
      "image": {
        "src": "/home/hero-placeholder.svg",
        "alt": "Đội ngũ đổi mới KOOLA"
      }
    }'::jsonb,
    10
  ),
  (
    2,
    'about_story',
    '{
      "label": "HÀNH TRÌNH CỦA CHÚNG TÔI",
      "paragraphs": [
        "Bắt đầu từ một nhóm nhỏ các kỹ sư giải quyết vấn đề kết nối, chúng tôi đã phát triển thành nhà cung cấp giải pháp công nghệ toàn diện. Chúng tôi đã chứng kiến tận mắt sự hội tụ của IT, IoT và tự động hóa có thể mở khóa hiệu quả và đổi mới chưa từng có.",
        "Mỗi dự án chúng tôi thực hiện đều được dẫn dắt bởi ba trụ cột cốt lõi: chính xác trong thực thi, minh bạch trong giao tiếp, và tập trung vào kết quả đo lường được. Khách hàng không chỉ nhận được giải pháp—họ có được một đối tác công nghệ cam kết với thành công lâu dài của họ."
      ],
      "image": {
        "src": "/home/hero-placeholder.svg",
        "alt": "Câu chuyện phát triển KOOLA"
      }
    }'::jsonb,
    20
  ),
  (
    2,
    'about_milestone',
    '{
      "label": "Tác động của chúng tôi",
      "headline": "Hơn 1.500 triển khai thành công trên 15 quốc gia, phục vụ doanh nghiệp từ startup đến Fortune 500",
      "iconAlt": "Huy hiệu xuất sắc toàn cầu"
    }'::jsonb,
    30
  ),
  (
    2,
    'about_team_roles',
    '{
      "title": "Đội ngũ đa ngành của chúng tôi bao gồm kiến trúc sư IoT, chuyên gia tự động hóa, full-stack developer và kỹ sư hệ thống cùng hợp tác để cung cấp giải pháp end-to-end thúc đẩy chuyển đổi doanh nghiệp thực sự",
      "intro": "",
      "ctaLabel": "Tham gia đội ngũ",
      "ctaHref": "/careers",
      "roles": [
        { "role": "Kiến trúc sư\nIoT", "image": "/home/hero-placeholder.svg" },
        { "role": "Kỹ sư\nTự động hóa", "image": "/home/hero-placeholder.svg" },
        { "role": "Chuyên gia\nTích hợp", "image": "/home/hero-placeholder.svg" },
        { "role": "Chuyên viên\nDevOps", "image": "/home/hero-placeholder.svg" },
        { "role": "Chuyên gia\nGiải pháp", "image": "/home/hero-placeholder.svg" }
      ]
    }'::jsonb,
    40
  ),
  (
    2,
    'about_trusted',
    '{
      "title": "Được tin tưởng bởi các công ty hàng đầu từ những gã khổng lồ sản xuất đến startup công nghệ đổi mới—bao gồm các thương hiệu toàn cầu như Microsoft, Google và Sony",
      "subtitle": "",
      "ctaLabel": "Xem case study",
      "ctaHref": "/services",
      "logos": ["microsoft", "google", "slack", "lg", "sony"]
    }'::jsonb,
    50
  ),
  (
    2,
    'about_testimonials',
    '{
      "title": "",
      "subtitle": "",
      "helper": "",
      "items": [
        { "stars": 5, "quote": "KOOLA đã chuyển đổi xưởng sản xuất của chúng tôi với giải pháp IoT giảm thời gian chết 40% và mang lại khả năng hiển thị thời gian thực mà chúng tôi chưa từng có. Đội ngũ của họ hiểu rõ thách thức ngành từ ngày đầu tiên.", "name": "Michael Chen\nGiám đốc Vận hành, Industrial Corp" },
        { "stars": 5, "quote": "Hệ thống tự động hóa KOOLA thiết kế cho hoạt động kho bãi của chúng tôi đã vượt quá mọi kỳ vọng. ROI đạt được trong vòng chưa đầy 8 tháng, và hệ thống mở rộng hoàn hảo khi chúng tôi phát triển.", "name": "Sarah Martinez\nCOO, LogiTech Solutions" },
        { "stars": 5, "quote": "Làm việc với KOOLA giống như có một phần mở rộng của đội ngũ riêng. Thiết kế hạ tầng IT của họ chu đáo, thực thi hoàn hảo, và hỗ trợ luôn xuất sắc.", "name": "David Thompson\nCTO, FinanceHub" },
        { "stars": 5, "quote": "Từ ý tưởng đến triển khai, KOOLA cung cấp giải pháp tòa nhà thông minh vừa sáng tạo vừa thực tế. Chỉ riêng tiết kiệm năng lượng đã biện minh cho khoản đầu tư, nhưng cải thiện trải nghiệm người dùng mới thực sự tạo nên sự khác biệt.", "name": "Jennifer Lee\nQuản lý Cơ sở vật chất, GreenTech Campus" }
      ]
    }'::jsonb,
    60
  ),
  (
    2,
    'about_timeline',
    '{
      "label": "Quá trình phát triển",
      "items": [
        { "year": "2015", "title": "", "description": "Thành lập bởi đội ngũ kỹ sư đam mê kết nối phần cứng và phần mềm. Hoàn thành triển khai IoT công nghiệp đầu tiên cho khách hàng sản xuất." },
        { "year": "2019", "title": "", "description": "Mở rộng sang dịch vụ tự động hóa toàn diện. Ra mắt nền tảng IoT độc quyền hiện cung cấp giải pháp tại 8 quốc gia. Đội ngũ tăng lên hơn 50 chuyên gia." },
        { "year": "2024", "title": "", "description": "Đạt mốc 1.500+ triển khai thành công. Khai trương phòng lab đổi mới tập trung vào edge computing và tự động hóa tích hợp AI. Được công nhận là công ty dẫn đầu giải pháp Công nghiệp 4.0 tại Đông Nam Á." }
      ]
    }'::jsonb,
    70
  ),
  (
    2,
    'about_performance',
    '{
      "description": "Cam kết về sự xuất sắc đã mang lại cho chúng tôi tỷ lệ hài lòng khách hàng dẫn đầu ngành 96%, với thời gian giao dự án trung bình nhanh hơn 30% so với tiêu chuẩn ngành—tất cả vẫn duy trì chất lượng không thỏa hiệp.",
      "percent": 96
    }'::jsonb,
    80
  ),
  (
    2,
    'about_cta',
    '{
      "title": "Sẵn sàng chuyển đổi hoạt động của bạn?",
      "subtitle": "Dù bạn đang tìm cách hiện đại hóa hạ tầng IT, triển khai giải pháp IoT thông minh, hay tự động hóa quy trình kinh doanh quan trọng, KOOLA mang đến chuyên môn, công nghệ và phương pháp đối tác để biến điều đó thành hiện thực. Hãy để chúng tôi biến tầm nhìn chuyển đổi số của bạn thành thực tế.",
      "ctaLabel": "Bắt đầu dự án",
      "ctaHref": "/contact",
      "image": "/home/hero-placeholder.svg"
    }'::jsonb,
    90
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
