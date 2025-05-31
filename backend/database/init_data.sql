-- 初始数据

-- 插入测试会员
INSERT INTO members (name, phone, email, status, created_at) VALUES
('张三', '13800138001', 'zhangsan@example.com', 'active', NOW()),
('李四', '13800138002', 'lisi@example.com', 'active', NOW()),
('王五', '13800138003', 'wangwu@example.com', 'inactive', NOW()),
('赵六', '13800138004', 'zhaoliu@example.com', 'active', NOW()),
('钱七', '13800138005', 'qianqi@example.com', 'active', NOW());

-- 插入测试设备
INSERT INTO devices (name, ip_address, port, status, created_at) VALUES
('前台设备', '192.168.1.100', 4370, 'offline', NOW()),
('健身区设备', '192.168.1.101', 4370, 'offline', NOW());

-- 插入系统用户
INSERT INTO users (username, email, hashed_password, is_active, role, created_at) VALUES
('admin', 'admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', true, 'admin', NOW()),
('user', 'user@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', true, 'user', NOW());

-- 插入测试指纹模板 (模拟数据)
INSERT INTO fingerprint_templates (member_id, template_data, finger_index, created_at) VALUES
(1, 'SIMULATED_TEMPLATE_DATA_1', 1, NOW()),
(1, 'SIMULATED_TEMPLATE_DATA_2', 2, NOW()),
(2, 'SIMULATED_TEMPLATE_DATA_3', 1, NOW()),
(3, 'SIMULATED_TEMPLATE_DATA_4', 1, NOW());

-- 插入测试识别记录
INSERT INTO recognition_logs (member_id, device_id, recognized_at, status, confidence) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'success', 85),
(2, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'success', 90),
(1, 2, DATE_SUB(NOW(), INTERVAL 3 HOUR), 'success', 80),
(3, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 'success', 75),
(2, 2, DATE_SUB(NOW(), INTERVAL 5 HOUR), 'success', 95),
(NULL, 1, DATE_SUB(NOW(), INTERVAL 6 HOUR), 'failed', 0),
(NULL, 2, DATE_SUB(NOW(), INTERVAL 7 HOUR), 'failed', 0),
(1, 1, DATE_SUB(NOW(), INTERVAL 8 HOUR), 'success', 88),
(2, 1, DATE_SUB(NOW(), INTERVAL 9 HOUR), 'success', 92),
(3, 2, DATE_SUB(NOW(), INTERVAL 10 HOUR), 'success', 78);

-- 插入测试录入记录
INSERT INTO enrollment_logs (member_id, device_id, enrolled_at, status, finger_index) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'success', 1),
(1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'success', 2),
(2, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 'success', 1),
(3, 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 'success', 1),
(4, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 'failed', 1),
(5, 2, DATE_SUB(NOW(), INTERVAL 5 DAY), 'failed', 2);
