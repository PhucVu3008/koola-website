-- Seed benefits_subtitle for all services
-- Each service gets a unique, compelling subtitle describing the value proposition

-- English Services (locale = 'en')

-- Service 1: IoT System Integration
UPDATE services SET benefits_subtitle = 'Transform your operations with intelligent IoT solutions that connect devices, collect data, and drive actionable insights for your business.'
WHERE slug = 'iot-system-integration' AND locale = 'en';

-- Service 2: Industrial Automation
UPDATE services SET benefits_subtitle = 'Revolutionize your manufacturing with smart automation systems that increase productivity, ensure quality consistency, and reduce operational costs.'
WHERE slug = 'industrial-automation' AND locale = 'en';

-- Service 3: IT Infrastructure Solutions
UPDATE services SET benefits_subtitle = 'Build a rock-solid IT foundation with enterprise-grade infrastructure that delivers high availability, scalability, and security for your growing business.'
WHERE slug = 'it-infrastructure-solutions' AND locale = 'en';

-- Service 4: Smart Building Solutions
UPDATE services SET benefits_subtitle = 'Create intelligent, sustainable buildings with integrated systems that optimize energy usage, enhance comfort, and provide centralized management.'
WHERE slug = 'smart-building-solutions' AND locale = 'en';

-- Service 5: Cloud Infrastructure Management
UPDATE services SET benefits_subtitle = 'Accelerate your digital transformation with scalable cloud solutions that reduce costs, enable rapid deployment, and support global growth.'
WHERE slug = 'cloud-infrastructure-management' AND locale = 'en';

-- Service 6: Cybersecurity Solutions
UPDATE services SET benefits_subtitle = 'Protect your business assets with enterprise-grade security solutions that provide 24/7 threat protection, ensure compliance, and defend against evolving cyber threats.'
WHERE slug = 'cybersecurity-solutions' AND locale = 'en';

-- Vietnamese Services (locale = 'vi')

-- Service 7: IoT System Integration (VI)
UPDATE services SET benefits_subtitle = 'Chuyển đổi hoạt động của bạn với các giải pháp IoT thông minh kết nối thiết bị, thu thập dữ liệu và tạo ra những thông tin chi tiết hữu ích cho doanh nghiệp.'
WHERE slug = 'tich-hop-he-thong-iot' AND locale = 'vi';

-- Service 8: Industrial Automation (VI)
UPDATE services SET benefits_subtitle = 'Cách mạng hóa sản xuất với hệ thống tự động hóa thông minh giúp tăng năng suất, đảm bảo chất lượng nhất quán và giảm chi phí vận hành.'
WHERE slug = 'tu-dong-hoa-cong-nghiep' AND locale = 'vi';

-- Service 9: IT Infrastructure Solutions (VI)
UPDATE services SET benefits_subtitle = 'Xây dựng nền tảng IT vững chắc với hạ tầng doanh nghiệp mang lại tính khả dụng cao, khả năng mở rộng và bảo mật cho doanh nghiệp đang phát triển.'
WHERE slug = 'giai-phap-ha-tang-cntt' AND locale = 'vi';

-- Service 10: Smart Building Solutions (VI)
UPDATE services SET benefits_subtitle = 'Tạo ra các tòa nhà thông minh, bền vững với hệ thống tích hợp tối ưu hóa năng lượng, nâng cao sự thoải mái và cung cấp quản lý tập trung.'
WHERE slug = 'giai-phap-toa-nha-thong-minh' AND locale = 'vi';

-- Service 11: Cloud Infrastructure Management (VI)
UPDATE services SET benefits_subtitle = 'Đẩy nhanh chuyển đổi số với giải pháp cloud có khả năng mở rộng giúp giảm chi phí, triển khai nhanh và hỗ trợ phát triển toàn cầu.'
WHERE slug = 'quan-ly-ha-tang-dam-may' AND locale = 'vi';

-- Service 12: Cybersecurity Solutions (VI)
UPDATE services SET benefits_subtitle = 'Bảo vệ tài sản doanh nghiệp với giải pháp bảo mật cấp doanh nghiệp cung cấp bảo vệ mối đe dọa 24/7, đảm bảo tuân thủ và phòng thủ trước các mối đe dọa mạng đang phát triển.'
WHERE slug = 'giai-phap-an-ninh-mang' AND locale = 'vi';
