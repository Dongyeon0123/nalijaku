package com.nallijaku.backend.controller;

import com.nallijaku.backend.dto.ApiResponse;
import com.nallijaku.backend.dto.LoginRequest;
import com.nallijaku.backend.dto.SignUpRequest;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * 회원가입 API
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        User savedUser = authService.signUp(signUpRequest);

        Map<String, Object> data = new HashMap<>();
        data.put("userId", savedUser.getId());
        data.put("username", savedUser.getUsername());

        return ResponseEntity.ok(
            ApiResponse.success("회원가입이 완료되었습니다.", data)
        );
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest loginRequest) {
        User user = authService.login(loginRequest);

        Map<String, Object> data = new HashMap<>();
        data.put("user", createUserInfo(user));
        data.put("token", "temporary_session_" + user.getId()); // 향후 JWT 토큰 구현 예정

        return ResponseEntity.ok(
            ApiResponse.success("로그인 성공", data)
        );
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(
            ApiResponse.success("로그아웃되었습니다.")
        );
    }

    /**
     * 사용자명 중복 확인 API
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkUsername(@PathVariable String username) {
        boolean exists = authService.isUsernameExists(username);

        Map<String, Object> data = new HashMap<>();
        data.put("exists", exists);

        String message = exists ? "이미 사용 중인 사용자명입니다." : "사용 가능한 사용자명입니다.";
        
        return ResponseEntity.ok(
            ApiResponse.success(message, data)
        );
    }

    /**
     * 현재 사용자 정보 조회 API
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser() {
        // 향후 JWT 토큰에서 사용자 정보를 추출하여 구현
        // 현재는 임시로 빈 응답 반환
        return ResponseEntity.ok(
            ApiResponse.success("사용자 정보 조회 성공", new HashMap<>())
        );
    }

    /**
     * 사용자 권한 확인 API (관리자 페이지 버튼 표시용)
     */
    @GetMapping("/check-admin/{username}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkAdminRole(@PathVariable String username) {
        boolean isAdmin = authService.isAdmin(username);
        
        Map<String, Object> data = new HashMap<>();
        data.put("isAdmin", isAdmin);
        data.put("username", username);
        
        String message = isAdmin ? "관리자 권한이 있습니다." : "일반 사용자입니다.";
        
        return ResponseEntity.ok(
            ApiResponse.success(message, data)
        );
    }

    // createUserInfo 헬퍼 메서드
    private Map<String, Object> createUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("organization", user.getOrganization());
        userInfo.put("role", user.getRole().toString());
        userInfo.put("phone", user.getPhone());
        userInfo.put("droneExperience", user.getDroneExperience());
        userInfo.put("createdAt", user.getCreatedAt());
        return userInfo;
    }
}