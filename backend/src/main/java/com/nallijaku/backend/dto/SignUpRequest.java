package com.nallijaku.backend.dto;

import jakarta.validation.constraints.*;

/**
 * 회원가입 요청 DTO
 * 프론트엔드에서 전송되는 회원가입 정보를 받기 위한 클래스
 */
public class SignUpRequest {
    
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 4, max = 20, message = "사용자명은 4-20자 사이여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다")
    private String username;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 50, message = "비밀번호는 8-50자 사이여야 합니다")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", 
             message = "비밀번호는 대소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다")
    private String password;
    
    @NotBlank(message = "비밀번호 확인은 필수입니다")
    private String confirmPassword;
    
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    private String email; // 선택 입력
    
    @NotBlank(message = "소속은 필수입니다")
    @Size(max = 100, message = "소속은 100자 이하여야 합니다")
    private String organization;
    
    @NotBlank(message = "역할은 필수입니다")
    private String role;
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "연락처는 10-11자리 숫자만 입력 가능합니다")
    private String phone;
    
    @NotNull(message = "약관 동의는 필수입니다")
    @AssertTrue(message = "약관에 동의해야 가입이 가능합니다")
    private Boolean termsAgreed;
    
    @NotNull(message = "드론 경험 여부는 필수입니다")
    private Boolean droneExperience = false;
    
    // 기본 생성자
    public SignUpRequest() {}
    
    // 생성자
    public SignUpRequest(String username, String password, String confirmPassword, 
                        String email, String organization, String role, String phone, 
                        Boolean termsAgreed, Boolean droneExperience) {
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.email = email;
        this.organization = organization;
        this.role = role;
        this.phone = phone;
        this.termsAgreed = termsAgreed;
        this.droneExperience = droneExperience;
    }
    
    // Getters and Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getOrganization() {
        return organization;
    }
    
    public void setOrganization(String organization) {
        this.organization = organization;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public Boolean getTermsAgreed() {
        return termsAgreed;
    }
    
    public void setTermsAgreed(Boolean termsAgreed) {
        this.termsAgreed = termsAgreed;
    }
    
    public Boolean getDroneExperience() {
        return droneExperience;
    }
    
    public void setDroneExperience(Boolean droneExperience) {
        this.droneExperience = droneExperience;
    }
    
    /**
     * 비밀번호와 확인 비밀번호가 일치하는지 검증
     */
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }
}


