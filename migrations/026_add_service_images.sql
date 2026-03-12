-- Migration 026: Add service_images table for gallery images per service
-- Allows multiple images per service, admin-manageable via sort_order

BEGIN;

-- ============================================================
-- 1. CREATE service_images TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS service_images (
  id          SERIAL PRIMARY KEY,
  service_id  INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT NOT NULL DEFAULT '',
  caption     TEXT NOT NULL DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_images_service ON service_images(service_id, sort_order);

-- ============================================================
-- 2. SEED IMAGES FOR EN SERVICES
-- ============================================================

-- SEED: IoT System Integration (EN=1, VI=7)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (1, '/services/gallery/iot-1.jpg', 'IoT sensors and connected devices', 'Smart sensor deployment', 1),
  (1, '/services/gallery/iot-2.jpg', 'Circuit board and microprocessors', 'Edge computing hardware', 2),
  (1, '/services/gallery/iot-3.jpg', 'Data visualization dashboard', 'Real-time IoT monitoring', 3),
  (7, '/services/gallery/iot-1.jpg', 'Cảm biến IoT và thiết bị kết nối', 'Triển khai cảm biến thông minh', 1),
  (7, '/services/gallery/iot-2.jpg', 'Bo mạch và vi xử lý', 'Phần cứng điện toán biên', 2),
  (7, '/services/gallery/iot-3.jpg', 'Bảng điều khiển trực quan dữ liệu', 'Giám sát IoT thời gian thực', 3);

-- SEED: Industrial Automation (EN=2, VI=8)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (2, '/services/gallery/automation-1.jpg', 'Robotic arm in factory', 'Automated production line', 1),
  (2, '/services/gallery/automation-2.jpg', 'Engineer monitoring systems', 'SCADA control room', 2),
  (2, '/services/gallery/automation-3.jpg', 'Industrial machinery', 'PLC-controlled equipment', 3),
  (8, '/services/gallery/automation-1.jpg', 'Cánh tay robot trong nhà máy', 'Dây chuyền sản xuất tự động', 1),
  (8, '/services/gallery/automation-2.jpg', 'Kỹ sư giám sát hệ thống', 'Phòng điều khiển SCADA', 2),
  (8, '/services/gallery/automation-3.jpg', 'Máy móc công nghiệp', 'Thiết bị điều khiển PLC', 3);

-- SEED: IT Infrastructure Solutions (EN=3, VI=9)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (3, '/services/gallery/infra-1.jpg', 'Server room with racks', 'Enterprise data center', 1),
  (3, '/services/gallery/infra-2.jpg', 'Network cables and switches', 'Network infrastructure', 2),
  (3, '/services/gallery/infra-3.jpg', 'IT team collaboration', 'Infrastructure planning', 3),
  (9, '/services/gallery/infra-1.jpg', 'Phòng máy chủ', 'Trung tâm dữ liệu doanh nghiệp', 1),
  (9, '/services/gallery/infra-2.jpg', 'Cáp mạng và thiết bị chuyển mạch', 'Hạ tầng mạng', 2),
  (9, '/services/gallery/infra-3.jpg', 'Đội ngũ IT làm việc', 'Lập kế hoạch hạ tầng', 3);

-- SEED: Smart Building Solutions (EN=4, VI=10)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (4, '/services/gallery/building-1.jpg', 'Modern smart building exterior', 'Intelligent building management', 1),
  (4, '/services/gallery/building-2.jpg', 'Smart office workspace', 'Automated workspace control', 2),
  (4, '/services/gallery/building-3.jpg', 'Meeting room with smart systems', 'Integrated room automation', 3),
  (10, '/services/gallery/building-1.jpg', 'Tòa nhà thông minh hiện đại', 'Quản lý tòa nhà thông minh', 1),
  (10, '/services/gallery/building-2.jpg', 'Không gian văn phòng thông minh', 'Điều khiển không gian tự động', 2),
  (10, '/services/gallery/building-3.jpg', 'Phòng họp với hệ thống thông minh', 'Tự động hóa phòng tích hợp', 3);

-- SEED: Cloud Infrastructure Management (EN=5, VI=11)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (5, '/services/gallery/cloud-1.jpg', 'Global network visualization', 'Cloud network architecture', 1),
  (5, '/services/gallery/cloud-2.jpg', 'Cloud dashboard monitoring', 'Infrastructure monitoring', 2),
  (5, '/services/gallery/cloud-3.jpg', 'Data center networking', 'Hybrid cloud deployment', 3),
  (11, '/services/gallery/cloud-1.jpg', 'Mạng lưới toàn cầu', 'Kiến trúc mạng đám mây', 1),
  (11, '/services/gallery/cloud-2.jpg', 'Bảng giám sát đám mây', 'Giám sát hạ tầng', 2),
  (11, '/services/gallery/cloud-3.jpg', 'Mạng trung tâm dữ liệu', 'Triển khai đám mây lai', 3);

-- SEED: Cybersecurity Solutions (EN=6, VI=12)
INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
  (6, '/services/gallery/cyber-1.jpg', 'Digital security concept', 'Threat detection systems', 1),
  (6, '/services/gallery/cyber-2.jpg', 'Security operations center', 'SOC monitoring', 2),
  (6, '/services/gallery/cyber-3.jpg', 'Cybersecurity analyst at work', 'Vulnerability assessment', 3),
  (12, '/services/gallery/cyber-1.jpg', 'Khái niệm bảo mật số', 'Hệ thống phát hiện mối đe dọa', 1),
  (12, '/services/gallery/cyber-2.jpg', 'Trung tâm vận hành bảo mật', 'Giám sát SOC', 2),
  (12, '/services/gallery/cyber-3.jpg', 'Chuyên viên an ninh mạng', 'Đánh giá lỗ hổng', 3);

COMMIT;
