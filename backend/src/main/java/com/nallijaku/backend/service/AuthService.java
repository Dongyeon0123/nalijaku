package com.nallijaku.backend.service;

import com.nallijaku.backend.dto.LoginRequest;
import com.nallijaku.backend.dto.SignUpRequest;
import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User signUp(SignUpRequest signUpRequest) {
        // 사용자명 중복 확인
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 사용자명입니다.");
        }

        // 이메일 중복 확인
        if (signUpRequest.getEmail() != null && !signUpRequest.getEmail().isEmpty()) {
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
        }

        // 비밀번호 확인 검증
        if (!signUpRequest.isPasswordMatching()) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // Role 변환
        Role userRole = parseRole(signUpRequest.getRole());

        // 새 사용자 생성 및 비밀번호 암호화
        User newUser = new User(
                signUpRequest.getUsername(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getEmail(),
                signUpRequest.getOrganization(),
                userRole,
                signUpRequest.getPhone(),
                signUpRequest.getDroneExperience(),
                signUpRequest.getTermsAgreed()
        );

        return userRepository.save(newUser);
    }

    @Transactional(readOnly = true)
    public User login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 계정 상태 확인
        if (!user.getAccountEnabled()) {
            throw new IllegalStateException("비활성화된 계정입니다.");
        }

        if (user.getAccountLocked()) {
            throw new IllegalStateException("잠금된 계정입니다.");
        }

        return user;
    }

    private Role parseRole(String roleStr) {
        if (roleStr == null || roleStr.trim().isEmpty() || roleStr.matches("\\d+")) {
            return Role.GENERAL;
        }
        try {
            return Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.GENERAL; // 잘못된 role 값이면 기본값 사용
        }
    }

    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * 사용자가 관리자 권한을 가지고 있는지 확인
     */
    @Transactional(readOnly = true)
    public boolean isAdmin(String username) {
        return userRepository.findByUsername(username)
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }
}