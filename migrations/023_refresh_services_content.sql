-- Migration: Refresh all services content with specific, professional details
-- Updates: content_md, excerpt, seo_title, seo_description, benefits_subtitle
-- Adds: service_benefits (currently empty)
-- Date: 2026-03-12

-- ═══════════════════════════════════════════════════════════════
-- ENGLISH SERVICES
-- ═══════════════════════════════════════════════════════════════

-- ─── Service 1: IoT System Integration ───────────────────────
UPDATE services SET
  excerpt = 'End-to-end IoT solutions that connect your devices, collect real-time data, and automate operations across your entire business.',
  seo_title = 'IoT System Integration Services | KOOLA',
  seo_description = 'Connect devices, collect real-time data, and automate operations with KOOLA IoT integration services. MQTT, OPC-UA, AWS IoT, Azure IoT Hub.',
  benefits_subtitle = 'Why businesses choose KOOLA for IoT',
  content_md = '## Connect Everything. Automate Anything.

Your devices generate valuable data every second — but without proper integration, that data sits in silos. KOOLA builds IoT systems that connect your sensors, machines, and software into a single intelligent platform.

### What We Actually Do

We do not just install sensors. We design complete IoT ecosystems tailored to your operations:

- **Device connectivity** — We integrate any industrial protocol (MQTT, OPC-UA, Modbus, BACnet) into a unified data pipeline
- **Edge computing** — Process critical data locally for sub-second response times, reducing cloud dependency
- **Cloud platform** — Centralized dashboards on AWS IoT, Azure IoT Hub, or ThingsBoard for real-time monitoring
- **Custom alerts & automation** — Rules engine that triggers actions based on your specific business logic

### Technology We Work With

| Layer | Technologies |
|-------|-------------|
| Protocols | MQTT, CoAP, HTTP/REST, WebSocket, Modbus TCP/RTU, OPC-UA, BACnet |
| Edge | AWS Greengrass, Azure IoT Edge, custom gateways |
| Cloud | AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard |
| Analytics | InfluxDB, TimescaleDB, Grafana, custom dashboards |

### Industries We Serve

- **Manufacturing** — Production line monitoring, predictive maintenance, quality control
- **Logistics** — Fleet tracking, warehouse automation, cold chain monitoring
- **Agriculture** — Smart irrigation, environmental monitoring, crop analytics
- **Energy** — Smart metering, grid monitoring, renewable energy optimization'
WHERE slug = 'iot-system-integration' AND locale = 'en';

-- ─── Service 2: Industrial Automation ─────────────────────────
UPDATE services SET
  excerpt = 'Smart automation systems that optimize production, reduce downtime, and bring Industry 4.0 capabilities to your factory floor.',
  seo_title = 'Industrial Automation Solutions | KOOLA',
  seo_description = 'PLC programming, SCADA systems, robotics integration, and predictive maintenance. KOOLA delivers Industry 4.0 automation solutions.',
  benefits_subtitle = 'Why manufacturers trust KOOLA',
  content_md = '## Smarter Factories Start Here

Manual processes slow you down. Equipment failures cost you money. KOOLA designs automation systems that keep your production running efficiently, predictably, and profitably.

### Our Automation Services

- **PLC & Control Systems** — Programming and integration of Siemens, Allen-Bradley, Mitsubishi, and Schneider PLCs for precise process control
- **SCADA & HMI** — Real-time supervisory systems with intuitive operator interfaces for complete plant visibility
- **Robotics Integration** — Collaborative robots (cobots) and industrial robots integrated into your existing production lines
- **Predictive Maintenance** — Vibration analysis, thermal monitoring, and ML-based failure prediction to prevent unplanned downtime
- **Process Optimization** — Data-driven analysis to identify bottlenecks and improve OEE (Overall Equipment Effectiveness)

### Core Capabilities

| Area | What We Deliver |
|------|----------------|
| Control Systems | PLC programming, DCS integration, motion control |
| Visualization | SCADA, HMI design, real-time dashboards |
| Robotics | Pick-and-place, welding, assembly, palletizing |
| Data | OPC-UA connectivity, historian databases, analytics |
| Safety | SIL-rated safety systems, emergency shutdown |

### Industry 4.0 Ready

Every system we build is designed for connectivity. Your automation data feeds directly into your IoT platform, ERP, and analytics tools — giving you a complete digital picture of your operations.'
WHERE slug = 'industrial-automation' AND locale = 'en';

-- ─── Service 3: IT Infrastructure Solutions ──────────────────
UPDATE services SET
  excerpt = 'Reliable, scalable IT infrastructure designed for business continuity — from network architecture to data center solutions.',
  seo_title = 'IT Infrastructure Solutions | KOOLA',
  seo_description = 'Network design, server deployment, data center solutions, and 24/7 monitoring. KOOLA builds IT infrastructure that grows with your business.',
  benefits_subtitle = 'Why businesses rely on KOOLA for IT',
  content_md = '## Infrastructure That Never Lets You Down

Your business runs on IT. When systems go down, everything stops. KOOLA designs and deploys infrastructure that is reliable, secure, and built to scale with your growth.

### What We Build

- **Network Architecture** — Enterprise-grade LAN/WAN design with redundancy, segmentation, and performance optimization
- **Server & Storage** — On-premise, hybrid, or cloud server deployments with proper sizing, clustering, and backup strategies
- **Data Center** — From rack design to cooling systems, we build data centers that meet your capacity and compliance requirements
- **Unified Communications** — VoIP, video conferencing, and collaboration platforms integrated into your network
- **Security Infrastructure** — Firewalls, IDS/IPS, VPN, and zero-trust network architecture

### Our Approach

We do not sell hardware — we solve problems. Every infrastructure project starts with understanding your business requirements, growth plans, and budget constraints. Then we design a solution that fits.

| Phase | What Happens |
|-------|-------------|
| Assessment | Audit existing infrastructure, identify gaps and risks |
| Design | Architecture blueprint with redundancy and growth planning |
| Deployment | Staged rollout with minimal business disruption |
| Migration | Data and workload migration with rollback plans |
| Support | 24/7 monitoring, proactive maintenance, SLA-backed response |

### Technology Partners

We work with industry-leading vendors: Cisco, HPE, Dell, Fortinet, VMware, Microsoft, and Veeam — selecting the right tools for your specific needs, not pushing a single vendor stack.'
WHERE slug = 'it-infrastructure-solutions' AND locale = 'en';

-- ─── Service 4: Smart Building Solutions ──────────────────────
UPDATE services SET
  excerpt = 'Intelligent building management systems that reduce energy costs, improve occupant comfort, and centralize facility control.',
  seo_title = 'Smart Building Solutions | KOOLA',
  seo_description = 'Building automation, energy management, smart HVAC, and IoT sensor networks. KOOLA transforms buildings into intelligent, efficient spaces.',
  benefits_subtitle = 'Why property managers choose KOOLA',
  content_md = '## Buildings That Think For Themselves

Modern buildings should do more than shelter — they should actively optimize energy, comfort, and security. KOOLA integrates building systems into a single intelligent platform that reduces costs and improves the experience for everyone inside.

### What We Integrate

- **Building Automation (BAS)** — Centralized control of HVAC, lighting, elevators, and fire safety through a single management platform
- **Energy Management** — Real-time monitoring and optimization that typically reduces energy consumption by 25-40%
- **Smart HVAC** — Demand-based climate control using occupancy sensors and weather data for optimal comfort and efficiency
- **Intelligent Lighting** — Daylight harvesting, occupancy-based control, and circadian rhythm lighting for productivity and savings
- **Access Control & Security** — Integrated access management with video surveillance, visitor management, and emergency protocols
- **IoT Sensor Networks** — Air quality, temperature, humidity, and occupancy sensors providing real-time building intelligence

### Measurable Results

| Metric | Typical Improvement |
|--------|-------------------|
| Energy costs | 25-40% reduction |
| Space utilization | 25% improvement |
| Maintenance response | 50% faster issue resolution |
| Occupant satisfaction | Measurable improvement in comfort scores |

### Standards & Compliance

Our solutions support LEED, WELL, and Green Mark certification requirements. We design with sustainability and regulatory compliance built in from the start.'
WHERE slug = 'smart-building-solutions' AND locale = 'en';

-- ─── Service 5: Cloud Infrastructure Management ──────────────
UPDATE services SET
  excerpt = 'Cloud architecture, migration, and ongoing management that reduces costs and accelerates your digital transformation.',
  seo_title = 'Cloud Infrastructure Management | KOOLA',
  seo_description = 'Cloud architecture design, migration, DevOps, cost optimization, and 24/7 management on AWS, Azure, and GCP. KOOLA cloud services.',
  benefits_subtitle = 'Why businesses move to cloud with KOOLA',
  content_md = '## Cloud Done Right

Moving to the cloud is not just about lifting and shifting servers. It is about rethinking how your infrastructure supports your business. KOOLA designs cloud architectures that are secure, cost-effective, and built for performance.

### Our Cloud Services

- **Architecture Design** — Right-sized cloud architecture on AWS, Azure, or GCP based on your workload requirements and budget
- **Cloud Migration** — Zero-downtime migration strategies with thorough testing and rollback plans
- **DevOps & CI/CD** — Automated build, test, and deployment pipelines using Terraform, Docker, Kubernetes, and GitHub Actions
- **Cloud Security** — IAM policies, encryption, network segmentation, and compliance monitoring
- **Cost Optimization** — Reserved instances, right-sizing, spot instances, and waste elimination — typically saving 30-45%
- **Disaster Recovery** — Multi-region backup strategies with defined RPO/RTO targets

### Technology Stack

| Layer | Tools |
|-------|-------|
| IaC | Terraform, CloudFormation, Pulumi |
| Containers | Docker, Kubernetes, ECS, EKS, AKS |
| CI/CD | GitHub Actions, GitLab CI, Jenkins, ArgoCD |
| Monitoring | CloudWatch, Datadog, Prometheus, Grafana |
| Security | AWS GuardDuty, Azure Defender, Vault, OPA |

### Multi-Cloud Expertise

We are not locked into a single provider. Whether you need AWS, Azure, GCP, or a hybrid approach, we design the architecture that makes the most sense for your specific requirements and existing investments.'
WHERE slug = 'cloud-infrastructure-management' AND locale = 'en';

-- ─── Service 6: Cybersecurity Solutions ───────────────────────
UPDATE services SET
  excerpt = 'Comprehensive security services that protect your business from threats — from assessment and architecture to 24/7 monitoring and incident response.',
  seo_title = 'Cybersecurity Solutions | KOOLA',
  seo_description = 'Security assessment, penetration testing, SOC monitoring, incident response, and compliance. KOOLA protects your digital assets.',
  benefits_subtitle = 'Why businesses trust KOOLA for security',
  content_md = '## Security Is Not Optional

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

Technology alone is not enough. We provide security awareness training programs that turn your employees from the weakest link into your first line of defense.'
WHERE slug = 'cybersecurity-solutions' AND locale = 'en';

-- ═══════════════════════════════════════════════════════════════
-- ENGLISH SERVICE BENEFITS (populate empty table)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_benefits WHERE service_id IN (1,2,3,4,5,6);

INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order) VALUES
-- IoT (1)
(1, 'Real-Time Visibility', 'Monitor all connected devices and data streams from a single dashboard with sub-second latency', 'eye', 1),
(1, 'Protocol Agnostic', 'We integrate any industrial protocol — MQTT, OPC-UA, Modbus, BACnet — into one unified platform', 'plug', 2),
(1, 'Scalable Architecture', 'Start with 10 devices or 10,000. Our edge-to-cloud architecture scales without redesign', 'trending-up', 3),
(1, 'Actionable Insights', 'Automated alerts and analytics that turn raw sensor data into business decisions', 'brain', 4),
-- Industrial Automation (2)
(2, 'Reduced Downtime', 'Predictive maintenance and real-time monitoring catch issues before they stop production', 'clock', 1),
(2, 'Multi-Vendor Support', 'We program Siemens, Allen-Bradley, Mitsubishi, and Schneider — no vendor lock-in', 'layers', 2),
(2, 'Industry 4.0 Ready', 'Every system connects to your IoT platform and ERP for complete digital visibility', 'wifi', 3),
(2, 'Safety Compliant', 'SIL-rated safety systems and emergency shutdown protocols built into every design', 'shield', 4),
-- IT Infrastructure (3)
(3, 'Zero-Downtime Design', 'Redundant architecture with failover ensures your business never stops', 'server', 1),
(3, 'Vendor Neutral', 'We select the best tools from Cisco, HPE, Dell, Fortinet — not push a single vendor', 'shuffle', 2),
(3, 'Scalable Growth', 'Infrastructure designed to grow with your business without costly redesigns', 'trending-up', 3),
(3, '24/7 Monitoring', 'Proactive monitoring and SLA-backed support keeps your systems healthy', 'activity', 4),
-- Smart Building (4)
(4, 'Energy Savings', 'Typical 25-40% reduction in energy costs through intelligent automation', 'zap', 1),
(4, 'Unified Control', 'HVAC, lighting, security, and access managed from a single platform', 'layout', 2),
(4, 'Occupant Comfort', 'Demand-based climate and lighting that adapts to real-time conditions', 'smile', 3),
(4, 'Green Certified', 'Solutions designed to support LEED, WELL, and Green Mark certification', 'leaf', 4),
-- Cloud (5)
(5, 'Cost Optimization', 'Right-sizing and waste elimination typically saves 30-45% on cloud spend', 'dollar-sign', 1),
(5, 'Multi-Cloud', 'AWS, Azure, GCP, or hybrid — we design for your needs, not a single provider', 'cloud', 2),
(5, 'DevOps Built-In', 'Automated CI/CD pipelines from day one for faster, safer deployments', 'git-branch', 3),
(5, 'Disaster Recovery', 'Multi-region backup with defined RPO/RTO targets for business continuity', 'shield', 4),
-- Cybersecurity (6)
(6, 'Proactive Defense', '24/7 SOC monitoring with automated threat detection and response', 'shield', 1),
(6, 'Compliance Ready', 'ISO 27001, NIST, PCI-DSS, GDPR framework alignment and audit support', 'check-circle', 2),
(6, 'Rapid Response', 'Incident containment, forensic analysis, and recovery when threats materialize', 'alert-triangle', 3),
(6, 'Human Firewall', 'Security awareness training that turns employees into your first line of defense', 'users', 4);

-- ═══════════════════════════════════════════════════════════════
-- VIETNAMESE SERVICES
-- ═══════════════════════════════════════════════════════════════

-- ─── Service 7: Tích hợp Hệ thống IoT ───────────────────────
UPDATE services SET
  excerpt = 'Giải pháp IoT toàn diện kết nối thiết bị, thu thập dữ liệu thời gian thực và tự động hóa vận hành trên toàn bộ doanh nghiệp.',
  seo_title = 'Dịch vụ Tích hợp Hệ thống IoT | KOOLA',
  seo_description = 'Kết nối thiết bị, thu thập dữ liệu thời gian thực và tự động hóa vận hành với dịch vụ tích hợp IoT của KOOLA. MQTT, OPC-UA, AWS IoT, Azure IoT Hub.',
  benefits_subtitle = 'Tại sao doanh nghiệp chọn KOOLA cho IoT',
  content_md = '## Kết nối mọi thứ. Tự động hóa mọi nơi.

Thiết bị của bạn tạo ra dữ liệu giá trị mỗi giây — nhưng nếu không được tích hợp đúng cách, dữ liệu đó nằm rải rác. KOOLA xây dựng hệ thống IoT kết nối cảm biến, máy móc và phần mềm thành một nền tảng thông minh duy nhất.

### Chúng tôi thực sự làm gì

Chúng tôi không chỉ lắp cảm biến. Chúng tôi thiết kế hệ sinh thái IoT hoàn chỉnh phù hợp với vận hành của bạn:

- **Kết nối thiết bị** — Tích hợp mọi giao thức công nghiệp (MQTT, OPC-UA, Modbus, BACnet) vào một pipeline dữ liệu thống nhất
- **Edge computing** — Xử lý dữ liệu quan trọng tại chỗ với thời gian phản hồi dưới 1 giây, giảm phụ thuộc cloud
- **Nền tảng cloud** — Dashboard tập trung trên AWS IoT, Azure IoT Hub hoặc ThingsBoard để giám sát thời gian thực
- **Cảnh báo & tự động hóa** — Rules engine kích hoạt hành động dựa trên logic kinh doanh cụ thể của bạn

### Công nghệ chúng tôi sử dụng

| Tầng | Công nghệ |
|------|-----------|
| Giao thức | MQTT, CoAP, HTTP/REST, WebSocket, Modbus TCP/RTU, OPC-UA, BACnet |
| Edge | AWS Greengrass, Azure IoT Edge, gateway tùy chỉnh |
| Cloud | AWS IoT Core, Azure IoT Hub, Google Cloud IoT, ThingsBoard |
| Phân tích | InfluxDB, TimescaleDB, Grafana, dashboard tùy chỉnh |

### Ngành nghề phục vụ

- **Sản xuất** — Giám sát dây chuyền, bảo trì dự đoán, kiểm soát chất lượng
- **Logistics** — Theo dõi đội xe, tự động hóa kho, giám sát chuỗi lạnh
- **Nông nghiệp** — Tưới tiêu thông minh, giám sát môi trường, phân tích cây trồng
- **Năng lượng** — Đo lường thông minh, giám sát lưới điện, tối ưu năng lượng tái tạo'
WHERE slug = 'tich-hop-he-thong-iot' AND locale = 'vi';

-- ─── Service 8: Tự động hóa Công nghiệp ─────────────────────
UPDATE services SET
  excerpt = 'Hệ thống tự động hóa thông minh tối ưu sản xuất, giảm thời gian chết và đưa năng lực Industry 4.0 vào nhà máy.',
  seo_title = 'Giải pháp Tự động hóa Công nghiệp | KOOLA',
  seo_description = 'Lập trình PLC, hệ thống SCADA, tích hợp robot và bảo trì dự đoán. KOOLA cung cấp giải pháp tự động hóa Industry 4.0.',
  benefits_subtitle = 'Tại sao nhà sản xuất tin tưởng KOOLA',
  content_md = '## Nhà máy thông minh bắt đầu từ đây

Quy trình thủ công làm chậm bạn. Hỏng thiết bị tốn tiền. KOOLA thiết kế hệ thống tự động hóa giữ sản xuất vận hành hiệu quả, ổn định và có lợi nhuận.

### Dịch vụ tự động hóa

- **PLC & Hệ thống điều khiển** — Lập trình và tích hợp PLC Siemens, Allen-Bradley, Mitsubishi, Schneider cho điều khiển quy trình chính xác
- **SCADA & HMI** — Hệ thống giám sát thời gian thực với giao diện vận hành trực quan cho tầm nhìn toàn nhà máy
- **Tích hợp Robot** — Robot cộng tác (cobot) và robot công nghiệp tích hợp vào dây chuyền sản xuất hiện có
- **Bảo trì dự đoán** — Phân tích rung động, giám sát nhiệt và dự đoán hỏng hóc dựa trên ML để ngăn ngừa downtime
- **Tối ưu quy trình** — Phân tích dữ liệu để xác định điểm nghẽn và cải thiện OEE

### Năng lực cốt lõi

| Lĩnh vực | Chúng tôi cung cấp |
|-----------|-------------------|
| Điều khiển | Lập trình PLC, tích hợp DCS, điều khiển chuyển động |
| Trực quan hóa | SCADA, thiết kế HMI, dashboard thời gian thực |
| Robot | Pick-and-place, hàn, lắp ráp, palletizing |
| Dữ liệu | Kết nối OPC-UA, historian databases, analytics |
| An toàn | Hệ thống an toàn SIL, emergency shutdown |

### Sẵn sàng Industry 4.0

Mọi hệ thống chúng tôi xây dựng đều được thiết kế cho kết nối. Dữ liệu tự động hóa của bạn được đưa trực tiếp vào nền tảng IoT, ERP và công cụ phân tích — cho bạn bức tranh số hoàn chỉnh về vận hành.'
WHERE slug = 'tu-dong-hoa-cong-nghiep' AND locale = 'vi';

-- ─── Service 9: Giải pháp Hạ tầng CNTT ──────────────────────
UPDATE services SET
  excerpt = 'Hạ tầng IT đáng tin cậy, có khả năng mở rộng, được thiết kế cho tính liên tục kinh doanh — từ kiến trúc mạng đến giải pháp data center.',
  seo_title = 'Giải pháp Hạ tầng CNTT | KOOLA',
  seo_description = 'Thiết kế mạng, triển khai server, giải pháp data center và giám sát 24/7. KOOLA xây dựng hạ tầng IT phát triển cùng doanh nghiệp.',
  benefits_subtitle = 'Tại sao doanh nghiệp tin cậy KOOLA cho IT',
  content_md = '## Hạ tầng không bao giờ để bạn thất vọng

Doanh nghiệp của bạn chạy trên IT. Khi hệ thống sập, mọi thứ dừng lại. KOOLA thiết kế và triển khai hạ tầng đáng tin cậy, bảo mật và sẵn sàng mở rộng theo tăng trưởng.

### Chúng tôi xây dựng gì

- **Kiến trúc mạng** — Thiết kế LAN/WAN cấp doanh nghiệp với dự phòng, phân đoạn và tối ưu hiệu suất
- **Server & Lưu trữ** — Triển khai on-premise, hybrid hoặc cloud với sizing phù hợp, clustering và chiến lược backup
- **Data Center** — Từ thiết kế rack đến hệ thống làm mát, chúng tôi xây data center đáp ứng yêu cầu dung lượng và tuân thủ
- **Truyền thông hợp nhất** — VoIP, video conferencing và nền tảng cộng tác tích hợp vào mạng
- **Hạ tầng bảo mật** — Firewall, IDS/IPS, VPN và kiến trúc zero-trust

### Phương pháp tiếp cận

Chúng tôi không bán phần cứng — chúng tôi giải quyết vấn đề. Mọi dự án hạ tầng bắt đầu từ hiểu yêu cầu kinh doanh, kế hoạch tăng trưởng và ngân sách. Sau đó thiết kế giải pháp phù hợp.

| Giai đoạn | Nội dung |
|-----------|---------|
| Đánh giá | Kiểm tra hạ tầng hiện tại, xác định lỗ hổng và rủi ro |
| Thiết kế | Bản vẽ kiến trúc với dự phòng và kế hoạch tăng trưởng |
| Triển khai | Rollout theo giai đoạn với gián đoạn kinh doanh tối thiểu |
| Di chuyển | Migration dữ liệu và workload với kế hoạch rollback |
| Hỗ trợ | Giám sát 24/7, bảo trì chủ động, phản hồi theo SLA |

### Đối tác công nghệ

Chúng tôi làm việc với các nhà cung cấp hàng đầu: Cisco, HPE, Dell, Fortinet, VMware, Microsoft và Veeam — chọn công cụ phù hợp cho nhu cầu cụ thể, không ép buộc một vendor duy nhất.'
WHERE slug = 'giai-phap-ha-tang-cntt' AND locale = 'vi';

-- ─── Service 10: Giải pháp Tòa nhà Thông minh ───────────────
UPDATE services SET
  excerpt = 'Hệ thống quản lý tòa nhà thông minh giảm chi phí năng lượng, cải thiện tiện nghi và tập trung điều khiển cơ sở vật chất.',
  seo_title = 'Giải pháp Tòa nhà Thông minh | KOOLA',
  seo_description = 'Tự động hóa tòa nhà, quản lý năng lượng, HVAC thông minh và mạng cảm biến IoT. KOOLA biến tòa nhà thành không gian thông minh.',
  benefits_subtitle = 'Tại sao quản lý bất động sản chọn KOOLA',
  content_md = '## Tòa nhà tự suy nghĩ cho chính mình

Tòa nhà hiện đại không chỉ che chở — chúng phải chủ động tối ưu năng lượng, tiện nghi và an ninh. KOOLA tích hợp hệ thống tòa nhà vào một nền tảng thông minh duy nhất giảm chi phí và cải thiện trải nghiệm cho mọi người bên trong.

### Chúng tôi tích hợp gì

- **Tự động hóa tòa nhà (BAS)** — Điều khiển tập trung HVAC, chiếu sáng, thang máy và phòng cháy qua một nền tảng quản lý duy nhất
- **Quản lý năng lượng** — Giám sát và tối ưu thời gian thực, thường giảm 25-40% tiêu thụ năng lượng
- **HVAC thông minh** — Điều khiển khí hậu theo nhu cầu sử dụng cảm biến chiếm chỗ và dữ liệu thời tiết
- **Chiếu sáng thông minh** — Thu hoạch ánh sáng tự nhiên, điều khiển theo chiếm chỗ và chiếu sáng nhịp sinh học
- **Kiểm soát truy cập & An ninh** — Quản lý truy cập tích hợp với giám sát video, quản lý khách và quy trình khẩn cấp
- **Mạng cảm biến IoT** — Cảm biến chất lượng không khí, nhiệt độ, độ ẩm và chiếm chỗ cung cấp thông tin tòa nhà thời gian thực

### Kết quả đo lường được

| Chỉ số | Cải thiện điển hình |
|--------|-------------------|
| Chi phí năng lượng | Giảm 25-40% |
| Sử dụng không gian | Cải thiện 25% |
| Phản hồi bảo trì | Giải quyết nhanh hơn 50% |
| Hài lòng cư dân | Cải thiện đáng kể điểm tiện nghi |

### Tiêu chuẩn & Tuân thủ

Giải pháp của chúng tôi hỗ trợ yêu cầu chứng nhận LEED, WELL và Green Mark. Chúng tôi thiết kế với bền vững và tuân thủ quy định ngay từ đầu.'
WHERE slug = 'giai-phap-toa-nha-thong-minh' AND locale = 'vi';

-- ─── Service 11: Quản lý Hạ tầng Đám mây ────────────────────
UPDATE services SET
  excerpt = 'Kiến trúc cloud, migration và quản lý liên tục giúp giảm chi phí và tăng tốc chuyển đổi số.',
  seo_title = 'Quản lý Hạ tầng Đám mây | KOOLA',
  seo_description = 'Thiết kế kiến trúc cloud, migration, DevOps, tối ưu chi phí và quản lý 24/7 trên AWS, Azure, GCP. Dịch vụ cloud KOOLA.',
  benefits_subtitle = 'Tại sao doanh nghiệp chuyển cloud cùng KOOLA',
  content_md = '## Cloud đúng cách

Chuyển lên cloud không chỉ là lift-and-shift server. Đó là tái tư duy cách hạ tầng hỗ trợ doanh nghiệp. KOOLA thiết kế kiến trúc cloud bảo mật, tiết kiệm chi phí và tối ưu hiệu suất.

### Dịch vụ cloud của chúng tôi

- **Thiết kế kiến trúc** — Kiến trúc cloud phù hợp trên AWS, Azure hoặc GCP dựa trên yêu cầu workload và ngân sách
- **Cloud Migration** — Chiến lược migration không downtime với kiểm thử kỹ lưỡng và kế hoạch rollback
- **DevOps & CI/CD** — Pipeline build, test và deploy tự động sử dụng Terraform, Docker, Kubernetes và GitHub Actions
- **Cloud Security** — IAM policies, mã hóa, phân đoạn mạng và giám sát tuân thủ
- **Tối ưu chi phí** — Reserved instances, right-sizing, spot instances và loại bỏ lãng phí — thường tiết kiệm 30-45%
- **Disaster Recovery** — Chiến lược backup multi-region với mục tiêu RPO/RTO xác định

### Technology Stack

| Tầng | Công cụ |
|------|---------|
| IaC | Terraform, CloudFormation, Pulumi |
| Container | Docker, Kubernetes, ECS, EKS, AKS |
| CI/CD | GitHub Actions, GitLab CI, Jenkins, ArgoCD |
| Giám sát | CloudWatch, Datadog, Prometheus, Grafana |
| Bảo mật | AWS GuardDuty, Azure Defender, Vault, OPA |

### Chuyên môn Multi-Cloud

Chúng tôi không bị khóa vào một nhà cung cấp. Dù bạn cần AWS, Azure, GCP hay hybrid, chúng tôi thiết kế kiến trúc hợp lý nhất cho yêu cầu cụ thể và đầu tư hiện có.'
WHERE slug = 'quan-ly-ha-tang-dam-may' AND locale = 'vi';

-- ─── Service 12: Giải pháp An ninh Mạng ─────────────────────
UPDATE services SET
  excerpt = 'Dịch vụ bảo mật toàn diện bảo vệ doanh nghiệp khỏi mối đe dọa — từ đánh giá và kiến trúc đến giám sát 24/7 và ứng phó sự cố.',
  seo_title = 'Giải pháp An ninh Mạng | KOOLA',
  seo_description = 'Đánh giá bảo mật, penetration testing, giám sát SOC, ứng phó sự cố và tuân thủ. KOOLA bảo vệ tài sản số của bạn.',
  benefits_subtitle = 'Tại sao doanh nghiệp tin tưởng KOOLA cho bảo mật',
  content_md = '## Bảo mật không phải tùy chọn

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

Công nghệ thôi chưa đủ. Chúng tôi cung cấp chương trình đào tạo nhận thức bảo mật biến nhân viên từ mắt xích yếu nhất thành tuyến phòng thủ đầu tiên.'
WHERE slug = 'giai-phap-an-ninh-mang' AND locale = 'vi';

-- ═══════════════════════════════════════════════════════════════
-- VIETNAMESE SERVICE BENEFITS
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_benefits WHERE service_id IN (7,8,9,10,11,12);

INSERT INTO service_benefits (service_id, title, description, icon_name, sort_order) VALUES
-- IoT (7)
(7, 'Hiển thị thời gian thực', 'Giám sát tất cả thiết bị kết nối và luồng dữ liệu từ một dashboard duy nhất với độ trễ dưới 1 giây', 'eye', 1),
(7, 'Không phụ thuộc giao thức', 'Tích hợp mọi giao thức công nghiệp — MQTT, OPC-UA, Modbus, BACnet — vào một nền tảng thống nhất', 'plug', 2),
(7, 'Kiến trúc mở rộng', 'Bắt đầu với 10 hoặc 10.000 thiết bị. Kiến trúc edge-to-cloud mở rộng không cần thiết kế lại', 'trending-up', 3),
(7, 'Insights hành động', 'Cảnh báo tự động và phân tích biến dữ liệu cảm biến thô thành quyết định kinh doanh', 'brain', 4),
-- Tự động hóa (8)
(8, 'Giảm thời gian chết', 'Bảo trì dự đoán và giám sát thời gian thực phát hiện vấn đề trước khi dừng sản xuất', 'clock', 1),
(8, 'Hỗ trợ đa vendor', 'Lập trình Siemens, Allen-Bradley, Mitsubishi, Schneider — không bị khóa vendor', 'layers', 2),
(8, 'Sẵn sàng Industry 4.0', 'Mọi hệ thống kết nối với nền tảng IoT và ERP cho tầm nhìn số hoàn chỉnh', 'wifi', 3),
(8, 'Tuân thủ an toàn', 'Hệ thống an toàn SIL và quy trình emergency shutdown tích hợp trong mọi thiết kế', 'shield', 4),
-- Hạ tầng CNTT (9)
(9, 'Thiết kế không downtime', 'Kiến trúc dự phòng với failover đảm bảo doanh nghiệp không bao giờ dừng', 'server', 1),
(9, 'Trung lập vendor', 'Chọn công cụ tốt nhất từ Cisco, HPE, Dell, Fortinet — không ép một vendor duy nhất', 'shuffle', 2),
(9, 'Tăng trưởng linh hoạt', 'Hạ tầng thiết kế phát triển cùng doanh nghiệp không cần thiết kế lại tốn kém', 'trending-up', 3),
(9, 'Giám sát 24/7', 'Giám sát chủ động và hỗ trợ theo SLA giữ hệ thống luôn khỏe mạnh', 'activity', 4),
-- Tòa nhà thông minh (10)
(10, 'Tiết kiệm năng lượng', 'Giảm 25-40% chi phí năng lượng thông qua tự động hóa thông minh', 'zap', 1),
(10, 'Điều khiển tập trung', 'HVAC, chiếu sáng, an ninh và truy cập quản lý từ một nền tảng duy nhất', 'layout', 2),
(10, 'Tiện nghi cư dân', 'Khí hậu và chiếu sáng theo nhu cầu thích ứng với điều kiện thời gian thực', 'smile', 3),
(10, 'Chứng nhận xanh', 'Giải pháp thiết kế hỗ trợ chứng nhận LEED, WELL và Green Mark', 'leaf', 4),
-- Cloud (11)
(11, 'Tối ưu chi phí', 'Right-sizing và loại bỏ lãng phí thường tiết kiệm 30-45% chi phí cloud', 'dollar-sign', 1),
(11, 'Multi-Cloud', 'AWS, Azure, GCP hoặc hybrid — thiết kế theo nhu cầu, không phụ thuộc một provider', 'cloud', 2),
(11, 'DevOps tích hợp', 'Pipeline CI/CD tự động từ ngày đầu cho deploy nhanh hơn, an toàn hơn', 'git-branch', 3),
(11, 'Disaster Recovery', 'Backup multi-region với mục tiêu RPO/RTO xác định cho tính liên tục kinh doanh', 'shield', 4),
-- An ninh mạng (12)
(12, 'Phòng thủ chủ động', 'Giám sát SOC 24/7 với phát hiện mối đe dọa tự động và phản hồi', 'shield', 1),
(12, 'Sẵn sàng tuân thủ', 'Căn chỉnh ISO 27001, NIST, PCI-DSS, GDPR và hỗ trợ audit', 'check-circle', 2),
(12, 'Phản hồi nhanh', 'Ngăn chặn sự cố, phân tích forensic và phục hồi khi mối đe dọa xảy ra', 'alert-triangle', 3),
(12, 'Tường lửa con người', 'Đào tạo nhận thức bảo mật biến nhân viên thành tuyến phòng thủ đầu tiên', 'users', 4);

