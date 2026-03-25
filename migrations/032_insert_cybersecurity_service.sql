-- Migration 032: Insert Cybersecurity service (EN + VI) with full content
-- Context: DB production does not have cybersecurity service records.
--          Migration 023 assumed id=6/12 existed (UPDATE only) — they do not.
--          This migration inserts fresh records using id-agnostic CTEs.
-- Date: 2026-03-25

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- 1. INSERT SERVICE RECORDS (EN + VI)
-- ═══════════════════════════════════════════════════════════════

-- Guard: skip if already exists (idempotent)
INSERT INTO services (locale, title, slug, slug_group, icon_name, sort_order, status, excerpt, seo_title, seo_description, benefits_subtitle, content_md, published_at)
SELECT
  'en',
  'Cybersecurity Solutions',
  'cybersecurity-solutions',
  'cybersecurity-solutions',
  'shield',
  6,
  'published',
  'Comprehensive security services that protect your business from threats — from assessment and architecture to 24/7 monitoring and incident response.',
  'Cybersecurity Solutions | KOOLA',
  'Security assessment, penetration testing, SOC monitoring, incident response, and compliance. KOOLA protects your digital assets.',
  'Why businesses trust KOOLA for security',
  $BODY$## Security Is Not Optional

Cyber threats do not wait for you to be ready. KOOLA provides layered security that protects your business from the inside out — combining technology, processes, and people into a comprehensive defense strategy.

### Our Security Services

- **Security Assessment & Penetration Testing** — Identify vulnerabilities before attackers do. We test your networks, applications, and infrastructure against real-world attack scenarios
- **Security Architecture Design** — Zero-trust network design, micro-segmentation, and defense-in-depth strategies tailored to your risk profile
- **Network Security** — Next-gen firewalls, IDS/IPS, DDoS protection, and secure remote access (VPN/ZTNA)
- **Endpoint Protection** — EDR/XDR deployment, patch management, and device compliance enforcement
- **SOC Monitoring** — 24/7 security operations center with SIEM, threat detection, and automated response
- **Incident Response** — Rapid containment, forensic analysis, and recovery planning when incidents occur
- **Compliance & Governance** — Frameworks alignment (ISO 27001, NIST, PCI-DSS, GDPR) with audit preparation support

### Our Approach

| Phase | What We Do |
|-------|-----------|
| Assess | Vulnerability scanning, penetration testing, risk analysis |
| Design | Security architecture, policy development, tool selection |
| Implement | Deploy security controls, configure monitoring, train staff |
| Monitor | 24/7 threat detection, log analysis, anomaly detection |
| Respond | Incident containment, forensics, recovery, lessons learned |

### Security Awareness

Technology alone is not enough. We provide security awareness training programs that turn your employees from the weakest link into your first line of defense.$BODY$,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'cybersecurity-solutions' AND locale = 'en');

INSERT INTO services (locale, title, slug, slug_group, icon_name, sort_order, status, excerpt, seo_title, seo_description, benefits_subtitle, content_md, published_at)
SELECT
  'vi',
  'Giải pháp An ninh Mạng',
  'giai-phap-an-ninh-mang',
  'cybersecurity-solutions',
  'shield',
  6,
  'published',
  'Dịch vụ bảo mật toàn diện bảo vệ doanh nghiệp khỏi mối đe dọa — từ đánh giá và kiến trúc đến giám sát 24/7 và ứng phó sự cố.',
  'Giải pháp An ninh Mạng | KOOLA',
  'Đánh giá bảo mật, penetration testing, giám sát SOC, ứng phó sự cố và tuân thủ. KOOLA bảo vệ tài sản số của bạn.',
  'Tại sao doanh nghiệp tin tưởng KOOLA cho bảo mật',
  $BODY$## Bảo mật không phải tùy chọn

Mối đe dọa mạng không chờ bạn sẵn sàng. KOOLA cung cấp bảo mật nhiều lớp bảo vệ doanh nghiệp từ trong ra ngoài — kết hợp công nghệ, quy trình và con người thành chiến lược phòng thủ toàn diện.

### Dịch vụ bảo mật

- **Đánh giá & Penetration Testing** — Xác định lỗ hổng trước kẻ tấn công. Chúng tôi kiểm tra mạng, ứng dụng và hạ tầng theo kịch bản tấn công thực tế
- **Thiết kế kiến trúc bảo mật** — Zero-trust, micro-segmentation và defense-in-depth phù hợp với hồ sơ rủi ro
- **Bảo mật mạng** — Next-gen firewall, IDS/IPS, chống DDoS và truy cập từ xa an toàn (VPN/ZTNA)
- **Bảo vệ Endpoint** — Triển khai EDR/XDR, quản lý patch và tuân thủ thiết bị
- **Giám sát SOC** — Trung tâm vận hành bảo mật 24/7 với SIEM, phát hiện mối đe dọa và phản hồi tự động
- **Ứng phó sự cố** — Ngăn chặn nhanh, phân tích forensic và lập kế hoạch phục hồi khi sự cố xảy ra
- **Tuân thủ & Quản trị** — Căn chỉnh framework (ISO 27001, NIST, PCI-DSS, GDPR) với hỗ trợ chuẩn bị audit

### Phương pháp tiếp cận

| Giai đoạn | Chúng tôi làm gì |
|-----------|-----------------|
| Đánh giá | Quét lỗ hổng, penetration testing, phân tích rủi ro |
| Thiết kế | Kiến trúc bảo mật, phát triển chính sách, chọn công cụ |
| Triển khai | Deploy kiểm soát bảo mật, cấu hình giám sát, đào tạo nhân viên |
| Giám sát | Phát hiện mối đe dọa 24/7, phân tích log, phát hiện bất thường |
| Ứng phó | Ngăn chặn sự cố, forensics, phục hồi, rút kinh nghiệm |

### Nhận thức bảo mật

Công nghệ thôi chưa đủ. Chúng tôi cung cấp chương trình đào tạo nhận thức bảo mật biến nhân viên từ mắt xích yếu nhất thành tuyến phòng thủ đầu tiên.$BODY$,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'giai-phap-an-ninh-mang' AND locale = 'vi');

-- ═══════════════════════════════════════════════════════════════
-- 2. BENEFITS (reference by slug — id-agnostic)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_benefits
WHERE service_id IN (
  SELECT id FROM services WHERE slug IN ('cybersecurity-solutions', 'giai-phap-an-ninh-mang')
);

INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order)
SELECT s.id, v.title, v.description, v.icon_name, v.sort_order
FROM services s
JOIN (VALUES
  ('cybersecurity-solutions', 'Proactive Threat Detection', '24/7 SOC monitoring with automated detection and analyst response — finding threats before they become incidents.', 'shield', 1),
  ('cybersecurity-solutions', 'Compliance-Ready Controls', 'Security architecture mapped to ISO 27001, NIST, PCI-DSS, and GDPR. We prepare the evidence your auditors need.', 'check-circle', 2),
  ('cybersecurity-solutions', 'Rapid Incident Response', 'Contain, investigate, and recover — with pre-built playbooks and on-call analysts ready to act within 15 minutes for critical alerts.', 'alert-triangle', 3),
  ('cybersecurity-solutions', 'Human Firewall Training', 'Security awareness programmes that turn employees from the weakest link into your first line of defence.', 'users', 4),
  ('giai-phap-an-ninh-mang', 'Phát hiện mối đe dọa chủ động', 'Giám sát SOC 24/7 với phát hiện tự động và phản hồi chuyên viên — tìm mối đe dọa trước khi thành sự cố.', 'shield', 1),
  ('giai-phap-an-ninh-mang', 'Kiểm soát sẵn sàng tuân thủ', 'Kiến trúc bảo mật ánh xạ theo ISO 27001, NIST, PCI-DSS và GDPR. Chúng tôi chuẩn bị bằng chứng kiểm toán viên cần.', 'check-circle', 2),
  ('giai-phap-an-ninh-mang', 'Ứng phó sự cố nhanh chóng', 'Ngăn chặn, điều tra và phục hồi — với playbook dựng sẵn và chuyên viên trực sẵn sàng hành động trong 15 phút với cảnh báo nghiêm trọng.', 'alert-triangle', 3),
  ('giai-phap-an-ninh-mang', 'Đào tạo tường lửa con người', 'Chương trình nhận thức bảo mật biến nhân viên từ mắt xích yếu nhất thành tuyến phòng thủ đầu tiên.', 'users', 4)
) AS v(slug, title, description, icon_name, sort_order)
ON s.slug = v.slug;

-- ═══════════════════════════════════════════════════════════════
-- 3. DELIVERABLES (id-agnostic via JOIN)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_deliverables
WHERE service_id IN (
  SELECT id FROM services WHERE slug IN ('cybersecurity-solutions', 'giai-phap-an-ninh-mang')
);

INSERT INTO service_deliverables (service_id, title, description, sort_order)
SELECT s.id, v.title, v.description, v.sort_order
FROM services s
JOIN (VALUES
  ('cybersecurity-solutions', 'Security Assessment Report', 'Full vulnerability scan and manual penetration test results with CVSS risk scores, proof-of-concept exploits, and prioritised remediation roadmap.', 1),
  ('cybersecurity-solutions', 'Security Architecture Blueprint', 'Network segmentation design, zero-trust access model, firewall ruleset, and tool recommendations tailored to your environment and budget.', 2),
  ('cybersecurity-solutions', 'SOC Monitoring Dashboard', 'Live SIEM dashboard with pre-built detection rules, alert playbooks, and monthly threat intelligence briefings.', 3),
  ('cybersecurity-solutions', 'Incident Response Playbooks', 'Step-by-step runbooks for the top 10 attack scenarios specific to your industry, ready to execute when an incident occurs.', 4),
  ('cybersecurity-solutions', 'Compliance Evidence Pack', 'Documented controls, audit trails, and gap analysis mapped to ISO 27001, NIST CSF, PCI-DSS, or GDPR — whichever frameworks apply to you.', 5),
  ('cybersecurity-solutions', 'Security Awareness Training', 'Customised e-learning modules, phishing simulation campaign results, and quarterly refresher content for your entire team.', 6),
  ('giai-phap-an-ninh-mang', 'Báo cáo đánh giá bảo mật', 'Kết quả quét lỗ hổng toàn diện và kiểm thử xâm nhập thủ công kèm điểm rủi ro CVSS, khai thác proof-of-concept và lộ trình khắc phục theo ưu tiên.', 1),
  ('giai-phap-an-ninh-mang', 'Bản thiết kế kiến trúc bảo mật', 'Thiết kế phân đoạn mạng, mô hình truy cập zero-trust, bộ quy tắc firewall và khuyến nghị công cụ phù hợp với môi trường và ngân sách của bạn.', 2),
  ('giai-phap-an-ninh-mang', 'Dashboard giám sát SOC', 'Dashboard SIEM trực tiếp với quy tắc phát hiện dựng sẵn, playbook cảnh báo và briefing threat intelligence hàng tháng.', 3),
  ('giai-phap-an-ninh-mang', 'Playbook ứng phó sự cố', 'Quy trình từng bước cho 10 kịch bản tấn công hàng đầu theo ngành của bạn — sẵn sàng thực thi khi sự cố xảy ra.', 4),
  ('giai-phap-an-ninh-mang', 'Bộ hồ sơ tuân thủ', 'Kiểm soát đã ghi chép, nhật ký kiểm toán và phân tích khoảng cách theo ISO 27001, NIST CSF, PCI-DSS hoặc GDPR — framework nào áp dụng cho bạn.', 5),
  ('giai-phap-an-ninh-mang', 'Đào tạo nhận thức bảo mật', 'Module e-learning tùy chỉnh, kết quả chiến dịch phishing mô phỏng và nội dung ôn tập hàng quý cho toàn bộ nhân viên.', 6)
) AS v(slug, title, description, sort_order)
ON s.slug = v.slug;

-- ═══════════════════════════════════════════════════════════════
-- 4. PROCESS STEPS (id-agnostic via JOIN)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_process_steps
WHERE service_id IN (
  SELECT id FROM services WHERE slug IN ('cybersecurity-solutions', 'giai-phap-an-ninh-mang')
);

INSERT INTO service_process_steps (service_id, title, description, sort_order)
SELECT s.id, v.title, v.description, v.sort_order
FROM services s
JOIN (VALUES
  ('cybersecurity-solutions', 'Threat Landscape Assessment', 'We map your attack surface, identify critical assets, and benchmark your current security posture against industry standards before recommending anything.', 1),
  ('cybersecurity-solutions', 'Risk-Prioritised Roadmap', 'Not every vulnerability needs to be fixed today. We rank findings by business impact and exploitability, then build a phased remediation plan that fits your budget and timeline.', 2),
  ('cybersecurity-solutions', 'Architecture & Control Design', 'We design the security architecture — network segmentation, access controls, monitoring stack — and document it so your team understands every decision.', 3),
  ('cybersecurity-solutions', 'Controlled Deployment', 'Security controls are deployed in stages with parallel testing to avoid disruption. Every change is logged and reversible.', 4),
  ('cybersecurity-solutions', 'SOC Activation & Tuning', 'We stand up your SIEM environment, configure detection rules specific to your environment, and tune out false positives during a 30-day stabilisation period.', 5),
  ('cybersecurity-solutions', 'Ongoing Monitoring & Review', 'Continuous 24/7 monitoring with monthly threat reports, quarterly penetration testing, and annual security reviews to keep your defences current.', 6),
  ('giai-phap-an-ninh-mang', 'Đánh giá bối cảnh mối đe dọa', 'Chúng tôi lập bản đồ bề mặt tấn công, xác định tài sản quan trọng và đánh chuẩn tình trạng bảo mật hiện tại theo tiêu chuẩn ngành trước khi đề xuất bất cứ điều gì.', 1),
  ('giai-phap-an-ninh-mang', 'Lộ trình theo rủi ro ưu tiên', 'Không phải lỗ hổng nào cũng cần sửa ngay hôm nay. Chúng tôi xếp hạng phát hiện theo tác động kinh doanh và khả năng khai thác, sau đó xây dựng kế hoạch khắc phục theo giai đoạn phù hợp ngân sách và thời gian.', 2),
  ('giai-phap-an-ninh-mang', 'Thiết kế kiến trúc & kiểm soát', 'Chúng tôi thiết kế kiến trúc bảo mật — phân đoạn mạng, kiểm soát truy cập, monitoring stack — và ghi lại tài liệu để nhóm của bạn hiểu mọi quyết định.', 3),
  ('giai-phap-an-ninh-mang', 'Triển khai có kiểm soát', 'Kiểm soát bảo mật được triển khai theo từng giai đoạn với kiểm thử song song để tránh gián đoạn. Mọi thay đổi đều được ghi lại và có thể hoàn tác.', 4),
  ('giai-phap-an-ninh-mang', 'Kích hoạt & tinh chỉnh SOC', 'Chúng tôi thiết lập môi trường SIEM, cấu hình quy tắc phát hiện cho môi trường cụ thể của bạn và loại bỏ false positive trong giai đoạn ổn định 30 ngày.', 5),
  ('giai-phap-an-ninh-mang', 'Giám sát & đánh giá liên tục', 'Giám sát 24/7 liên tục với báo cáo mối đe dọa hàng tháng, kiểm thử xâm nhập hàng quý và đánh giá bảo mật hàng năm để giữ phòng thủ luôn cập nhật.', 6)
) AS v(slug, title, description, sort_order)
ON s.slug = v.slug;

-- ═══════════════════════════════════════════════════════════════
-- 5. FAQS (id-agnostic via JOIN)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_faqs
WHERE service_id IN (
  SELECT id FROM services WHERE slug IN ('cybersecurity-solutions', 'giai-phap-an-ninh-mang')
);

INSERT INTO service_faqs (service_id, question, answer, sort_order)
SELECT s.id, v.question, v.answer, v.sort_order
FROM services s
JOIN (VALUES
  -- EN FAQs
  ('cybersecurity-solutions', 'What does a security assessment actually cover?',
   'Our assessments cover external network penetration testing (attacking your perimeter from the internet), internal network testing (simulating a compromised insider), web application testing, wireless security, and social engineering simulations. You receive a full technical report with CVSS-scored findings and an executive summary with business impact context. We do not just hand you a scanner output — every finding is manually validated.',
   1),
  ('cybersecurity-solutions', 'Do you offer ongoing monitoring or just one-time assessments?',
   'Both. One-time assessments help you understand your current posture. Ongoing monitoring through our SOC service (SIEM + 24/7 analyst coverage) provides continuous protection. Most clients start with an assessment, then engage us for ongoing monitoring once they understand their risk exposure.',
   2),
  ('cybersecurity-solutions', 'How long does a penetration test take?',
   'Scope determines timeline. A focused external network test typically takes 5-7 business days. A full assessment covering network, applications, and social engineering is usually 2-3 weeks. We provide a clear scope document and timeline before starting so there are no surprises.',
   3),
  ('cybersecurity-solutions', 'What compliance frameworks do you work with?',
   'We work with NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls, MITRE ATT&CK, PCI-DSS, HIPAA, GDPR, and SOC 2. We identify which frameworks apply to your business and build controls that satisfy multiple requirements simultaneously.',
   4),
  ('cybersecurity-solutions', 'Can you help with an active security incident?',
   'Yes. Contact us immediately. For active incidents, we start with containment — isolating affected systems to stop spread — before moving to investigation and recovery. After the incident is contained, we conduct root cause analysis and provide recommendations to prevent recurrence.',
   5),
  ('cybersecurity-solutions', 'How do you handle cloud security (AWS, Azure, GCP)?',
   'We assess cloud configurations against CIS Benchmarks, review IAM policies for privilege escalation paths, audit storage bucket permissions, review VPC network rules, and check for exposed secrets in code repositories. We also implement Cloud Security Posture Management (CSPM) tools for ongoing misconfiguration detection.',
   6),
  ('cybersecurity-solutions', 'What is your approach to security awareness training?',
   'We use a three-part approach: baseline phishing simulation to measure current susceptibility, customised training modules addressing attack types relevant to your industry, and follow-up phishing campaigns to measure improvement. We track completion and susceptibility rates and report quarterly.',
   7),
  ('cybersecurity-solutions', 'How quickly does your SOC respond to a critical alert?',
   'Our SOC is designed for immediate response. For critical alerts — active attacks, ransomware indicators, data exfiltration — our target is analyst acknowledgement within 15 minutes and containment action within 30 minutes. All incidents are documented with full timeline, impact assessment, and post-incident recommendations.',
   8),
  -- VI FAQs
  ('giai-phap-an-ninh-mang', 'Đánh giá bảo mật thực sự bao gồm những gì?',
   'Đánh giá của chúng tôi bao gồm kiểm thử xâm nhập mạng bên ngoài (tấn công vành đai từ internet), kiểm thử mạng nội bộ (mô phỏng insider bị xâm phạm), kiểm thử ứng dụng web, bảo mật không dây và mô phỏng social engineering. Bạn nhận được báo cáo kỹ thuật đầy đủ với phát hiện theo điểm CVSS và bản tóm tắt điều hành. Mọi phát hiện đều được xác minh thủ công.',
   1),
  ('giai-phap-an-ninh-mang', 'Bạn có cung cấp giám sát liên tục hay chỉ đánh giá một lần?',
   'Cả hai. Đánh giá một lần giúp bạn hiểu tình trạng hiện tại. Giám sát liên tục qua dịch vụ SOC (SIEM + phân tích 24/7) cung cấp bảo vệ thường xuyên. Hầu hết khách hàng bắt đầu với đánh giá, sau đó hợp tác giám sát liên tục khi đã hiểu rõ rủi ro.',
   2),
  ('giai-phap-an-ninh-mang', 'Kiểm thử xâm nhập mất bao lâu?',
   'Phạm vi quyết định thời gian. Kiểm thử mạng bên ngoài tập trung thường mất 5-7 ngày làm việc. Đánh giá toàn diện bao gồm mạng, ứng dụng và social engineering thường là 2-3 tuần. Chúng tôi cung cấp tài liệu phạm vi và lịch trình rõ ràng trước khi bắt đầu.',
   3),
  ('giai-phap-an-ninh-mang', 'Bạn làm việc với framework tuân thủ nào?',
   'Chúng tôi làm việc với NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls, MITRE ATT&CK, PCI-DSS, HIPAA, GDPR và SOC 2. Chúng tôi xác định framework nào áp dụng cho doanh nghiệp của bạn và xây dựng kiểm soát đáp ứng nhiều yêu cầu cùng lúc.',
   4),
  ('giai-phap-an-ninh-mang', 'Bạn có thể hỗ trợ sự cố bảo mật đang xảy ra không?',
   'Có. Liên hệ chúng tôi ngay. Với sự cố đang diễn ra, chúng tôi bắt đầu bằng ngăn chặn — cô lập hệ thống bị ảnh hưởng để ngăn lây lan — trước khi chuyển sang điều tra và phục hồi. Sau đó chúng tôi phân tích nguyên nhân gốc rễ và đưa ra khuyến nghị phòng ngừa.',
   5),
  ('giai-phap-an-ninh-mang', 'Bạn xử lý bảo mật cloud (AWS, Azure, GCP) như thế nào?',
   'Chúng tôi đánh giá cấu hình cloud theo CIS Benchmarks, xem xét chính sách IAM tìm đường leo thang đặc quyền, kiểm tra quyền storage bucket, xem lại quy tắc mạng VPC và kiểm tra bí mật bị lộ trong kho code. Chúng tôi cũng triển khai công cụ CSPM để phát hiện cấu hình sai liên tục.',
   6),
  ('giai-phap-an-ninh-mang', 'Phương pháp đào tạo nhận thức bảo mật của bạn là gì?',
   'Chúng tôi dùng cách tiếp cận ba bước: mô phỏng phishing cơ sở để đo mức độ nhạy cảm hiện tại, module đào tạo tùy chỉnh cho các loại tấn công phù hợp với ngành của bạn và chiến dịch phishing tiếp theo để đo cải tiến. Chúng tôi theo dõi tỷ lệ hoàn thành và báo cáo hàng quý.',
   7),
  ('giai-phap-an-ninh-mang', 'SOC của bạn phản hồi cảnh báo nghiêm trọng nhanh như thế nào?',
   'SOC của chúng tôi được thiết kế để phản hồi ngay lập tức. Với cảnh báo nghiêm trọng — tấn công đang diễn ra, dấu hiệu ransomware, rò rỉ dữ liệu — mục tiêu là xác nhận trong 15 phút và hành động ngăn chặn trong 30 phút. Mọi sự cố được ghi lại đầy đủ dòng thời gian và khuyến nghị sau sự cố.',
   8)
) AS v(slug, question, answer, sort_order)
ON s.slug = v.slug;

-- ═══════════════════════════════════════════════════════════════
-- 6. VERIFY
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE
  en_id BIGINT;
  vi_id BIGINT;
BEGIN
  SELECT id INTO en_id FROM services WHERE slug = 'cybersecurity-solutions' AND locale = 'en';
  SELECT id INTO vi_id FROM services WHERE slug = 'giai-phap-an-ninh-mang' AND locale = 'vi';

  RAISE NOTICE 'Cybersecurity EN id=%, VI id=%', en_id, vi_id;

  IF en_id IS NULL OR vi_id IS NULL THEN
    RAISE EXCEPTION 'Cybersecurity service records missing after insert';
  END IF;
END $$;

COMMIT;
