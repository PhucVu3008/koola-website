-- Seed service_related relationships
-- Each service will have 3 related services for the "Related" section

-- Strategy: Create logical relationships between services
-- IoT ↔ Industrial Automation ↔ IT Infrastructure
-- Smart Building ↔ Cloud ↔ Cybersecurity

-- English Services (IDs 1-6)

-- Service 1: IoT System Integration → relates to Industrial Automation, IT Infrastructure, Cloud
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(1, 2, 1),  -- IoT → Industrial Automation
(1, 3, 2),  -- IoT → IT Infrastructure
(1, 5, 3);  -- IoT → Cloud Infrastructure

-- Service 2: Industrial Automation → relates to IoT, IT Infrastructure, Smart Building
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(2, 1, 1),  -- Industrial Automation → IoT
(2, 3, 2),  -- Industrial Automation → IT Infrastructure
(2, 4, 3);  -- Industrial Automation → Smart Building

-- Service 3: IT Infrastructure Solutions → relates to Cloud, Cybersecurity, IoT
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(3, 5, 1),  -- IT Infrastructure → Cloud
(3, 6, 2),  -- IT Infrastructure → Cybersecurity
(3, 1, 3);  -- IT Infrastructure → IoT

-- Service 4: Smart Building Solutions → relates to IoT, IT Infrastructure, Cloud
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(4, 1, 1),  -- Smart Building → IoT
(4, 3, 2),  -- Smart Building → IT Infrastructure
(4, 5, 3);  -- Smart Building → Cloud

-- Service 5: Cloud Infrastructure Management → relates to IT Infrastructure, Cybersecurity, Smart Building
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(5, 3, 1),  -- Cloud → IT Infrastructure
(5, 6, 2),  -- Cloud → Cybersecurity
(5, 4, 3);  -- Cloud → Smart Building

-- Service 6: Cybersecurity Solutions → relates to IT Infrastructure, Cloud, Industrial Automation
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(6, 3, 1),  -- Cybersecurity → IT Infrastructure
(6, 5, 2),  -- Cybersecurity → Cloud
(6, 2, 3);  -- Cybersecurity → Industrial Automation

-- Vietnamese Services (IDs 7-12)
-- Mirror the same relationship patterns

-- Service 7: Tích hợp Hệ thống IoT → relates to Tự động hóa, Hạ tầng CNTT, Cloud
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(7, 8, 1),   -- IoT VI → Industrial Automation VI
(7, 9, 2),   -- IoT VI → IT Infrastructure VI
(7, 11, 3);  -- IoT VI → Cloud VI

-- Service 8: Tự động hóa Công nghiệp → relates to IoT, Hạ tầng CNTT, Tòa nhà thông minh
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(8, 7, 1),   -- Industrial Automation VI → IoT VI
(8, 9, 2),   -- Industrial Automation VI → IT Infrastructure VI
(8, 10, 3);  -- Industrial Automation VI → Smart Building VI

-- Service 9: Giải pháp Hạ tầng CNTT → relates to Cloud, An ninh mạng, IoT
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(9, 11, 1),  -- IT Infrastructure VI → Cloud VI
(9, 12, 2),  -- IT Infrastructure VI → Cybersecurity VI
(9, 7, 3);   -- IT Infrastructure VI → IoT VI

-- Service 10: Giải pháp Tòa nhà Thông minh → relates to IoT, Hạ tầng CNTT, Cloud
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(10, 7, 1),   -- Smart Building VI → IoT VI
(10, 9, 2),   -- Smart Building VI → IT Infrastructure VI
(10, 11, 3);  -- Smart Building VI → Cloud VI

-- Service 11: Quản lý Hạ tầng Đám mây → relates to Hạ tầng CNTT, An ninh mạng, Tòa nhà thông minh
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(11, 9, 1),   -- Cloud VI → IT Infrastructure VI
(11, 12, 2),  -- Cloud VI → Cybersecurity VI
(11, 10, 3);  -- Cloud VI → Smart Building VI

-- Service 12: Giải pháp An ninh Mạng → relates to Hạ tầng CNTT, Cloud, Tự động hóa
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(12, 9, 1),   -- Cybersecurity VI → IT Infrastructure VI
(12, 11, 2),  -- Cybersecurity VI → Cloud VI
(12, 8, 3);   -- Cybersecurity VI → Industrial Automation VI
