-- Migration: Update About page content for KOOLA as a newly founded company (2026)
-- Replaces: about_milestone → about_mission_values, about_testimonials → about_process
-- Updates: all section content to reflect startup identity
-- Date: 2026-03-12

-- ═══════════════════════════════════════════════════════════════
-- ENGLISH (page slug='about', locale='en')
-- ═══════════════════════════════════════════════════════════════

-- Update about_intro
UPDATE page_sections SET payload = '{
  "label": "WHO WE ARE",
  "headline": "Technology That Works for Your Business",
  "paragraphs": [
    "KOOLA is a technology company founded in 2026 with a clear mission: simplify and modernize business operations through smart IT solutions. We believe technology should remove complexity, not add it.",
    "From IT infrastructure and cloud solutions to process automation and digital transformation, we partner with businesses ready to operate smarter, faster, and more efficiently."
  ],
  "image": {
    "src": "/images/about/intro.jpg",
    "alt": "KOOLA team at work"
  }
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_intro';

-- Update about_story
UPDATE page_sections SET payload = '{
  "label": "OUR STORY",
  "paragraphs": [
    "KOOLA was born from a simple observation: too many businesses struggle with outdated systems and disconnected tools that slow them down. We saw an opportunity to bridge the gap between what technology can do and what businesses actually need.",
    "Our founding team brings together expertise in systems engineering, cloud architecture, and business process optimization. We started KOOLA to be the technology partner we wished existed — one that listens first, delivers practical solutions, and stays with you for the long run."
  ],
  "image": {
    "src": "/images/about/story.jpg",
    "alt": "KOOLA founding story"
  }
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_story';

-- Replace about_milestone → about_mission_values
UPDATE page_sections SET section_key = 'about_mission_values', payload = '{
  "title": "Our Mission & Core Values",
  "subtitle": "The principles that guide everything we do",
  "values": [
    { "icon": "lightbulb", "title": "Innovation", "description": "We stay ahead of technology trends to bring you solutions that are modern, scalable, and future-ready." },
    { "icon": "shield", "title": "Quality", "description": "Every solution we deliver is built to last — thoroughly tested, well-documented, and production-grade from day one." },
    { "icon": "handshake", "title": "Partnership", "description": "We do not just deliver projects. We build long-term relationships and grow alongside your business." },
    { "icon": "eye", "title": "Transparency", "description": "Clear communication, honest timelines, and no hidden costs. You always know where your project stands." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_milestone';

-- Update about_team_roles
UPDATE page_sections SET payload = '{
  "title": "A focused team of engineers and consultants dedicated to delivering real results for your business",
  "intro": "",
  "ctaLabel": "Join our team",
  "ctaHref": "/careers",
  "roles": [
    { "role": "Cloud\nArchitects", "image": "/home/hero-placeholder.svg" },
    { "role": "Systems\nEngineers", "image": "/home/hero-placeholder.svg" },
    { "role": "DevOps\nSpecialists", "image": "/home/hero-placeholder.svg" },
    { "role": "Solution\nConsultants", "image": "/home/hero-placeholder.svg" },
    { "role": "Automation\nEngineers", "image": "/home/hero-placeholder.svg" }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_team_roles';

-- Replace about_testimonials → about_process
UPDATE page_sections SET section_key = 'about_process', payload = '{
  "title": "How We Work",
  "subtitle": "A structured approach that delivers results on time, every time",
  "steps": [
    { "step": 1, "title": "Consult", "description": "We start by understanding your business, challenges, and goals. No assumptions — just deep listening and thorough analysis." },
    { "step": 2, "title": "Design", "description": "Our team architects a tailored solution with clear scope, timeline, and deliverables. You approve every detail before we build." },
    { "step": 3, "title": "Implement", "description": "We build and deploy with precision — following best practices, rigorous testing, and transparent progress updates throughout." },
    { "step": 4, "title": "Support", "description": "Launch is just the beginning. We provide ongoing maintenance, monitoring, and optimization to keep your systems running at peak performance." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_testimonials';

-- Update about_trusted → remove (no longer needed for startup)
DELETE FROM page_sections
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_trusted';

-- Update about_timeline
UPDATE page_sections SET payload = '{
  "label": "Our Journey",
  "items": [
    { "year": "2026 Q1", "title": "Founded", "description": "KOOLA was established with a mission to modernize business operations through practical, reliable technology solutions." },
    { "year": "2026 Q2", "title": "First Projects", "description": "Delivered our first IT infrastructure and cloud migration projects for local businesses, proving our approach works." },
    { "year": "2026+", "title": "Growing Forward", "description": "Expanding our service portfolio and team to serve more businesses across Vietnam and Southeast Asia." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_timeline';

-- Update about_performance
UPDATE page_sections SET payload = '{
  "description": "We are committed to delivering every project on time and within budget. Our goal is 100% client satisfaction — and we measure ourselves against that standard every single day.",
  "percent": 100
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_performance';

-- Update about_cta
UPDATE page_sections SET payload = '{
  "title": "Ready to Modernize Your Business?",
  "subtitle": "Whether you need IT infrastructure, cloud solutions, or process automation, KOOLA is here to help. Let us discuss how technology can work harder for your business.",
  "ctaLabel": "Get in touch",
  "ctaHref": "/contact",
  "image": "/home/hero-placeholder.svg"
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en')
  AND section_key = 'about_cta';

-- ═══════════════════════════════════════════════════════════════
-- VIETNAMESE (page slug='about', locale='vi')
-- ═══════════════════════════════════════════════════════════════

-- Update about_intro (VI)
UPDATE page_sections SET payload = '{
  "label": "CHÚNG TÔI LÀ AI",
  "headline": "Công nghệ phục vụ doanh nghiệp của bạn",
  "paragraphs": [
    "KOOLA là công ty công nghệ được thành lập năm 2026 với sứ mệnh rõ ràng: đơn giản hóa và hiện đại hóa quy trình vận hành doanh nghiệp thông qua các giải pháp IT thông minh. Chúng tôi tin rằng công nghệ nên loại bỏ sự phức tạp, không phải tạo thêm.",
    "Từ hạ tầng IT và giải pháp đám mây đến tự động hóa quy trình và chuyển đổi số, chúng tôi đồng hành cùng các doanh nghiệp sẵn sàng vận hành thông minh hơn, nhanh hơn và hiệu quả hơn."
  ],
  "image": {
    "src": "/images/about/intro.jpg",
    "alt": "Đội ngũ KOOLA làm việc"
  }
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_intro';

-- Update about_story (VI)
UPDATE page_sections SET payload = '{
  "label": "CÂU CHUYỆN CỦA CHÚNG TÔI",
  "paragraphs": [
    "KOOLA ra đời từ một nhận định đơn giản: quá nhiều doanh nghiệp đang vật lộn với hệ thống lỗi thời và các công cụ rời rạc làm chậm hoạt động. Chúng tôi nhìn thấy cơ hội để thu hẹp khoảng cách giữa khả năng của công nghệ và nhu cầu thực tế của doanh nghiệp.",
    "Đội ngũ sáng lập của chúng tôi quy tụ chuyên môn về kỹ thuật hệ thống, kiến trúc đám mây và tối ưu hóa quy trình kinh doanh. Chúng tôi thành lập KOOLA để trở thành đối tác công nghệ mà chúng tôi từng mong muốn — lắng nghe trước, đưa ra giải pháp thực tế, và đồng hành lâu dài."
  ],
  "image": {
    "src": "/images/about/story.jpg",
    "alt": "Câu chuyện thành lập KOOLA"
  }
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_story';

-- Replace about_milestone → about_mission_values (VI)
UPDATE page_sections SET section_key = 'about_mission_values', payload = '{
  "title": "Sứ mệnh & Giá trị cốt lõi",
  "subtitle": "Những nguyên tắc định hướng mọi hoạt động của chúng tôi",
  "values": [
    { "icon": "lightbulb", "title": "Đổi mới", "description": "Chúng tôi luôn cập nhật xu hướng công nghệ để mang đến giải pháp hiện đại, có khả năng mở rộng và sẵn sàng cho tương lai." },
    { "icon": "shield", "title": "Chất lượng", "description": "Mọi giải pháp đều được xây dựng để bền vững — kiểm thử kỹ lưỡng, tài liệu đầy đủ và đạt chuẩn production ngay từ đầu." },
    { "icon": "handshake", "title": "Đối tác", "description": "Chúng tôi không chỉ giao dự án. Chúng tôi xây dựng mối quan hệ lâu dài và phát triển cùng doanh nghiệp của bạn." },
    { "icon": "eye", "title": "Minh bạch", "description": "Giao tiếp rõ ràng, timeline trung thực, không chi phí ẩn. Bạn luôn biết dự án đang ở đâu." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_milestone';

-- Update about_team_roles (VI)
UPDATE page_sections SET payload = '{
  "title": "Đội ngũ kỹ sư và tư vấn tập trung vào việc mang lại kết quả thực sự cho doanh nghiệp của bạn",
  "intro": "",
  "ctaLabel": "Tham gia đội ngũ",
  "ctaHref": "/careers",
  "roles": [
    { "role": "Kiến trúc sư\nCloud", "image": "/home/hero-placeholder.svg" },
    { "role": "Kỹ sư\nHệ thống", "image": "/home/hero-placeholder.svg" },
    { "role": "Chuyên viên\nDevOps", "image": "/home/hero-placeholder.svg" },
    { "role": "Tư vấn\nGiải pháp", "image": "/home/hero-placeholder.svg" },
    { "role": "Kỹ sư\nTự động hóa", "image": "/home/hero-placeholder.svg" }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_team_roles';

-- Replace about_testimonials → about_process (VI)
UPDATE page_sections SET section_key = 'about_process', payload = '{
  "title": "Quy trình làm việc",
  "subtitle": "Phương pháp có hệ thống, đảm bảo kết quả đúng hạn",
  "steps": [
    { "step": 1, "title": "Tư vấn", "description": "Chúng tôi bắt đầu bằng việc tìm hiểu doanh nghiệp, thách thức và mục tiêu của bạn. Không giả định — chỉ lắng nghe sâu và phân tích kỹ lưỡng." },
    { "step": 2, "title": "Thiết kế", "description": "Đội ngũ kiến trúc giải pháp phù hợp với phạm vi, timeline và deliverables rõ ràng. Bạn duyệt mọi chi tiết trước khi chúng tôi xây dựng." },
    { "step": 3, "title": "Triển khai", "description": "Chúng tôi xây dựng và triển khai với sự chính xác — tuân thủ best practices, kiểm thử nghiêm ngặt và cập nhật tiến độ minh bạch." },
    { "step": 4, "title": "Hỗ trợ", "description": "Ra mắt chỉ là khởi đầu. Chúng tôi cung cấp bảo trì, giám sát và tối ưu hóa liên tục để hệ thống luôn vận hành ở hiệu suất cao nhất." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_testimonials';

-- Delete about_trusted (VI)
DELETE FROM page_sections
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_trusted';

-- Update about_timeline (VI)
UPDATE page_sections SET payload = '{
  "label": "Hành trình của chúng tôi",
  "items": [
    { "year": "2026 Q1", "title": "Thành lập", "description": "KOOLA được thành lập với sứ mệnh hiện đại hóa quy trình vận hành doanh nghiệp thông qua các giải pháp công nghệ thực tế và đáng tin cậy." },
    { "year": "2026 Q2", "title": "Dự án đầu tiên", "description": "Hoàn thành các dự án hạ tầng IT và chuyển đổi đám mây đầu tiên cho doanh nghiệp địa phương, chứng minh phương pháp của chúng tôi hiệu quả." },
    { "year": "2026+", "title": "Phát triển tiếp", "description": "Mở rộng danh mục dịch vụ và đội ngũ để phục vụ nhiều doanh nghiệp hơn tại Việt Nam và Đông Nam Á." }
  ]
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_timeline';

-- Update about_performance (VI)
UPDATE page_sections SET payload = '{
  "description": "Chúng tôi cam kết hoàn thành mọi dự án đúng hạn và trong ngân sách. Mục tiêu của chúng tôi là 100% khách hàng hài lòng — và chúng tôi đo lường bản thân theo tiêu chuẩn đó mỗi ngày.",
  "percent": 100
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_performance';

-- Update about_cta (VI)
UPDATE page_sections SET payload = '{
  "title": "Sẵn sàng hiện đại hóa doanh nghiệp?",
  "subtitle": "Dù bạn cần hạ tầng IT, giải pháp đám mây hay tự động hóa quy trình, KOOLA luôn sẵn sàng hỗ trợ. Hãy cùng thảo luận về cách công nghệ có thể phục vụ doanh nghiệp của bạn tốt hơn.",
  "ctaLabel": "Liên hệ ngay",
  "ctaHref": "/contact",
  "image": "/home/hero-placeholder.svg"
}'::jsonb
WHERE page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi')
  AND section_key = 'about_cta';
