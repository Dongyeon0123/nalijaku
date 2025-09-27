package com.nallijaku.backend.dto;

import jakarta.validation.constraints.*;

/**
 * 교육 도입 문의 요청 DTO
 * 프론트엔드 폼 데이터와 매핑
 */
public class EducationInquiryRequest {
    
    @NotBlank(message = "기관명은 필수입니다")
    @Size(max = 100, message = "기관명은 100자 이하여야 합니다")
    private String schoolName; // 프론트엔드에서 schoolName으로 전송
    
    @NotBlank(message = "담당자명은 필수입니다")
    @Size(max = 50, message = "담당자명은 50자 이하여야 합니다")
    private String contactPerson;
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "연락처는 010-0000-0000 형식이어야 합니다")
    private String phone;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    private String email;
    
    @NotBlank(message = "예상 학생 수는 필수입니다")
    private String studentCount;
    
    private String budget; // 선택사항
    
    private String grade; // 선택사항
    
    private String preferredDate; // 선택사항
    
    private String message; // 추가 메시지
    
    // 상담 내용 체크박스들
    private Boolean purchaseInquiry = false; // 교구 구매 문의
    private Boolean schoolVisit = false; // 학교(기관) 출강 문의
    private Boolean careerExperience = false; // 진로 체험 출강 문의
    private Boolean boothEntrustment = false; // 체험 부스 위탁 문의
    private Boolean other = false; // 기타
    private String otherText; // 기타 내용
    
    // 동의 사항
    @NotNull(message = "개인정보 수집 동의는 필수입니다")
    private Boolean privacyAgreement; // 프론트엔드에서 privacyAgreement로 전송
    
    private Boolean marketingAgreed = false; // 마케팅 수신 동의 (선택)
    
    // 기본 생성자
    public EducationInquiryRequest() {}
    
    // Getters and Setters
    public String getSchoolName() {
        return schoolName;
    }
    
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }
    
    public String getContactPerson() {
        return contactPerson;
    }
    
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
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
    
    public String getBudget() {
        return budget;
    }
    
    public void setBudget(String budget) {
        this.budget = budget;
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
    
    public Boolean getOther() {
        return other;
    }
    
    public void setOther(Boolean other) {
        this.other = other;
    }
    
    public String getOtherText() {
        return otherText;
    }
    
    public void setOtherText(String otherText) {
        this.otherText = otherText;
    }
    
    public Boolean getPrivacyAgreement() {
        return privacyAgreement;
    }
    
    public void setPrivacyAgreement(Boolean privacyAgreement) {
        this.privacyAgreement = privacyAgreement;
    }
    
    public Boolean getMarketingAgreed() {
        return marketingAgreed;
    }
    
    public void setMarketingAgreed(Boolean marketingAgreed) {
        this.marketingAgreed = marketingAgreed;
    }
}