
package com.nallijaku.backend.controller;

import com.nallijaku.backend.entity.Role;
import com.nallijaku.backend.entity.User;
import com.nallijaku.backend.service.TestService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TestController.class)
class TestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TestService testService;

    @Test
    @DisplayName("사용자 수 조회 API 테스트")
    void getUserCount() throws Exception {
        // given
        when(testService.getUserCount()).thenReturn(10L);

        // when & then
        mockMvc.perform(get("/users/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("총 사용자 수: 10명"));
    }

    @Test
    @DisplayName("관리자 정보 조회 API 테스트")
    void getAdminUser_Success() throws Exception {
        // given
        User admin = new User("admin", "pass", "admin@test.com", "Nallijaku", Role.ADMIN, "01012345678", true, true);
        when(testService.getAdminUser()).thenReturn(Optional.of(admin));

        // when & then
        mockMvc.perform(get("/users/admin"))
                .andExpect(status().isOk())
                .andExpect(content().string(" 사용자명: admin, 이메일: admin@test.com, 역할: 관리자"));
    }

    @Test
    @DisplayName("관리자 정보 조회 API 실패 - 관리자 없음")
    void getAdminUser_Fail_NotFound() throws Exception {
        // given
        when(testService.getAdminUser()).thenReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/users/admin"))
                .andExpect(status().isOk())
                .andExpect(content().string("관리자 계정을 찾을 수 없습니다."));
    }
}
