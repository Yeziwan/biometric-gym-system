-- 初始化数据库脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS biometric_gym CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE biometric_gym;

-- 创建会员表
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建设备表
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    port INT DEFAULT 4370,
    status VARCHAR(20) DEFAULT 'offline',
    last_heartbeat DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建指纹模板表
CREATE TABLE IF NOT EXISTS fingerprint_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    template_data LONGBLOB NOT NULL,
    finger_index INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 创建识别记录表
CREATE TABLE IF NOT EXISTS recognition_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    device_id INT NOT NULL,
    recognized_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    confidence INT,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- 创建录入记录表
CREATE TABLE IF NOT EXISTS enrollment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    device_id INT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    finger_index INT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- 创建系统用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始管理员用户（密码：admin123）
INSERT INTO users (username, email, hashed_password, role)
VALUES ('admin', 'admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin');

-- 插入测试数据
-- 插入测试会员
INSERT INTO members (name, phone, email, status) VALUES
('张三', '13800138001', 'zhangsan@example.com', 'active'),
('李四', '13800138002', 'lisi@example.com', 'active'),
('王五', '13800138003', 'wangwu@example.com', 'inactive');

-- 插入测试设备
INSERT INTO devices (name, ip_address, port, status) VALUES
('前台设备', '192.168.1.100', 4370, 'offline'),
('健身区设备', '192.168.1.101', 4370, 'offline');

-- 创建索引
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_recognition_logs_member_id ON recognition_logs(member_id);
CREATE INDEX idx_recognition_logs_device_id ON recognition_logs(device_id);
CREATE INDEX idx_recognition_logs_recognized_at ON recognition_logs(recognized_at);
CREATE INDEX idx_fingerprint_templates_member_id ON fingerprint_templates(member_id);
CREATE INDEX idx_enrollment_logs_member_id ON enrollment_logs(member_id);
CREATE INDEX idx_enrollment_logs_device_id ON enrollment_logs(device_id);
