
package com.nallijaku.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nallijaku.backend.dto.LoginRequest;
import com.nallijaku.backend.dto.SignUpRequest;
import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("회원가입 API 성공 테스트")
    void signUp_Success() throws Exception {
        // given
        SignUpRequest signUpRequest = new SignUpRequest("newuser", "password123", "password123", "new@test.com", "New Org", "GENERAL", "01011112222", true, false);
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername(signUpRequest.getUsername());

        when(authService.signUp(any(SignUpRequest.class))).thenReturn(savedUser);

        // when & then
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다."))
                .andExpect(jsonPath("$.username").value("newuser"));
    }

    @Test
    @DisplayName("회원가입 API 실패 - 사용자명 중복")
    void signUp_Fail_UsernameExists() throws Exception {
        // given
        SignUpRequest signUpRequest = new SignUpRequest("existinguser", "password123", "password123", "new@test.com", "New Org", "GENERAL", "01011112222", true, false);
        when(authService.signUp(any(SignUpRequest.class))).thenThrow(new IllegalArgumentException("이미 사용 중인 사용자명입니다."));

        // when & then
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 사용자명입니다."));
    }

    @Test
    @DisplayName("로그인 API 성공 테스트")
    void login_Success() throws Exception {
        // given
        LoginRequest loginRequest = new LoginRequest("testuser", "password123", false);
        User user = new User("testuser", "encodedPassword", "test@test.com", "Test Org", Role.GENERAL, "01012345678", true, true);

        when(authService.login(any(LoginRequest.class))).thenReturn(user);

        // when & then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("로그인 성공"))
                .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    @DisplayName("로그인 API 실패 - 존재하지 않는 사용자")
    void login_Fail_UserNotFound() throws Exception {
        // given
        LoginRequest loginRequest = new LoginRequest("nouser", "password123", false);
        when(authService.login(any(LoginRequest.class))).thenThrow(new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // when & then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("사용자를 찾을 수 없습니다."));
    }

    @Test
    @DisplayName("로그인 API 실패 - 비밀번호 불일치")
    void login_Fail_PasswordMismatch() throws Exception {
        // given
        LoginRequest loginRequest = new LoginRequest("testuser", "wrongpassword", false);
        when(authService.login(any(LoginRequest.class))).thenThrow(new IllegalArgumentException("비밀번호가 일치하지 않습니다."));

        // when & then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("비밀번호가 일치하지 않습니다."));
    }
}
