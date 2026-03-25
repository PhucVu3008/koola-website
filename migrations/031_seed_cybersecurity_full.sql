-- Migration 031: Seed Cybersecurity service with full content (EN + VI)
-- Scope: Update service_deliverables, service_process_steps, service_faqs, service_benefits
--        for both EN (id=6) and VI (id=12) Cybersecurity services.
-- Date: 2026-03-25
-- Note: services table content (excerpt, content_md, seo_*) was set in migration 023.
--       This migration fills in the child tables that were missing or incomplete.

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- 1. DELIVERABLES — What we actually hand over
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_deliverables WHERE service_id IN (6, 12);

INSERT INTO service_deliverables (service_id, title, description, sort_order) VALUES
-- EN (id=6)
(6, 'Security Assessment Report', 'Full vulnerability scan and manual penetration test results with CVSS risk scores, proof-of-concept exploits, and prioritised remediation roadmap.', 1),
(6, 'Security Architecture Blueprint', 'Network segmentation design, zero-trust access model, firewall ruleset, and tool recommendations tailored to your environment and budget.', 2),
(6, 'SOC Monitoring Dashboard', 'Live SIEM dashboard with pre-built detection rules, alert playbooks, and monthly threat intelligence briefings.', 3),
(6, 'Incident Response Playbooks', 'Step-by-step runbooks for the top 10 attack scenarios specific to your industry, ready to execute when an incident occurs.', 4),
(6, 'Compliance Evidence Pack', 'Documented controls, audit trails, and gap analysis mapped to ISO 27001, NIST CSF, PCI-DSS, or GDPR — whichever frameworks apply to you.', 5),
(6, 'Security Awareness Training', 'Customised e-learning modules, phishing simulation campaign results, and quarterly refresher content for your entire team.', 6),
-- VI (id=12)
(12, 'Báo cáo đánh giá bảo mật', 'Kết quả quét lỗ hổng toàn diện và kiểm thử xâm nhập thủ công kèm điểm rủi ro CVSS, khai thác proof-of-concept và lộ trình khắc phục theo ưu tiên.', 1),
(12, 'Bản thiết kế kiến trúc bảo mật', 'Thiết kế phân đoạn mạng, mô hình truy cập zero-trust, bộ quy tắc firewall và khuyến nghị công cụ phù hợp với môi trường và ngân sách của bạn.', 2),
(12, 'Dashboard giám sát SOC', 'Dashboard SIEM trực tiếp với quy tắc phát hiện dựng sẵn, playbook cảnh báo và briefing threat intelligence hàng tháng.', 3),
(12, 'Playbook ứng phó sự cố', 'Quy trình từng bước cho 10 kịch bản tấn công hàng đầu theo ngành của bạn — sẵn sàng thực thi khi sự cố xảy ra.', 4),
(12, 'Bộ hồ sơ tuân thủ', 'Kiểm soát đã ghi chép, nhật ký kiểm toán và phân tích khoảng cách theo ISO 27001, NIST CSF, PCI-DSS hoặc GDPR — framework nào áp dụng cho bạn.', 5),
(12, 'Đào tạo nhận thức bảo mật', 'Module e-learning tùy chỉnh, kết quả chiến dịch phishing mô phỏng và nội dung ôn tập hàng quý cho toàn bộ nhân viên.', 6);

-- ═══════════════════════════════════════════════════════════════
-- 2. PROCESS STEPS — How we work
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_process_steps WHERE service_id IN (6, 12);

INSERT INTO service_process_steps (service_id, title, description, sort_order) VALUES
-- EN (id=6)
(6, 'Threat Landscape Assessment', 'We map your attack surface, identify critical assets, and benchmark your current security posture against industry standards before recommending anything.', 1),
(6, 'Risk-Prioritised Roadmap', 'Not every vulnerability needs to be fixed today. We rank findings by business impact and exploitability, then build a phased remediation plan that fits your budget and timeline.', 2),
(6, 'Architecture & Control Design', 'We design the security architecture — network segmentation, access controls, monitoring stack — and document it so your team understands every decision.', 3),
(6, 'Controlled Deployment', 'Security controls are deployed in stages with parallel testing to avoid disruption. Every change is logged and reversible.', 4),
(6, 'SOC Activation & Tuning', 'We stand up your SIEM environment, configure detection rules specific to your environment, and tune out false positives during a 30-day stabilisation period.', 5),
(6, 'Ongoing Monitoring & Review', 'Continuous 24/7 monitoring with monthly threat reports, quarterly penetration testing, and annual security reviews to keep your defences current.', 6),
-- VI (id=12)
(12, 'Đánh giá bối cảnh mối đe dọa', 'Chúng tôi lập bản đồ bề mặt tấn công, xác định tài sản quan trọng và đánh chuẩn tình trạng bảo mật hiện tại theo tiêu chuẩn ngành trước khi đề xuất bất cứ điều gì.', 1),
(12, 'Lộ trình theo rủi ro ưu tiên', 'Không phải lỗ hổng nào cũng cần sửa ngay hôm nay. Chúng tôi xếp hạng phát hiện theo tác động kinh doanh và khả năng khai thác, sau đó xây dựng kế hoạch khắc phục theo giai đoạn phù hợp ngân sách và thời gian.', 2),
(12, 'Thiết kế kiến trúc & kiểm soát', 'Chúng tôi thiết kế kiến trúc bảo mật — phân đoạn mạng, kiểm soát truy cập, monitoring stack — và ghi lại tài liệu để nhóm của bạn hiểu mọi quyết định.', 3),
(12, 'Triển khai có kiểm soát', 'Kiểm soát bảo mật được triển khai theo từng giai đoạn với kiểm thử song song để tránh gián đoạn. Mọi thay đổi đều được ghi lại và có thể hoàn tác.', 4),
(12, 'Kích hoạt & tinh chỉnh SOC', 'Chúng tôi thiết lập môi trường SIEM, cấu hình quy tắc phát hiện cho môi trường cụ thể của bạn và loại bỏ false positive trong giai đoạn ổn định 30 ngày.', 5),
(12, 'Giám sát & đánh giá liên tục', 'Giám sát 24/7 liên tục với báo cáo mối đe dọa hàng tháng, kiểm thử xâm nhập hàng quý và đánh giá bảo mật hàng năm để giữ phòng thủ luôn cập nhật.', 6);

-- ═══════════════════════════════════════════════════════════════
-- 3. FAQS — EN (service_id=6)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_faqs WHERE service_id IN (6, 12);

INSERT INTO service_faqs (service_id, question, answer, sort_order) VALUES

-- EN FAQs
(6, 'What does a security assessment actually cover?',
'Our assessments cover external network penetration testing (attacking your perimeter from the internet), internal network testing (simulating a compromised insider), web application testing, wireless security, and social engineering simulations. You receive a full technical report with CVSS-scored findings and an executive summary with business impact context. We do not just hand you a scanner output — every finding is manually validated.',
1),

(6, 'Do you offer ongoing security monitoring or just one-time assessments?',
'Both. One-time assessments help you understand your current posture. Ongoing monitoring through our SOC service (SIEM + 24/7 analyst coverage) provides continuous protection. Most clients start with an assessment, then engage us for ongoing monitoring once they understand their risk exposure. We can also do quarterly assessments without the managed service if your team handles day-to-day monitoring.',
2),

(6, 'How long does a penetration test take?',
'Scope determines timeline. A focused external network test typically takes 5-7 business days. A full assessment covering network, applications, and social engineering is usually 2-3 weeks. We provide a clear scope document and timeline before starting so there are no surprises.',
3),

(6, 'What frameworks do you work with for compliance?',
'We work with NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls, MITRE ATT&CK, PCI-DSS (for card data environments), HIPAA (healthcare), GDPR (data privacy), and SOC 2. We identify which frameworks apply to your business and build controls that satisfy multiple requirements simultaneously rather than treating each framework as a separate project.',
4),

(6, 'Can you help with a security incident that is happening right now?',
'Yes. Contact us immediately at our emergency line. For active incidents, we start with containment — isolating affected systems to stop spread — before moving to investigation and recovery. We do not wait for a full forensic picture before acting. After the incident is contained, we conduct root cause analysis, document the timeline, and provide recommendations to prevent recurrence.',
5),

(6, 'How do you handle security for cloud environments (AWS, Azure, GCP)?',
'Cloud security requires different approaches than on-premise. We assess cloud configurations against CIS Benchmarks, review IAM policies for privilege escalation paths, audit storage bucket permissions, review VPC network rules, and check for exposed secrets in code repositories. We also implement Cloud Security Posture Management (CSPM) tools for ongoing misconfiguration detection.',
6),

(6, 'What is your approach to employee security training?',
'We use a three-part approach: baseline phishing simulation to measure current susceptibility, customised training modules addressing the specific attack types relevant to your industry, and follow-up phishing campaigns to measure improvement. Training is available as live workshops, self-paced online modules, or a combination. We track completion and susceptibility rates and report quarterly.',
7),

(6, 'How quickly can your SOC respond to a critical alert?',
'Our SOC is designed for immediate response. For critical alerts — active attacks, ransomware indicators, data exfiltration — our target is analyst acknowledgement within 15 minutes and containment action within 30 minutes. Medium-severity alerts target 1-hour response. All incidents are documented with full timeline, impact assessment, and post-incident recommendations.',
8),

-- VI FAQs (service_id=12)
(12, 'Đánh giá bảo mật thực sự bao gồm những gì?',
'Đánh giá của chúng tôi bao gồm kiểm thử xâm nhập mạng bên ngoài (tấn công vành đai từ internet), kiểm thử mạng nội bộ (mô phỏng insider bị xâm phạm), kiểm thử ứng dụng web, bảo mật không dây và mô phỏng social engineering. Bạn nhận được báo cáo kỹ thuật đầy đủ với phát hiện theo điểm CVSS và bản tóm tắt điều hành với bối cảnh tác động kinh doanh. Chúng tôi không chỉ đưa kết quả từ scanner — mọi phát hiện đều được xác minh thủ công.',
1),

(12, 'Bạn có cung cấp giám sát bảo mật liên tục hay chỉ đánh giá một lần?',
'Cả hai. Đánh giá một lần giúp bạn hiểu tình trạng hiện tại. Giám sát liên tục qua dịch vụ SOC (SIEM + phân tích 24/7) cung cấp bảo vệ thường xuyên. Hầu hết khách hàng bắt đầu với đánh giá, sau đó hợp tác giám sát liên tục khi đã hiểu rõ rủi ro. Chúng tôi cũng có thể thực hiện đánh giá hàng quý nếu nhóm của bạn xử lý giám sát hàng ngày.',
2),

(12, 'Kiểm thử xâm nhập mất bao lâu?',
'Phạm vi quyết định thời gian. Kiểm thử mạng bên ngoài tập trung thường mất 5-7 ngày làm việc. Đánh giá toàn diện bao gồm mạng, ứng dụng và social engineering thường là 2-3 tuần. Chúng tôi cung cấp tài liệu phạm vi và lịch trình rõ ràng trước khi bắt đầu để không có bất ngờ.',
3),

(12, 'Bạn làm việc với framework tuân thủ nào?',
'Chúng tôi làm việc với NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls, MITRE ATT&CK, PCI-DSS (môi trường dữ liệu thẻ), HIPAA (y tế), GDPR (bảo mật dữ liệu) và SOC 2. Chúng tôi xác định framework nào áp dụng cho doanh nghiệp của bạn và xây dựng kiểm soát đáp ứng nhiều yêu cầu cùng lúc thay vì xử lý từng framework riêng lẻ.',
4),

(12, 'Bạn có thể hỗ trợ sự cố bảo mật đang xảy ra ngay bây giờ không?',
'Có. Liên hệ chúng tôi ngay qua đường dây khẩn cấp. Với sự cố đang diễn ra, chúng tôi bắt đầu bằng ngăn chặn — cô lập hệ thống bị ảnh hưởng để ngăn lây lan — trước khi chuyển sang điều tra và phục hồi. Sau khi sự cố được ngăn chặn, chúng tôi phân tích nguyên nhân gốc rễ, ghi lại dòng thời gian và đưa ra khuyến nghị phòng ngừa tái phát.',
5),

(12, 'Bạn xử lý bảo mật cho môi trường cloud (AWS, Azure, GCP) như thế nào?',
'Bảo mật cloud cần cách tiếp cận khác so với on-premise. Chúng tôi đánh giá cấu hình cloud theo CIS Benchmarks, xem xét chính sách IAM tìm đường leo thang đặc quyền, kiểm tra quyền storage bucket, xem lại quy tắc mạng VPC và kiểm tra bí mật bị lộ trong kho code. Chúng tôi cũng triển khai công cụ Cloud Security Posture Management (CSPM) để phát hiện cấu hình sai liên tục.',
6),

(12, 'Phương pháp đào tạo nhận thức bảo mật của bạn là gì?',
'Chúng tôi dùng cách tiếp cận ba bước: mô phỏng phishing cơ sở để đo mức độ nhạy cảm hiện tại, module đào tạo tùy chỉnh cho các loại tấn công phù hợp với ngành của bạn và chiến dịch phishing tiếp theo để đo cải tiến. Đào tạo có dạng workshop trực tiếp, module online tự học hoặc kết hợp. Chúng tôi theo dõi tỷ lệ hoàn thành và nhạy cảm, báo cáo hàng quý.',
7),

(12, 'SOC của bạn phản hồi cảnh báo nghiêm trọng nhanh như thế nào?',
'SOC của chúng tôi được thiết kế để phản hồi ngay lập tức. Với cảnh báo nghiêm trọng — tấn công đang diễn ra, dấu hiệu ransomware, rò rỉ dữ liệu — mục tiêu là chuyên viên xác nhận trong 15 phút và hành động ngăn chặn trong 30 phút. Cảnh báo mức trung bình mục tiêu 1 giờ. Mọi sự cố được ghi lại đầy đủ dòng thời gian, đánh giá tác động và khuyến nghị sau sự cố.',
8);

-- ═══════════════════════════════════════════════════════════════
-- 4. BENEFITS — Refresh with icon_name for EN + VI
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_benefits WHERE service_id IN (6, 12);

INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order) VALUES
-- EN (id=6)
(6, 'Proactive Threat Detection', '24/7 SOC monitoring with automated detection and analyst response — finding threats before they become incidents.', 'shield', 1),
(6, 'Compliance-Ready Controls', 'Security architecture mapped to ISO 27001, NIST, PCI-DSS, and GDPR. We prepare the evidence your auditors need.', 'check-circle', 2),
(6, 'Rapid Incident Response', 'Contain, investigate, and recover — with pre-built playbooks and on-call analysts ready to act within 15 minutes for critical alerts.', 'alert-triangle', 3),
(6, 'Human Firewall Training', 'Security awareness programmes that turn employees from the weakest link into your first line of defence.', 'users', 4),
-- VI (id=12)
(12, 'Phát hiện mối đe dọa chủ động', 'Giám sát SOC 24/7 với phát hiện tự động và phản hồi chuyên viên — tìm mối đe dọa trước khi thành sự cố.', 'shield', 1),
(12, 'Kiểm soát sẵn sàng tuân thủ', 'Kiến trúc bảo mật ánh xạ theo ISO 27001, NIST, PCI-DSS và GDPR. Chúng tôi chuẩn bị bằng chứng kiểm toán viên cần.', 'check-circle', 2),
(12, 'Ứng phó sự cố nhanh chóng', 'Ngăn chặn, điều tra và phục hồi — với playbook dựng sẵn và chuyên viên trực sẵn sàng hành động trong 15 phút với cảnh báo nghiêm trọng.', 'alert-triangle', 3),
(12, 'Đào tạo tường lửa con người', 'Chương trình nhận thức bảo mật biến nhân viên từ mắt xích yếu nhất thành tuyến phòng thủ đầu tiên.', 'users', 4);

COMMIT;
