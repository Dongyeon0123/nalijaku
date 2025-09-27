package com.nallijaku.backend.dto;

import jakarta.validation.constraints.*;

/**
 * 파트너 지원 요청 DTO
 * 프론트엔드 폼 데이터와 매핑
 */
public class PartnerApplicationRequest {
    
    @NotBlank(message = "성함은 필수입니다")
    @Size(max = 50, message = "성함은 50자 이하여야 합니다")
    private String contactPerson; // 프론트엔드에서 contactPerson으로 전송
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "연락처는 010-0000-0000 형식이어야 합니다")
    private String phone;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    private String email;
    
    @NotBlank(message = "활동지역은 필수입니다")
    @Size(max = 100, message = "활동지역은 100자 이하여야 합니다")
    private String location;
    
    @NotBlank(message = "경력 사항은 필수입니다")
    private String experience;
    
    // 드론 자격증 종류들
    private Boolean practicalCert = false; // 실기평가조종 자격증
    private Boolean class1Cert = false; // 1종 조종 자격증
    private Boolean class2Cert = false; // 2종 조종 자격증
    private Boolean class3Cert = false; // 3종 조종 자격증
    private Boolean instructorCert = false; // 교관 자격증
    private Boolean other = false; // 기타
    private String otherText; // 기타 내용
    
    // 동의 사항
    @NotNull(message = "개인정보 처리방침 동의는 필수입니다")
    private Boolean privacyAgreement; // 프론트엔드에서 privacyAgreement로 전송
    
    private Boolean marketingAgreed = false; // 마케팅 수신 동의 (선택)
    
    // 기본 생성자
    public PartnerApplicationRequest() {}
    
    // Getters and Setters
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