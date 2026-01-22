-- Seed data for service_benefits
-- Key benefits/value propositions for each service
-- 3 benefits per service for the "Key Benefits" section

INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order) VALUES
  -- Service 1: IoT System Integration (EN)
  (1, 'Real-Time Monitoring', 'Monitor all connected devices and systems in real-time with comprehensive dashboards and instant alerts for critical events', 'Activity', 1),
  (1, 'Predictive Analytics', 'Leverage machine learning to predict equipment failures, optimize operations, and reduce downtime by up to 50%', 'TrendingUp', 2),
  (1, 'Seamless Integration', 'Connect with existing ERP, MES, and enterprise systems through standard APIs and protocols for unified data flow', 'Link', 3),
  
  -- Service 2: Industrial Automation (EN)
  (2, 'Increased Productivity', 'Boost production output by 30-50% through optimized automation, reduced cycle times, and 24/7 operation capability', 'Zap', 1),
  (2, 'Quality Consistency', 'Achieve consistent product quality with automated quality control, reducing defects by 40% and minimizing waste', 'CheckCircle', 2),
  (2, 'Reduced Operational Costs', 'Lower labor costs, energy consumption, and maintenance expenses through intelligent automation and predictive maintenance', 'DollarSign', 3),
  
  -- Service 3: IT Infrastructure Solutions (EN)
  (3, 'High Availability', '99.9% uptime guarantee with redundant systems, automated failover, and 24/7 monitoring for business continuity', 'Shield', 1),
  (3, 'Scalable Architecture', 'Easily scale infrastructure up or down based on business needs without major disruptions or capital investment', 'Maximize', 2),
  (3, 'Enterprise Security', 'Multi-layered security with firewall, IDS/IPS, encryption, and compliance with ISO 27001, HIPAA, PCI DSS standards', 'Lock', 3),
  
  -- Service 4: Smart Building Solutions (EN)
  (4, 'Energy Cost Savings', 'Reduce energy consumption by 30-40% through intelligent HVAC control, lighting optimization, and demand response', 'Battery', 1),
  (4, 'Enhanced Comfort', 'Maintain optimal indoor conditions with automated temperature, humidity, and air quality control for occupant satisfaction', 'Wind', 2),
  (4, 'Centralized Management', 'Control all building systems from a single platform with mobile access, automated scheduling, and real-time insights', 'Smartphone', 3),
  
  -- Service 5: Cloud Infrastructure Management (EN)
  (5, 'Cost Optimization', 'Reduce cloud spending by 30-45% through right-sizing, reserved instances, spot instances, and automated cost management', 'DollarSign', 1),
  (5, 'Rapid Deployment', 'Deploy applications 10x faster with automated CI/CD pipelines, infrastructure as code, and containerization', 'Rocket', 2),
  (5, 'Global Scalability', 'Scale applications globally with multi-region deployment, auto-scaling, and content delivery networks for low latency', 'Globe', 3),
  
  -- Service 6: Cybersecurity Solutions (EN)
  (6, '24/7 Threat Protection', 'Round-the-clock security monitoring with 15-minute incident response time and 99.7% threat detection rate', 'Shield', 1),
  (6, 'Compliance Assurance', 'Meet regulatory requirements (ISO 27001, SOC 2, HIPAA, GDPR) with comprehensive documentation and audit support', 'FileCheck', 2),
  (6, 'Proactive Defense', 'Stay ahead of threats with threat intelligence, vulnerability scanning, penetration testing, and security awareness training', 'Eye', 3),
  
  -- Service 7: Tích hợp Hệ thống IoT (VI)
  (7, 'Giám Sát Real-Time', 'Giám sát tất cả thiết bị và hệ thống kết nối real-time với dashboards toàn diện và cảnh báo tức thì cho sự kiện critical', 'Activity', 1),
  (7, 'Phân Tích Dự Đoán', 'Tận dụng machine learning để dự đoán hỏng hóc thiết bị, tối ưu vận hành và giảm downtime lên đến 50%', 'TrendingUp', 2),
  (7, 'Tích Hợp Liền Mạch', 'Kết nối với hệ thống ERP, MES và doanh nghiệp hiện có thông qua APIs và protocols tiêu chuẩn cho data flow thống nhất', 'Link', 3),
  
  -- Service 8: Tự động hóa Công nghiệp (VI)
  (8, 'Tăng Năng Suất', 'Tăng sản lượng 30-50% thông qua tự động hóa tối ưu, giảm thời gian chu kỳ và khả năng vận hành 24/7', 'Zap', 1),
  (8, 'Chất Lượng Nhất Quán', 'Đạt chất lượng sản phẩm nhất quán với quality control tự động, giảm 40% defects và tối thiểu hóa lãng phí', 'CheckCircle', 2),
  (8, 'Giảm Chi Phí Vận Hành', 'Giảm chi phí lao động, tiêu thụ năng lượng và bảo trì thông qua tự động hóa thông minh và bảo trì dự đoán', 'DollarSign', 3),
  
  -- Service 9: Giải pháp Hạ tầng CNTT (VI)
  (9, 'High Availability', 'Đảm bảo uptime 99.9% với hệ thống dự phòng, failover tự động và giám sát 24/7 cho business continuity', 'Shield', 1),
  (9, 'Kiến Trúc Có Thể Mở Rộng', 'Dễ dàng scale hạ tầng lên hoặc xuống dựa trên nhu cầu kinh doanh mà không có disruptions lớn hoặc đầu tư vốn', 'Maximize', 2),
  (9, 'Bảo Mật Doanh Nghiệp', 'Bảo mật đa tầng với firewall, IDS/IPS, encryption và tuân thủ các tiêu chuẩn ISO 27001, HIPAA, PCI DSS', 'Lock', 3),
  
  -- Service 10: Giải pháp Tòa nhà Thông minh (VI)
  (10, 'Tiết Kiệm Chi Phí Năng Lượng', 'Giảm 30-40% tiêu thụ năng lượng thông qua điều khiển HVAC thông minh, tối ưu chiếu sáng và demand response', 'Battery', 1),
  (10, 'Nâng Cao Sự Thoải Mái', 'Duy trì điều kiện trong nhà tối ưu với điều khiển tự động nhiệt độ, độ ẩm và chất lượng không khí cho sự hài lòng của người dùng', 'Wind', 2),
  (10, 'Quản Lý Tập Trung', 'Điều khiển tất cả hệ thống tòa nhà từ một nền tảng với truy cập mobile, lập lịch tự động và insights real-time', 'Smartphone', 3),
  
  -- Service 11: Quản lý Hạ tầng Đám mây (VI)
  (11, 'Tối Ưu Chi Phí', 'Giảm 30-45% chi phí cloud thông qua right-sizing, reserved instances, spot instances và quản lý chi phí tự động', 'DollarSign', 1),
  (11, 'Triển Khai Nhanh', 'Triển khai ứng dụng nhanh hơn 10 lần với CI/CD pipelines tự động, infrastructure as code và containerization', 'Rocket', 2),
  (11, 'Khả Năng Mở Rộng Toàn Cầu', 'Scale ứng dụng toàn cầu với triển khai multi-region, auto-scaling và content delivery networks cho độ trễ thấp', 'Globe', 3),
  
  -- Service 12: Giải pháp An ninh Mạng (VI)
  (12, 'Bảo Vệ Mối Đe Dọa 24/7', 'Giám sát bảo mật suốt ngày đêm với thời gian phản ứng 15 phút và tỷ lệ phát hiện mối đe dọa 99.7%', 'Shield', 1),
  (12, 'Đảm Bảo Tuân Thủ', 'Đáp ứng yêu cầu quy định (ISO 27001, SOC 2, HIPAA, GDPR) với tài liệu toàn diện và hỗ trợ audit', 'FileCheck', 2),
  (12, 'Phòng Thủ Proactive', 'Luôn đi trước mối đe dọa với threat intelligence, vulnerability scanning, penetration testing và security awareness training', 'Eye', 3)
ON CONFLICT DO NOTHING;
