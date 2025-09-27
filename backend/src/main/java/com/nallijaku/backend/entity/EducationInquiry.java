package com.nallijaku.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 교육 도입문의 엔티티
 * 기관에서 드론 교육 도입을 문의할 때 사용되는 정보
 */
@Entity
@Table(name = "education_inquiries")
public class EducationInquiry {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "기관명은 필수입니다")
    @Size(max = 100, message = "기관명은 100자 이하여야 합니다")
    @Column(nullable = false, length = 100)
    private String organizationName; // schoolName
    
    @NotBlank(message = "담당자명은 필수입니다")
    @Size(max = 50, message = "담당자명은 50자 이하여야 합니다")
    @Column(nullable = false, length = 50)
    private String contactPerson; // 담당자명
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "연락처는 10-11자리 숫자만 입력 가능합니다")
    @Column(nullable = false, length = 15)
    private String phoneNumber; // phone
    
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    @Column(length = 100)
    private String email; // 이메일 (필수가 됨)
    
    // 추가 프론트엔드 필드들
    @Column(length = 50)
    private String studentCount; // 학생 수 (선택)
    
    @Column(length = 50)
    private String grade; // 학년 (선택)
    
    @Column(length = 100)
    private String preferredDate; // 희망 일정 (선택)
    
    @Column(columnDefinition = "TEXT")
    private String message; // 추가 메시지 (선택)
    
    // 상담 내용 체크박스들
    @Column(nullable = false)
    private Boolean purchaseInquiry = false; // 교구 구매 문의
    
    @Column(nullable = false)
    private Boolean schoolVisit = false; // 학교(기관) 출강 문의
    
    @Column(nullable = false)
    private Boolean careerExperience = false; // 진로 체험 출강 문의
    
    @Column(nullable = false)
    private Boolean boothEntrustment = false; // 체험 부스 위탁 문의
    
    @Column(nullable = false)
    private Boolean otherInquiry = false; // 기타
    
    @Column(columnDefinition = "TEXT")
    private String otherText; // 기타 내용
    
    // 동의 사항
    @NotNull(message = "개인정보 수집 동의는 필수입니다")
    @Column(nullable = false)
    private Boolean privacyAgreed; // 개인정보 수집 및 이용 동의
    
    @Column(nullable = false)
    private Boolean contactAgreed = true; // 연락 동의 (묵시적으로 true)
    
    @Column(nullable = false)
    private Boolean marketingAgreed = false; // 마케팅 수신 동의 (기본값 false)
    
    // 관리자용 필드들
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InquiryStatus status = InquiryStatus.PENDING; // 처리 상태
    
    @Column(length = 50)
    private String assignedAdmin; // 담당 관리자 (선택)
    
    @Column(columnDefinition = "TEXT")
    private String adminNotes; // 관리자 메모 (선택)
    
    @Column
    private LocalDateTime processedAt; // 처리 완료 시간
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public EducationInquiry() {}
    
    // 생성자
    public EducationInquiry(String organizationName, String contactPerson, String phoneNumber, 
                           String email, String studentCount, String grade, String preferredDate,
                           String message, Boolean purchaseInquiry, Boolean schoolVisit,
                           Boolean careerExperience, Boolean boothEntrustment, Boolean otherInquiry,
                           String otherText, Boolean privacyAgreed, Boolean marketingAgreed) {
        this.organizationName = organizationName;
        this.contactPerson = contactPerson;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.studentCount = studentCount;
        this.grade = grade;
        this.preferredDate = preferredDate;
        this.message = message;
        this.purchaseInquiry = purchaseInquiry;
        this.schoolVisit = schoolVisit;
        this.careerExperience = careerExperience;
        this.boothEntrustment = boothEntrustment;
        this.otherInquiry = otherInquiry;
        this.otherText = otherText;
        this.privacyAgreed = privacyAgreed;
        this.marketingAgreed = marketingAgreed;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOrganizationName() {
        return organizationName;
    }
    
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
    
    public String getContactPerson() {
        return contactPerson;
    }
    
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getStudentCount() {
        return studentCount;
    }
    
    public void setStudentCount(String studentCount) {
        this.studentCount = studentCount;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public String getPreferredDate() {
        return preferredDate;
    }
    
    public void setPreferredDate(String preferredDate) {
        this.preferredDate = preferredDate;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Boolean getPurchaseInquiry() {
        return purchaseInquiry;
    }
    
    public void setPurchaseInquiry(Boolean purchaseInquiry) {
        this.purchaseInquiry = purchaseInquiry;
    }
    
    public Boolean getSchoolVisit() {
        return schoolVisit;
    }
    
    public void setSchoolVisit(Boolean schoolVisit) {
        this.schoolVisit = schoolVisit;
    }
    
    public Boolean getCareerExperience() {
        return careerExperience;
    }
    
    public void setCareerExperience(Boolean careerExperience) {
        this.careerExperience = careerExperience;
    }
    
    public Boolean getBoothEntrustment() {
        return boothEntrustment;
    }
    
    public void setBoothEntrustment(Boolean boothEntrustment) {
        this.boothEntrustment = boothEntrustment;
    }
    
    public Boolean getOtherInquiry() {
        return otherInquiry;
    }
    
    public void setOtherInquiry(Boolean otherInquiry) {
        this.otherInquiry = otherInquiry;
    }
    
    public String getOtherText() {
        return otherText;
    }
    
    public void setOtherText(String otherText) {
        this.otherText = otherText;
    }
    
    public Boolean getPrivacyAgreed() {
        return privacyAgreed;
    }
    
    public void setPrivacyAgreed(Boolean privacyAgreed) {
        this.privacyAgreed = privacyAgreed;
    }
    
    public Boolean getContactAgreed() {
        return contactAgreed;
    }
    
    public void setContactAgreed(Boolean contactAgreed) {
        this.contactAgreed = contactAgreed;
    }
    
    public Boolean getMarketingAgreed() {
        return marketingAgreed;
    }
    
    public void setMarketingAgreed(Boolean marketingAgreed) {
        this.marketingAgreed = marketingAgreed;
    }
    
    public InquiryStatus getStatus() {
        return status;
    }
    
    public void setStatus(InquiryStatus status) {
        this.status = status;
    }
    
    public String getAssignedAdmin() {
        return assignedAdmin;
    }
    
    public void setAssignedAdmin(String assignedAdmin) {
        this.assignedAdmin = assignedAdmin;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}