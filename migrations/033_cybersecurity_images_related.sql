-- Migration 033: Add service_images and service_related for Cybersecurity (EN id=17, VI id=18)
-- Also update existing services to link to/from Cybersecurity where logical.
-- Date: 2026-03-25

BEGIN;

-- ═══════════════════════════════════════════════════════════════
-- 1. SERVICE IMAGES for Cybersecurity EN (id=17) and VI (id=18)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_images WHERE service_id IN (17, 18);

INSERT INTO service_images (service_id, url, alt, caption, sort_order) VALUES
-- EN (id=17)
(17, '/services/gallery/cyber-1.jpg', 'Digital security concept',              'Threat detection systems',     1),
(17, '/services/gallery/cyber-2.jpg', 'Security operations center',            'SOC monitoring',               2),
(17, '/services/gallery/cyber-3.jpg', 'Cybersecurity analyst at work',         'Vulnerability assessment',     3),
-- VI (id=18)
(18, '/services/gallery/cyber-1.jpg', 'Khái niệm bảo mật số',                 'Hệ thống phát hiện mối đe dọa', 1),
(18, '/services/gallery/cyber-2.jpg', 'Trung tâm vận hành bảo mật',           'Giám sát SOC',                 2),
(18, '/services/gallery/cyber-3.jpg', 'Chuyên viên an ninh mạng làm việc',    'Đánh giá lỗ hổng',             3);

-- ═══════════════════════════════════════════════════════════════
-- 2. SERVICE RELATED for Cybersecurity
--    EN: Cybersecurity (17) → IT Infrastructure (3), Cloud (5), Industrial Automation (2)
--    VI: Cybersecurity (18) → Hạ tầng CNTT (9), Cloud (11), Tự động hóa (8)
-- ═══════════════════════════════════════════════════════════════

DELETE FROM service_related WHERE service_id IN (17, 18);

INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
-- EN
(17, 3,  1),  -- Cybersecurity EN → IT Infrastructure EN
(17, 5,  2),  -- Cybersecurity EN → Cloud EN
(17, 2,  3),  -- Cybersecurity EN → Industrial Automation EN
-- VI
(18, 9,  1),  -- Cybersecurity VI → Hạ tầng CNTT VI
(18, 11, 2),  -- Cybersecurity VI → Cloud VI
(18, 8,  3);  -- Cybersecurity VI → Tự động hóa VI

-- ═══════════════════════════════════════════════════════════════
-- 3. UPDATE EXISTING SERVICES to include Cybersecurity as related
--    IT Infrastructure (3) and Cloud (5) currently link to old id=6 (not in prod).
--    Replace those stale references with id=17.
--    Same for VI: IT Infrastructure (9) and Cloud (11) → Cybersecurity VI (18).
-- ═══════════════════════════════════════════════════════════════

-- EN: IT Infrastructure (3) — replaces stale ref to id=6 if present, or updates sort_order=2
DELETE FROM service_related WHERE service_id = 3 AND related_service_id IN (6, 17);
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(3, 5,  1),  -- IT Infrastructure → Cloud
(3, 17, 2),  -- IT Infrastructure → Cybersecurity (new)
(3, 1,  3)   -- IT Infrastructure → IoT
ON CONFLICT DO NOTHING;

-- EN: Cloud (5) — replaces stale ref to id=6
DELETE FROM service_related WHERE service_id = 5 AND related_service_id IN (6, 17);
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(5, 3,  1),  -- Cloud → IT Infrastructure
(5, 17, 2),  -- Cloud → Cybersecurity (new)
(5, 4,  3)   -- Cloud → Smart Building
ON CONFLICT DO NOTHING;

-- VI: Hạ tầng CNTT (9) — replaces stale ref to id=12
DELETE FROM service_related WHERE service_id = 9 AND related_service_id IN (12, 18);
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(9, 11, 1),  -- Hạ tầng CNTT → Cloud
(9, 18, 2),  -- Hạ tầng CNTT → Cybersecurity VI (new)
(9, 7,  3)   -- Hạ tầng CNTT → IoT VI
ON CONFLICT DO NOTHING;

-- VI: Cloud (11) — replaces stale ref to id=12
DELETE FROM service_related WHERE service_id = 11 AND related_service_id IN (12, 18);
INSERT INTO service_related (service_id, related_service_id, sort_order) VALUES
(11, 9,  1),  -- Cloud VI → Hạ tầng CNTT
(11, 18, 2),  -- Cloud VI → Cybersecurity VI (new)
(11, 10, 3)   -- Cloud VI → Tòa nhà thông minh
ON CONFLICT DO NOTHING;

COMMIT;
