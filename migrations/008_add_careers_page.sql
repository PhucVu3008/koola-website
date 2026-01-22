-- Migration 008: Add Careers page and seed data
-- Creates careers page entries and sample job posts with slug_group support

BEGIN;

-- ============================================================================
-- 1) Add slug_group to job_posts table (for i18n mapping)
-- ============================================================================
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS slug_group VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_job_posts_slug_group ON job_posts(slug_group);

COMMENT ON COLUMN job_posts.slug_group IS 'Groups the same job across different locales. Use English slug as identifier.';

-- ============================================================================
-- 2) Insert Careers page entries (EN + VI)
-- ============================================================================
INSERT INTO pages (locale, slug, title, seo_description, status, created_at, updated_at)
VALUES
  ('en', 'careers', 'Careers', 'Join the Koola team. Explore career opportunities in software development, IoT, and automation.', 'published', NOW(), NOW()),
  ('vi', 'careers', 'Tuyển dụng', 'Tham gia đội ngũ Koola. Khám phá cơ hội nghề nghiệp trong phát triển phần mềm, IoT và tự động hóa.', 'published', NOW(), NOW())
ON CONFLICT (locale, slug) DO NOTHING;

-- ============================================================================
-- 3) Seed page sections for Careers (EN)
-- ============================================================================
DO $$
DECLARE
  v_page_id_en BIGINT;
BEGIN
  SELECT id INTO v_page_id_en FROM pages WHERE slug = 'careers' AND locale = 'en';

  -- Hero Section
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_en,
    'careers_hero',
    1,
    jsonb_build_object(
      'imageUrl', '/careers/hero-bg.jpg',
      'imageAlt', 'Koola team collaboration'
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;

  -- Pride Section (Testimonial Slider)
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_en,
    'careers_pride',
    2,
    jsonb_build_object(
      'slides', jsonb_build_array(
        jsonb_build_object(
          'quote', 'Koola provides an excellent environment for long-term development, as it highly values and encourages a culture of mutual learning and sharing.',
          'authorName', 'Annie Hu',
          'authorRole', 'Senior QA'
        ),
        jsonb_build_object(
          'quote', 'Working at Koola has been an incredible journey. The team culture fosters innovation and continuous growth.',
          'authorName', 'John Smith',
          'authorRole', 'Lead Developer'
        ),
        jsonb_build_object(
          'quote', 'The collaborative environment at Koola empowers us to tackle challenging projects with cutting-edge technology.',
          'authorName', 'Sarah Chen',
          'authorRole', 'IoT Engineer'
        )
      )
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;

  -- Culture Section
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_en,
    'careers_culture',
    3,
    jsonb_build_object(
      'imageUrl', '/careers/culture.jpg',
      'imageAlt', 'Koola team collaboration',
      'bullets', jsonb_build_array(
        jsonb_build_object(
          'title', 'GLUE: Giving little unexpected extra',
          'body', 'Deliver WOW to internal and external customers'
        ),
        jsonb_build_object(
          'title', 'Go 1% beyond the expectation',
          'body', 'See the good in people & situations, truly. Build a positive team and family spirit.'
        ),
        jsonb_build_object(
          'title', 'Think bold, think fast!',
          'body', 'We view change as well as continuous learning and adaption'
        ),
        jsonb_build_object(
          'title', 'Sharing is caring',
          'body', 'We are selfless and helping others to be their best'
        )
      )
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;
END $$;

-- ============================================================================
-- 4) Seed page sections for Careers (VI)
-- ============================================================================
DO $$
DECLARE
  v_page_id_vi BIGINT;
BEGIN
  SELECT id INTO v_page_id_vi FROM pages WHERE slug = 'careers' AND locale = 'vi';

  -- Hero Section
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_vi,
    'careers_hero',
    1,
    jsonb_build_object(
      'imageUrl', '/careers/hero-bg.jpg',
      'imageAlt', 'Đội ngũ Koola cộng tác'
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;

  -- Pride Section (Testimonial Slider)
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_vi,
    'careers_pride',
    2,
    jsonb_build_object(
      'slides', jsonb_build_array(
        jsonb_build_object(
          'quote', 'Koola cung cấp môi trường tuyệt vời cho sự phát triển lâu dài, vì nó đánh giá cao và khuyến khích văn hóa học hỏi và chia sẻ lẫn nhau.',
          'authorName', 'Annie Hu',
          'authorRole', 'QA Cao cấp'
        ),
        jsonb_build_object(
          'quote', 'Làm việc tại Koola là một hành trình tuyệt vời. Văn hóa đội ngũ thúc đẩy sự đổi mới và tăng trưởng liên tục.',
          'authorName', 'John Smith',
          'authorRole', 'Trưởng nhóm phát triển'
        ),
        jsonb_build_object(
          'quote', 'Môi trường cộng tác tại Koola trao quyền cho chúng tôi giải quyết các dự án thách thức với công nghệ tiên tiến.',
          'authorName', 'Sarah Chen',
          'authorRole', 'Kỹ sư IoT'
        )
      )
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;

  -- Culture Section
  INSERT INTO page_sections (page_id, section_key, sort_order, payload)
  VALUES (
    v_page_id_vi,
    'careers_culture',
    3,
    jsonb_build_object(
      'imageUrl', '/careers/culture.jpg',
      'imageAlt', 'Đội ngũ Koola cộng tác',
      'bullets', jsonb_build_array(
        jsonb_build_object(
          'title', 'GLUE: Mang đến điều bất ngờ nhỏ',
          'body', 'Mang lại trải nghiệm WOW cho khách hàng nội bộ và bên ngoài'
        ),
        jsonb_build_object(
          'title', 'Vượt trội 1% so với kỳ vọng',
          'body', 'Nhìn thấy điều tốt đẹp ở mọi người và tình huống. Xây dựng tinh thần đội ngũ và gia đình tích cực.'
        ),
        jsonb_build_object(
          'title', 'Suy nghĩ táo bạo, hành động nhanh!',
          'body', 'Chúng tôi xem sự thay đổi như học hỏi liên tục và thích nghi'
        ),
        jsonb_build_object(
          'title', 'Chia sẻ là quan tâm',
          'body', 'Chúng tôi không ích kỷ và giúp đỡ người khác trở nên tốt nhất'
        )
      )
    )
  ) ON CONFLICT (page_id, section_key) DO NOTHING;
END $$;

-- ============================================================================
-- 5) Seed sample job posts (EN + VI with slug_group)
-- ============================================================================

-- Job 1: NodeJS Developer - Senior (EN)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'en',
  'NodeJS Developer - Senior',
  'nodejs-developer-senior',
  'nodejs-developer-senior',
  'Engineering',
  'Location: Lao Dong - Viet Nam',
  'Full-time',
  'Senior',
  'Join our team as a Senior NodeJS Developer to build scalable backend systems.',
  E'- Design, document, and implement technical solutions for systems of various types and sizes, ensuring integration, maintenance, and migration considerations\n- Provide comprehensive software architecture design\n- Manage code quality and conduct code reviews to ensure standards\n- Define guidelines, review alternative technical approaches, and conduct technical evaluations\n- Collaborate with product managers and lead engineers to recommend solutions based on project roadmap\n- Work hands-on as a technical leader/expert architect in projects on a daily basis\n- Continuously stay informed on emerging technologies and develop new project ideas when required by the project roadmap\n- Contribute to presales activities, including preparing technical proposals and providing estimations\n- Support recruitment efforts within the company',
  E'- 7+ years of software development experience with C#, .NET, ASP.NET Core, Web API, Entity Framework, SQL Server\n- Solid experience as Software Architecture, SQL or principles, clean code.\n- Experience with Azure or AWS, Microservices, Configuration, DevOps, Performance and Security\n- Familiarity with React, Angular, or Vue\n- Experience in working and coordinating with global teams\n- Excellent verbal and written communication and knowledge and expertise of SDLC\n- Having experience working with all tasks in the SDLC, such as Github Copilot or similar, is a plus',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 1: NodeJS Developer - Senior (VI)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'vi',
  'Lập trình viên NodeJS - Cấp cao',
  'lap-trinh-vien-nodejs-cap-cao',
  'nodejs-developer-senior',
  'Kỹ thuật',
  'Địa điểm: Lao Động - Việt Nam',
  'Toàn thời gian',
  'Cao cấp',
  'Tham gia đội ngũ của chúng tôi với vai trò Lập trình viên NodeJS cấp cao để xây dựng các hệ thống backend có khả năng mở rộng.',
  E'- Thiết kế, tài liệu hóa và triển khai các giải pháp kỹ thuật cho các hệ thống với nhiều loại và quy mô khác nhau\n- Cung cấp thiết kế kiến trúc phần mềm toàn diện\n- Quản lý chất lượng code và thực hiện review code để đảm bảo tiêu chuẩn\n- Xác định hướng dẫn, đánh giá các phương pháp kỹ thuật thay thế\n- Cộng tác với quản lý sản phẩm và kỹ sư trưởng để đề xuất giải pháp\n- Làm việc thực tế như một leader/expert architect hàng ngày\n- Liên tục cập nhật công nghệ mới và phát triển ý tưởng dự án mới\n- Đóng góp vào các hoạt động presales\n- Hỗ trợ nỗ lực tuyển dụng trong công ty',
  E'- 7+ năm kinh nghiệm phát triển phần mềm với C#, .NET, ASP.NET Core\n- Kinh nghiệm vững chắc về Software Architecture, SQL, clean code\n- Kinh nghiệm với Azure hoặc AWS, Microservices, DevOps\n- Quen thuộc với React, Angular, hoặc Vue\n- Kinh nghiệm làm việc và phối hợp với đội ngũ toàn cầu\n- Kỹ năng giao tiếp xuất sắc và kiến thức chuyên môn về SDLC\n- Có kinh nghiệm với Github Copilot là một lợi thế',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 2: Python Developer - Junior (EN)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'en',
  'Python Developer - Junior',
  'python-developer-junior',
  'python-developer-junior',
  'Engineering',
  'Location: Lao Dong - Viet Nam',
  'Full-time',
  'Junior',
  'Join our team to work on exciting Python projects and grow your skills.',
  E'- Develop and maintain Python applications\n- Write clean, maintainable code\n- Collaborate with senior developers\n- Participate in code reviews\n- Learn and apply best practices',
  E'- 1-2 years of Python experience\n- Basic understanding of web frameworks (Django/Flask)\n- Familiarity with SQL databases\n- Good problem-solving skills\n- Eagerness to learn',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 2: Python Developer - Junior (VI)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'vi',
  'Lập trình viên Python - Sơ cấp',
  'lap-trinh-vien-python-so-cap',
  'python-developer-junior',
  'Kỹ thuật',
  'Địa điểm: Lao Động - Việt Nam',
  'Toàn thời gian',
  'Sơ cấp',
  'Tham gia đội ngũ để làm việc trên các dự án Python thú vị và phát triển kỹ năng.',
  E'- Phát triển và bảo trì ứng dụng Python\n- Viết code sạch, dễ bảo trì\n- Cộng tác với developer cấp cao\n- Tham gia review code\n- Học hỏi và áp dụng best practices',
  E'- 1-2 năm kinh nghiệm Python\n- Hiểu biết cơ bản về web framework (Django/Flask)\n- Quen thuộc với SQL database\n- Kỹ năng giải quyết vấn đề tốt\n- Háo hức học hỏi',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 3: Data Scientist Lead (EN)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'en',
  'Data Scientist Lead',
  'data-scientist-lead',
  'data-scientist-lead',
  'Data Science',
  'Location: Lao Dong - Viet Nam',
  'Full-time',
  'Lead',
  'Lead data science initiatives and build ML models for business impact.',
  E'- Lead data science team and projects\n- Design and implement ML models\n- Collaborate with business stakeholders\n- Mentor junior data scientists\n- Drive data-driven decision making',
  E'- 5+ years in data science/ML\n- Strong Python, R, SQL skills\n- Experience with ML frameworks (TensorFlow, PyTorch)\n- Leadership experience\n- Strong communication skills',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 3: Data Scientist Lead (VI)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'vi',
  'Trưởng nhóm Khoa học dữ liệu',
  'truong-nhom-khoa-hoc-du-lieu',
  'data-scientist-lead',
  'Khoa học dữ liệu',
  'Địa điểm: Lao Động - Việt Nam',
  'Toàn thời gian',
  'Trưởng nhóm',
  'Dẫn dắt các sáng kiến khoa học dữ liệu và xây dựng mô hình ML cho tác động kinh doanh.',
  E'- Dẫn dắt đội ngũ và dự án khoa học dữ liệu\n- Thiết kế và triển khai mô hình ML\n- Cộng tác với các bên liên quan kinh doanh\n- Hướng dẫn data scientist cấp thấp\n- Thúc đẩy ra quyết định dựa trên dữ liệu',
  E'- 5+ năm trong data science/ML\n- Kỹ năng Python, R, SQL mạnh\n- Kinh nghiệm với ML framework (TensorFlow, PyTorch)\n- Kinh nghiệm lãnh đạo\n- Kỹ năng giao tiếp tốt',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 4: Solution Architect - .NET (EN)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'en',
  'Solution Architect - .NET',
  'solution-architect-dotnet',
  'solution-architect-dotnet',
  'Engineering',
  'Location: Lao Dong - Viet Nam',
  'Full-time',
  'Master',
  'Design enterprise solutions and lead technical teams.',
  E'- Design scalable enterprise architectures\n- Lead technical decision making\n- Mentor development teams\n- Ensure best practices\n- Collaborate with stakeholders',
  E'- 10+ years .NET experience\n- Deep architecture knowledge\n- Cloud expertise (Azure/AWS)\n- Strong leadership skills\n- Excellent communication',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 4: Solution Architect - .NET (VI)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'vi',
  'Kiến trúc sư giải pháp - .NET',
  'kien-truc-su-giai-phap-dotnet',
  'solution-architect-dotnet',
  'Kỹ thuật',
  'Địa điểm: Lao Động - Việt Nam',
  'Toàn thời gian',
  'Chuyên gia',
  'Thiết kế giải pháp doanh nghiệp và dẫn dắt đội ngũ kỹ thuật.',
  E'- Thiết kế kiến trúc doanh nghiệp có khả năng mở rộng\n- Dẫn dắt quyết định kỹ thuật\n- Hướng dẫn đội ngũ phát triển\n- Đảm bảo best practices\n- Cộng tác với các bên liên quan',
  E'- 10+ năm kinh nghiệm .NET\n- Kiến thức kiến trúc sâu rộng\n- Chuyên môn Cloud (Azure/AWS)\n- Kỹ năng lãnh đạo mạnh\n- Giao tiếp xuất sắc',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 5: AI Engineer - Master (EN)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'en',
  'AI Engineer - Master',
  'ai-engineer-master',
  'ai-engineer-master',
  'AI/ML',
  'Location: Lao Dong - Viet Nam',
  'Full-time',
  'Master',
  'Build cutting-edge AI solutions and lead AI initiatives.',
  E'- Design and implement AI systems\n- Lead AI research and development\n- Mentor AI team members\n- Stay updated with latest AI trends\n- Collaborate with product teams',
  E'- Master''s degree in AI/ML or related field\n- 8+ years in AI/ML engineering\n- Deep learning expertise\n- Production ML experience\n- Strong Python skills',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

-- Job 5: AI Engineer - Master (VI)
INSERT INTO job_posts (
  locale, title, slug, slug_group, department, location, employment_type, level,
  summary, responsibilities_md, requirements_md, status, published_at, created_at, updated_at
)
VALUES (
  'vi',
  'Kỹ sư AI - Chuyên gia',
  'ky-su-ai-chuyen-gia',
  'ai-engineer-master',
  'AI/ML',
  'Địa điểm: Lao Động - Việt Nam',
  'Toàn thời gian',
  'Chuyên gia',
  'Xây dựng giải pháp AI tiên tiến và dẫn dắt các sáng kiến AI.',
  E'- Thiết kế và triển khai hệ thống AI\n- Dẫn dắt nghiên cứu và phát triển AI\n- Hướng dẫn thành viên đội AI\n- Cập nhật xu hướng AI mới nhất\n- Cộng tác với đội sản phẩm',
  E'- Bằng thạc sĩ AI/ML hoặc lĩnh vực liên quan\n- 8+ năm trong kỹ thuật AI/ML\n- Chuyên môn deep learning\n- Kinh nghiệm ML production\n- Kỹ năng Python mạnh',
  'published',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (locale, slug) DO NOTHING;

COMMIT;
