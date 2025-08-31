package com.nallijaku.backend.entity;

/**
 * 회원 역할/유형을 정의하는 enum
 * - STUDENT: 학생
 * - TEACHER: 교사/선생님
 * - INSTRUCTOR: 드론 강사
 * - GENERAL: 일반인
 * - ADMIN: 관리자
 */
public enum Role {
    STUDENT("학생"),
    TEACHER("교사"),
    INSTRUCTOR("드론강사"),
    GENERAL("일반인"),
    ADMIN("관리자");
    
    private final String description;
    
    Role(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    @Override
    public String toString() {
        return description;
    }
}


