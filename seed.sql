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
  -- English
  (1, 'en', 'service', 'IT Solutions', 'it-solutions', 'Information Technology solutions and consulting', 1),
  (2, 'en', 'service', 'IoT Services', 'iot-services', 'Internet of Things implementation and integration', 2),
  (3, 'en', 'service', 'Automation', 'automation', 'Business process and industrial automation', 3),
  -- Vietnamese
  (13, 'vi', 'service', 'Giải pháp CNTT', 'giai-phap-cntt', 'Giải pháp và tư vấn Công nghệ Thông tin', 1),
  (14, 'vi', 'service', 'Dịch vụ IoT', 'dich-vu-iot', 'Triển khai và tích hợp Internet of Things', 2),
  (15, 'vi', 'service', 'Tự động hóa', 'tu-dong-hoa', 'Tự động hóa quy trình kinh doanh và công nghiệp', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert categories for posts
INSERT INTO categories (id, locale, kind, name, slug, description, sort_order) VALUES 
  (4, 'en', 'post', 'Technology', 'technology', 'Tech articles and insights', 1),
  (5, 'en', 'post', 'IoT News', 'iot-news', 'Latest in Internet of Things', 2),
  (6, 'en', 'post', 'Tutorials', 'tutorials', 'How-to guides and best practices', 3)
ON CONFLICT (locale, kind, slug) DO NOTHING;

-- Insert tags
INSERT INTO tags (id, locale, name, slug) VALUES 
  -- English
  (1, 'en', 'IoT', 'iot'),
  (2, 'en', 'Automation', 'automation'),
  (3, 'en', 'Cloud Computing', 'cloud-computing'),
  (4, 'en', 'Smart Systems', 'smart-systems'),
  (5, 'en', 'Industry 4.0', 'industry-4-0'),
  -- Vietnamese
  (6, 'vi', 'IoT', 'iot'),
  (7, 'vi', 'Tự động hóa', 'tu-dong-hoa'),
  (8, 'vi', 'Điện toán đám mây', 'dien-toan-dam-may'),
  (9, 'vi', 'Hệ thống thông minh', 'he-thong-thong-minh'),
  (10, 'vi', 'Công nghiệp 4.0', 'cong-nghiep-4-0')
ON CONFLICT (locale, slug) DO NOTHING;

-- Insert sample services (English)
INSERT INTO services (id, locale, title, slug, excerpt, content_md, status, published_at, sort_order, created_by) VALUES 
  (1, 'en', 'IoT System Integration', 'iot-system-integration', 
   'Connect and automate your devices with intelligent IoT solutions', 
   '## Transform Your Business with IoT System Integration

In today''s connected world, IoT (Internet of Things) technology is revolutionizing how businesses operate. Our comprehensive IoT System Integration service helps you harness the power of connected devices, sensors, and smart systems to drive operational efficiency, reduce costs, and unlock new business opportunities.

### What We Deliver

We design and implement end-to-end IoT ecosystems tailored to your specific business needs. From device connectivity to cloud integration, real-time analytics to predictive insights, our solutions provide the foundation for digital transformation.

### Our Approach

Our team of IoT specialists combines expertise in embedded systems, cloud platforms, data analytics, and industrial protocols to create robust, scalable IoT solutions. We work with leading IoT platforms including AWS IoT, Azure IoT Hub, Google Cloud IoT, and custom on-premise deployments.

### Technology Stack

- **Protocols**: MQTT, CoAP, HTTP/REST, WebSocket, Modbus, OPC-UA
- **Platforms**: AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard
- **Edge Computing**: AWS Greengrass, Azure IoT Edge, custom edge solutions
- **Security**: TLS/SSL encryption, device authentication, secure firmware updates
- **Analytics**: Real-time stream processing, machine learning integration, predictive maintenance

### Industries We Serve

Our IoT solutions have been successfully deployed across manufacturing, agriculture, smart cities, healthcare, logistics, and energy sectors. Each implementation is customized to address industry-specific challenges and regulatory requirements.',
   'published', NOW(), 1, 1),
  (2, 'en', 'Industrial Automation', 'industrial-automation',
   'Optimize production with smart automation systems',
   '## Revolutionize Manufacturing with Industrial Automation

Manufacturing excellence demands precision, efficiency, and continuous optimization. Our Industrial Automation services transform traditional production lines into smart, connected systems that maximize output, minimize waste, and ensure consistent quality.

### Comprehensive Automation Solutions

We specialize in designing and implementing industrial automation systems that integrate seamlessly with your existing infrastructure. From PLC programming to SCADA systems, robotics to predictive maintenance, our solutions drive measurable improvements in productivity and ROI.

### What Sets Us Apart

With over a decade of experience in industrial automation, our engineers have deep expertise in both legacy systems and cutting-edge Industry 4.0 technologies. We don''t just automate processes—we optimize entire workflows to create competitive advantages.

### Core Capabilities

**PLC & Control Systems**: Programming and integration of Siemens, Allen-Bradley, Mitsubishi, and Schneider Electric PLCs. Advanced motion control, process control, and safety systems implementation.

**SCADA & HMI**: Design and deployment of supervisory control and data acquisition systems with intuitive human-machine interfaces. Real-time monitoring, alarming, and historical data analysis.

**Robotics Integration**: Industrial robot programming, cell design, and integration with existing production lines. Collaborative robots (cobots) for human-robot collaboration.

**Predictive Maintenance**: IoT sensor integration, vibration analysis, and machine learning models to predict equipment failures before they occur. Reduce downtime by up to 50%.

**Process Optimization**: Data-driven analysis to identify bottlenecks, optimize cycle times, and improve overall equipment effectiveness (OEE).

### Industry 4.0 Ready

Our solutions embrace Industry 4.0 principles, enabling digital transformation through IIoT connectivity, edge computing, and integration with enterprise systems (ERP, MES, QMS).',
   'published', NOW(), 2, 1),
  (3, 'en', 'IT Infrastructure Solutions', 'it-infrastructure-solutions',
   'Build reliable and scalable IT infrastructure for your business',
   '## Enterprise-Grade IT Infrastructure Solutions

Your IT infrastructure is the backbone of your business operations. Whether you''re scaling rapidly, modernizing legacy systems, or building from the ground up, our IT Infrastructure Solutions ensure reliability, performance, and security at every layer.

### Comprehensive Infrastructure Services

We design, deploy, and manage complete IT infrastructure solutions tailored to your business requirements. From network architecture to data center operations, cloud integration to disaster recovery, we provide end-to-end expertise.

### Our Service Portfolio

**Network Design & Implementation**: Enterprise network architecture, LAN/WAN design, SD-WAN deployment, network security, and performance optimization. Support for Cisco, Juniper, Aruba, and Fortinet equipment.

**Data Center Solutions**: Physical and virtual data center design, server consolidation, storage architecture (SAN/NAS), and hyperconverged infrastructure (HCI) deployment using VMware, Hyper-V, or Nutanix.

**Cloud Integration**: Hybrid and multi-cloud architecture design, cloud migration strategies, cloud-native application deployment, and seamless integration between on-premise and cloud environments.

**Server & Storage**: Server sizing and procurement, virtualization platform design, backup and recovery solutions, and storage performance optimization.

**Security & Compliance**: Network security architecture, firewall deployment and management, VPN solutions, endpoint protection, and compliance with industry standards (ISO 27001, GDPR, HIPAA).

**Monitoring & Management**: 24/7 infrastructure monitoring, proactive alerting, performance optimization, capacity planning, and comprehensive reporting dashboards.

### Technology Partners

We maintain partnerships with industry leaders including Cisco, Microsoft, VMware, Dell EMC, HPE, and NetApp to deliver best-in-class solutions with enterprise support.

### Business Continuity

Our infrastructure designs prioritize high availability, disaster recovery, and business continuity. We implement redundant systems, automated failover, and comprehensive backup strategies to ensure your operations never stop.',
   'published', NOW(), 3, 1),
  (4, 'en', 'Smart Building Solutions', 'smart-building-solutions',
   'Transform your building into an intelligent, energy-efficient space',
   '## Smart Building Solutions: The Future of Facility Management

Modern buildings should work smarter, not harder. Our Smart Building Solutions transform traditional facilities into intelligent, sustainable spaces that optimize energy consumption, enhance occupant comfort, and reduce operational costs by up to 40%.

### Integrated Building Intelligence

We design and implement comprehensive building automation systems that integrate HVAC, lighting, access control, security, and energy management into a unified platform. Real-time monitoring, automated controls, and predictive analytics create buildings that adapt to occupant needs while maximizing efficiency.

### Core Technologies

**Building Automation Systems (BAS)**: Integration of Honeywell, Johnson Controls, Siemens, or Schneider Electric building management systems. Centralized control of all building subsystems with intuitive dashboards and mobile access.

**Energy Management**: Real-time energy monitoring, consumption analytics, automated demand response, and renewable energy integration. Reduce energy costs by 30-40% through intelligent optimization.

**Smart HVAC Control**: Zone-based climate control, occupancy-based optimization, predictive maintenance scheduling, and integration with weather forecasts for proactive adjustments.

**Intelligent Lighting**: LED lighting systems with daylight harvesting, occupancy sensing, and circadian rhythm optimization. Wireless lighting control using Zigbee, EnOcean, or BACnet protocols.

**Access Control & Security**: Integrated security systems combining access control, video surveillance, intrusion detection, and visitor management. Mobile credentials and biometric authentication options.

**IoT Sensor Networks**: Deployment of wireless sensors for temperature, humidity, CO2, occupancy, and indoor air quality monitoring. Real-time data for occupant comfort and compliance.

### Sustainability & Compliance

Our solutions help achieve LEED, BREEAM, and WELL Building Standard certifications. Comprehensive reporting on energy consumption, carbon footprint, and indoor environmental quality.

### ROI & Benefits

- **30-40% energy cost reduction** through intelligent optimization
- **25% improvement** in space utilization through occupancy analytics
- **50% faster** issue resolution with predictive maintenance
- **Enhanced occupant satisfaction** through improved comfort and air quality
- **Real-time visibility** into building performance and operational costs',
   'published', NOW(), 4, 1),
  (5, 'en', 'Cloud Infrastructure Management', 'cloud-infrastructure-management',
   'Scalable cloud solutions for modern enterprises',
   '## Cloud Infrastructure Management: Accelerate Digital Transformation

The cloud is no longer optional—it''s the foundation of modern business. Our Cloud Infrastructure Management services help enterprises harness the full power of cloud computing with optimized architecture, seamless migration, and ongoing management that maximizes performance while minimizing costs.

### Comprehensive Cloud Expertise

We provide end-to-end cloud infrastructure services across AWS, Azure, Google Cloud, and hybrid cloud environments. From initial strategy to migration execution and ongoing optimization, our certified cloud architects ensure your cloud investment delivers maximum business value.

### Our Service Offerings

**Cloud Architecture Design**: Multi-cloud and hybrid cloud architecture tailored to your workloads. High availability design, disaster recovery planning, and compliance-first architecture for regulated industries.

**Cloud Migration**: Comprehensive migration strategies including lift-and-shift, re-platforming, and cloud-native refactoring. Minimize downtime and risk with phased migration approaches and automated testing.

**DevOps & CI/CD**: Implementation of modern DevOps practices with automated pipelines, infrastructure as code (Terraform, CloudFormation), containerization (Docker, Kubernetes), and continuous deployment workflows.

**Cloud Security**: Identity and access management (IAM), network security architecture, encryption at rest and in transit, compliance automation (SOC 2, ISO 27001, HIPAA), and security monitoring with SIEM integration.

**Cost Optimization**: Cloud cost analysis, right-sizing recommendations, reserved instance planning, spot instance strategies, and automated cost allocation. Average cost reduction of 30-45% through intelligent optimization.

**Performance Optimization**: Application performance monitoring (APM), infrastructure scaling strategies, caching implementation, CDN optimization, and database performance tuning.

**Disaster Recovery**: Multi-region backup strategies, automated failover systems, RTO/RPO planning, and regular disaster recovery testing to ensure business continuity.

### Technology Stack

- **Cloud Platforms**: AWS, Azure, Google Cloud Platform
- **Container Orchestration**: Kubernetes, Amazon EKS, Azure AKS, Google GKE
- **Infrastructure as Code**: Terraform, AWS CloudFormation, Azure ARM Templates
- **CI/CD Tools**: Jenkins, GitLab CI, GitHub Actions, Azure DevOps
- **Monitoring**: Prometheus, Grafana, CloudWatch, Azure Monitor, Datadog
- **Security**: AWS Security Hub, Azure Security Center, Cloud Security Posture Management (CSPM)

### Certified Expertise

Our team holds certifications including AWS Solutions Architect Professional, Azure Solutions Architect Expert, Google Cloud Professional Architect, and Kubernetes certifications (CKA, CKAD).',
   'published', NOW(), 5, 1),
  (6, 'en', 'Cybersecurity Solutions', 'cybersecurity-solutions',
   'Protect your business with enterprise-grade security solutions',
   '## Cybersecurity Solutions: Defend Your Digital Assets

In an era of sophisticated cyber threats, robust security is not optional—it''s business critical. Our Cybersecurity Solutions provide comprehensive protection through proactive defense, continuous monitoring, and rapid incident response. We protect your data, systems, and reputation against evolving threats.

### Holistic Security Approach

We implement defense-in-depth strategies that protect your organization at every layer—from network perimeter to endpoints, applications to data. Our security framework combines advanced technology, expert analysis, and proven methodologies to create resilient security postures.

### Core Security Services

**Security Assessment & Penetration Testing**: Comprehensive vulnerability assessments, penetration testing, red team/blue team exercises, and social engineering simulations. Identify weaknesses before attackers do.

**Security Architecture Design**: Network segmentation, zero-trust architecture, micro-segmentation, and secure cloud architecture design. Security-first approach to infrastructure planning.

**Network Security**: Next-generation firewall deployment (Palo Alto, Fortinet, Cisco), intrusion detection/prevention systems (IDS/IPS), secure remote access (VPN, zero-trust network access), and DDoS protection.

**Endpoint Protection**: Advanced endpoint detection and response (EDR) using CrowdStrike, Microsoft Defender, or SentinelOne. Mobile device management (MDM), data loss prevention (DLP), and privileged access management (PAM).

**Security Monitoring (SOC)**: 24/7 security operations center with SIEM integration (Splunk, QRadar, Azure Sentinel), threat intelligence feeds, behavioral analysis, and automated threat response.

**Incident Response**: Rapid incident response team available 24/7, forensic analysis, containment strategies, recovery planning, and post-incident reporting. Average response time under 15 minutes.

**Compliance & Governance**: Compliance consulting and implementation for ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR, and industry-specific regulations. Automated compliance monitoring and reporting.

**Security Awareness Training**: Comprehensive security training programs, phishing simulation campaigns, and security culture development to make your team the first line of defense.

### Threat Intelligence

We leverage global threat intelligence feeds and maintain partnerships with leading security research organizations to stay ahead of emerging threats. Proactive threat hunting identifies potential compromises before they cause damage.

### Proven Results

- **99.7% threat detection rate** through advanced monitoring
- **15-minute average** incident response time
- **Zero successful breaches** for clients with our managed security services
- **90% reduction** in security incidents through training and awareness
- **Full compliance** achievement for regulated industries',
   'published', NOW(), 6, 1),
  -- Vietnamese versions
  (7, 'vi', 'Tích hợp Hệ thống IoT', 'tich-hop-he-thong-iot', 
   'Kết nối và tự động hóa thiết bị của bạn với giải pháp IoT thông minh', 
   '## Chuyển đổi Doanh nghiệp với Tích hợp Hệ thống IoT

Trong thế giới kết nối ngày nay, công nghệ IoT (Internet of Things) đang cách mạng hóa cách thức hoạt động của doanh nghiệp. Dịch vụ Tích hợp Hệ thống IoT toàn diện của chúng tôi giúp bạn khai thác sức mạnh của các thiết bị kết nối, cảm biến và hệ thống thông minh để tăng hiệu quả vận hành, giảm chi phí và mở ra cơ hội kinh doanh mới.

### Những Gì Chúng Tôi Cung Cấp

Chúng tôi thiết kế và triển khai hệ sinh thái IoT end-to-end được tùy chỉnh theo nhu cầu kinh doanh cụ thể của bạn. Từ kết nối thiết bị đến tích hợp cloud, phân tích real-time đến insights dự đoán, giải pháp của chúng tôi cung cấp nền tảng cho chuyển đổi số.

### Phương Pháp Tiếp Cận

Đội ngũ chuyên gia IoT của chúng tôi kết hợp chuyên môn về embedded systems, cloud platforms, data analytics và industrial protocols để tạo ra giải pháp IoT mạnh mẽ, có khả năng mở rộng. Chúng tôi làm việc với các nền tảng IoT hàng đầu bao gồm AWS IoT, Azure IoT Hub, Google Cloud IoT và triển khai on-premise tùy chỉnh.

### Technology Stack

- **Protocols**: MQTT, CoAP, HTTP/REST, WebSocket, Modbus, OPC-UA
- **Platforms**: AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard
- **Edge Computing**: AWS Greengrass, Azure IoT Edge, custom edge solutions
- **Bảo mật**: Mã hóa TLS/SSL, xác thực thiết bị, cập nhật firmware an toàn
- **Phân tích**: Xử lý stream real-time, tích hợp machine learning, bảo trì dự đoán

### Ngành Nghề Phục Vụ

Giải pháp IoT của chúng tôi đã được triển khai thành công trên nhiều lĩnh vực: sản xuất, nông nghiệp, smart cities, y tế, logistics và năng lượng. Mỗi triển khai được tùy chỉnh để giải quyết các thách thức và yêu cầu quy định đặc thù của ngành.',
   'published', NOW(), 1, 1),
  (8, 'vi', 'Tự động hóa Công nghiệp', 'tu-dong-hoa-cong-nghiep',
   'Tối ưu hóa sản xuất với hệ thống tự động hóa thông minh',
   '## Cách Mạng Hóa Sản Xuất với Tự động hóa Công nghiệp

Sự xuất sắc trong sản xuất đòi hỏi độ chính xác, hiệu quả và tối ưu hóa liên tục. Dịch vụ Tự động hóa Công nghiệp của chúng tôi chuyển đổi dây chuyền sản xuất truyền thống thành hệ thống thông minh, kết nối, tối đa hóa sản lượng, giảm thiểu lãng phí và đảm bảo chất lượng nhất quán.

### Giải Pháp Tự động hóa Toàn diện

Chúng tôi chuyên thiết kế và triển khai hệ thống tự động hóa công nghiệp tích hợp liền mạch với hạ tầng hiện có của bạn. Từ lập trình PLC đến hệ thống SCADA, robotics đến bảo trì dự đoán, giải pháp của chúng tôi mang lại cải thiện có thể đo lường về năng suất và ROI.

### Điểm Khác Biệt

Với hơn một thập kỷ kinh nghiệm trong tự động hóa công nghiệp, các kỹ sư của chúng tôi có chuyên môn sâu về cả hệ thống legacy và công nghệ Industry 4.0 tiên tiến. Chúng tôi không chỉ tự động hóa quy trình—chúng tôi tối ưu toàn bộ workflow để tạo lợi thế cạnh tranh.

### Khả Năng Cốt Lõi

**PLC & Control Systems**: Lập trình và tích hợp PLC Siemens, Allen-Bradley, Mitsubishi và Schneider Electric. Triển khai motion control nâng cao, process control và safety systems.

**SCADA & HMI**: Thiết kế và triển khai hệ thống giám sát điều khiển và thu thập dữ liệu với giao diện người-máy trực quan. Giám sát real-time, cảnh báo và phân tích dữ liệu lịch sử.

**Tích hợp Robotics**: Lập trình robot công nghiệp, thiết kế cell và tích hợp với dây chuyền sản xuất hiện có. Collaborative robots (cobots) cho sự hợp tác người-robot.

**Bảo Trì Dự Đoán**: Tích hợp cảm biến IoT, phân tích rung động và mô hình machine learning để dự đoán hỏng hóc thiết bị trước khi xảy ra. Giảm downtime lên đến 50%.

**Tối Ưu Quy Trình**: Phân tích dựa trên dữ liệu để xác định điểm nghẽn, tối ưu chu kỳ và cải thiện hiệu suất thiết bị tổng thể (OEE).

### Sẵn Sàng Industry 4.0

Giải pháp của chúng tôi áp dụng nguyên tắc Industry 4.0, cho phép chuyển đổi số thông qua kết nối IIoT, edge computing và tích hợp với hệ thống doanh nghiệp (ERP, MES, QMS).',
   'published', NOW(), 2, 1),
  (9, 'vi', 'Giải pháp Hạ tầng CNTT', 'giai-phap-ha-tang-cntt',
   'Xây dựng hạ tầng CNTT đáng tin cậy và có khả năng mở rộng cho doanh nghiệp',
   '## Giải Pháp Hạ Tầng CNTT Cấp Doanh Nghiệp

Hạ tầng CNTT là xương sống của hoạt động kinh doanh. Cho dù bạn đang mở rộng nhanh chóng, hiện đại hóa hệ thống legacy, hay xây dựng từ đầu, Giải pháp Hạ tầng CNTT của chúng tôi đảm bảo độ tin cậy, hiệu suất và bảo mật ở mọi tầng.

### Dịch Vụ Hạ Tầng Toàn Diện

Chúng tôi thiết kế, triển khai và quản lý giải pháp hạ tầng CNTT hoàn chỉnh phù hợp với yêu cầu kinh doanh của bạn. Từ kiến trúc mạng đến vận hành data center, tích hợp cloud đến disaster recovery, chúng tôi cung cấp chuyên môn end-to-end.

### Danh Mục Dịch Vụ

**Thiết Kế & Triển Khai Mạng**: Kiến trúc mạng doanh nghiệp, thiết kế LAN/WAN, triển khai SD-WAN, bảo mật mạng và tối ưu hiệu suất. Hỗ trợ thiết bị Cisco, Juniper, Aruba và Fortinet.

**Giải Pháp Data Center**: Thiết kế data center vật lý và ảo hóa, consolidation máy chủ, kiến trúc storage (SAN/NAS) và triển khai hyperconverged infrastructure (HCI) sử dụng VMware, Hyper-V hoặc Nutanix.

**Tích Hợp Cloud**: Thiết kế kiến trúc hybrid và multi-cloud, chiến lược migration cloud, triển khai ứng dụng cloud-native và tích hợp liền mạch giữa môi trường on-premise và cloud.

**Server & Storage**: Sizing và mua sắm server, thiết kế nền tảng ảo hóa, giải pháp backup và recovery, và tối ưu hiệu suất storage.

**Bảo Mật & Tuân Thủ**: Kiến trúc bảo mật mạng, triển khai và quản lý firewall, giải pháp VPN, endpoint protection và tuân thủ các tiêu chuẩn ngành (ISO 27001, GDPR, HIPAA).

**Giám Sát & Quản Lý**: Giám sát hạ tầng 24/7, cảnh báo proactive, tối ưu hiệu suất, capacity planning và dashboard báo cáo toàn diện.

### Đối Tác Công Nghệ

Chúng tôi duy trì quan hệ đối tác với các leader ngành bao gồm Cisco, Microsoft, VMware, Dell EMC, HPE và NetApp để cung cấp giải pháp tốt nhất với hỗ trợ cấp doanh nghiệp.

### Liên Tục Kinh Doanh

Thiết kế hạ tầng của chúng tôi ưu tiên high availability, disaster recovery và business continuity. Chúng tôi triển khai hệ thống dự phòng, failover tự động và chiến lược backup toàn diện để đảm bảo hoạt động không bao giờ dừng.',
   'published', NOW(), 3, 1),
  (10, 'vi', 'Giải pháp Tòa nhà Thông minh', 'giai-phap-toa-nha-thong-minh',
   'Biến tòa nhà của bạn thành không gian thông minh, tiết kiệm năng lượng',
   '## Giải Pháp Tòa Nhà Thông Minh: Tương Lai của Quản Lý Cơ Sở

Tòa nhà hiện đại nên hoạt động thông minh hơn, không chỉ vận hành nhiều hơn. Giải pháp Tòa nhà Thông minh của chúng tôi biến đổi cơ sở truyền thống thành không gian thông minh, bền vững, tối ưu tiêu thụ năng lượng, nâng cao sự thoải mái của người sử dụng và giảm chi phí vận hành lên đến 40%.

### Trí Tuệ Tòa Nhà Tích Hợp

Chúng tôi thiết kế và triển khai hệ thống tự động hóa tòa nhà toàn diện tích hợp HVAC, chiếu sáng, kiểm soát ra vào, an ninh và quản lý năng lượng vào một nền tảng thống nhất. Giám sát real-time, điều khiển tự động và phân tích dự đoán tạo ra các tòa nhà thích ứng với nhu cầu người dùng đồng thời tối đa hóa hiệu quả.

### Công Nghệ Cốt Lõi

**Building Automation Systems (BAS)**: Tích hợp hệ thống quản lý tòa nhà Honeywell, Johnson Controls, Siemens hoặc Schneider Electric. Điều khiển tập trung tất cả hệ thống con với dashboard trực quan và truy cập mobile.

**Quản Lý Năng Lượng**: Giám sát năng lượng real-time, phân tích tiêu thụ, demand response tự động và tích hợp năng lượng tái tạo. Giảm chi phí năng lượng 30-40% thông qua tối ưu thông minh.

**Điều Khiển HVAC Thông Minh**: Điều khiển khí hậu theo zone, tối ưu dựa trên occupancy, lập lịch bảo trì dự đoán và tích hợp dự báo thời tiết cho điều chỉnh proactive.

**Chiếu Sáng Thông Minh**: Hệ thống đèn LED với daylight harvesting, cảm biến occupancy và tối ưu nhịp sinh học. Điều khiển chiếu sáng không dây sử dụng Zigbee, EnOcean hoặc BACnet protocols.

**Kiểm Soát Ra Vào & An Ninh**: Hệ thống an ninh tích hợp kết hợp access control, camera giám sát, phát hiện xâm nhập và quản lý khách. Tùy chọn mobile credentials và xác thực sinh trắc học.

**Mạng Cảm Biến IoT**: Triển khai cảm biến không dây cho nhiệt độ, độ ẩm, CO2, occupancy và giám sát chất lượng không khí trong nhà. Dữ liệu real-time cho sự thoải mái và tuân thủ.

### Bền Vững & Tuân Thủ

Giải pháp của chúng tôi giúp đạt chứng nhận LEED, BREEAM và WELL Building Standard. Báo cáo toàn diện về tiêu thụ năng lượng, dấu chân carbon và chất lượng môi trường trong nhà.

### ROI & Lợi Ích

- **Giảm 30-40% chi phí năng lượng** thông qua tối ưu thông minh
- **Cải thiện 25%** sử dụng không gian thông qua phân tích occupancy
- **Nhanh hơn 50%** giải quyết vấn đề với bảo trì dự đoán
- **Nâng cao sự hài lòng** của người sử dụng thông qua cải thiện sự thoải mái và chất lượng không khí
- **Tầm nhìn real-time** về hiệu suất tòa nhà và chi phí vận hành',
   'published', NOW(), 4, 1),
  (11, 'vi', 'Quản lý Hạ tầng Đám mây', 'quan-ly-ha-tang-dam-may',
   'Giải pháp đám mây có khả năng mở rộng cho doanh nghiệp hiện đại',
   '## Quản Lý Hạ Tầng Đám Mây: Tăng Tốc Chuyển Đổi Số

Đám mây không còn là tùy chọn—đó là nền tảng của kinh doanh hiện đại. Dịch vụ Quản lý Hạ tầng Đám mây của chúng tôi giúp doanh nghiệp khai thác toàn bộ sức mạnh của cloud computing với kiến trúc tối ưu, migration liền mạch và quản lý liên tục, tối đa hóa hiệu suất đồng thời giảm thiểu chi phí.

### Chuyên Môn Cloud Toàn Diện

Chúng tôi cung cấp dịch vụ hạ tầng cloud end-to-end trên AWS, Azure, Google Cloud và môi trường hybrid cloud. Từ chiến lược ban đầu đến thực thi migration và tối ưu liên tục, các kiến trúc sư cloud được chứng nhận của chúng tôi đảm bảo đầu tư cloud của bạn mang lại giá trị kinh doanh tối đa.

### Các Dịch Vụ

**Thiết Kế Kiến Trúc Cloud**: Kiến trúc multi-cloud và hybrid cloud tùy chỉnh theo workloads của bạn. Thiết kế high availability, disaster recovery planning và kiến trúc compliance-first cho ngành được quản lý.

**Cloud Migration**: Chiến lược migration toàn diện bao gồm lift-and-shift, re-platforming và refactoring cloud-native. Giảm thiểu downtime và rủi ro với phương pháp migration từng giai đoạn và testing tự động.

**DevOps & CI/CD**: Triển khai thực hành DevOps hiện đại với pipeline tự động, infrastructure as code (Terraform, CloudFormation), containerization (Docker, Kubernetes) và workflow continuous deployment.

**Bảo Mật Cloud**: Identity and access management (IAM), kiến trúc bảo mật mạng, mã hóa at rest và in transit, compliance automation (SOC 2, ISO 27001, HIPAA) và giám sát bảo mật với tích hợp SIEM.

**Tối Ưu Chi Phí**: Phân tích chi phí cloud, đề xuất right-sizing, lập kế hoạch reserved instance, chiến lược spot instance và phân bổ chi phí tự động. Giảm chi phí trung bình 30-45% thông qua tối ưu thông minh.

**Tối Ưu Hiệu Suất**: Application performance monitoring (APM), chiến lược scaling hạ tầng, triển khai caching, tối ưu CDN và tuning hiệu suất database.

**Disaster Recovery**: Chiến lược backup đa region, hệ thống failover tự động, RTO/RPO planning và testing disaster recovery thường xuyên để đảm bảo business continuity.

### Technology Stack

- **Cloud Platforms**: AWS, Azure, Google Cloud Platform
- **Container Orchestration**: Kubernetes, Amazon EKS, Azure AKS, Google GKE
- **Infrastructure as Code**: Terraform, AWS CloudFormation, Azure ARM Templates
- **CI/CD Tools**: Jenkins, GitLab CI, GitHub Actions, Azure DevOps
- **Monitoring**: Prometheus, Grafana, CloudWatch, Azure Monitor, Datadog
- **Security**: AWS Security Hub, Azure Security Center, Cloud Security Posture Management (CSPM)

### Chuyên Môn Được Chứng Nhận

Đội ngũ của chúng tôi có các chứng chỉ AWS Solutions Architect Professional, Azure Solutions Architect Expert, Google Cloud Professional Architect và chứng chỉ Kubernetes (CKA, CKAD).',
   'published', NOW(), 5, 1),
  (12, 'vi', 'Giải pháp An ninh Mạng', 'giai-phap-an-ninh-mang',
   'Bảo vệ doanh nghiệp với giải pháp bảo mật cấp doanh nghiệp',
   '## Giải Pháp An Ninh Mạng: Bảo Vệ Tài Sản Số

Trong kỷ nguyên của các mối đe dọa mạng tinh vi, bảo mật mạnh mẽ không phải là tùy chọn—đó là yếu tố quan trọng cho kinh doanh. Giải pháp An ninh Mạng của chúng tôi cung cấp bảo vệ toàn diện thông qua phòng thủ proactive, giám sát liên tục và ứng phó sự cố nhanh chóng. Chúng tôi bảo vệ dữ liệu, hệ thống và danh tiếng của bạn trước các mối đe dọa đang phát triển.

### Phương Pháp Bảo Mật Toàn Diện

Chúng tôi triển khai chiến lược defense-in-depth bảo vệ tổ chức của bạn ở mọi tầng—từ perimeter mạng đến endpoint, ứng dụng đến dữ liệu. Framework bảo mật của chúng tôi kết hợp công nghệ tiên tiến, phân tích chuyên gia và phương pháp đã được chứng minh để tạo ra tư thế bảo mật resilient.

### Dịch Vụ Bảo Mật Cốt Lõi

**Đánh Giá Bảo Mật & Penetration Testing**: Đánh giá lỗ hổng toàn diện, penetration testing, red team/blue team exercises và mô phỏng social engineering. Xác định điểm yếu trước khi kẻ tấn công phát hiện.

**Thiết Kế Kiến Trúc Bảo Mật**: Network segmentation, zero-trust architecture, micro-segmentation và thiết kế kiến trúc cloud an toàn. Phương pháp security-first trong lập kế hoạch hạ tầng.

**Bảo Mật Mạng**: Triển khai next-generation firewall (Palo Alto, Fortinet, Cisco), intrusion detection/prevention systems (IDS/IPS), truy cập từ xa an toàn (VPN, zero-trust network access) và bảo vệ DDoS.

**Endpoint Protection**: Phát hiện và phản ứng endpoint nâng cao (EDR) sử dụng CrowdStrike, Microsoft Defender hoặc SentinelOne. Mobile device management (MDM), data loss prevention (DLP) và privileged access management (PAM).

**Giám Sát Bảo Mật (SOC)**: Trung tâm vận hành bảo mật 24/7 với tích hợp SIEM (Splunk, QRadar, Azure Sentinel), feeds threat intelligence, phân tích hành vi và phản ứng mối đe dọa tự động.

**Ứng Phó Sự Cố**: Đội phản ứng sự cố nhanh chóng 24/7, phân tích forensic, chiến lược containment, recovery planning và báo cáo sau sự cố. Thời gian phản ứng trung bình dưới 15 phút.

**Tuân Thủ & Quản Trị**: Tư vấn và triển khai tuân thủ cho ISO 27001, SOC 2, PCI DSS, HIPAA, GDPR và quy định đặc thù ngành. Giám sát và báo cáo tuân thủ tự động.

**Đào Tạo Nhận Thức Bảo Mật**: Chương trình đào tạo bảo mật toàn diện, chiến dịch mô phỏng phishing và phát triển văn hóa bảo mật để biến team của bạn thành tuyến phòng thủ đầu tiên.

### Threat Intelligence

Chúng tôi tận dụng feeds threat intelligence toàn cầu và duy trì quan hệ đối tác với các tổ chức nghiên cứu bảo mật hàng đầu để luôn đi trước các mối đe dọa mới nổi. Proactive threat hunting xác định các compromise tiềm năng trước khi chúng gây ra thiệt hại.

### Kết Quả Đã Chứng Minh

- **99.7% tỷ lệ phát hiện mối đe dọa** thông qua giám sát nâng cao
- **Thời gian phản ứng trung bình 15 phút** cho sự cố
- **Zero breach thành công** cho clients với dịch vụ bảo mật được quản lý
- **Giảm 90%** sự cố bảo mật thông qua đào tạo và nhận thức
- **Đạt tuân thủ đầy đủ** cho các ngành được quản lý',
   'published', NOW(), 6, 1)
ON CONFLICT (locale, slug) DO NOTHING;

-- Link services to categories
INSERT INTO service_categories (service_id, category_id) VALUES 
  -- English services
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 2), (3, 3),
  (4, 2), (4, 3),  -- Smart Building
  (5, 1), (5, 3),  -- Cloud Infrastructure
  (6, 1), (6, 3),  -- Cybersecurity
  -- Vietnamese services
  (7, 13), (7, 14),  -- IoT (VI)
  (8, 13), (8, 15),  -- Industrial Automation (VI)
  (9, 14), (9, 15),  -- IT Infrastructure (VI)
  (10, 14), (10, 15), -- Smart Building (VI)
  (11, 13), (11, 15), -- Cloud (VI)
  (12, 13), (12, 15)  -- Cybersecurity (VI)
ON CONFLICT DO NOTHING;

-- Link services to tags
INSERT INTO service_tags (service_id, tag_id) VALUES 
  -- English services
  (1, 1), (1, 4),
  (2, 1), (2, 5),
  (3, 2), (3, 3),
  (4, 1), (4, 4),  -- Smart Building
  (5, 3), (5, 2),  -- Cloud
  (6, 2), (6, 3),  -- Cybersecurity
  -- Vietnamese services
  (7, 6), (7, 9),
  (8, 6), (8, 10),
  (9, 7), (9, 8),
  (10, 6), (10, 9),
  (11, 8), (11, 7),
  (12, 7), (12, 8)
ON CONFLICT DO NOTHING;

-- Insert service deliverables
INSERT INTO service_deliverables (service_id, title, description, sort_order) VALUES 
  -- Service 1: IoT System Integration (EN)
  (1, 'Complete IoT Platform', 'Custom-built IoT platform with device management, data collection, and real-time analytics dashboard', 1),
  (1, 'Device Integration Kit', 'Seamless integration with your existing sensors, controllers, and IoT devices using industry-standard protocols', 2),
  (1, 'Cloud Infrastructure', 'Scalable cloud infrastructure setup on AWS IoT Core, Azure IoT Hub, or Google Cloud IoT', 3),
  (1, 'Mobile & Web Dashboard', 'Real-time monitoring dashboard accessible via web and mobile applications with customizable alerts', 4),
  
  -- Service 2: Industrial Automation (EN)
  (2, 'Automation System Design', 'Complete automation architecture with PLC programming, control logic, and safety systems', 1),
  (2, 'SCADA Implementation', 'Advanced SCADA system with HMI screens, real-time monitoring, and historical data logging', 2),
  (2, 'System Integration', 'Integration with existing ERP, MES, and production management systems', 3),
  (2, 'Training & Documentation', 'Comprehensive operator training, maintenance manuals, and technical documentation', 4),
  
  -- Service 3: IT Infrastructure Solutions (EN)
  (3, 'Infrastructure Architecture', 'Complete IT infrastructure blueprint including network topology, server layout, and security zones', 1),
  (3, 'Network Implementation', 'Enterprise-grade network deployment with routers, switches, firewalls, and wireless access points', 2),
  (3, 'Cloud Migration Plan', 'Detailed cloud migration strategy with risk assessment, timeline, and rollback procedures', 3),
  (3, '24/7 Monitoring System', 'Proactive monitoring platform with automated alerts, performance dashboards, and incident response', 4),
  
  -- Service 4: Smart Building Solutions (EN)
  (4, 'Building Automation Platform', 'Integrated BAS system controlling HVAC, lighting, security, and energy management', 1),
  (4, 'Energy Management Dashboard', 'Real-time energy monitoring with consumption analytics, cost tracking, and optimization recommendations', 2),
  (4, 'IoT Sensor Network', 'Wireless sensor deployment for temperature, humidity, CO2, occupancy, and air quality monitoring', 3),
  (4, 'Mobile Control App', 'Custom mobile application for facility managers to control building systems remotely', 4),
  
  -- Service 5: Cloud Infrastructure Management (EN)
  (5, 'Cloud Architecture Blueprint', 'Multi-cloud architecture design with high availability, disaster recovery, and cost optimization', 1),
  (5, 'Migration Execution Plan', 'Phased migration roadmap with application assessment, dependency mapping, and testing strategy', 2),
  (5, 'DevOps Pipeline', 'Automated CI/CD pipeline with infrastructure as code, containerization, and automated testing', 3),
  (5, 'Cost Optimization Report', 'Monthly cost analysis with right-sizing recommendations, reserved instance planning, and savings opportunities', 4),
  
  -- Service 6: Cybersecurity Solutions (EN)
  (6, 'Security Assessment Report', 'Comprehensive vulnerability analysis, penetration testing results, and risk prioritization matrix', 1),
  (6, 'Security Infrastructure', 'Next-gen firewall deployment, IDS/IPS implementation, and endpoint protection across all devices', 2),
  (6, 'SOC Setup & Monitoring', '24/7 security operations center with SIEM integration, threat intelligence, and incident response playbooks', 3),
  (6, 'Compliance Documentation', 'Complete compliance package for ISO 27001, SOC 2, or industry-specific regulations with audit support', 4),
  
  -- Service 7: Tích hợp Hệ thống IoT (VI)
  (7, 'Nền tảng IoT Hoàn chỉnh', 'Nền tảng IoT tùy chỉnh với quản lý thiết bị, thu thập dữ liệu và dashboard phân tích real-time', 1),
  (7, 'Bộ Tích hợp Thiết bị', 'Tích hợp liền mạch với cảm biến, controller và thiết bị IoT hiện có sử dụng protocols tiêu chuẩn ngành', 2),
  (7, 'Hạ tầng Cloud', 'Thiết lập hạ tầng cloud có khả năng mở rộng trên AWS IoT Core, Azure IoT Hub hoặc Google Cloud IoT', 3),
  (7, 'Dashboard Mobile & Web', 'Dashboard giám sát real-time truy cập qua web và mobile với cảnh báo tùy chỉnh', 4),
  
  -- Service 8: Tự động hóa Công nghiệp (VI)
  (8, 'Thiết kế Hệ thống Tự động', 'Kiến trúc tự động hóa hoàn chỉnh với lập trình PLC, control logic và safety systems', 1),
  (8, 'Triển khai SCADA', 'Hệ thống SCADA nâng cao với màn hình HMI, giám sát real-time và ghi log dữ liệu lịch sử', 2),
  (8, 'Tích hợp Hệ thống', 'Tích hợp với hệ thống ERP, MES và quản lý sản xuất hiện có', 3),
  (8, 'Đào tạo & Tài liệu', 'Đào tạo vận hành toàn diện, hướng dẫn bảo trì và tài liệu kỹ thuật', 4),
  
  -- Service 9: Giải pháp Hạ tầng CNTT (VI)
  (9, 'Kiến trúc Hạ tầng', 'Blueprint hạ tầng CNTT hoàn chỉnh bao gồm topology mạng, layout server và các zone bảo mật', 1),
  (9, 'Triển khai Mạng', 'Triển khai mạng cấp doanh nghiệp với routers, switches, firewalls và wireless access points', 2),
  (9, 'Kế hoạch Migration Cloud', 'Chiến lược migration cloud chi tiết với đánh giá rủi ro, timeline và quy trình rollback', 3),
  (9, 'Hệ thống Giám sát 24/7', 'Nền tảng giám sát proactive với cảnh báo tự động, dashboard hiệu suất và incident response', 4),
  
  -- Service 10: Giải pháp Tòa nhà Thông minh (VI)
  (10, 'Nền tảng Tự động Tòa nhà', 'Hệ thống BAS tích hợp điều khiển HVAC, chiếu sáng, an ninh và quản lý năng lượng', 1),
  (10, 'Dashboard Quản lý Năng lượng', 'Giám sát năng lượng real-time với phân tích tiêu thụ, theo dõi chi phí và đề xuất tối ưu', 2),
  (10, 'Mạng Cảm biến IoT', 'Triển khai cảm biến không dây cho nhiệt độ, độ ẩm, CO2, occupancy và giám sát chất lượng không khí', 3),
  (10, 'App Điều khiển Mobile', 'Ứng dụng mobile tùy chỉnh cho quản lý cơ sở điều khiển hệ thống tòa nhà từ xa', 4),
  
  -- Service 11: Quản lý Hạ tầng Đám mây (VI)
  (11, 'Blueprint Kiến trúc Cloud', 'Thiết kế kiến trúc multi-cloud với high availability, disaster recovery và tối ưu chi phí', 1),
  (11, 'Kế hoạch Thực thi Migration', 'Roadmap migration theo giai đoạn với đánh giá ứng dụng, ánh xạ dependency và chiến lược testing', 2),
  (11, 'Pipeline DevOps', 'Pipeline CI/CD tự động với infrastructure as code, containerization và testing tự động', 3),
  (11, 'Báo cáo Tối ưu Chi phí', 'Phân tích chi phí hàng tháng với đề xuất right-sizing, lập kế hoạch reserved instance và cơ hội tiết kiệm', 4),
  
  -- Service 12: Giải pháp An ninh Mạng (VI)
  (12, 'Báo cáo Đánh giá Bảo mật', 'Phân tích lỗ hổng toàn diện, kết quả penetration testing và ma trận ưu tiên rủi ro', 1),
  (12, 'Hạ tầng Bảo mật', 'Triển khai next-gen firewall, triển khai IDS/IPS và endpoint protection trên tất cả thiết bị', 2),
  (12, 'Thiết lập SOC & Giám sát', 'Trung tâm vận hành bảo mật 24/7 với tích hợp SIEM, threat intelligence và incident response playbooks', 3),
  (12, 'Tài liệu Tuân thủ', 'Gói tuân thủ hoàn chỉnh cho ISO 27001, SOC 2 hoặc quy định đặc thù ngành với hỗ trợ audit', 4)
ON CONFLICT DO NOTHING;

-- Insert service process steps
INSERT INTO service_process_steps (service_id, title, description, sort_order) VALUES 
  -- Service 1: IoT System Integration (EN)
  (1, 'Discovery & Requirements', 'Deep dive into your business needs, existing infrastructure, and IoT use cases. Identify devices, data requirements, and integration points.', 1),
  (1, 'Architecture Design', 'Design comprehensive IoT architecture including device connectivity, edge computing, cloud platform, and data flow. Select appropriate protocols and technologies.', 2),
  (1, 'Platform Development', 'Build and configure IoT platform, develop device integration modules, set up data pipelines, and create analytics dashboards.', 3),
  (1, 'Testing & Validation', 'Comprehensive testing including device connectivity, data accuracy, security validation, and performance under load. End-to-end system verification.', 4),
  (1, 'Deployment & Training', 'Phased deployment with minimal disruption, comprehensive user training, and documentation handover. Ongoing support and monitoring.', 5),
  
  -- Service 2: Industrial Automation (EN)
  (2, 'Process Assessment', 'Evaluate current manufacturing processes, identify automation opportunities, analyze existing equipment, and define improvement goals.', 1),
  (2, 'Solution Design', 'Create detailed automation design including PLC selection, control logic, SCADA architecture, network topology, and safety systems.', 2),
  (2, 'System Development', 'PLC programming, SCADA development, HMI design, and integration with existing systems. Factory acceptance testing.', 3),
  (2, 'Installation & Integration', 'On-site installation of hardware, system integration, network setup, and site acceptance testing. Minimal production disruption.', 4),
  (2, 'Training & Optimization', 'Operator and maintenance training, system fine-tuning, and continuous optimization support. Performance monitoring and improvement recommendations.', 5),
  
  -- Service 3: IT Infrastructure Solutions (EN)
  (3, 'Infrastructure Assessment', 'Comprehensive assessment of current IT infrastructure, identify gaps, bottlenecks, and security vulnerabilities. Define business requirements and growth projections.', 1),
  (3, 'Architecture Planning', 'Design future-proof infrastructure architecture including network, servers, storage, and cloud integration. Capacity planning and disaster recovery design.', 2),
  (3, 'Procurement & Setup', 'Equipment procurement, vendor coordination, and infrastructure setup in staging environment. Configuration and initial testing.', 3),
  (3, 'Migration & Deployment', 'Phased migration from legacy systems with minimal downtime. Production deployment, cutover planning, and rollback procedures.', 4),
  (3, 'Monitoring & Support', 'Implement 24/7 monitoring, establish support procedures, performance tuning, and ongoing optimization. Regular health checks and capacity reviews.', 5),
  
  -- Service 4: Smart Building Solutions (EN)
  (4, 'Building Assessment', 'Comprehensive facility audit including HVAC systems, lighting, energy consumption patterns, and occupancy analysis. Identify optimization opportunities.', 1),
  (4, 'System Design', 'Design integrated building automation solution with sensor placement, controller selection, network architecture, and energy management strategies.', 2),
  (4, 'Installation & Integration', 'Install IoT sensors, controllers, actuators, and building automation platform. Integrate with existing building systems and utilities.', 3),
  (4, 'Configuration & Optimization', 'Configure automation rules, schedules, and algorithms. Fine-tune HVAC and lighting control for optimal comfort and efficiency.', 4),
  (4, 'Training & Handover', 'Train facility management team on system operation, maintenance procedures, and troubleshooting. Complete documentation and ongoing support.', 5),
  
  -- Service 5: Cloud Infrastructure Management (EN)
  (5, 'Cloud Readiness Assessment', 'Evaluate current applications and infrastructure for cloud compatibility. Identify migration candidates, dependencies, and potential challenges.', 1),
  (5, 'Architecture & Planning', 'Design cloud architecture with multi-cloud strategy, security framework, disaster recovery, and cost optimization. Create detailed migration roadmap.', 2),
  (5, 'Migration Execution', 'Execute phased migration starting with non-critical workloads. Implement DevOps practices, CI/CD pipelines, and infrastructure as code.', 3),
  (5, 'Optimization & Tuning', 'Performance optimization, right-sizing resources, implementing auto-scaling, and cost optimization strategies. Security hardening and compliance validation.', 4),
  (5, 'Ongoing Management', 'Continuous monitoring, automated remediation, regular cost reviews, security updates, and optimization recommendations. Quarterly architecture reviews.', 5),
  
  -- Service 6: Cybersecurity Solutions (EN)
  (6, 'Security Assessment', 'Comprehensive security audit including vulnerability scanning, penetration testing, policy review, and compliance gap analysis. Risk prioritization matrix.', 1),
  (6, 'Strategy Development', 'Create security roadmap with quick wins and long-term initiatives. Define security policies, incident response procedures, and compliance requirements.', 2),
  (6, 'Implementation', 'Deploy security controls including firewall, IDS/IPS, endpoint protection, SIEM, and access management. Network segmentation and hardening.', 3),
  (6, 'Testing & Validation', 'Penetration testing, security validation, and red team exercises. Test incident response procedures and disaster recovery plans.', 4),
  (6, 'Monitoring & Response', 'Establish 24/7 SOC with threat monitoring, incident response, and regular security reporting. Continuous improvement and threat intelligence integration.', 5),
  
  -- Service 7: Tích hợp Hệ thống IoT (VI)
  (7, 'Khám phá & Yêu cầu', 'Tìm hiểu sâu về nhu cầu kinh doanh, hạ tầng hiện có và use cases IoT. Xác định thiết bị, yêu cầu dữ liệu và điểm tích hợp.', 1),
  (7, 'Thiết kế Kiến trúc', 'Thiết kế kiến trúc IoT toàn diện bao gồm kết nối thiết bị, edge computing, cloud platform và data flow. Chọn protocols và công nghệ phù hợp.', 2),
  (7, 'Phát triển Nền tảng', 'Xây dựng và cấu hình nền tảng IoT, phát triển modules tích hợp thiết bị, thiết lập data pipelines và tạo analytics dashboards.', 3),
  (7, 'Testing & Validation', 'Testing toàn diện bao gồm kết nối thiết bị, độ chính xác dữ liệu, validation bảo mật và hiệu suất dưới tải. Kiểm tra hệ thống end-to-end.', 4),
  (7, 'Triển khai & Đào tạo', 'Triển khai theo giai đoạn với gián đoạn tối thiểu, đào tạo người dùng toàn diện và bàn giao tài liệu. Hỗ trợ và giám sát liên tục.', 5),
  
  -- Service 8: Tự động hóa Công nghiệp (VI)
  (8, 'Đánh giá Quy trình', 'Đánh giá quy trình sản xuất hiện tại, xác định cơ hội tự động hóa, phân tích thiết bị hiện có và xác định mục tiêu cải thiện.', 1),
  (8, 'Thiết kế Giải pháp', 'Tạo thiết kế tự động hóa chi tiết bao gồm lựa chọn PLC, control logic, kiến trúc SCADA, network topology và safety systems.', 2),
  (8, 'Phát triển Hệ thống', 'Lập trình PLC, phát triển SCADA, thiết kế HMI và tích hợp với hệ thống hiện có. Factory acceptance testing.', 3),
  (8, 'Lắp đặt & Tích hợp', 'Lắp đặt hardware tại site, tích hợp hệ thống, thiết lập mạng và site acceptance testing. Gián đoạn sản xuất tối thiểu.', 4),
  (8, 'Đào tạo & Tối ưu', 'Đào tạo vận hành và bảo trì, fine-tuning hệ thống và hỗ trợ tối ưu liên tục. Giám sát hiệu suất và đề xuất cải thiện.', 5),
  
  -- Service 9: Giải pháp Hạ tầng CNTT (VI)
  (9, 'Đánh giá Hạ tầng', 'Đánh giá toàn diện hạ tầng CNTT hiện tại, xác định gaps, bottlenecks và lỗ hổng bảo mật. Xác định yêu cầu kinh doanh và dự báo tăng trưởng.', 1),
  (9, 'Lập kế hoạch Kiến trúc', 'Thiết kế kiến trúc hạ tầng tương lai bao gồm mạng, servers, storage và tích hợp cloud. Capacity planning và thiết kế disaster recovery.', 2),
  (9, 'Mua sắm & Thiết lập', 'Mua sắm thiết bị, phối hợp nhà cung cấp và thiết lập hạ tầng trong môi trường staging. Cấu hình và testing ban đầu.', 3),
  (9, 'Migration & Triển khai', 'Migration theo giai đoạn từ hệ thống legacy với downtime tối thiểu. Triển khai production, lập kế hoạch cutover và quy trình rollback.', 4),
  (9, 'Giám sát & Hỗ trợ', 'Triển khai giám sát 24/7, thiết lập quy trình hỗ trợ, tuning hiệu suất và tối ưu liên tục. Health checks và capacity reviews định kỳ.', 5),
  
  -- Service 10: Giải pháp Tòa nhà Thông minh (VI)
  (10, 'Đánh giá Tòa nhà', 'Audit cơ sở toàn diện bao gồm hệ thống HVAC, chiếu sáng, patterns tiêu thụ năng lượng và phân tích occupancy. Xác định cơ hội tối ưu.', 1),
  (10, 'Thiết kế Hệ thống', 'Thiết kế giải pháp building automation tích hợp với vị trí cảm biến, lựa chọn controller, kiến trúc mạng và chiến lược quản lý năng lượng.', 2),
  (10, 'Lắp đặt & Tích hợp', 'Lắp đặt cảm biến IoT, controllers, actuators và nền tảng building automation. Tích hợp với hệ thống tòa nhà và utilities hiện có.', 3),
  (10, 'Cấu hình & Tối ưu', 'Cấu hình automation rules, schedules và algorithms. Fine-tune điều khiển HVAC và chiếu sáng cho sự thoải mái và hiệu quả tối ưu.', 4),
  (10, 'Đào tạo & Bàn giao', 'Đào tạo team quản lý cơ sở về vận hành hệ thống, quy trình bảo trì và troubleshooting. Tài liệu hoàn chỉnh và hỗ trợ liên tục.', 5),
  
  -- Service 11: Quản lý Hạ tầng Đám mây (VI)
  (11, 'Đánh giá Cloud Readiness', 'Đánh giá ứng dụng và hạ tầng hiện tại về khả năng tương thích cloud. Xác định ứng cử viên migration, dependencies và thách thức tiềm năng.', 1),
  (11, 'Kiến trúc & Lập kế hoạch', 'Thiết kế kiến trúc cloud với chiến lược multi-cloud, security framework, disaster recovery và tối ưu chi phí. Tạo roadmap migration chi tiết.', 2),
  (11, 'Thực thi Migration', 'Thực thi migration theo giai đoạn bắt đầu với workloads không quan trọng. Triển khai DevOps practices, CI/CD pipelines và infrastructure as code.', 3),
  (11, 'Tối ưu & Tuning', 'Tối ưu hiệu suất, right-sizing resources, triển khai auto-scaling và chiến lược tối ưu chi phí. Hardening bảo mật và validation tuân thủ.', 4),
  (11, 'Quản lý Liên tục', 'Giám sát liên tục, remediation tự động, reviews chi phí thường xuyên, security updates và đề xuất tối ưu. Quarterly architecture reviews.', 5),
  
  -- Service 12: Giải pháp An ninh Mạng (VI)
  (12, 'Đánh giá Bảo mật', 'Audit bảo mật toàn diện bao gồm vulnerability scanning, penetration testing, policy review và compliance gap analysis. Ma trận ưu tiên rủi ro.', 1),
  (12, 'Phát triển Chiến lược', 'Tạo roadmap bảo mật với quick wins và sáng kiến dài hạn. Xác định security policies, incident response procedures và yêu cầu tuân thủ.', 2),
  (12, 'Triển khai', 'Triển khai security controls bao gồm firewall, IDS/IPS, endpoint protection, SIEM và access management. Network segmentation và hardening.', 3),
  (12, 'Testing & Validation', 'Penetration testing, security validation và red team exercises. Test incident response procedures và disaster recovery plans.', 4),
  (12, 'Giám sát & Phản ứng', 'Thiết lập SOC 24/7 với giám sát mối đe dọa, incident response và báo cáo bảo mật thường xuyên. Cải tiến liên tục và tích hợp threat intelligence.', 5)
ON CONFLICT DO NOTHING;

-- Insert service FAQs
INSERT INTO service_faqs (service_id, question, answer, sort_order) VALUES 
  -- Service 1: IoT System Integration (EN)
  (1, 'What IoT protocols and platforms do you support?', 'We support all major IoT protocols including MQTT, CoAP, HTTP/REST, WebSocket, Modbus, and OPC-UA. We work with AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard, and custom on-premise platforms. Our platform-agnostic approach ensures we can integrate with your existing infrastructure.', 1),
  (1, 'How long does a typical IoT implementation take?', 'Project timeline varies based on complexity and scale. A basic IoT solution with 10-50 devices typically takes 8-12 weeks. Enterprise-scale deployments with thousands of devices and complex integrations may take 4-6 months. We provide detailed timelines during the discovery phase with clear milestones.', 2),
  (1, 'Can you integrate IoT with our existing ERP, MES, or other enterprise systems?', 'Absolutely. System integration is one of our core strengths. We have successfully integrated IoT platforms with SAP, Oracle, Microsoft Dynamics, custom ERPs, MES systems, and various databases. We use standard APIs, message queues, and ETL processes to ensure seamless data flow between systems.', 3),
  (1, 'What about IoT security and data privacy?', 'Security is built into every layer of our IoT solutions. We implement device authentication, TLS/SSL encryption for data in transit, encrypted storage, secure firmware updates, network segmentation, and regular security audits. We comply with industry standards and regulations including GDPR, ISO 27001, and industry-specific requirements.', 4),
  
  -- Service 2: Industrial Automation (EN)
  (2, 'What PLC brands and industrial protocols do you work with?', 'We have extensive experience with Siemens (S7-300/400/1200/1500), Allen-Bradley (ControlLogix, CompactLogix), Mitsubishi, Schneider Electric, Omron, and Beckhoff PLCs. We support all major industrial protocols including Profibus, Profinet, EtherNet/IP, Modbus TCP/RTU, OPC-UA, and EtherCAT.', 1),
  (2, 'How do you minimize production downtime during automation implementation?', 'We use a phased approach: extensive pre-testing in our lab, parallel system operation during transition, installation during planned maintenance windows, and comprehensive rollback procedures. Most installations are completed over weekends or maintenance shutdowns. We typically achieve 95%+ uptime during implementation phases.', 2),
  (2, 'Do you provide training and ongoing support after implementation?', 'Yes, comprehensive training is included covering operations, troubleshooting, and maintenance. We provide operator manuals, maintenance procedures, and technical documentation. Our support packages include remote monitoring, on-call support, preventive maintenance visits, and system optimization services.', 3),
  (2, 'Can you help with predictive maintenance implementation?', 'Absolutely. We integrate vibration sensors, temperature monitoring, current monitoring, and other industrial IoT sensors with machine learning models to predict equipment failures. Our predictive maintenance solutions typically reduce unplanned downtime by 40-50% and extend equipment life by 20-30%.', 4),
  
  -- Service 3: IT Infrastructure Solutions (EN)
  (3, 'Do you provide both on-premise and cloud infrastructure solutions?', 'Yes, we design and implement on-premise data centers, cloud-only solutions, and hybrid architectures. We assess your workloads and recommend the optimal mix based on performance requirements, compliance needs, cost considerations, and business objectives. Many clients benefit from hybrid approaches combining on-premise critical systems with cloud scalability.', 1),
  (3, 'What is your approach to high availability and disaster recovery?', 'We design for resilience at every layer: redundant network paths, clustered servers, replicated storage, and geographically distributed backups. We define RTO (Recovery Time Objective) and RPO (Recovery Point Objective) based on your business requirements and implement solutions that meet or exceed these targets. Regular DR testing is included.', 2),
  (3, 'How do you handle infrastructure monitoring and support?', 'We implement 24/7 monitoring with automated alerting for all critical systems. Our NOC (Network Operations Center) team responds to incidents immediately. We provide tiered support: Level 1 for basic issues (response within 30 minutes), Level 2 for complex issues (within 2 hours), and Level 3 escalation for critical outages (within 15 minutes).', 3),
  (3, 'Can you help with compliance requirements like ISO 27001 or HIPAA?', 'Yes, we have extensive experience implementing compliant infrastructure for regulated industries. We understand ISO 27001, HIPAA, PCI DSS, GDPR, and industry-specific regulations. Our designs include proper network segmentation, access controls, audit logging, encryption, and documentation required for compliance audits.', 4),
  
  -- Service 4: Smart Building Solutions (EN)
  (4, 'What building systems can you integrate into a single platform?', 'We integrate HVAC (heating, ventilation, air conditioning), lighting control, access control and security, fire safety systems, elevator management, energy meters, water management, parking systems, and environmental sensors (temperature, humidity, CO2, air quality) into a unified building management platform with centralized monitoring and control.', 1),
  (4, 'How much energy savings can we realistically expect?', 'Based on our implementations, typical energy cost reductions range from 25-40% depending on building age and current systems. Savings come from optimized HVAC scheduling, occupancy-based control, daylight harvesting, demand response, and eliminating simultaneous heating/cooling. Most installations achieve ROI within 2-3 years from energy savings alone.', 2),
  (4, 'Can the system scale across multiple buildings or campuses?', 'Absolutely. Our platform supports multi-site management with centralized dashboards, aggregated reporting, and standardized configurations. You can monitor and control all buildings from a single interface while maintaining local autonomy. We have successfully deployed solutions managing 50+ buildings across multiple cities with unified energy management and maintenance workflows.', 3),
  (4, 'What about occupant comfort and indoor air quality?', 'Occupant comfort is a primary focus. We deploy sensors for temperature, humidity, CO2, and VOCs to ensure healthy indoor environments. The system automatically adjusts HVAC and ventilation to maintain optimal conditions. Occupants can provide feedback through mobile apps, and the system learns preferences over time while balancing comfort with energy efficiency.', 4),
  
  -- Service 5: Cloud Infrastructure Management (EN)
  (5, 'Which cloud platforms do you recommend and why?', 'We work with AWS, Azure, and Google Cloud Platform. The choice depends on your specific needs: AWS for breadth of services and maturity, Azure for Microsoft ecosystem integration and hybrid scenarios, GCP for data analytics and machine learning capabilities. We often recommend multi-cloud strategies to avoid vendor lock-in and leverage best-of-breed services from each platform.', 1),
  (5, 'How do you ensure zero downtime during cloud migration?', 'We use proven migration patterns: database replication with gradual traffic shift, blue-green deployments, pilot migrations with small workloads first, comprehensive testing in staging environments, automated rollback procedures, and 24/7 support during cutover windows. We typically achieve 99.9%+ uptime during migrations through careful planning and phased approaches.', 2),
  (5, 'What about cloud cost optimization?', 'Cloud cost optimization is ongoing. We implement automated right-sizing recommendations, spot instances for non-critical workloads, reserved instances for predictable loads, auto-scaling to match demand, lifecycle policies to move cold data to cheaper storage, and comprehensive cost allocation tags. Clients typically see 30-45% cost reduction within the first 6 months.', 3),
  (5, 'Do you provide DevOps and CI/CD implementation?', 'Yes, DevOps transformation is central to cloud success. We implement infrastructure as code (Terraform, CloudFormation), containerization (Docker, Kubernetes), automated CI/CD pipelines (Jenkins, GitLab, GitHub Actions), automated testing, and monitoring. This accelerates deployment cycles from weeks to hours while improving reliability and reducing errors.', 4),
  
  -- Service 6: Cybersecurity Solutions (EN)
  (6, 'What security frameworks and standards do you follow?', 'We align with industry-leading frameworks including NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls, and MITRE ATT&CK. For compliance, we support SOC 2, PCI DSS, HIPAA, GDPR, CMMC (for defense contractors), and industry-specific regulations. Our approach is risk-based, prioritizing controls that provide the most protection for your specific threat landscape.', 1),
  (6, 'How quickly can you respond to security incidents?', 'Our 24/7 Security Operations Center (SOC) provides immediate incident response. For critical security alerts (active attacks, ransomware, data exfiltration), our average response time is under 15 minutes with security analysts immediately investigating. For medium-severity incidents, response within 1 hour. All incidents include detailed forensics, containment, remediation, and post-incident reporting.', 2),
  (6, 'What is included in your penetration testing service?', 'Our penetration testing includes external network testing, internal network testing, web application testing, wireless security assessment, social engineering simulations, and physical security testing (if requested). We use both automated scanning and manual exploitation techniques. Deliverables include executive summary, detailed findings with risk ratings, proof-of-concept exploits, and actionable remediation recommendations.', 3),
  (6, 'Do you provide security awareness training for employees?', 'Yes, human factors are critical for security. We provide comprehensive security awareness training covering phishing recognition, password security, social engineering, mobile device security, and safe internet usage. We conduct simulated phishing campaigns to measure effectiveness and provide targeted training. Training is available as instructor-led sessions, online courses, and quarterly refreshers with updated threat intelligence.', 4),
  
  -- Service 7: Tích hợp Hệ thống IoT (VI)
  (7, 'Các protocols và platforms IoT nào được hỗ trợ?', 'Chúng tôi hỗ trợ tất cả protocols IoT chính bao gồm MQTT, CoAP, HTTP/REST, WebSocket, Modbus và OPC-UA. Chúng tôi làm việc với AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard và platforms on-premise tùy chỉnh. Phương pháp platform-agnostic của chúng tôi đảm bảo có thể tích hợp với hạ tầng hiện có của bạn.', 1),
  (7, 'Triển khai IoT điển hình mất bao lâu?', 'Timeline dự án thay đổi dựa trên độ phức tạp và quy mô. Giải pháp IoT cơ bản với 10-50 thiết bị thường mất 8-12 tuần. Triển khai quy mô doanh nghiệp với hàng ngàn thiết bị và tích hợp phức tạp có thể mất 4-6 tháng. Chúng tôi cung cấp timeline chi tiết trong giai đoạn khám phá với các milestone rõ ràng.', 2),
  (7, 'Có thể tích hợp IoT với ERP, MES hoặc hệ thống doanh nghiệp hiện có không?', 'Hoàn toàn được. Tích hợp hệ thống là một trong những thế mạnh cốt lõi. Chúng tôi đã tích hợp thành công nền tảng IoT với SAP, Oracle, Microsoft Dynamics, ERPs tùy chỉnh, hệ thống MES và các databases khác nhau. Chúng tôi sử dụng APIs tiêu chuẩn, message queues và quy trình ETL để đảm bảo data flow liền mạch giữa các hệ thống.', 3),
  (7, 'Vấn đề bảo mật IoT và quyền riêng tư dữ liệu thì sao?', 'Bảo mật được tích hợp vào mọi tầng của giải pháp IoT. Chúng tôi triển khai xác thực thiết bị, mã hóa TLS/SSL cho dữ liệu đang truyền, lưu trữ được mã hóa, firmware updates an toàn, network segmentation và audits bảo mật thường xuyên. Chúng tôi tuân thủ các tiêu chuẩn và quy định ngành bao gồm GDPR, ISO 27001 và yêu cầu đặc thù ngành.', 4),
  
  -- Service 8: Tự động hóa Công nghiệp (VI)
  (8, 'Các brands PLC và industrial protocols nào được hỗ trợ?', 'Chúng tôi có kinh nghiệm phong phú với PLCs Siemens (S7-300/400/1200/1500), Allen-Bradley (ControlLogix, CompactLogix), Mitsubishi, Schneider Electric, Omron và Beckhoff. Chúng tôi hỗ trợ tất cả industrial protocols chính bao gồm Profibus, Profinet, EtherNet/IP, Modbus TCP/RTU, OPC-UA và EtherCAT.', 1),
  (8, 'Làm thế nào để giảm thiểu downtime sản xuất trong quá trình triển khai?', 'Chúng tôi sử dụng phương pháp từng giai đoạn: testing rộng rãi trong lab, vận hành hệ thống song song trong giai đoạn chuyển đổi, lắp đặt trong cửa sổ bảo trì đã lên kế hoạch và quy trình rollback toàn diện. Hầu hết lắp đặt được hoàn thành vào cuối tuần hoặc shutdowns bảo trì. Chúng tôi thường đạt 95%+ uptime trong các giai đoạn triển khai.', 2),
  (8, 'Có cung cấp đào tạo và hỗ trợ liên tục sau triển khai không?', 'Có, đào tạo toàn diện được bao gồm bao quát vận hành, troubleshooting và bảo trì. Chúng tôi cung cấp hướng dẫn vận hành, quy trình bảo trì và tài liệu kỹ thuật. Gói hỗ trợ bao gồm giám sát từ xa, hỗ trợ on-call, visits bảo trì phòng ngừa và dịch vụ tối ưu hệ thống.', 3),
  (8, 'Có thể giúp triển khai bảo trì dự đoán không?', 'Hoàn toàn được. Chúng tôi tích hợp vibration sensors, temperature monitoring, current monitoring và các cảm biến industrial IoT khác với mô hình machine learning để dự đoán hỏng hóc thiết bị. Giải pháp predictive maintenance thường giảm unplanned downtime 40-50% và kéo dài tuổi thọ thiết bị 20-30%.', 4),
  
  -- Service 9: Giải pháp Hạ tầng CNTT (VI)
  (9, 'Có cung cấp cả giải pháp hạ tầng on-premise và cloud không?', 'Có, chúng tôi thiết kế và triển khai data centers on-premise, giải pháp cloud-only và kiến trúc hybrid. Chúng tôi đánh giá workloads và đề xuất sự kết hợp tối ưu dựa trên yêu cầu hiệu suất, nhu cầu tuân thủ, cân nhắc chi phí và mục tiêu kinh doanh. Nhiều clients được lợi từ phương pháp hybrid kết hợp hệ thống critical on-premise với khả năng mở rộng cloud.', 1),
  (9, 'Phương pháp tiếp cận high availability và disaster recovery như thế nào?', 'Chúng tôi thiết kế cho resilience ở mọi tầng: network paths dự phòng, clustered servers, replicated storage và backups phân tán địa lý. Chúng tôi xác định RTO (Recovery Time Objective) và RPO (Recovery Point Objective) dựa trên yêu cầu kinh doanh và triển khai giải pháp đáp ứng hoặc vượt các targets này. Testing DR thường xuyên được bao gồm.', 2),
  (9, 'Giám sát hạ tầng và hỗ trợ được xử lý như thế nào?', 'Chúng tôi triển khai giám sát 24/7 với cảnh báo tự động cho tất cả hệ thống critical. Đội NOC (Network Operations Center) phản ứng với sự cố ngay lập tức. Chúng tôi cung cấp hỗ trợ phân tầng: Level 1 cho vấn đề cơ bản (phản ứng trong 30 phút), Level 2 cho vấn đề phức tạp (trong 2 giờ) và escalation Level 3 cho outages critical (trong 15 phút).', 3),
  (9, 'Có thể giúp với yêu cầu tuân thủ như ISO 27001 hoặc HIPAA không?', 'Có, chúng tôi có kinh nghiệm phong phú triển khai hạ tầng tuân thủ cho các ngành được quản lý. Chúng tôi hiểu ISO 27001, HIPAA, PCI DSS, GDPR và quy định đặc thù ngành. Thiết kế của chúng tôi bao gồm network segmentation phù hợp, access controls, audit logging, encryption và tài liệu cần thiết cho compliance audits.', 4),
  
  -- Service 10: Giải pháp Tòa nhà Thông minh (VI)
  (10, 'Các hệ thống tòa nhà nào có thể tích hợp vào một nền tảng duy nhất?', 'Chúng tôi tích hợp HVAC (sưởi ấm, thông gió, điều hòa), điều khiển chiếu sáng, access control và an ninh, fire safety systems, quản lý thang máy, energy meters, water management, parking systems và environmental sensors (nhiệt độ, độ ẩm, CO2, air quality) vào nền tảng quản lý tòa nhà thống nhất với giám sát và điều khiển tập trung.', 1),
  (10, 'Có thể kỳ vọng tiết kiệm năng lượng bao nhiêu thực tế?', 'Dựa trên các triển khai, giảm chi phí năng lượng điển hình dao động từ 25-40% tùy thuộc vào tuổi tòa nhà và hệ thống hiện tại. Tiết kiệm đến từ lập lịch HVAC tối ưu, điều khiển dựa trên occupancy, daylight harvesting, demand response và loại bỏ đồng thời sưởi/làm mát. Hầu hết lắp đặt đạt ROI trong 2-3 năm chỉ từ tiết kiệm năng lượng.', 2),
  (10, 'Hệ thống có thể mở rộng trên nhiều tòa nhà hoặc campuses không?', 'Hoàn toàn được. Nền tảng hỗ trợ quản lý multi-site với dashboards tập trung, báo cáo tổng hợp và cấu hình tiêu chuẩn hóa. Bạn có thể giám sát và điều khiển tất cả tòa nhà từ một giao diện duy nhất đồng thời duy trì quyền tự chủ local. Chúng tôi đã triển khai thành công giải pháp quản lý 50+ tòa nhà trên nhiều thành phố với quản lý năng lượng và maintenance workflows thống nhất.', 3),
  (10, 'Sự thoải mái của người sử dụng và chất lượng không khí trong nhà thì sao?', 'Sự thoải mái của người sử dụng là trọng tâm chính. Chúng tôi triển khai sensors cho nhiệt độ, độ ẩm, CO2 và VOCs để đảm bảo môi trường trong nhà lành mạnh. Hệ thống tự động điều chỉnh HVAC và thông gió để duy trì điều kiện tối ưu. Người sử dụng có thể cung cấp feedback qua mobile apps và hệ thống học preferences theo thời gian đồng thời cân bằng sự thoải mái với hiệu quả năng lượng.', 4),
  
  -- Service 11: Quản lý Hạ tầng Đám mây (VI)
  (11, 'Nên chọn cloud platforms nào và tại sao?', 'Chúng tôi làm việc với AWS, Azure và Google Cloud Platform. Lựa chọn phụ thuộc vào nhu cầu cụ thể: AWS cho breadth of services và maturity, Azure cho tích hợp Microsoft ecosystem và hybrid scenarios, GCP cho data analytics và machine learning capabilities. Chúng tôi thường đề xuất chiến lược multi-cloud để tránh vendor lock-in và tận dụng best-of-breed services từ mỗi nền tảng.', 1),
  (11, 'Làm thế nào để đảm bảo zero downtime trong quá trình cloud migration?', 'Chúng tôi sử dụng migration patterns đã được chứng minh: database replication với gradual traffic shift, blue-green deployments, pilot migrations với workloads nhỏ trước, testing toàn diện trong staging environments, quy trình rollback tự động và hỗ trợ 24/7 trong cutover windows. Chúng tôi thường đạt 99.9%+ uptime trong migrations thông qua lập kế hoạch cẩn thận và phương pháp từng giai đoạn.', 2),
  (11, 'Tối ưu chi phí cloud thì sao?', 'Tối ưu chi phí cloud là liên tục. Chúng tôi triển khai right-sizing recommendations tự động, spot instances cho workloads không critical, reserved instances cho loads dự đoán được, auto-scaling để match demand, lifecycle policies để chuyển cold data sang storage rẻ hơn và comprehensive cost allocation tags. Clients thường thấy giảm 30-45% chi phí trong 6 tháng đầu.', 3),
  (11, 'Có cung cấp triển khai DevOps và CI/CD không?', 'Có, chuyển đổi DevOps là trung tâm cho thành công cloud. Chúng tôi triển khai infrastructure as code (Terraform, CloudFormation), containerization (Docker, Kubernetes), automated CI/CD pipelines (Jenkins, GitLab, GitHub Actions), automated testing và monitoring. Điều này tăng tốc deployment cycles từ tuần xuống giờ đồng thời cải thiện reliability và giảm errors.', 4),
  
  -- Service 12: Giải pháp An ninh Mạng (VI)
  (12, 'Các security frameworks và standards nào được tuân theo?', 'Chúng tôi align với frameworks hàng đầu ngành bao gồm NIST Cybersecurity Framework, ISO 27001/27002, CIS Controls và MITRE ATT&CK. Cho compliance, chúng tôi hỗ trợ SOC 2, PCI DSS, HIPAA, GDPR, CMMC (cho nhà thầu quốc phòng) và quy định đặc thù ngành. Phương pháp của chúng tôi dựa trên rủi ro, ưu tiên các controls cung cấp bảo vệ nhiều nhất cho threat landscape cụ thể của bạn.', 1),
  (12, 'Có thể phản ứng với security incidents nhanh như thế nào?', 'Security Operations Center (SOC) 24/7 cung cấp incident response ngay lập tức. Cho critical security alerts (tấn công đang hoạt động, ransomware, data exfiltration), thời gian phản ứng trung bình dưới 15 phút với security analysts ngay lập tức điều tra. Cho medium-severity incidents, phản ứng trong 1 giờ. Tất cả incidents bao gồm forensics chi tiết, containment, remediation và post-incident reporting.', 2),
  (12, 'Dịch vụ penetration testing bao gồm những gì?', 'Penetration testing bao gồm external network testing, internal network testing, web application testing, wireless security assessment, social engineering simulations và physical security testing (nếu yêu cầu). Chúng tôi sử dụng cả automated scanning và manual exploitation techniques. Deliverables bao gồm executive summary, findings chi tiết với risk ratings, proof-of-concept exploits và đề xuất remediation hành động được.', 3),
  (12, 'Có cung cấp security awareness training cho nhân viên không?', 'Có, yếu tố con người là critical cho bảo mật. Chúng tôi cung cấp security awareness training toàn diện bao quát nhận diện phishing, password security, social engineering, mobile device security và internet usage an toàn. Chúng tôi tiến hành simulated phishing campaigns để đo effectiveness và cung cấp targeted training. Training có sẵn dưới dạng instructor-led sessions, online courses và quarterly refreshers với threat intelligence cập nhật.', 4)
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
  ),
  (
    3,
    'en',
    'services',
    'Our Services',
    'Our Services — KOOLA',
    'Discover KOOLA comprehensive IT, IoT, and Automation solutions designed to transform your business operations.',
    'published',
    1
  ),
  (
    4,
    'vi',
    'services',
    'Dịch vụ của chúng tôi',
    'Dịch vụ của chúng tôi — KOOLA',
    'Khám phá các giải pháp IT, IoT và Tự động hóa toàn diện của KOOLA được thiết kế để chuyển đổi hoạt động doanh nghiệp của bạn.',
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
        "src": "/images/about/intro.jpg",
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
        "src": "/images/about/story.jpg",
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
        "src": "/images/about/intro.jpg",
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
        "src": "/images/about/story.jpg",
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
  ),
  -- Services page sections (EN) - page_id = 3
  (
    3,
    'services_hero',
    '{
      "label": "Our services",
      "title": "Transforming businesses through intelligent technology solutions",
      "backgroundImage": "/services/hero-bg.jpg"
    }'::jsonb,
    10
  ),
  (
    3,
    'services_mid_quote',
    '{
      "imageUrl": "/services/team-collaboration.jpg",
      "headline": "We work with you and your teams to define, structure and build the organizational and technical capabilities needed to transform into a modern digital driven business.",
      "paragraph": "To succeed, you need a partner who can connect strategy to practical execution, using cross-functional teams of strategists, developers, data engineers and designers."
    }'::jsonb,
    20
  ),
  (
    3,
    'services_cta',
    '{
      "title": "We make information technology simple, faster and less expensive",
      "buttonLabel": "Get a headstart",
      "backgroundImage": "/services/cta-bg.jpg"
    }'::jsonb,
    30
  ),
  -- Services page sections (VI) - page_id = 4
  (
    4,
    'services_hero',
    '{
      "label": "Dịch vụ của chúng tôi",
      "title": "Chuyển đổi doanh nghiệp thông qua các giải pháp công nghệ thông minh",
      "backgroundImage": "/services/hero-bg.jpg"
    }'::jsonb,
    10
  ),
  (
    4,
    'services_mid_quote',
    '{
      "imageUrl": "/services/team-collaboration.jpg",
      "headline": "Chúng tôi làm việc cùng bạn và đội ngũ của bạn để xác định, cấu trúc và xây dựng các năng lực tổ chức và kỹ thuật cần thiết để chuyển đổi thành doanh nghiệp số hiện đại.",
      "paragraph": "Để thành công, bạn cần một đối tác có thể kết nối chiến lược với thực thi thực tế, sử dụng các đội ngũ đa chức năng gồm chiến lược gia, nhà phát triển, kỹ sư dữ liệu và nhà thiết kế."
    }'::jsonb,
    20
  ),
  (
    4,
    'services_cta',
    '{
      "title": "Chúng tôi làm cho công nghệ thông tin trở nên đơn giản, nhanh hơn và ít tốn kém hơn",
      "buttonLabel": "Bắt đầu ngay",
      "backgroundImage": "/services/cta-bg.jpg"
    }'::jsonb,
    30
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
