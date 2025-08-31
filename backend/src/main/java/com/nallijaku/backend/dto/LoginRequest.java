package com.nallijaku.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * 로그인 요청 DTO
 * 프론트엔드에서 전송되는 로그인 정보를 받기 위한 클래스
 */
public class LoginRequest {
    
    @NotBlank(message = "사용자명은 필수입니다")
    private String username;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
    
    private Boolean rememberMe = false; // 로그인 상태 유지 여부
    
    // 기본 생성자
    public LoginRequest() {}
    
    // 생성자
    public LoginRequest(String username, String password, Boolean rememberMe) {
        this.username = username;
        this.password = password;
        this.rememberMe = rememberMe;
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
    
    public Boolean getRememberMe() {
        return rememberMe;
    }
    
    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}







