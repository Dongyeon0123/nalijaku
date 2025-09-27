
package com.nallijaku.backend.service;

import com.nallijaku.backend.dto.SignUpRequest;
import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private SignUpRequest signUpRequest;

    @BeforeEach
    void setUp() {
        signUpRequest = new SignUpRequest(
                "testuser",
                "password123",
                "password123",
                "test@test.com",
                "Test Org",
                "GENERAL",
                "01012345678",
                true,
                false
        );
    }

    @Test
    @DisplayName("회원가입 성공 테스트")
    void signUp_Success() {
        // given
        when(userRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        User registeredUser = authService.signUp(signUpRequest);

        // then
        assertNotNull(registeredUser);
        assertEquals(signUpRequest.getUsername(), registeredUser.getUsername());
        assertEquals("encodedPassword", registeredUser.getPassword());
        assertEquals(Role.GENERAL, registeredUser.getRole());
    }

    @Test
    @DisplayName("중복된 사용자명으로 회원가입 실패 테스트")
    void signUp_Fail_UsernameExists() {
        // given
        when(userRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(true);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.signUp(signUpRequest);
        });
        assertEquals("이미 사용 중인 사용자명입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("중복된 이메일로 회원가입 실패 테스트")
    void signUp_Fail_EmailExists() {
        // given
        when(userRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(true);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.signUp(signUpRequest);
        });
        assertEquals("이미 사용 중인 이메일입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("비밀번호 불일치로 회원가입 실패 테스트")
    void signUp_Fail_PasswordMismatch() {
        // given
        signUpRequest.setConfirmPassword("wrongpassword");

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.signUp(signUpRequest);
        });
        assertEquals("비밀번호와 비밀번호 확인이 일치하지 않습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("잘못된 Role 값으로 회원가입 시 GENERAL로 설정되는지 테스트")
    void signUp_Success_InvalidRoleDefaultsToGeneral() {
        // given
        signUpRequest.setRole("INVALID_ROLE");
        when(userRepository.existsByUsername(signUpRequest.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(signUpRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        User registeredUser = authService.signUp(signUpRequest);

        // then
        assertEquals(Role.GENERAL, registeredUser.getRole());
    }
}
