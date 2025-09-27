
package com.nallijaku.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nallijaku.backend.entity.EducationInquiry;
import com.nallijaku.backend.service.EducationInquiryService;
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

@WebMvcTest(EducationInquiryController.class)
class EducationInquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EducationInquiryService educationInquiryService;

    private EducationInquiry inquiry;

    @BeforeEach
    void setUp() {
        inquiry = new EducationInquiry(
                "Test School", "Test Teacher", "01012345678", "teacher@test.com",
                "30", "3", "2024-10-01", "Test message",
                true, false, true, false, false, "",
                true, false
        );
        inquiry.setId(1L);
    }

    @Test
    @DisplayName("교육 문의 제출 성공 테스트")
    void submitInquiry_Success() throws Exception {
        // given
        when(educationInquiryService.saveInquiry(any(EducationInquiry.class))).thenReturn(inquiry);

        // when & then
        mockMvc.perform(post("/education-inquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inquiry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("교육 도입 문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다."))
                .andExpect(jsonPath("$.inquiryId").value(1L));
    }

    @Test
    @DisplayName("교육 문의 제출 실패 - 기관명 누락")
    void submitInquiry_Fail_MissingOrganizationName() throws Exception {
        // given
        EducationInquiry invalidInquiry = new EducationInquiry(
                null, // 기관명 누락
                "Test Teacher",
                "01012345678",
                "teacher@test.com",
                "30", "3", "2024-10-01", "Test message",
                true, false, true, false, false, "",
                true, false
        );

        // when & then
        mockMvc.perform(post("/education-inquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidInquiry)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("기관명은 필수입니다"));
    }

    @Test
    @DisplayName("모든 교육 문의 조회 성공 테스트")
    void getAllInquiries_Success() throws Exception {
        // given
        when(educationInquiryService.getAllInquiries()).thenReturn(List.of(inquiry));

        // when & then
        mockMvc.perform(get("/education-inquiries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.data[0].organizationName").value("Test School"));
    }

    @Test
    @DisplayName("ID로 교육 문의 조회 성공 테스트")
    void getInquiryById_Success() throws Exception {
        // given
        when(educationInquiryService.getInquiryById(1L)).thenReturn(Optional.of(inquiry));

        // when & then
        mockMvc.perform(get("/education-inquiries/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1L));
    }

    @Test
    @DisplayName("존재하지 않는 ID로 교육 문의 조회 실패 테스트")
    void getInquiryById_Fail_NotFound() throws Exception {
        // given
        when(educationInquiryService.getInquiryById(99L)).thenReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/education-inquiries/99"))
                .andExpect(status().isNotFound());
    }
}
