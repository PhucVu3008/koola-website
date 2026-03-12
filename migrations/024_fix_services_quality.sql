-- Migration 024: Fix service content quality issues
-- 1. Fix icon_name mismatches for IT Infrastructure, Smart Building, Cybersecurity
-- 2. Fix FAQ claims that are too bold for a startup (EN + VI)
-- 3. Improve Vietnamese FAQ language quality

BEGIN;

-- ============================================================
-- 1. FIX ICON NAMES
-- ============================================================

-- IT Infrastructure: cloud → server (avoid conflict with Cloud Infrastructure)
UPDATE services SET icon_name = 'server' WHERE id = 3;
UPDATE services SET icon_name = 'server' WHERE id = 9;

-- Smart Building: pen → building
UPDATE services SET icon_name = 'building' WHERE id = 4;
UPDATE services SET icon_name = 'building' WHERE id = 10;

-- Cybersecurity: code/NULL → shield
UPDATE services SET icon_name = 'shield' WHERE id = 6;
UPDATE services SET icon_name = 'shield' WHERE id = 12;

-- ============================================================
-- 2. FIX EN FAQ CLAIMS (too bold for startup)
-- ============================================================

-- FAQ 3 (IoT): Remove "successfully integrated" claim
UPDATE service_faqs SET answer = 'Absolutely. System integration is one of our core strengths. We integrate IoT platforms with SAP, Oracle, Microsoft Dynamics, custom ERPs, MES systems, and various databases using standard APIs, message queues, and ETL processes to ensure seamless data flow between your systems.'
WHERE id = 3;

-- FAQ 5 (Industrial Automation): Remove "extensive experience" claim
UPDATE service_faqs SET answer = 'We work with all major PLC platforms including Siemens (S7-300/400/1200/1500), Allen-Bradley (ControlLogix, CompactLogix), Mitsubishi, Schneider Electric, Omron, and Beckhoff. We support all major industrial protocols including Profibus, Profinet, EtherNet/IP, Modbus TCP/RTU, OPC-UA, and EtherCAT.'
WHERE id = 5;

-- FAQ 8 (Industrial Automation): Remove specific % claims
UPDATE service_faqs SET answer = 'Absolutely. We integrate vibration sensors, temperature monitoring, current monitoring, and other industrial IoT sensors with machine learning models to predict equipment failures before they happen. Predictive maintenance solutions can significantly reduce unplanned downtime and extend equipment life, helping you move from reactive to proactive maintenance strategies.'
WHERE id = 8;

-- FAQ 12 (IT Infrastructure): Remove "extensive experience" claim
UPDATE service_faqs SET answer = 'Yes, our infrastructure designs account for regulatory compliance requirements. We understand ISO 27001, HIPAA, PCI DSS, GDPR, and industry-specific regulations. Our designs include proper network segmentation, access controls, audit logging, encryption, and documentation required for compliance audits.'
WHERE id = 12;

-- FAQ 14 (Smart Building): Remove "Based on our implementations" claim
UPDATE service_faqs SET answer = 'Industry benchmarks show typical energy cost reductions of 25-40% depending on building age and current systems. Savings come from optimized HVAC scheduling, occupancy-based control, daylight harvesting, demand response, and eliminating simultaneous heating/cooling. Most smart building installations achieve ROI within 2-3 years from energy savings alone.'
WHERE id = 14;

-- FAQ 15 (Smart Building): Remove "50+ buildings" false claim
UPDATE service_faqs SET answer = 'Absolutely. Our platform supports multi-site management with centralized dashboards, aggregated reporting, and standardized configurations. You can monitor and control all buildings from a single interface while maintaining local autonomy. The architecture is designed to scale from a single building to an entire campus or portfolio with unified energy management and maintenance workflows.'
WHERE id = 15;

-- FAQ 22 (Cybersecurity): Rephrase response time as SLA target
UPDATE service_faqs SET answer = 'Our 24/7 Security Operations Center (SOC) is designed for immediate incident response. For critical security alerts (active attacks, ransomware, data exfiltration), our target response time is under 15 minutes with security analysts investigating immediately. For medium-severity incidents, response within 1 hour. All incidents include detailed forensics, containment, remediation, and post-incident reporting.'
WHERE id = 22;

-- ============================================================
-- 3. FIX VI FAQ CLAIMS + IMPROVE LANGUAGE QUALITY
-- ============================================================

-- FAQ 27 (IoT VI): Remove "đã tích hợp thành công" claim + improve language
UPDATE service_faqs SET answer = 'Hoàn toàn được. Tích hợp hệ thống là một trong những thế mạnh cốt lõi của chúng tôi. Chúng tôi tích hợp nền tảng IoT với SAP, Oracle, Microsoft Dynamics, các hệ thống ERP tùy chỉnh, MES và nhiều loại cơ sở dữ liệu khác nhau. Chúng tôi sử dụng API tiêu chuẩn, hàng đợi tin nhắn và quy trình ETL để đảm bảo luồng dữ liệu liền mạch giữa các hệ thống.'
WHERE id = 27;

-- FAQ 25 (IoT VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi hỗ trợ tất cả các giao thức IoT chính bao gồm MQTT, CoAP, HTTP/REST, WebSocket, Modbus và OPC-UA. Chúng tôi làm việc với AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard và các nền tảng on-premise tùy chỉnh. Phương pháp không phụ thuộc nền tảng đảm bảo tích hợp được với hạ tầng hiện có của bạn.'
WHERE id = 25;

-- FAQ 26 (IoT VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Thời gian dự án thay đổi dựa trên độ phức tạp và quy mô. Giải pháp IoT cơ bản với 10-50 thiết bị thường mất 8-12 tuần. Triển khai quy mô doanh nghiệp với hàng nghìn thiết bị và tích hợp phức tạp có thể mất 4-6 tháng. Chúng tôi cung cấp lịch trình chi tiết trong giai đoạn khảo sát với các mốc tiến độ rõ ràng.'
WHERE id = 26;

-- FAQ 28 (IoT VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Bảo mật được tích hợp vào mọi tầng của giải pháp IoT. Chúng tôi triển khai xác thực thiết bị, mã hóa TLS/SSL cho dữ liệu truyền tải, lưu trữ được mã hóa, cập nhật firmware an toàn, phân đoạn mạng và kiểm tra bảo mật định kỳ. Chúng tôi tuân thủ các tiêu chuẩn ngành bao gồm GDPR, ISO 27001 và các quy định chuyên ngành.'
WHERE id = 28;

-- FAQ 29 (Automation VI): Remove "kinh nghiệm phong phú" + improve language
UPDATE service_faqs SET answer = 'Chúng tôi làm việc với tất cả các nền tảng PLC chính bao gồm Siemens (S7-300/400/1200/1500), Allen-Bradley (ControlLogix, CompactLogix), Mitsubishi, Schneider Electric, Omron và Beckhoff. Chúng tôi hỗ trợ tất cả giao thức công nghiệp chính bao gồm Profibus, Profinet, EtherNet/IP, Modbus TCP/RTU, OPC-UA và EtherCAT.'
WHERE id = 29;

-- FAQ 30 (Automation VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi sử dụng phương pháp triển khai từng giai đoạn: kiểm thử kỹ lưỡng trong phòng lab, vận hành hệ thống song song trong giai đoạn chuyển đổi, lắp đặt trong các đợt bảo trì theo kế hoạch và quy trình rollback toàn diện. Hầu hết các lắp đặt được hoàn thành vào cuối tuần hoặc trong thời gian bảo trì định kỳ.'
WHERE id = 30;

-- FAQ 31 (Automation VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Có, đào tạo toàn diện được bao gồm, bao quát vận hành, xử lý sự cố và bảo trì. Chúng tôi cung cấp tài liệu hướng dẫn vận hành, quy trình bảo trì và tài liệu kỹ thuật đầy đủ. Các gói hỗ trợ bao gồm giám sát từ xa, hỗ trợ trực tuyến, bảo trì phòng ngừa định kỳ và dịch vụ tối ưu hệ thống.'
WHERE id = 31;

-- FAQ 32 (Automation VI): Remove specific % claims + improve language
UPDATE service_faqs SET answer = 'Hoàn toàn được. Chúng tôi tích hợp cảm biến rung động, giám sát nhiệt độ, giám sát dòng điện và các cảm biến IoT công nghiệp khác với mô hình machine learning để dự đoán hỏng hóc thiết bị trước khi xảy ra. Giải pháp bảo trì dự đoán giúp giảm đáng kể thời gian ngừng hoạt động ngoài kế hoạch và kéo dài tuổi thọ thiết bị, chuyển từ bảo trì phản ứng sang chủ động.'
WHERE id = 32;

-- FAQ 36 (IT Infra VI): Remove "kinh nghiệm phong phú" + improve language
UPDATE service_faqs SET answer = 'Có, thiết kế hạ tầng của chúng tôi đáp ứng các yêu cầu tuân thủ quy định. Chúng tôi nắm vững ISO 27001, HIPAA, PCI DSS, GDPR và các quy định chuyên ngành. Thiết kế bao gồm phân đoạn mạng phù hợp, kiểm soát truy cập, ghi nhật ký kiểm toán, mã hóa và tài liệu cần thiết cho các cuộc kiểm tra tuân thủ.'
WHERE id = 36;

-- FAQ 33 (IT Infra VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Có, chúng tôi thiết kế và triển khai trung tâm dữ liệu on-premise, giải pháp cloud thuần túy và kiến trúc hybrid. Chúng tôi đánh giá khối lượng công việc và đề xuất phương án tối ưu dựa trên yêu cầu hiệu suất, nhu cầu tuân thủ, cân nhắc chi phí và mục tiêu kinh doanh. Nhiều doanh nghiệp hưởng lợi từ phương pháp hybrid kết hợp hệ thống quan trọng on-premise với khả năng mở rộng của cloud.'
WHERE id = 33;

-- FAQ 34 (IT Infra VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi thiết kế cho khả năng phục hồi ở mọi tầng: đường mạng dự phòng, máy chủ cluster, lưu trữ sao chép và sao lưu phân tán địa lý. Chúng tôi xác định RTO (Mục tiêu Thời gian Phục hồi) và RPO (Mục tiêu Điểm Phục hồi) dựa trên yêu cầu kinh doanh và triển khai giải pháp đạt hoặc vượt các mục tiêu này. Kiểm tra DR định kỳ được bao gồm trong dịch vụ.'
WHERE id = 34;

-- FAQ 35 (IT Infra VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi triển khai giám sát 24/7 với cảnh báo tự động cho tất cả hệ thống quan trọng. Đội ngũ NOC (Trung tâm Vận hành Mạng) phản hồi sự cố ngay lập tức. Chúng tôi cung cấp hỗ trợ phân tầng: Cấp 1 cho sự cố cơ bản (phản hồi trong 30 phút), Cấp 2 cho sự cố phức tạp (trong 2 giờ) và Cấp 3 cho sự cố nghiêm trọng (trong 15 phút).'
WHERE id = 35;

-- FAQ 38 (Smart Building VI): Remove "Dựa trên các triển khai" claim
UPDATE service_faqs SET answer = 'Theo tiêu chuẩn ngành, giảm chi phí năng lượng điển hình dao động từ 25-40% tùy thuộc vào tuổi tòa nhà và hệ thống hiện tại. Tiết kiệm đến từ lập lịch HVAC tối ưu, điều khiển dựa trên mức độ sử dụng, tận dụng ánh sáng tự nhiên, phản hồi nhu cầu và loại bỏ sưởi/làm mát đồng thời. Hầu hết các triển khai tòa nhà thông minh đạt ROI trong 2-3 năm chỉ từ tiết kiệm năng lượng.'
WHERE id = 38;

-- FAQ 39 (Smart Building VI): Remove "50+ buildings" false claim
UPDATE service_faqs SET answer = 'Hoàn toàn được. Nền tảng hỗ trợ quản lý đa địa điểm với bảng điều khiển tập trung, báo cáo tổng hợp và cấu hình tiêu chuẩn hóa. Bạn có thể giám sát và điều khiển tất cả tòa nhà từ một giao diện duy nhất đồng thời duy trì quyền tự chủ cục bộ. Kiến trúc được thiết kế để mở rộng từ một tòa nhà đến toàn bộ khuôn viên hoặc danh mục bất động sản với quản lý năng lượng và quy trình bảo trì thống nhất.'
WHERE id = 39;

-- FAQ 37 (Smart Building VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi tích hợp HVAC (sưởi ấm, thông gió, điều hòa), điều khiển chiếu sáng, kiểm soát truy cập và an ninh, hệ thống phòng cháy chữa cháy, quản lý thang máy, đồng hồ năng lượng, quản lý nước, hệ thống bãi đỗ xe và cảm biến môi trường (nhiệt độ, độ ẩm, CO2, chất lượng không khí) vào một nền tảng quản lý tòa nhà thống nhất với giám sát và điều khiển tập trung.'
WHERE id = 37;

-- FAQ 40 (Smart Building VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Sự thoải mái của người sử dụng là trọng tâm chính. Chúng tôi triển khai cảm biến nhiệt độ, độ ẩm, CO2 và VOC để đảm bảo môi trường trong nhà lành mạnh. Hệ thống tự động điều chỉnh HVAC và thông gió để duy trì điều kiện tối ưu. Người sử dụng có thể phản hồi qua ứng dụng di động, và hệ thống học hỏi sở thích theo thời gian đồng thời cân bằng giữa tiện nghi và hiệu quả năng lượng.'
WHERE id = 40;

-- FAQ 45 (Cybersecurity VI): Improve Vietnamese quality - remove "align"
UPDATE service_faqs SET answer = 'Chúng tôi tuân theo các framework hàng đầu ngành bao gồm NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls và MITRE ATT&CK. Về tuân thủ, chúng tôi hỗ trợ SOC 2, PCI DSS, HIPAA, GDPR, CMMC (cho nhà thầu quốc phòng) và các quy định chuyên ngành. Phương pháp của chúng tôi dựa trên rủi ro, ưu tiên các biện pháp kiểm soát mang lại bảo vệ tốt nhất cho bối cảnh mối đe dọa cụ thể của bạn.'
WHERE id = 45;

-- FAQ 46 (Cybersecurity VI): Rephrase response time as SLA target
UPDATE service_faqs SET answer = 'Trung tâm Vận hành An ninh (SOC) 24/7 được thiết kế để phản hồi sự cố ngay lập tức. Với cảnh báo bảo mật nghiêm trọng (tấn công đang diễn ra, ransomware, rò rỉ dữ liệu), mục tiêu thời gian phản hồi là dưới 15 phút với chuyên viên bảo mật điều tra ngay lập tức. Với sự cố mức trung bình, phản hồi trong 1 giờ. Tất cả sự cố bao gồm phân tích forensic chi tiết, ngăn chặn, khắc phục và báo cáo sau sự cố.'
WHERE id = 46;

-- FAQ 47 (Cybersecurity VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Dịch vụ kiểm thử xâm nhập bao gồm kiểm tra mạng bên ngoài, kiểm tra mạng nội bộ, kiểm tra ứng dụng web, đánh giá bảo mật không dây, mô phỏng social engineering và kiểm tra bảo mật vật lý (nếu yêu cầu). Chúng tôi sử dụng cả kỹ thuật quét tự động và khai thác thủ công. Sản phẩm bàn giao bao gồm tóm tắt điều hành, phát hiện chi tiết với xếp hạng rủi ro, khai thác proof-of-concept và khuyến nghị khắc phục cụ thể.'
WHERE id = 47;

-- FAQ 48 (Cybersecurity VI): Improve Vietnamese quality - remove "critical"
UPDATE service_faqs SET answer = 'Có, yếu tố con người rất quan trọng cho bảo mật. Chúng tôi cung cấp chương trình đào tạo nhận thức bảo mật toàn diện bao gồm nhận diện phishing, bảo mật mật khẩu, social engineering, bảo mật thiết bị di động và sử dụng internet an toàn. Chúng tôi thực hiện các chiến dịch phishing mô phỏng để đo lường hiệu quả và cung cấp đào tạo có mục tiêu. Đào tạo có sẵn dưới dạng buổi học trực tiếp, khóa học trực tuyến và ôn tập hàng quý với thông tin mối đe dọa cập nhật.'
WHERE id = 48;

-- FAQ 41-44 (Cloud VI): Improve Vietnamese quality
UPDATE service_faqs SET answer = 'Chúng tôi làm việc với AWS, Azure và Google Cloud Platform. Lựa chọn phụ thuộc vào nhu cầu cụ thể: AWS cho độ rộng dịch vụ và sự trưởng thành, Azure cho tích hợp hệ sinh thái Microsoft và kịch bản hybrid, GCP cho khả năng phân tích dữ liệu và machine learning. Chúng tôi thường khuyến nghị chiến lược đa đám mây để tránh phụ thuộc nhà cung cấp và tận dụng dịch vụ tốt nhất từ mỗi nền tảng.'
WHERE id = 41;

UPDATE service_faqs SET answer = 'Chúng tôi sử dụng các mô hình migration đã được kiểm chứng: sao chép cơ sở dữ liệu với chuyển đổi lưu lượng dần dần, triển khai blue-green, migration thí điểm với khối lượng công việc nhỏ trước, kiểm thử toàn diện trong môi trường staging, quy trình rollback tự động và hỗ trợ 24/7 trong thời gian chuyển đổi. Phương pháp từng giai đoạn và lập kế hoạch kỹ lưỡng đảm bảo uptime tối đa trong quá trình migration.'
WHERE id = 42;

UPDATE service_faqs SET answer = 'Tối ưu chi phí cloud là quá trình liên tục. Chúng tôi triển khai khuyến nghị right-sizing tự động, spot instances cho khối lượng công việc không quan trọng, reserved instances cho tải dự đoán được, auto-scaling theo nhu cầu, chính sách lifecycle để chuyển dữ liệu ít truy cập sang lưu trữ rẻ hơn và hệ thống phân bổ chi phí toàn diện. Tối ưu chi phí cloud thường giúp giảm 30-45% chi phí trong 6 tháng đầu.'
WHERE id = 43;

UPDATE service_faqs SET answer = 'Có, chuyển đổi DevOps là yếu tố trung tâm cho thành công trên cloud. Chúng tôi triển khai infrastructure as code (Terraform, CloudFormation), container hóa (Docker, Kubernetes), pipeline CI/CD tự động (Jenkins, GitLab, GitHub Actions), kiểm thử tự động và giám sát. Điều này giúp tăng tốc chu kỳ triển khai từ hàng tuần xuống hàng giờ đồng thời cải thiện độ tin cậy và giảm lỗi.'
WHERE id = 44;

COMMIT;

