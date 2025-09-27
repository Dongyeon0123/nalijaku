
package com.nallijaku.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nallijaku.backend.entity.PartnerApplication;
import com.nallijaku.backend.service.PartnerApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PartnerApplicationController.class)
class PartnerApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PartnerApplicationService partnerApplicationService;

    private PartnerApplication application;

    @BeforeEach
    void setUp() {
        application = new PartnerApplication(
                "Test Applicant", "01087654321", "applicant@test.com", "Seoul",
                "5 years experience", true, true, false, false, true, false, "",
                true, false
        );
        application.setId(1L);
    }

    @Test
    @DisplayName("파트너 지원서 제출 성공 테스트")
    void submitApplication_Success() throws Exception {
        // given
        when(partnerApplicationService.saveApplication(any(PartnerApplication.class))).thenReturn(application);

        // when & then
        mockMvc.perform(post("/partner-applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(application)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("파트너 지원서가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다."))
                .andExpect(jsonPath("$.applicationId").value(1L));
    }

    @Test
    @DisplayName("파트너 지원서 제출 실패 - 이름 누락")
    void submitApplication_Fail_MissingApplicantName() throws Exception {
        // given
        PartnerApplication invalidApplication = new PartnerApplication(
                null, // 이름 누락
                "01087654321",
                "applicant@test.com",
                "Seoul",
                "5 years experience",
                true, true, false, false, true, false, "",
                true, false
        );

        // when & then
        mockMvc.perform(post("/partner-applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidApplication)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("성함은 필수입니다"));
    }

    @Test
    @DisplayName("모든 지원서 조회 성공 테스트")
    void getAllApplications_Success() throws Exception {
        // given
        when(partnerApplicationService.getAllApplications()).thenReturn(List.of(application));

        // when & then
        mockMvc.perform(get("/partner-applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.data[0].applicantName").value("Test Applicant"));
    }

    @Test
    @DisplayName("ID로 지원서 조회 성공 테스트")
    void getApplicationById_Success() throws Exception {
        // given
        when(partnerApplicationService.getApplicationById(1L)).thenReturn(Optional.of(application));

        // when & then
        mockMvc.perform(get("/partner-applications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    @DisplayName("존재하지 않는 ID로 지원서 조회 실패 테스트")
    void getApplicationById_Fail_NotFound() throws Exception {
        // given
        when(partnerApplicationService.getApplicationById(99L)).thenReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/partner-applications/99"))
                .andExpect(status().isNotFound());
    }
}
