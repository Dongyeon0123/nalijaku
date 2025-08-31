package com.nallijaku.backend.repository;

import com.nallijaku.backend.entity.PartnerApplication;
import com.nallijaku.backend.entity.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PartnerApplicationRepository extends JpaRepository<PartnerApplication, Long> {
    
    // 상태별 지원서 조회
    List<PartnerApplication> findByStatus(InquiryStatus status);
    
    // 지원자명으로 검색
    List<PartnerApplication> findByApplicantNameContaining(String applicantName);
    
    // 이메일로 검색
    PartnerApplication findByEmail(String email);
    
    // 연락처로 검색
    PartnerApplication findByPhoneNumber(String phoneNumber);
    
    // 활동지역으로 검색
    List<PartnerApplication> findByLocationContaining(String location);
    
    // 담당 관리자별 지원서 조회
    List<PartnerApplication> findByAssignedAdmin(String assignedAdmin);
    
    // 생성일 기간별 조회
    List<PartnerApplication> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // 처리되지 않은 지원서 수 조회
    @Query("SELECT COUNT(p) FROM PartnerApplication p WHERE p.status = 'PENDING'")
    long countPendingApplications();
    
    // 최근 지원서 조회 (생성일 기준 내림차순)
    List<PartnerApplication> findTop10ByOrderByCreatedAtDesc();
    
    // 자격증별 지원자 조회
    List<PartnerApplication> findByPracticalCert(Boolean practicalCert);
    List<PartnerApplication> findByClass1Cert(Boolean class1Cert);
    List<PartnerApplication> findByClass2Cert(Boolean class2Cert);
    List<PartnerApplication> findByClass3Cert(Boolean class3Cert);
    List<PartnerApplication> findByInstructorCert(Boolean instructorCert);
    
    // 면접 예정자 조회
    List<PartnerApplication> findByInterviewScheduledAtIsNotNull();
    
    // 특정 기간 면접 예정자 조회
    List<PartnerApplication> findByInterviewScheduledAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}



