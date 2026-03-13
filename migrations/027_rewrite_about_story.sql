-- Migration 027: Rewrite About page content — more professional, specific, and heartfelt
-- Updates: hero, about_intro, about_story, about_mission_values, about_cta for EN (page_id=1) and VI (page_id=2)

BEGIN;

-- ============================================================
-- ENGLISH (page_id = 1)
-- ============================================================

-- Hero
UPDATE page_sections SET payload = '{
  "headline": "Building Technology That Businesses Can Rely On",
  "subheadline": "KOOLA is a technology company rooted in Binh Thuan, Vietnam. We design, build, and maintain IT infrastructure, IoT systems, and automation solutions — helping businesses operate with confidence and clarity.",
  "primary_cta": { "href": "/contact", "label": "Start a conversation" },
  "secondary_cta": { "href": "/services", "label": "Explore our services" }
}'::jsonb
WHERE page_id = 1 AND section_key = 'hero';

-- About Intro
UPDATE page_sections SET payload = '{
  "label": "WHO WE ARE",
  "headline": "A Technology Partner That Listens First",
  "paragraphs": [
    "KOOLA is a technology company founded in 2026 in Binh Thuan, Vietnam. We specialize in IT infrastructure, IoT integration, industrial automation, cloud management, and cybersecurity — serving small and medium businesses that need reliable, well-engineered systems without the complexity of dealing with large vendors.",
    "We are a small team, and we see that as a strength. Every client works directly with the people who design and build their systems. There are no layers of account managers or outsourced support. When you call us, you reach the engineer who knows your setup.",
    "Our approach is straightforward: we listen to what your business actually needs, propose solutions that fit your scale and budget, and deliver work we stand behind. No overselling, no unnecessary complexity."
  ],
  "image": { "src": "/images/about/intro.jpg", "alt": "KOOLA engineering team collaborating on a project" }
}'::jsonb
WHERE page_id = 1 AND section_key = 'about_intro';

-- About Story (EN)
UPDATE page_sections SET payload = '{
  "label": "OUR STORY",
  "paragraphs": [
    "KOOLA started with a conversation, not a business plan. In early 2026, our founders — engineers who had spent years working inside IT departments of manufacturing plants and logistics companies in southern Vietnam — kept running into the same problem: businesses knew they needed better technology, but the options available were either too expensive, too generic, or too complicated to maintain.",
    "Large system integrators offered enterprise-grade solutions at enterprise-grade prices. Freelancers could handle one-off tasks but lacked the depth for ongoing infrastructure. There was a gap in the middle — a need for a technology partner that could deliver professional, well-documented systems at a scale that made sense for growing Vietnamese businesses.",
    "That gap became KOOLA. We set up our base in Binh Thuan and started with what we knew best: designing IT infrastructure, connecting IoT devices in industrial settings, and building automation workflows that actually save time instead of creating new headaches.",
    "What sets us apart is not just technical skill — it is how we work. We take the time to understand each client''s operations before proposing anything. We document everything we build so your team can maintain it. We answer the phone when something breaks at 2 AM. And we price our work fairly, because we would rather build a long-term relationship than maximize a single invoice.",
    "We are still a young company, and we are honest about that. We do not pretend to have decades of case studies or hundreds of enterprise clients. What we do have is a team that cares deeply about doing good work, a growing portfolio of real projects, and the energy to go the extra mile for every client who trusts us with their technology."
  ],
  "image": { "src": "/images/about/story.jpg", "alt": "KOOLA team working on-site at a client facility" }
}'::jsonb
WHERE page_id = 1 AND section_key = 'about_story';

-- Mission & Values (EN)
UPDATE page_sections SET payload = '{
  "title": "What We Stand For",
  "subtitle": "These are not slogans on a wall. They are commitments we hold ourselves to on every project.",
  "values": [
    {
      "icon": "handshake",
      "title": "Honest Partnership",
      "description": "We tell you what you need, not what costs the most. If a simpler solution works better for your situation, we will recommend it — even if it means a smaller project for us."
    },
    {
      "icon": "shield",
      "title": "Built to Last",
      "description": "We do not cut corners. Every system we deliver is properly documented, thoroughly tested, and designed for your team to maintain long after the project ends."
    },
    {
      "icon": "eye",
      "title": "Full Transparency",
      "description": "You will always know where your project stands. We share progress openly, flag risks early, and never surprise you with hidden costs or scope changes."
    },
    {
      "icon": "lightbulb",
      "title": "Practical Innovation",
      "description": "We stay current with technology trends, but we only recommend what actually solves your problem. Innovation for its own sake is not innovation — it is waste."
    }
  ]
}'::jsonb
WHERE page_id = 1 AND section_key = 'about_mission_values';

-- CTA (EN)
UPDATE page_sections SET payload = '{
  "title": "Let Us Talk About What You Need",
  "subtitle": "Whether you are planning a new system, upgrading existing infrastructure, or just exploring your options — we are happy to listen. No pressure, no obligations. Just a straightforward conversation about how technology can help your business.",
  "ctaLabel": "Get in touch",
  "ctaHref": "/contact",
  "image": "/images/about/cta/cta.jpg"
}'::jsonb
WHERE page_id = 1 AND section_key = 'about_cta';

-- ============================================================
-- VIETNAMESE (page_id = 2)
-- ============================================================

-- Hero
UPDATE page_sections SET payload = '{
  "headline": "Xây dựng công nghệ mà doanh nghiệp có thể tin cậy",
  "subheadline": "KOOLA là công ty công nghệ có trụ sở tại Bình Thuận, Việt Nam. Chúng tôi thiết kế, xây dựng và vận hành hạ tầng IT, hệ thống IoT và giải pháp tự động hóa — giúp doanh nghiệp hoạt động tự tin và rõ ràng hơn.",
  "primary_cta": { "href": "/contact", "label": "Liên hệ tư vấn" },
  "secondary_cta": { "href": "/services", "label": "Xem dịch vụ" }
}'::jsonb
WHERE page_id = 2 AND section_key = 'hero';

-- About Intro
UPDATE page_sections SET payload = '{
  "label": "CHÚNG TÔI LÀ AI",
  "headline": "Đối tác công nghệ lắng nghe trước, hành động sau",
  "paragraphs": [
    "KOOLA là công ty công nghệ được thành lập năm 2026 tại Bình Thuận, Việt Nam. Chúng tôi chuyên về hạ tầng IT, tích hợp IoT, tự động hóa công nghiệp, quản lý đám mây và an ninh mạng — phục vụ các doanh nghiệp vừa và nhỏ cần hệ thống đáng tin cậy, được thiết kế bài bản mà không phải đối mặt với sự phức tạp của các nhà cung cấp lớn.",
    "Chúng tôi là đội ngũ nhỏ, và chúng tôi xem đó là thế mạnh. Mỗi khách hàng làm việc trực tiếp với những người thiết kế và xây dựng hệ thống cho họ. Không có lớp quản lý tài khoản hay bộ phận hỗ trợ thuê ngoài. Khi bạn gọi cho chúng tôi, bạn nói chuyện với chính kỹ sư hiểu rõ hệ thống của bạn.",
    "Cách làm việc của chúng tôi rất đơn giản: lắng nghe nhu cầu thực tế của doanh nghiệp, đề xuất giải pháp phù hợp với quy mô và ngân sách, và bàn giao công việc mà chúng tôi chịu trách nhiệm đến cùng. Không bán thêm, không phức tạp hóa."
  ],
  "image": { "src": "/images/about/intro.jpg", "alt": "Đội ngũ kỹ sư KOOLA cộng tác trong dự án" }
}'::jsonb
WHERE page_id = 2 AND section_key = 'about_intro';

-- About Story (VI)
UPDATE page_sections SET payload = '{
  "label": "CÂU CHUYỆN CỦA CHÚNG TÔI",
  "paragraphs": [
    "KOOLA bắt đầu từ một cuộc trò chuyện, không phải một bản kế hoạch kinh doanh. Đầu năm 2026, những người sáng lập của chúng tôi — các kỹ sư đã nhiều năm làm việc trong bộ phận IT của các nhà máy sản xuất và công ty logistics ở miền Nam Việt Nam — liên tục gặp phải cùng một vấn đề: doanh nghiệp biết họ cần công nghệ tốt hơn, nhưng các lựa chọn hiện có hoặc quá đắt, quá chung chung, hoặc quá phức tạp để duy trì.",
    "Các nhà tích hợp hệ thống lớn cung cấp giải pháp cấp doanh nghiệp với mức giá cấp doanh nghiệp. Freelancer có thể xử lý các công việc đơn lẻ nhưng thiếu chiều sâu cho hạ tầng dài hạn. Có một khoảng trống ở giữa — nhu cầu về một đối tác công nghệ có thể cung cấp hệ thống chuyên nghiệp, được tài liệu hóa đầy đủ, ở quy mô phù hợp với các doanh nghiệp Việt Nam đang phát triển.",
    "Khoảng trống đó trở thành KOOLA. Chúng tôi đặt trụ sở tại Bình Thuận và bắt đầu với những gì chúng tôi giỏi nhất: thiết kế hạ tầng IT, kết nối thiết bị IoT trong môi trường công nghiệp, và xây dựng quy trình tự động hóa thực sự tiết kiệm thời gian thay vì tạo thêm rắc rối.",
    "Điều khiến chúng tôi khác biệt không chỉ là kỹ năng chuyên môn — mà là cách chúng tôi làm việc. Chúng tôi dành thời gian tìm hiểu hoạt động của từng khách hàng trước khi đề xuất bất cứ điều gì. Chúng tôi tài liệu hóa mọi thứ chúng tôi xây dựng để đội ngũ của bạn có thể tự vận hành. Chúng tôi nghe điện thoại khi có sự cố lúc 2 giờ sáng. Và chúng tôi định giá công bằng, vì chúng tôi muốn xây dựng mối quan hệ lâu dài hơn là tối đa hóa một hóa đơn.",
    "Chúng tôi vẫn là một công ty trẻ, và chúng tôi thành thật về điều đó. Chúng tôi không giả vờ có hàng chục năm kinh nghiệm hay hàng trăm khách hàng doanh nghiệp. Điều chúng tôi có là một đội ngũ thực sự quan tâm đến chất lượng công việc, một danh mục dự án thực tế đang phát triển, và sự nhiệt huyết để nỗ lực hết mình cho mỗi khách hàng tin tưởng giao phó công nghệ cho chúng tôi."
  ],
  "image": { "src": "/images/about/story.jpg", "alt": "Đội ngũ KOOLA làm việc tại cơ sở khách hàng" }
}'::jsonb
WHERE page_id = 2 AND section_key = 'about_story';

-- Mission & Values (VI)
UPDATE page_sections SET payload = '{
  "title": "Giá trị cốt lõi",
  "subtitle": "Đây không phải khẩu hiệu treo tường. Đây là cam kết chúng tôi giữ vững trong mỗi dự án.",
  "values": [
    {
      "icon": "handshake",
      "title": "Hợp tác chân thành",
      "description": "Chúng tôi tư vấn những gì bạn cần, không phải những gì đắt nhất. Nếu giải pháp đơn giản hơn phù hợp hơn với tình huống của bạn, chúng tôi sẽ đề xuất — dù điều đó có nghĩa là dự án nhỏ hơn cho chúng tôi."
    },
    {
      "icon": "shield",
      "title": "Xây dựng bền vững",
      "description": "Chúng tôi không cắt xén. Mọi hệ thống chúng tôi bàn giao đều được tài liệu hóa đầy đủ, kiểm thử kỹ lưỡng, và thiết kế để đội ngũ của bạn có thể tự vận hành lâu dài."
    },
    {
      "icon": "eye",
      "title": "Minh bạch hoàn toàn",
      "description": "Bạn luôn biết dự án đang ở đâu. Chúng tôi chia sẻ tiến độ công khai, cảnh báo rủi ro sớm, và không bao giờ gây bất ngờ với chi phí ẩn hay thay đổi phạm vi."
    },
    {
      "icon": "lightbulb",
      "title": "Đổi mới thực tế",
      "description": "Chúng tôi cập nhật xu hướng công nghệ, nhưng chỉ đề xuất những gì thực sự giải quyết vấn đề của bạn. Đổi mới vì đổi mới không phải là đổi mới — đó là lãng phí."
    }
  ]
}'::jsonb
WHERE page_id = 2 AND section_key = 'about_mission_values';

-- CTA (VI)
UPDATE page_sections SET payload = '{
  "title": "Hãy nói về những gì bạn cần",
  "subtitle": "Dù bạn đang lên kế hoạch cho hệ thống mới, nâng cấp hạ tầng hiện có, hay chỉ đang tìm hiểu các lựa chọn — chúng tôi sẵn lòng lắng nghe. Không áp lực, không ràng buộc. Chỉ là một cuộc trò chuyện thẳng thắn về cách công nghệ có thể giúp doanh nghiệp của bạn.",
  "ctaLabel": "Liên hệ ngay",
  "ctaHref": "/contact",
  "image": "/images/about/cta/cta.jpg"
}'::jsonb
WHERE page_id = 2 AND section_key = 'about_cta';

COMMIT;
