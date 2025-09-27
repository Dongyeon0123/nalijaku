
package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TestService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public long getUserCount() {
        return userRepository.count();
    }

    public Optional<User> getAdminUser() {
        return userRepository.findByUsername("admin");
    }
    
    /**
     * 비밀번호를 BCrypt로 해시화
     */
    public String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    /**
     * 관리자 비밀번호 변경
     */
    @Transactional
    public boolean changeAdminPassword(String newPassword) {
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser.isPresent()) {
            User admin = adminUser.get();
            String hashedPassword = passwordEncoder.encode(newPassword);
            admin.setPassword(hashedPassword);
            userRepository.save(admin);
            return true;
        }
        return false;
    }
    
    /**
     * 관리자 제외 모든 사용자 삭제 (테스트 계정 정리용)
     */
    @Transactional
    public int deleteAllUsersExceptAdmin() {
        int deletedCount = userRepository.deleteByUsernameNot("admin");
        return deletedCount;
    }
    
    /**
     * 모든 사용자 목록 조회 (관리자용)
     */
    public java.util.List<java.util.Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
            .map(user -> {
                java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                userInfo.put("organization", user.getOrganization());
                userInfo.put("role", user.getRole().toString());
                userInfo.put("phone", user.getPhone());
                userInfo.put("droneExperience", user.getDroneExperience());
                userInfo.put("createdAt", user.getCreatedAt());
                return userInfo;
            })
            .collect(java.util.stream.Collectors.toList());
    }
}
