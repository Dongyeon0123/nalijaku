-- ================================
-- 날리자쿠 드론 교육 플랫폼 데이터베이스 스키마 (최적화 버전)
-- ================================

-- 데이터베이스 생성
DROP DATABASE IF EXISTS nallijaku_db;
CREATE DATABASE nallijaku_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- DB 사용자 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'nallijaku_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON nallijaku_db.* TO 'nallijaku_user'@'localhost';
FLUSH PRIVILEGES;

-- DB 선택
USE nallijaku_db;

-- ================================
-- 사용자 테이블
-- ================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    organization VARCHAR(100) NOT NULL, -- 소속 기관 (affiliation)
    role VARCHAR(20) NOT NULL, -- 직무/역할
    phone VARCHAR(15) NOT NULL,
    drone_experience TINYINT(1) DEFAULT 0, -- 드론 강의 경험 (0=없음, 1=있음)
    terms_agreed TINYINT(1) NOT NULL DEFAULT 0,
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    email_verification_token VARCHAR(255),
    account_locked TINYINT(1) NOT NULL DEFAULT 0,
    account_enabled TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_role CHECK (role IN ('STUDENT', 'TEACHER', 'INSTRUCTOR', 'GENERAL', 'ADMIN')),

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_organization (organization),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 리프레시 토큰 테이블
-- ================================
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_token (token),
    INDEX idx_refresh_user_id (user_id),
    INDEX idx_refresh_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 이메일 인증 로그 테이블
-- ================================
CREATE TABLE email_verification_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email VARCHAR(100) NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ev_user_id (user_id),
    INDEX idx_ev_token (verification_token),
    INDEX idx_ev_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 로그인 시도 로그 테이블
-- ================================
CREATE TABLE login_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success TINYINT(1) NOT NULL DEFAULT 0,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_la_username (username),
    INDEX idx_la_ip_address (ip_address),
    INDEX idx_la_attempted_at (attempted_at),
    INDEX idx_la_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 사용자 활동 로그 테이블
-- ================================
CREATE TABLE user_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, REGISTER 등
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    details JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ua_user_id (user_id),
    INDEX idx_ua_activity_type (activity_type),
    INDEX idx_ua_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 초기 관리자 계정
-- ================================
INSERT IGNORE INTO users (username, password, email, organization, role, phone, terms_agreed, email_verified, account_enabled) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM1JJ5z/S1p7DQTP9lNu', 
        'admin@nallijaku.com', '날리자쿠', 'ADMIN', '01012345678', 1, 1, 1);

-- ================================
-- 교육 도입문의 테이블
-- ================================
CREATE TABLE education_inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL, -- schoolName
    contact_person VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    student_count VARCHAR(50), -- 학생 수 (선택)
    grade VARCHAR(50), -- 학년 (선택)
    preferred_date VARCHAR(100), -- 희망 일정 (선택)
    message TEXT, -- 추가 메시지 (선택)
    -- 상담 내용 체크박스들
    purchase_inquiry TINYINT(1) DEFAULT 0, -- 교구 구매 문의
    school_visit TINYINT(1) DEFAULT 0, -- 학교(기관) 출강 문의
    career_experience TINYINT(1) DEFAULT 0, -- 진로 체험 출강 문의
    booth_entrustment TINYINT(1) DEFAULT 0, -- 체험 부스 위탁 문의
    other_inquiry TINYINT(1) DEFAULT 0, -- 기타
    other_text TEXT, -- 기타 내용
    -- 동의 사항
    contact_agreed TINYINT(1) NOT NULL DEFAULT 0, -- 연락 동의 (묵시적)
    privacy_agreed TINYINT(1) NOT NULL DEFAULT 0, -- 개인정보 동의
    marketing_agreed TINYINT(1) NOT NULL DEFAULT 0, -- 마케팅 동의 (기본 false)
    -- 관리자용
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    assigned_admin VARCHAR(50),
    admin_notes TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_inquiry_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),

    INDEX idx_ei_organization_name (organization_name),
    INDEX idx_ei_contact_person (contact_person),
    INDEX idx_ei_phone_number (phone_number),
    INDEX idx_ei_email (email),
    INDEX idx_ei_status (status),
    INDEX idx_ei_assigned_admin (assigned_admin),
    INDEX idx_ei_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 파트너 지원 테이블
-- ================================
CREATE TABLE partner_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_name VARCHAR(50) NOT NULL, -- contactPerson (이름)
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    location VARCHAR(100), -- 활동지역
    experience TEXT, -- 경력 사항
    -- 드론 자격증 종류
    practical_cert TINYINT(1) DEFAULT 0, -- 실기평가조종 자격증
    class1_cert TINYINT(1) DEFAULT 0, -- 1종 조종 자격증
    class2_cert TINYINT(1) DEFAULT 0, -- 2종 조종 자격증
    class3_cert TINYINT(1) DEFAULT 0, -- 3종 조종 자격증
    instructor_cert TINYINT(1) DEFAULT 0, -- 교관 자격증
    other_cert TINYINT(1) DEFAULT 0, -- 기타
    other_cert_text TEXT, -- 기타 내용
    -- 동의 사항
    privacy_agreed TINYINT(1) NOT NULL DEFAULT 0,
    marketing_agreed TINYINT(1) NOT NULL DEFAULT 0,
    -- 관리자용
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    assigned_admin VARCHAR(50),
    admin_notes TEXT,
    processed_at TIMESTAMP NULL,
    interview_scheduled_at TIMESTAMP NULL,
    interview_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_partner_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),

    INDEX idx_pa_applicant_name (applicant_name),
    INDEX idx_pa_phone_number (phone_number),
    INDEX idx_pa_email (email),
    INDEX idx_pa_location (location),
    INDEX idx_pa_status (status),
    INDEX idx_pa_assigned_admin (assigned_admin),
    INDEX idx_pa_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 관리자 알림 테이블
-- ================================
CREATE TABLE admin_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_type VARCHAR(30) NOT NULL,
    reference_id BIGINT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    admin_username VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,

    CONSTRAINT chk_notification_type CHECK (notification_type IN ('EDUCATION_INQUIRY', 'PARTNER_APPLICATION', 'USER_REGISTRATION', 'SYSTEM')),

    INDEX idx_an_type (notification_type),
    INDEX idx_an_reference_id (reference_id),
    INDEX idx_an_is_read (is_read),
    INDEX idx_an_admin_username (admin_username),
    INDEX idx_an_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- 테스트용 사용자 계정
-- ================================
INSERT IGNORE INTO users (username, password, email, organization, role, phone, terms_agreed, email_verified, account_enabled) 
VALUES 
    ('student1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM1JJ5z/S1p7DQTP9lNu', 'student1@test.com', '충주대학교', 'STUDENT', '01011111111', 1, 1, 1),
    ('teacher1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM1JJ5z/S1p7DQTP9lNu', 'teacher1@test.com', '충주중학교', 'TEACHER', '01022222222', 1, 1, 1),
    ('instructor1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM1JJ5z/S1p7DQTP9lNu', 'instructor1@test.com', '드론교육원', 'INSTRUCTOR', '01033333333', 1, 1, 1);

