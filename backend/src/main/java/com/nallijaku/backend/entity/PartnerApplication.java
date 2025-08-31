package com.nallijaku.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 교육 파트너 모집 지원 엔티티
 * 드론 강사나 교육 파트너로 지원할 때 사용되는 정보
 */
@Entity
@Table(name = "partner_applications")
public class PartnerApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "성함은 필수입니다")
    @Size(max = 50, message = "성함은 50자 이하여야 합니다")
    @Column(nullable = false, length = 50)
    private String applicantName; // contactPerson (이름)
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "연락처는 10-11자리 숫자만 입력 가능합니다")
    @Column(nullable = false, length = 15)
    private String phoneNumber; // phone
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    @Column(nullable = false, length = 100)
    private String email; // 이메일
    
    @Column(length = 100)
    private String location; // 활동지역
    
    @Column(columnDefinition = "TEXT")
    private String experience; // 경력 사항
    
    // 드론 자격증 종류들
    @Column(nullable = false)
    private Boolean practicalCert = false; // 실기평가조종 자격증
    
    @Column(nullable = false)
    private Boolean class1Cert = false; // 1종 조종 자격증
    
    @Column(nullable = false)
    private Boolean class2Cert = false; // 2종 조종 자격증
    
    @Column(nullable = false)
    private Boolean class3Cert = false; // 3종 조종 자격증
    
    @Column(nullable = false)
    private Boolean instructorCert = false; // 교관 자격증
    
    @Column(nullable = false)
    private Boolean otherCert = false; // 기타
    
    @Column(columnDefinition = "TEXT")
    private String otherCertText; // 기타 내용
    
    // 동의 사항
    @NotNull(message = "개인정보 처리방침 동의는 필수입니다")
    @Column(nullable = false)
    private Boolean privacyAgreed; // 개인정보 처리방침 동의
    
    @Column(nullable = false)
    private Boolean marketingAgreed = false; // 마케팅 수신 동의 (선택, 기본값 false)
    
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
    
    // 면접 관련 정보 (추후 확장 가능)
    @Column
    private LocalDateTime interviewScheduledAt; // 면접 예정 시간
    
    @Column(columnDefinition = "TEXT")
    private String interviewNotes; // 면접 메모
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public PartnerApplication() {}
    
    // 생성자
    public PartnerApplication(String applicantName, String phoneNumber, String email, 
                             String location, String experience,
                             Boolean practicalCert, Boolean class1Cert, Boolean class2Cert,
                             Boolean class3Cert, Boolean instructorCert, Boolean otherCert,
                             String otherCertText, Boolean privacyAgreed, Boolean marketingAgreed) {
        this.applicantName = applicantName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.location = location;
        this.experience = experience;
        this.practicalCert = practicalCert;
        this.class1Cert = class1Cert;
        this.class2Cert = class2Cert;
        this.class3Cert = class3Cert;
        this.instructorCert = instructorCert;
        this.otherCert = otherCert;
        this.otherCertText = otherCertText;
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
    
    public String getApplicantName() {
        return applicantName;
    }
    
    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
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
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getExperience() {
        return experience;
    }
    
    public void setExperience(String experience) {
        this.experience = experience;
    }
    
    public Boolean getPracticalCert() {
        return practicalCert;
    }
    
    public void setPracticalCert(Boolean practicalCert) {
        this.practicalCert = practicalCert;
    }
    
    public Boolean getClass1Cert() {
        return class1Cert;
    }
    
    public void setClass1Cert(Boolean class1Cert) {
        this.class1Cert = class1Cert;
    }
    
    public Boolean getClass2Cert() {
        return class2Cert;
    }
    
    public void setClass2Cert(Boolean class2Cert) {
        this.class2Cert = class2Cert;
    }
    
    public Boolean getClass3Cert() {
        return class3Cert;
    }
    
    public void setClass3Cert(Boolean class3Cert) {
        this.class3Cert = class3Cert;
    }
    
    public Boolean getInstructorCert() {
        return instructorCert;
    }
    
    public void setInstructorCert(Boolean instructorCert) {
        this.instructorCert = instructorCert;
    }
    
    public Boolean getOtherCert() {
        return otherCert;
    }
    
    public void setOtherCert(Boolean otherCert) {
        this.otherCert = otherCert;
    }
    
    public String getOtherCertText() {
        return otherCertText;
    }
    
    public void setOtherCertText(String otherCertText) {
        this.otherCertText = otherCertText;
    }
    
    public Boolean getPrivacyAgreed() {
        return privacyAgreed;
    }
    
    public void setPrivacyAgreed(Boolean privacyAgreed) {
        this.privacyAgreed = privacyAgreed;
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
    
    public LocalDateTime getInterviewScheduledAt() {
        return interviewScheduledAt;
    }
    
    public void setInterviewScheduledAt(LocalDateTime interviewScheduledAt) {
        this.interviewScheduledAt = interviewScheduledAt;
    }
    
    public String getInterviewNotes() {
        return interviewNotes;
    }
    
    public void setInterviewNotes(String interviewNotes) {
        this.interviewNotes = interviewNotes;
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