package com.nallijaku.backend.repository;

import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 사용자명으로 사용자 찾기 (로그인용)
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 찾기 (비밀번호 찾기용)
    Optional<User> findByEmail(String email);
    
    // 이메일 인증 토큰으로 사용자 찾기
    Optional<User> findByEmailVerificationToken(String token);
    
    // 사용자명 중복 체크
    boolean existsByUsername(String username);
    
    // 이메일 중복 체크
    boolean existsByEmail(String email);
    
    // 연락처 중복 체크
    boolean existsByPhone(String phone);
    
    // 역할별 사용자 조회
    List<User> findByRole(Role role);
    
    // 소속별 사용자 조회
    List<User> findByOrganization(String organization);
    
    // 활성화된 사용자만 조회
    List<User> findByAccountEnabledTrue();
    
    // 이메일 인증된 사용자만 조회
    List<User> findByEmailVerifiedTrue();
    
    // 사용자명 또는 이메일로 검색 (관리자용)
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.email LIKE %:keyword% OR u.organization LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    // 특정 역할과 소속으로 사용자 찾기
    List<User> findByRoleAndOrganization(Role role, String organization);
}


