package com.nallijaku.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 4, max = 20, message = "사용자명은 4-20자 사이여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다")
    @Column(nullable = false, unique = true, length = 20)
    private String username;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Column(nullable = false)
    private String password; // BCrypt로 암호화되어 저장
    
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    @Column(unique = true, length = 100)
    private String email; // 선택 입력
    
    @NotBlank(message = "소속은 필수입니다")
    @Size(max = 100, message = "소속은 100자 이하여야 합니다")
    @Column(nullable = false, length = 100)
    private String organization; // 반드시 입력해야 하는 기관명
    
    @NotNull(message = "역할은 필수입니다")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // 회원 유형 구분
    
    @NotBlank(message = "연락처는 필수입니다")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "연락처는 10-11자리 숫자만 입력 가능합니다")
    @Column(nullable = false, length = 11)
    private String phone; // 필수 입력, 숫자만 허용
    
    @Column(nullable = false)
    private Boolean droneExperience = false; // 드론 강의 경험 (0=없음, 1=있음)
    
    @NotNull(message = "약관 동의는 필수입니다")
    @Column(nullable = false)
    private Boolean termsAgreed; // 반드시 true여야 가입 완료
    
    @Column(nullable = false)
    private Boolean emailVerified = false; // 이메일 인증 여부
    
    @Column
    private String emailVerificationToken; // 이메일 인증 토큰
    
    @Column(nullable = false)
    private Boolean accountLocked = false; // 계정 잠금 여부
    
    @Column(nullable = false) 
    private Boolean accountEnabled = true; // 계정 활성화 여부
    
    @Column
    private LocalDateTime lastLoginAt; // 마지막 로그인 시간
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public User() {}
    
    // 생성자
    public User(String username, String password, String email, String organization, 
                Role role, String phone, Boolean droneExperience, Boolean termsAgreed) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.organization = organization;
        this.role = role;
        this.phone = phone;
        this.droneExperience = droneExperience;
        this.termsAgreed = termsAgreed;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public Boolean getDroneExperience() {
        return droneExperience;
    }
    
    public void setDroneExperience(Boolean droneExperience) {
        this.droneExperience = droneExperience;
    }
    
    public Boolean getTermsAgreed() {
        return termsAgreed;
    }
    
    public void setTermsAgreed(Boolean termsAgreed) {
        this.termsAgreed = termsAgreed;
    }
    
    public Boolean getEmailVerified() {
        return emailVerified;
    }
    
    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }
    
    public String getEmailVerificationToken() {
        return emailVerificationToken;
    }
    
    public void setEmailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
    }
    
    public Boolean getAccountLocked() {
        return accountLocked;
    }
    
    public void setAccountLocked(Boolean accountLocked) {
        this.accountLocked = accountLocked;
    }
    
    public Boolean getAccountEnabled() {
        return accountEnabled;
    }
    
    public void setAccountEnabled(Boolean accountEnabled) {
        this.accountEnabled = accountEnabled;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
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

