package com.nallijaku.backend.controller;

import com.nallijaku.backend.dto.LoginRequest;
import com.nallijaku.backend.dto.SignUpRequest;
import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://nallijaku.com", "https://www.nallijaku.com"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    /**
     * 회원가입 API
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            // 사용자명 중복 확인
            if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("이미 사용 중인 사용자명입니다."));
            }

            // 이메일 중복 확인 (이메일이 제공된 경우)
            if (signUpRequest.getEmail() != null && !signUpRequest.getEmail().isEmpty()) {
                if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("이미 사용 중인 이메일입니다."));
                }
            }

            // 비밀번호 확인 검증
            if (!signUpRequest.isPasswordMatching()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("비밀번호와 비밀번호 확인이 일치하지 않습니다."));
            }

            // 새 사용자 생성
            User newUser = new User(
                signUpRequest.getUsername(),
                "{noop}" + signUpRequest.getPassword(), // 임시로 {noop} 접두사 사용 (개발용)
                signUpRequest.getEmail(),
                signUpRequest.getOrganization(),
                Role.valueOf(signUpRequest.getRole().toUpperCase()),
                signUpRequest.getPhone(),
                signUpRequest.getDroneExperience(),
                signUpRequest.getTermsAgreed()
            );

            // 사용자 저장
            User savedUser = userRepository.save(newUser);

            // 성공 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("userId", savedUser.getId());
            response.put("username", savedUser.getUsername());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("회원가입 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // 사용자 찾기
            Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("사용자를 찾을 수 없습니다."));
            }

            User user = userOptional.get();

            // 비밀번호 확인 (임시로 {noop} 접두사 처리)
            String storedPassword = user.getPassword();
            String inputPassword = loginRequest.getPassword();
            
            // {noop} 접두사가 있으면 제거하고 비교
            if (storedPassword.startsWith("{noop}")) {
                storedPassword = storedPassword.substring(6);
            }
            
            if (!storedPassword.equals(inputPassword)) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("비밀번호가 일치하지 않습니다."));
            }

            // 계정 상태 확인
            if (!user.getAccountEnabled()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("비활성화된 계정입니다."));
            }

            if (user.getAccountLocked()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("잠금된 계정입니다."));
            }

            // 로그인 성공 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("user", createUserInfo(user));
            // 향후 JWT 토큰 구현 예정
            response.put("token", "temporary_session_" + user.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("로그인 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // 현재는 클라이언트 측에서 토큰 삭제로 처리
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그아웃되었습니다.");
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자명 중복 확인 API
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        boolean exists = userRepository.findByUsername(username).isPresent();
        
        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "이미 사용 중인 사용자명입니다." : "사용 가능한 사용자명입니다.");
        
        return ResponseEntity.ok(response);
    }

    /**
     * 현재 사용자 정보 조회 API
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // 향후 JWT 토큰에서 사용자 정보 추출 예정
        // 현재는 테스트용으로 admin 사용자 반환
        Optional<User> userOptional = userRepository.findByUsername("admin");
        
        if (userOptional.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", createUserInfo(userOptional.get()));
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest()
            .body(createErrorResponse("사용자 정보를 찾을 수 없습니다."));
    }

    // 헬퍼 메서드들
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

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
