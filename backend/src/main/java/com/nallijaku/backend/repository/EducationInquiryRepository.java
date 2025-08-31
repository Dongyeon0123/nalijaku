package com.nallijaku.backend.repository;

import com.nallijaku.backend.entity.EducationInquiry;
import com.nallijaku.backend.entity.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EducationInquiryRepository extends JpaRepository<EducationInquiry, Long> {
    
    // 상태별 문의 조회
    List<EducationInquiry> findByStatus(InquiryStatus status);
    
    // 기관명으로 검색
    List<EducationInquiry> findByOrganizationNameContaining(String organizationName);
    
    // 담당자명으로 검색
    List<EducationInquiry> findByContactPersonContaining(String contactPerson);
    
    // 이메일로 검색
    List<EducationInquiry> findByEmailContaining(String email);
    
    // 연락처로 검색
    EducationInquiry findByPhoneNumber(String phoneNumber);
    
    // 담당 관리자별 문의 조회
    List<EducationInquiry> findByAssignedAdmin(String assignedAdmin);
    
    // 생성일 기간별 조회
    List<EducationInquiry> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // 처리되지 않은 문의 수 조회
    @Query("SELECT COUNT(e) FROM EducationInquiry e WHERE e.status = 'PENDING'")
    long countPendingInquiries();
    
    // 최근 문의 조회 (생성일 기준 내림차순)
    List<EducationInquiry> findTop10ByOrderByCreatedAtDesc();
    
    // 상담 내용별 문의 조회
    List<EducationInquiry> findByPurchaseInquiry(Boolean purchaseInquiry);
    List<EducationInquiry> findBySchoolVisit(Boolean schoolVisit);
    List<EducationInquiry> findByCareerExperience(Boolean careerExperience);
    List<EducationInquiry> findByBoothEntrustment(Boolean boothEntrustment);
}



