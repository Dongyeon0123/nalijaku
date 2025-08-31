package com.nallijaku.backend.entity;

/**
 * 문의 처리 상태를 정의하는 enum
 * - PENDING: 대기중 (새로 접수된 문의)
 * - IN_PROGRESS: 처리중 (관리자가 확인하여 처리 시작)
 * - COMPLETED: 완료 (처리 완료)
 * - CANCELLED: 취소 (문의 취소)
 */
public enum InquiryStatus {
    PENDING("대기중"),
    IN_PROGRESS("처리중"),
    COMPLETED("완료"),
    CANCELLED("취소");
    
    private final String description;
    
    InquiryStatus(String description) {
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







