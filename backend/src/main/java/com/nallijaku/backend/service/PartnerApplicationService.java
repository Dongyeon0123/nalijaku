package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.PartnerApplication;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.repository.PartnerApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PartnerApplicationService {

    @Autowired
    private PartnerApplicationRepository partnerApplicationRepository;

    /**
     * 파트너 지원서 저장
     */
    public PartnerApplication saveApplication(PartnerApplication application) {
        // 기본값 설정
        if (application.getMarketingAgreed() == null) {
            application.setMarketingAgreed(false);
        }
        
        // 자격증 필드들 기본값 설정
        if (application.getPracticalCert() == null) application.setPracticalCert(false);
        if (application.getClass1Cert() == null) application.setClass1Cert(false);
        if (application.getClass2Cert() == null) application.setClass2Cert(false);
        if (application.getClass3Cert() == null) application.setClass3Cert(false);
        if (application.getInstructorCert() == null) application.setInstructorCert(false);
        if (application.getOtherCert() == null) application.setOtherCert(false);

        return partnerApplicationRepository.save(application);
    }

    /**
     * 모든 지원서 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getAllApplications() {
        return partnerApplicationRepository.findAll();
    }

    /**
     * ID로 지원서 조회
     */
    @Transactional(readOnly = true)
    public Optional<PartnerApplication> getApplicationById(Long id) {
        return partnerApplicationRepository.findById(id);
    }

    /**
     * 상태별 지원서 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getApplicationsByStatus(InquiryStatus status) {
        return partnerApplicationRepository.findByStatus(status);
    }

    /**
     * 지원자명으로 검색
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> searchByApplicantName(String applicantName) {
        return partnerApplicationRepository.findByApplicantNameContaining(applicantName);
    }

    /**
     * 이메일로 검색
     */
    @Transactional(readOnly = true)
    public PartnerApplication getApplicationByEmail(String email) {
        return partnerApplicationRepository.findByEmail(email);
    }

    /**
     * 연락처로 검색
     */
    @Transactional(readOnly = true)
    public PartnerApplication getApplicationByPhoneNumber(String phoneNumber) {
        return partnerApplicationRepository.findByPhoneNumber(phoneNumber);
    }

    /**
     * 활동지역으로 검색
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> searchByLocation(String location) {
        return partnerApplicationRepository.findByLocationContaining(location);
    }

    /**
     * 지원서 상태 업데이트
     */
    public PartnerApplication updateApplicationStatus(Long id, InquiryStatus status, String adminUsername) {
        Optional<PartnerApplication> applicationOpt = partnerApplicationRepository.findById(id);
        if (applicationOpt.isPresent()) {
            PartnerApplication application = applicationOpt.get();
            application.setStatus(status);
            application.setAssignedAdmin(adminUsername);
            
            if (status == InquiryStatus.COMPLETED) {
                application.setProcessedAt(LocalDateTime.now());
            }
            
            return partnerApplicationRepository.save(application);
        }
        throw new RuntimeException("지원서를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 관리자 메모 추가
     */
    public PartnerApplication addAdminNotes(Long id, String notes, String adminUsername) {
        Optional<PartnerApplication> applicationOpt = partnerApplicationRepository.findById(id);
        if (applicationOpt.isPresent()) {
            PartnerApplication application = applicationOpt.get();
            application.setAdminNotes(notes);
            application.setAssignedAdmin(adminUsername);
            
            return partnerApplicationRepository.save(application);
        }
        throw new RuntimeException("지원서를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 면접 일정 설정
     */
    public PartnerApplication scheduleInterview(Long id, LocalDateTime interviewDate, String adminUsername) {
        Optional<PartnerApplication> applicationOpt = partnerApplicationRepository.findById(id);
        if (applicationOpt.isPresent()) {
            PartnerApplication application = applicationOpt.get();
            application.setInterviewScheduledAt(interviewDate);
            application.setAssignedAdmin(adminUsername);
            application.setStatus(InquiryStatus.IN_PROGRESS); // 면접 예정 상태로 변경
            
            return partnerApplicationRepository.save(application);
        }
        throw new RuntimeException("지원서를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 면접 메모 추가
     */
    public PartnerApplication addInterviewNotes(Long id, String interviewNotes, String adminUsername) {
        Optional<PartnerApplication> applicationOpt = partnerApplicationRepository.findById(id);
        if (applicationOpt.isPresent()) {
            PartnerApplication application = applicationOpt.get();
            application.setInterviewNotes(interviewNotes);
            application.setAssignedAdmin(adminUsername);
            
            return partnerApplicationRepository.save(application);
        }
        throw new RuntimeException("지원서를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 최근 지원서 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getRecentApplications() {
        return partnerApplicationRepository.findTop10ByOrderByCreatedAtDesc();
    }

    /**
     * 처리 대기중인 지원서 수 조회
     */
    @Transactional(readOnly = true)
    public long getPendingApplicationCount() {
        return partnerApplicationRepository.countPendingApplications();
    }

    /**
     * 지원서 삭제
     */
    public void deleteApplication(Long id) {
        if (partnerApplicationRepository.existsById(id)) {
            partnerApplicationRepository.deleteById(id);
        } else {
            throw new RuntimeException("지원서를 찾을 수 없습니다. ID: " + id);
        }
    }

    /**
     * 기간별 지원서 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getApplicationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return partnerApplicationRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * 자격증별 지원자 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getApplicationsByCertification(String certificationType) {
        return switch (certificationType.toLowerCase()) {
            case "practical" -> partnerApplicationRepository.findByPracticalCert(true);
            case "class1" -> partnerApplicationRepository.findByClass1Cert(true);
            case "class2" -> partnerApplicationRepository.findByClass2Cert(true);
            case "class3" -> partnerApplicationRepository.findByClass3Cert(true);
            case "instructor" -> partnerApplicationRepository.findByInstructorCert(true);
            default -> throw new IllegalArgumentException("잘못된 자격증 타입: " + certificationType);
        };
    }

    /**
     * 면접 예정자 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getScheduledInterviews() {
        return partnerApplicationRepository.findByInterviewScheduledAtIsNotNull();
    }

    /**
     * 특정 기간 면접 예정자 조회
     */
    @Transactional(readOnly = true)
    public List<PartnerApplication> getInterviewsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return partnerApplicationRepository.findByInterviewScheduledAtBetween(startDate, endDate);
    }
}



