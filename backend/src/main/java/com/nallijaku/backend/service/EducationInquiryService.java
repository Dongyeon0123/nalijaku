package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.EducationInquiry;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.repository.EducationInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EducationInquiryService {

    @Autowired
    private EducationInquiryRepository educationInquiryRepository;

    /**
     * 교육 도입문의 저장
     */
    public EducationInquiry saveInquiry(EducationInquiry inquiry) {
        // 기본값 설정
        if (inquiry.getContactAgreed() == null) {
            inquiry.setContactAgreed(true); // 문의를 하는 것 자체가 연락 동의
        }
        if (inquiry.getMarketingAgreed() == null) {
            inquiry.setMarketingAgreed(false);
        }
        
        // 체크박스 필드들 기본값 설정
        if (inquiry.getPurchaseInquiry() == null) inquiry.setPurchaseInquiry(false);
        if (inquiry.getSchoolVisit() == null) inquiry.setSchoolVisit(false);
        if (inquiry.getCareerExperience() == null) inquiry.setCareerExperience(false);
        if (inquiry.getBoothEntrustment() == null) inquiry.setBoothEntrustment(false);
        if (inquiry.getOtherInquiry() == null) inquiry.setOtherInquiry(false);

        return educationInquiryRepository.save(inquiry);
    }

    /**
     * 모든 문의 조회
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> getAllInquiries() {
        return educationInquiryRepository.findAll();
    }

    /**
     * ID로 문의 조회
     */
    @Transactional(readOnly = true)
    public Optional<EducationInquiry> getInquiryById(Long id) {
        return educationInquiryRepository.findById(id);
    }

    /**
     * 상태별 문의 조회
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> getInquiriesByStatus(InquiryStatus status) {
        return educationInquiryRepository.findByStatus(status);
    }

    /**
     * 기관명으로 검색
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> searchByOrganizationName(String organizationName) {
        return educationInquiryRepository.findByOrganizationNameContaining(organizationName);
    }

    /**
     * 담당자명으로 검색
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> searchByContactPerson(String contactPerson) {
        return educationInquiryRepository.findByContactPersonContaining(contactPerson);
    }

    /**
     * 연락처로 검색
     */
    @Transactional(readOnly = true)
    public EducationInquiry getInquiryByPhoneNumber(String phoneNumber) {
        return educationInquiryRepository.findByPhoneNumber(phoneNumber);
    }

    /**
     * 문의 상태 업데이트
     */
    public EducationInquiry updateInquiryStatus(Long id, InquiryStatus status, String adminUsername) {
        Optional<EducationInquiry> inquiryOpt = educationInquiryRepository.findById(id);
        if (inquiryOpt.isPresent()) {
            EducationInquiry inquiry = inquiryOpt.get();
            inquiry.setStatus(status);
            inquiry.setAssignedAdmin(adminUsername);
            
            if (status == InquiryStatus.COMPLETED) {
                inquiry.setProcessedAt(LocalDateTime.now());
            }
            
            return educationInquiryRepository.save(inquiry);
        }
        throw new RuntimeException("문의를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 관리자 메모 추가
     */
    public EducationInquiry addAdminNotes(Long id, String notes, String adminUsername) {
        Optional<EducationInquiry> inquiryOpt = educationInquiryRepository.findById(id);
        if (inquiryOpt.isPresent()) {
            EducationInquiry inquiry = inquiryOpt.get();
            inquiry.setAdminNotes(notes);
            inquiry.setAssignedAdmin(adminUsername);
            
            return educationInquiryRepository.save(inquiry);
        }
        throw new RuntimeException("문의를 찾을 수 없습니다. ID: " + id);
    }

    /**
     * 최근 문의 조회
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> getRecentInquiries() {
        return educationInquiryRepository.findTop10ByOrderByCreatedAtDesc();
    }

    /**
     * 처리 대기중인 문의 수 조회
     */
    @Transactional(readOnly = true)
    public long getPendingInquiryCount() {
        return educationInquiryRepository.countPendingInquiries();
    }

    /**
     * 문의 삭제
     */
    public void deleteInquiry(Long id) {
        if (educationInquiryRepository.existsById(id)) {
            educationInquiryRepository.deleteById(id);
        } else {
            throw new RuntimeException("문의를 찾을 수 없습니다. ID: " + id);
        }
    }

    /**
     * 기간별 문의 조회
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> getInquiriesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return educationInquiryRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * 상담 내용별 문의 조회
     */
    @Transactional(readOnly = true)
    public List<EducationInquiry> getInquiriesByConsultationType(String consultationType) {
        return switch (consultationType.toLowerCase()) {
            case "purchase" -> educationInquiryRepository.findByPurchaseInquiry(true);
            case "visit" -> educationInquiryRepository.findBySchoolVisit(true);
            case "career" -> educationInquiryRepository.findByCareerExperience(true);
            case "booth" -> educationInquiryRepository.findByBoothEntrustment(true);
            default -> throw new IllegalArgumentException("잘못된 상담 내용 타입: " + consultationType);
        };
    }
}



