-- Migration 034: Seed full posts (EN + VI) with categories, tags, related posts
-- These are tech/IT company blog posts in both languages

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (locale, name, slug, kind) VALUES
  ('en', 'Technology', 'technology', 'post'),
  ('en', 'Business', 'business', 'post'),
  ('en', 'AI & Data', 'ai-data', 'post'),
  ('en', 'Cybersecurity', 'cybersecurity', 'post'),
  ('en', 'Cloud', 'cloud', 'post'),
  ('vi', 'Công nghệ', 'cong-nghe', 'post'),
  ('vi', 'Kinh doanh', 'kinh-doanh', 'post'),
  ('vi', 'AI & Dữ liệu', 'ai-du-lieu', 'post'),
  ('vi', 'Bảo mật', 'bao-mat', 'post'),
  ('vi', 'Cloud', 'cloud-vi', 'post')
ON CONFLICT (locale, slug, kind) DO NOTHING;

-- ============================================================
-- TAGS
-- ============================================================
INSERT INTO tags (locale, name, slug) VALUES
  ('en', 'IoT', 'iot'),
  ('en', 'Automation', 'automation'),
  ('en', 'Digital Transformation', 'digital-transformation'),
  ('en', 'Machine Learning', 'machine-learning'),
  ('en', 'Security', 'security'),
  ('en', 'Cloud Computing', 'cloud-computing'),
  ('en', 'UI/UX', 'ui-ux'),
  ('en', 'DevOps', 'devops'),
  ('vi', 'IoT', 'iot-vi'),
  ('vi', 'Tự động hóa', 'tu-dong-hoa'),
  ('vi', 'Chuyển đổi số', 'chuyen-doi-so'),
  ('vi', 'Học máy', 'hoc-may'),
  ('vi', 'Bảo mật', 'bao-mat-tag'),
  ('vi', 'Điện toán đám mây', 'dien-toan-dam-may'),
  ('vi', 'UI/UX', 'ui-ux-vi'),
  ('vi', 'DevOps', 'devops-vi')
ON CONFLICT (locale, slug) DO NOTHING;

-- ============================================================
-- POSTS (English) - 6 posts
-- ============================================================

-- Post EN 1: already exists (id=1) - Introduction to Industrial IoT
-- Post EN 2: already exists (id=2) - Top 10 Automation Trends
-- Post EN 3: already exists (id=3) - Building Your First IoT Solution

-- Patch existing posts to have hero images and proper published_at
UPDATE posts SET
  hero_asset_id = 16,
  published_at = NOW() - INTERVAL '10 days'
WHERE id = 1 AND hero_asset_id IS NULL;

UPDATE posts SET
  hero_asset_id = 14,
  published_at = NOW() - INTERVAL '8 days'
WHERE id = 2 AND hero_asset_id IS NULL;

UPDATE posts SET
  hero_asset_id = 7,
  published_at = NOW() - INTERVAL '6 days'
WHERE id = 3 AND hero_asset_id IS NULL;

-- Post EN 4: How AI is Reshaping Software Development
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'en',
  'How AI is Reshaping Software Development in 2026',
  'ai-reshaping-software-development-2026',
  'Artificial intelligence is no longer a futuristic concept — it''s actively transforming how software teams design, build, and deploy applications today.',
  '# How AI is Reshaping Software Development in 2026

## The New Era of AI-Assisted Coding

The software development landscape has fundamentally shifted. Tools powered by large language models now assist engineers with code completion, bug detection, test generation, and even architecture recommendations.

## Key Areas of Transformation

### 1. AI-Powered Code Generation
Modern IDEs integrated with AI assistants can generate entire functions, classes, and even microservices from natural language prompts. This reduces boilerplate writing by up to 60%.

### 2. Intelligent Testing
AI models can analyze codebases and auto-generate unit tests, identify edge cases humans might miss, and even predict which areas are most likely to contain bugs.

### 3. Automated Code Review
AI reviewers can flag security vulnerabilities, performance bottlenecks, and style violations in seconds — before a human reviewer even opens a PR.

### 4. Architecture Advisory
AI systems trained on thousands of production architectures can suggest optimal patterns for your specific load requirements, team size, and tech stack.

## Challenges and Considerations

While AI accelerates development, it introduces new considerations:
- **Code Quality**: Generated code must still be reviewed by engineers
- **Security**: AI may suggest patterns with known vulnerabilities if training data is outdated
- **Over-reliance**: Junior developers may skip learning fundamentals

## The KOOLA Approach

At KOOLA, we integrate AI tools carefully — as an amplifier for our expert engineers, not a replacement. Our teams use AI for repetitive tasks while maintaining human oversight for architecture, security, and business logic decisions.

## Conclusion

AI-driven development is here. Companies that embrace it thoughtfully will ship faster, with fewer bugs, and at lower cost. The key is knowing where AI excels and where human expertise remains indispensable.',
  9,
  'published',
  NOW() - INTERVAL '4 days',
  'How AI is Reshaping Software Development in 2026 | KOOLA',
  'Discover how artificial intelligence is transforming software development workflows, from code generation to automated testing and intelligent architecture advice.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post EN 5: Cloud Migration Best Practices
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'en',
  'Cloud Migration Best Practices: A Complete Guide for 2026',
  'cloud-migration-best-practices-2026',
  'Moving workloads to the cloud is one of the most impactful decisions a business can make. Done right, it delivers agility, cost savings, and scale. Done wrong, it creates expensive technical debt.',
  '# Cloud Migration Best Practices: A Complete Guide for 2026

## Why Cloud Migration Still Matters

Despite cloud adoption being mainstream for years, many organizations still run critical workloads on aging on-premise infrastructure. The 2026 reality: hybrid and multi-cloud strategies are the new standard.

## The 6 Migration Strategies (6Rs)

### Rehost (Lift and Shift)
Move applications to the cloud with minimal changes. Fast and low-risk, but misses optimization opportunities.

### Replatform
Minor tweaks to take advantage of cloud capabilities (e.g., moving to managed databases) without full refactoring.

### Repurchase
Replace legacy software with cloud-native SaaS alternatives.

### Refactor / Re-architect
Redesign applications to be cloud-native — often using microservices and containers. Highest effort, highest reward.

### Retain
Keep certain systems on-premise for compliance, latency, or dependency reasons.

### Retire
Decommission unused applications discovered during inventory.

## Migration Phases

1. **Discovery & Assessment** — Inventory all workloads, dependencies, and data flows
2. **Planning** — Choose migration strategy per workload, set timelines and budgets
3. **Proof of Concept** — Migrate a low-risk pilot workload
4. **Migration Waves** — Move workloads in prioritized batches
5. **Optimization** — Right-size resources, implement auto-scaling, optimize costs
6. **Governance** — Set up monitoring, cost alerts, and security policies

## Common Pitfalls

- Underestimating data transfer costs
- Neglecting security and compliance during migration
- Not training the team on cloud operations
- Skipping performance testing post-migration

## KOOLA''s Cloud Migration Services

Our team has guided 50+ organizations through successful cloud migrations across AWS, Azure, and Google Cloud. We bring battle-tested playbooks and dedicated cloud architects to every engagement.',
  12,
  'published',
  NOW() - INTERVAL '2 days',
  'Cloud Migration Best Practices 2026 | KOOLA',
  'A complete guide to cloud migration strategies, phases, and best practices to help your organization move workloads safely and efficiently.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post EN 6: Cybersecurity Trends
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'en',
  'Top Cybersecurity Threats and How to Defend Against Them',
  'top-cybersecurity-threats-defense-2026',
  'The cybersecurity threat landscape is more complex than ever. Learn about the most dangerous attack vectors in 2026 and the defensive strategies that actually work.',
  '# Top Cybersecurity Threats and How to Defend Against Them

## The Evolving Threat Landscape

As organizations accelerate digital transformation, attackers evolve in parallel. In 2026, AI-powered attacks, supply chain compromises, and ransomware-as-a-service have become the dominant threat categories.

## Critical Threat Vectors

### 1. AI-Enhanced Phishing
Attackers now use LLMs to craft highly personalized phishing emails at scale. Traditional email filters struggle to detect them.

**Defense:** Implement DMARC/DKIM/SPF, use AI-based email security, and conduct regular phishing simulations.

### 2. Ransomware-as-a-Service (RaaS)
Criminal groups sell ransomware toolkits to affiliates, lowering the barrier to entry for attackers.

**Defense:** Immutable backups, network segmentation, EDR solutions, and rapid incident response plans.

### 3. Supply Chain Attacks
Attackers compromise software vendors to reach their customers downstream (e.g., SolarWinds, XZ Utils).

**Defense:** Software composition analysis (SCA), vendor security assessments, and zero-trust architecture.

### 4. Cloud Misconfigurations
Exposed S3 buckets, over-permissive IAM roles, and unencrypted databases remain among the top causes of breaches.

**Defense:** Cloud Security Posture Management (CSPM) tools, automated compliance checks, and least-privilege access.

### 5. API Security Gaps
As APIs proliferate, attackers target them directly. Broken authentication and excessive data exposure are common.

**Defense:** API gateways, rate limiting, strict authentication, and regular API security testing.

## Building a Defense-in-Depth Strategy

1. **Identity First** — Zero-trust, MFA everywhere, privileged access management
2. **Endpoint Protection** — EDR, patch management, device compliance
3. **Network Security** — Micro-segmentation, encrypted traffic inspection
4. **Data Protection** — Encryption at rest and in transit, DLP policies
5. **Monitoring & Response** — SIEM, SOC, automated response playbooks

## How KOOLA Can Help

Our cybersecurity team offers vulnerability assessments, penetration testing, security architecture review, and managed security services to protect your organization at every layer.',
  10,
  'published',
  NOW() - INTERVAL '1 day',
  'Top Cybersecurity Threats 2026 | KOOLA',
  'Learn about the most dangerous cybersecurity threats in 2026 and defense strategies to protect your organization from AI-powered attacks, ransomware, and supply chain compromises.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- ============================================================
-- POSTS (Vietnamese) - 6 posts
-- ============================================================

-- Post VI 1
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'Giới thiệu về IoT Công nghiệp: Tương lai của tự động hóa',
  'gioi-thieu-iot-cong-nghiep',
  'IoT Công nghiệp (IIoT) đang thay đổi cách các nhà máy, kho bãi và cơ sở hạ tầng vận hành — kết nối máy móc, cảm biến và hệ thống để tạo ra hiệu quả chưa từng có.',
  '# Giới thiệu về IoT Công nghiệp: Tương lai của tự động hóa

## IIoT là gì?

Internet of Things Công nghiệp (IIoT) là việc áp dụng IoT vào các môi trường công nghiệp như sản xuất, logistics và quản lý tiện ích. Thay vì kết nối các thiết bị tiêu dùng, IIoT kết nối các máy móc, cảm biến và hệ thống điều khiển trong môi trường công nghiệp.

## Lợi ích chính

### Theo dõi thời gian thực
Cảm biến thu thập dữ liệu liên tục từ thiết bị, cho phép phát hiện sự cố trước khi xảy ra sự cố nghiêm trọng.

### Bảo trì dự đoán
Phân tích dữ liệu máy móc để dự đoán khi nào cần bảo trì, giảm thời gian ngừng hoạt động không theo kế hoạch.

### Tối ưu hóa năng lượng
Giám sát mức tiêu thụ năng lượng theo thời gian thực và tự động điều chỉnh để giảm lãng phí.

## Ứng dụng thực tế tại Việt Nam

- **Sản xuất**: Nhà máy tự động hóa theo dõi chất lượng sản phẩm theo thời gian thực
- **Logistics**: Kho thông minh với hệ thống quản lý hàng tồn kho tự động
- **Nông nghiệp**: Cảm biến đất và khí hậu điều khiển hệ thống tưới tiêu tự động

## KOOLA và IIoT

Đội ngũ kỹ sư KOOLA đã triển khai các giải pháp IIoT cho nhiều doanh nghiệp tại Việt Nam, từ giám sát nhà máy đến quản lý chuỗi cung ứng thông minh.',
  16,
  'published',
  NOW() - INTERVAL '10 days',
  'Giới thiệu IoT Công nghiệp | KOOLA',
  'Tìm hiểu về IoT Công nghiệp (IIoT) và cách nó đang thay đổi cách các nhà máy và cơ sở hạ tầng vận hành tại Việt Nam.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post VI 2
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'Top 10 xu hướng tự động hóa định hình năm 2026',
  'top-10-xu-huong-tu-dong-hoa-2026',
  'Tự động hóa không còn là tương lai — nó đang là hiện tại. Khám phá 10 xu hướng đang định hình lại cách doanh nghiệp vận hành trong năm 2026.',
  '# Top 10 xu hướng tự động hóa định hình năm 2026

## Tại sao tự động hóa quan trọng hơn bao giờ hết?

Trong bối cảnh áp lực chi phí, thiếu hụt nhân lực và nhu cầu tốc độ ngày càng tăng, tự động hóa đã chuyển từ lợi thế cạnh tranh thành yêu cầu sinh tồn.

## 10 xu hướng hàng đầu

1. **Hyperautomation** — Kết hợp AI, RPA và BPM để tự động hóa toàn bộ quy trình nghiệp vụ phức tạp
2. **Intelligent Document Processing** — Đọc và xử lý tài liệu không có cấu trúc bằng AI
3. **Collaborative Robots (Cobots)** — Robot làm việc song song với con người trong nhà máy
4. **Low-code/No-code Automation** — Nhân viên nghiệp vụ tự xây dựng quy trình tự động
5. **AI-driven Decision Automation** — Máy móc đưa ra quyết định dựa trên dữ liệu theo thời gian thực
6. **Automated Cloud Ops** — Tự động vận hành và tối ưu hóa hạ tầng đám mây
7. **DevSecOps Automation** — Bảo mật được tích hợp tự động vào toàn bộ pipeline phát triển
8. **Smart Supply Chain** — Chuỗi cung ứng tự học, tự điều chỉnh theo biến động thị trường
9. **Customer Experience Automation** — Chatbot và AI xử lý 70%+ yêu cầu khách hàng
10. **Predictive Analytics** — Phân tích dự đoán thay thế báo cáo phản ứng

## Làm thế nào để bắt đầu?

Bắt đầu nhỏ với quy trình lặp đi lặp lại có giá trị cao, đo lường kết quả, và mở rộng dần dần.',
  14,
  'published',
  NOW() - INTERVAL '8 days',
  'Top 10 xu hướng tự động hóa 2026 | KOOLA',
  'Khám phá 10 xu hướng tự động hóa đang định hình lại cách doanh nghiệp vận hành trong năm 2026 từ hyperautomation đến AI-driven decisions.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post VI 3
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'Xây dựng giải pháp IoT đầu tiên của bạn: Hướng dẫn từng bước',
  'xay-dung-giai-phap-iot-dau-tien',
  'Bắt đầu hành trình IoT có vẻ đáng sợ — phần cứng, firmware, cloud, bảo mật. Hướng dẫn thực tiễn này giúp bạn đi từ ý tưởng đến prototype hoạt động.',
  '# Xây dựng giải pháp IoT đầu tiên của bạn: Hướng dẫn từng bước

## Tổng quan kiến trúc IoT

Một giải pháp IoT điển hình gồm 4 lớp:
1. **Thiết bị & Cảm biến** — Thu thập dữ liệu từ thế giới vật lý
2. **Connectivity** — Truyền dữ liệu lên cloud (MQTT, HTTP, LoRa)
3. **Cloud Platform** — Lưu trữ, xử lý và phân tích dữ liệu
4. **Ứng dụng** — Dashboard, cảnh báo, điều khiển từ xa

## Bước 1: Xác định Use Case

Bắt đầu với vấn đề cụ thể:
- Theo dõi nhiệt độ kho lạnh?
- Giám sát tiêu thụ điện?
- Phát hiện rò rỉ nước?

## Bước 2: Chọn phần cứng

- **ESP32**: Rẻ, WiFi+Bluetooth tích hợp, lý tưởng cho prototype
- **Raspberry Pi**: Mạnh hơn, chạy Linux, phù hợp edge computing
- **Arduino**: Cực kỳ đơn giản, cho ứng dụng không cần kết nối

## Bước 3: Chọn Cloud Platform

- **AWS IoT Core**: Quy mô enterprise, nhiều tích hợp
- **Google Cloud IoT**: AI/ML mạnh, phân tích dữ liệu tốt
- **Azure IoT Hub**: Tích hợp Microsoft ecosystem

## Bước 4: Bảo mật từ đầu

- Sử dụng TLS/mTLS cho mọi kết nối
- Certificate-based device authentication
- Regular firmware updates

## KOOLA giúp gì cho bạn

Đội ngũ KOOLA cung cấp tư vấn kiến trúc, phát triển firmware, và triển khai cloud cho các dự án IoT từ prototype đến production.',
  7,
  'published',
  NOW() - INTERVAL '6 days',
  'Xây dựng giải pháp IoT đầu tiên | KOOLA',
  'Hướng dẫn từng bước xây dựng giải pháp IoT từ chọn phần cứng, kết nối cloud đến bảo mật cho doanh nghiệp Việt Nam.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post VI 4
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'AI đang định hình lại phát triển phần mềm như thế nào năm 2026',
  'ai-dinh-hinh-phat-trien-phan-mem-2026',
  'Trí tuệ nhân tạo không còn là khái niệm xa vời — nó đang tích cực thay đổi cách các đội nhóm thiết kế, xây dựng và triển khai ứng dụng ngay hôm nay.',
  '# AI đang định hình lại phát triển phần mềm như thế nào năm 2026

## Kỷ nguyên mới của lập trình hỗ trợ AI

Bối cảnh phát triển phần mềm đã thay đổi căn bản. Các công cụ được hỗ trợ bởi mô hình ngôn ngữ lớn (LLM) hiện hỗ trợ kỹ sư hoàn thành code, phát hiện lỗi, tạo test và thậm chí đề xuất kiến trúc.

## Các lĩnh vực chuyển đổi chính

### 1. Tạo code bằng AI
IDE tích hợp AI có thể tạo toàn bộ hàm, class từ mô tả ngôn ngữ tự nhiên. Giảm đến 60% thời gian viết code boilerplate.

### 2. Kiểm thử thông minh
AI phân tích codebase và tự tạo unit test, xác định các trường hợp biên mà con người có thể bỏ sót.

### 3. Review code tự động
AI phát hiện lỗ hổng bảo mật, tắc nghẽn hiệu năng và vi phạm style trong vài giây.

### 4. Tư vấn kiến trúc
Hệ thống AI được huấn luyện trên hàng nghìn kiến trúc production có thể đề xuất pattern tối ưu cho yêu cầu cụ thể.

## Thách thức và cân nhắc

- **Chất lượng code**: Code được tạo vẫn cần được kỹ sư review
- **Bảo mật**: AI có thể đề xuất các pattern có lỗ hổng đã biết
- **Phụ thuộc quá mức**: Lập trình viên mới vào nghề có thể bỏ qua việc học nền tảng

## Cách tiếp cận của KOOLA

Tại KOOLA, chúng tôi tích hợp AI cẩn thận — như một bộ khuếch đại cho kỹ sư chuyên gia, không phải thay thế. Đội ngũ sử dụng AI cho các nhiệm vụ lặp đi lặp lại trong khi duy trì giám sát của con người cho kiến trúc, bảo mật và logic nghiệp vụ.',
  9,
  'published',
  NOW() - INTERVAL '4 days',
  'AI định hình phát triển phần mềm 2026 | KOOLA',
  'Khám phá cách trí tuệ nhân tạo đang thay đổi quy trình phát triển phần mềm từ tạo code đến kiểm thử tự động và tư vấn kiến trúc thông minh.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post VI 5
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'Hướng dẫn di chuyển lên Cloud: Thực hành tốt nhất cho năm 2026',
  'huong-dan-di-chuyen-len-cloud-2026',
  'Di chuyển khối lượng công việc lên cloud là một trong những quyết định có tác động lớn nhất một doanh nghiệp có thể thực hiện. Làm đúng mang lại sự linh hoạt, tiết kiệm chi phí và khả năng mở rộng.',
  '# Hướng dẫn di chuyển lên Cloud: Thực hành tốt nhất cho năm 2026

## Tại sao di chuyển Cloud vẫn quan trọng?

Mặc dù cloud đã phổ biến nhiều năm, nhiều tổ chức vẫn chạy các ứng dụng quan trọng trên hạ tầng on-premise lỗi thời. Thực tế 2026: chiến lược hybrid và multi-cloud là tiêu chuẩn mới.

## 6 Chiến lược di chuyển (6Rs)

### Rehost (Lift and Shift)
Di chuyển ứng dụng lên cloud với thay đổi tối thiểu. Nhanh và ít rủi ro nhưng bỏ lỡ cơ hội tối ưu hóa.

### Replatform
Điều chỉnh nhỏ để tận dụng khả năng cloud (ví dụ: chuyển sang managed database) mà không cần refactor hoàn toàn.

### Repurchase
Thay thế phần mềm legacy bằng các giải pháp SaaS cloud-native.

### Refactor / Re-architect
Thiết kế lại ứng dụng để cloud-native — thường sử dụng microservices và container. Nỗ lực cao nhất, lợi ích cao nhất.

### Retain
Giữ một số hệ thống on-premise vì lý do tuân thủ, độ trễ hoặc phụ thuộc.

### Retire
Ngừng hoạt động các ứng dụng không dùng đến được phát hiện trong quá trình kiểm kê.

## Các giai đoạn di chuyển

1. **Khám phá & Đánh giá** — Kiểm kê tất cả khối lượng công việc và phụ thuộc
2. **Lập kế hoạch** — Chọn chiến lược di chuyển, đặt timeline và ngân sách
3. **Proof of Concept** — Di chuyển thử nghiệm với ứng dụng ít rủi ro
4. **Migration Waves** — Di chuyển ứng dụng theo từng đợt ưu tiên
5. **Tối ưu hóa** — Right-size tài nguyên, tối ưu chi phí
6. **Quản trị** — Thiết lập monitoring, cảnh báo chi phí và chính sách bảo mật',
  12,
  'published',
  NOW() - INTERVAL '2 days',
  'Hướng dẫn di chuyển Cloud 2026 | KOOLA',
  'Hướng dẫn toàn diện về chiến lược, các giai đoạn và thực hành tốt nhất để di chuyển ứng dụng lên cloud an toàn và hiệu quả.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- Post VI 6
INSERT INTO posts (locale, title, slug, excerpt, content_md, hero_asset_id, status, published_at, seo_title, seo_description)
VALUES (
  'vi',
  'Các mối đe dọa bảo mật hàng đầu và cách phòng thủ hiệu quả',
  'cac-moi-de-doa-bao-mat-va-cach-phong-thu-2026',
  'Bối cảnh mối đe dọa an ninh mạng đang phức tạp hơn bao giờ hết. Tìm hiểu về các vector tấn công nguy hiểm nhất năm 2026 và chiến lược phòng thủ thực sự hiệu quả.',
  '# Các mối đe dọa bảo mật hàng đầu và cách phòng thủ hiệu quả

## Bối cảnh mối đe dọa đang tiến hóa

Khi các tổ chức tăng tốc chuyển đổi số, kẻ tấn công cũng phát triển song song. Năm 2026, tấn công bằng AI, xâm phạm chuỗi cung ứng và ransomware-as-a-service là các danh mục mối đe dọa chi phối.

## Các vector tấn công chính

### 1. Phishing tăng cường bằng AI
Kẻ tấn công sử dụng LLM để tạo email phishing cực kỳ cá nhân hóa ở quy mô lớn.

**Phòng thủ:** Triển khai DMARC/DKIM/SPF, bảo mật email dựa trên AI, huấn luyện nhận thức bảo mật thường xuyên.

### 2. Ransomware-as-a-Service (RaaS)
Các nhóm tội phạm bán công cụ ransomware, hạ thấp rào cản gia nhập cho kẻ tấn công.

**Phòng thủ:** Backup bất biến, phân đoạn mạng, giải pháp EDR, kế hoạch phản hồi sự cố.

### 3. Tấn công chuỗi cung ứng
Kẻ tấn công xâm phạm nhà cung cấp phần mềm để tiếp cận khách hàng downstream.

**Phòng thủ:** Phân tích thành phần phần mềm (SCA), đánh giá bảo mật nhà cung cấp, kiến trúc zero-trust.

### 4. Cấu hình sai Cloud
S3 bucket lộ, IAM quá quyền, database không mã hóa vẫn là nguyên nhân hàng đầu của các vụ vi phạm.

**Phòng thủ:** Công cụ Cloud Security Posture Management (CSPM), kiểm tra tuân thủ tự động.

### 5. Lỗ hổng bảo mật API
Khi API ngày càng nhiều, kẻ tấn công nhắm mục tiêu trực tiếp vào chúng.

**Phòng thủ:** API gateway, rate limiting, xác thực chặt chẽ, kiểm thử bảo mật API định kỳ.

## Xây dựng chiến lược phòng thủ theo chiều sâu

1. **Identity First** — Zero-trust, MFA ở mọi nơi
2. **Bảo vệ Endpoint** — EDR, quản lý bản vá, tuân thủ thiết bị
3. **Bảo mật Mạng** — Micro-segmentation, kiểm tra lưu lượng mã hóa
4. **Bảo vệ Dữ liệu** — Mã hóa khi lưu trữ và truyền tải, chính sách DLP
5. **Giám sát & Phản hồi** — SIEM, SOC, playbook phản hồi tự động

## KOOLA có thể giúp gì

Đội ngũ bảo mật KOOLA cung cấp đánh giá lỗ hổng, kiểm thử xâm nhập, review kiến trúc bảo mật và dịch vụ bảo mật được quản lý.',
  10,
  'published',
  NOW() - INTERVAL '1 day',
  'Các mối đe dọa bảo mật hàng đầu 2026 | KOOLA',
  'Tìm hiểu về các mối đe dọa an ninh mạng nguy hiểm nhất năm 2026 và chiến lược phòng thủ hiệu quả để bảo vệ tổ chức của bạn.'
) ON CONFLICT (locale, slug) DO NOTHING;

-- ============================================================
-- POST CATEGORIES (link posts to categories)
-- ============================================================

-- EN posts
DO $$
DECLARE
  v_tech_id bigint;
  v_ai_id bigint;
  v_cloud_id bigint;
  v_cyber_id bigint;
  v_post4_id bigint;
  v_post5_id bigint;
  v_post6_id bigint;
BEGIN
  SELECT id INTO v_tech_id FROM categories WHERE locale='en' AND slug='technology' AND kind='post';
  SELECT id INTO v_ai_id FROM categories WHERE locale='en' AND slug='ai-data' AND kind='post';
  SELECT id INTO v_cloud_id FROM categories WHERE locale='en' AND slug='cloud' AND kind='post';
  SELECT id INTO v_cyber_id FROM categories WHERE locale='en' AND slug='cybersecurity' AND kind='post';
  SELECT id INTO v_post4_id FROM posts WHERE locale='en' AND slug='ai-reshaping-software-development-2026';
  SELECT id INTO v_post5_id FROM posts WHERE locale='en' AND slug='cloud-migration-best-practices-2026';
  SELECT id INTO v_post6_id FROM posts WHERE locale='en' AND slug='top-cybersecurity-threats-defense-2026';

  -- Post 1 (IoT) -> Technology
  IF v_tech_id IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (1, v_tech_id) ON CONFLICT DO NOTHING;
    INSERT INTO post_categories (post_id, category_id) VALUES (2, v_tech_id) ON CONFLICT DO NOTHING;
    INSERT INTO post_categories (post_id, category_id) VALUES (3, v_tech_id) ON CONFLICT DO NOTHING;
  END IF;
  -- Post 4 -> AI
  IF v_post4_id IS NOT NULL AND v_ai_id IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_post4_id, v_ai_id) ON CONFLICT DO NOTHING;
  END IF;
  -- Post 5 -> Cloud
  IF v_post5_id IS NOT NULL AND v_cloud_id IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_post5_id, v_cloud_id) ON CONFLICT DO NOTHING;
  END IF;
  -- Post 6 -> Cybersecurity
  IF v_post6_id IS NOT NULL AND v_cyber_id IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_post6_id, v_cyber_id) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- VI posts
DO $$
DECLARE
  v_tech_id bigint;
  v_ai_id bigint;
  v_cloud_id bigint;
  v_cyber_id bigint;
  v_p1 bigint; v_p2 bigint; v_p3 bigint; v_p4 bigint; v_p5 bigint; v_p6 bigint;
BEGIN
  SELECT id INTO v_tech_id FROM categories WHERE locale='vi' AND slug='cong-nghe' AND kind='post';
  SELECT id INTO v_ai_id FROM categories WHERE locale='vi' AND slug='ai-du-lieu' AND kind='post';
  SELECT id INTO v_cloud_id FROM categories WHERE locale='vi' AND slug='cloud-vi' AND kind='post';
  SELECT id INTO v_cyber_id FROM categories WHERE locale='vi' AND slug='bao-mat' AND kind='post';

  SELECT id INTO v_p1 FROM posts WHERE locale='vi' AND slug='gioi-thieu-iot-cong-nghiep';
  SELECT id INTO v_p2 FROM posts WHERE locale='vi' AND slug='top-10-xu-huong-tu-dong-hoa-2026';
  SELECT id INTO v_p3 FROM posts WHERE locale='vi' AND slug='xay-dung-giai-phap-iot-dau-tien';
  SELECT id INTO v_p4 FROM posts WHERE locale='vi' AND slug='ai-dinh-hinh-phat-trien-phan-mem-2026';
  SELECT id INTO v_p5 FROM posts WHERE locale='vi' AND slug='huong-dan-di-chuyen-len-cloud-2026';
  SELECT id INTO v_p6 FROM posts WHERE locale='vi' AND slug='cac-moi-de-doa-bao-mat-va-cach-phong-thu-2026';

  IF v_tech_id IS NOT NULL THEN
    IF v_p1 IS NOT NULL THEN INSERT INTO post_categories (post_id, category_id) VALUES (v_p1, v_tech_id) ON CONFLICT DO NOTHING; END IF;
    IF v_p2 IS NOT NULL THEN INSERT INTO post_categories (post_id, category_id) VALUES (v_p2, v_tech_id) ON CONFLICT DO NOTHING; END IF;
    IF v_p3 IS NOT NULL THEN INSERT INTO post_categories (post_id, category_id) VALUES (v_p3, v_tech_id) ON CONFLICT DO NOTHING; END IF;
  END IF;
  IF v_ai_id IS NOT NULL AND v_p4 IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_p4, v_ai_id) ON CONFLICT DO NOTHING;
  END IF;
  IF v_cloud_id IS NOT NULL AND v_p5 IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_p5, v_cloud_id) ON CONFLICT DO NOTHING;
  END IF;
  IF v_cyber_id IS NOT NULL AND v_p6 IS NOT NULL THEN
    INSERT INTO post_categories (post_id, category_id) VALUES (v_p6, v_cyber_id) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================
-- POST TAGS
-- ============================================================
DO $$
DECLARE
  v_iot bigint; v_auto bigint; v_ml bigint; v_cloud bigint; v_sec bigint;
  v_p4 bigint; v_p5 bigint; v_p6 bigint;
BEGIN
  SELECT id INTO v_iot FROM tags WHERE locale='en' AND slug='iot';
  SELECT id INTO v_auto FROM tags WHERE locale='en' AND slug='automation';
  SELECT id INTO v_ml FROM tags WHERE locale='en' AND slug='machine-learning';
  SELECT id INTO v_cloud FROM tags WHERE locale='en' AND slug='cloud-computing';
  SELECT id INTO v_sec FROM tags WHERE locale='en' AND slug='security';
  SELECT id INTO v_p4 FROM posts WHERE locale='en' AND slug='ai-reshaping-software-development-2026';
  SELECT id INTO v_p5 FROM posts WHERE locale='en' AND slug='cloud-migration-best-practices-2026';
  SELECT id INTO v_p6 FROM posts WHERE locale='en' AND slug='top-cybersecurity-threats-defense-2026';

  IF v_iot IS NOT NULL THEN
    INSERT INTO post_tags (post_id, tag_id) VALUES (1, v_iot) ON CONFLICT DO NOTHING;
    INSERT INTO post_tags (post_id, tag_id) VALUES (3, v_iot) ON CONFLICT DO NOTHING;
  END IF;
  IF v_auto IS NOT NULL THEN
    INSERT INTO post_tags (post_id, tag_id) VALUES (2, v_auto) ON CONFLICT DO NOTHING;
  END IF;
  IF v_ml IS NOT NULL AND v_p4 IS NOT NULL THEN
    INSERT INTO post_tags (post_id, tag_id) VALUES (v_p4, v_ml) ON CONFLICT DO NOTHING;
  END IF;
  IF v_cloud IS NOT NULL AND v_p5 IS NOT NULL THEN
    INSERT INTO post_tags (post_id, tag_id) VALUES (v_p5, v_cloud) ON CONFLICT DO NOTHING;
  END IF;
  IF v_sec IS NOT NULL AND v_p6 IS NOT NULL THEN
    INSERT INTO post_tags (post_id, tag_id) VALUES (v_p6, v_sec) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- VI tags
DO $$
DECLARE
  v_iot bigint; v_auto bigint; v_ml bigint; v_cloud bigint; v_sec bigint;
  v_p1 bigint; v_p2 bigint; v_p3 bigint; v_p4 bigint; v_p5 bigint; v_p6 bigint;
BEGIN
  SELECT id INTO v_iot FROM tags WHERE locale='vi' AND slug='iot-vi';
  SELECT id INTO v_auto FROM tags WHERE locale='vi' AND slug='tu-dong-hoa';
  SELECT id INTO v_ml FROM tags WHERE locale='vi' AND slug='hoc-may';
  SELECT id INTO v_cloud FROM tags WHERE locale='vi' AND slug='dien-toan-dam-may';
  SELECT id INTO v_sec FROM tags WHERE locale='vi' AND slug='bao-mat-tag';
  SELECT id INTO v_p1 FROM posts WHERE locale='vi' AND slug='gioi-thieu-iot-cong-nghiep';
  SELECT id INTO v_p2 FROM posts WHERE locale='vi' AND slug='top-10-xu-huong-tu-dong-hoa-2026';
  SELECT id INTO v_p3 FROM posts WHERE locale='vi' AND slug='xay-dung-giai-phap-iot-dau-tien';
  SELECT id INTO v_p4 FROM posts WHERE locale='vi' AND slug='ai-dinh-hinh-phat-trien-phan-mem-2026';
  SELECT id INTO v_p5 FROM posts WHERE locale='vi' AND slug='huong-dan-di-chuyen-len-cloud-2026';
  SELECT id INTO v_p6 FROM posts WHERE locale='vi' AND slug='cac-moi-de-doa-bao-mat-va-cach-phong-thu-2026';

  IF v_iot IS NOT NULL THEN
    IF v_p1 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p1, v_iot) ON CONFLICT DO NOTHING; END IF;
    IF v_p3 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p3, v_iot) ON CONFLICT DO NOTHING; END IF;
  END IF;
  IF v_auto IS NOT NULL AND v_p2 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p2, v_auto) ON CONFLICT DO NOTHING; END IF;
  IF v_ml IS NOT NULL AND v_p4 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p4, v_ml) ON CONFLICT DO NOTHING; END IF;
  IF v_cloud IS NOT NULL AND v_p5 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p5, v_cloud) ON CONFLICT DO NOTHING; END IF;
  IF v_sec IS NOT NULL AND v_p6 IS NOT NULL THEN INSERT INTO post_tags (post_id, tag_id) VALUES (v_p6, v_sec) ON CONFLICT DO NOTHING; END IF;
END $$;

-- ============================================================
-- POST RELATED (cross-link related posts)
-- ============================================================
DO $$
DECLARE
  v_p4_en bigint; v_p5_en bigint; v_p6_en bigint;
BEGIN
  SELECT id INTO v_p4_en FROM posts WHERE locale='en' AND slug='ai-reshaping-software-development-2026';
  SELECT id INTO v_p5_en FROM posts WHERE locale='en' AND slug='cloud-migration-best-practices-2026';
  SELECT id INTO v_p6_en FROM posts WHERE locale='en' AND slug='top-cybersecurity-threats-defense-2026';

  -- p4 related: p5, p6
  IF v_p4_en IS NOT NULL AND v_p5_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p4_en, v_p5_en, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF v_p4_en IS NOT NULL AND v_p6_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p4_en, v_p6_en, 2) ON CONFLICT DO NOTHING;
  END IF;
  -- p5 related: p4, p6
  IF v_p5_en IS NOT NULL AND v_p4_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p5_en, v_p4_en, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF v_p5_en IS NOT NULL AND v_p6_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p5_en, v_p6_en, 2) ON CONFLICT DO NOTHING;
  END IF;
  -- p6 related: p4, p5
  IF v_p6_en IS NOT NULL AND v_p4_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p6_en, v_p4_en, 1) ON CONFLICT DO NOTHING;
  END IF;
  IF v_p6_en IS NOT NULL AND v_p5_en IS NOT NULL THEN
    INSERT INTO post_related (post_id, related_post_id, sort_order) VALUES (v_p6_en, v_p5_en, 2) ON CONFLICT DO NOTHING;
  END IF;
END $$;
