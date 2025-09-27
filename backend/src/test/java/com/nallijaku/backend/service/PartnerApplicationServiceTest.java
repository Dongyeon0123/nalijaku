
package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.PartnerApplication;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.repository.PartnerApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PartnerApplicationServiceTest {

    @Mock
    private PartnerApplicationRepository partnerApplicationRepository;

    @InjectMocks
    private PartnerApplicationService partnerApplicationService;

    private PartnerApplication application;

    @BeforeEach
    void setUp() {
        application = new PartnerApplication(
                "Test Applicant",
                "01087654321",
                "applicant@test.com",
                "Seoul",
                "5 years experience",
                true, true, false, false, true, false, "",
                true, false
        );
        application.setId(1L);
    }

    @Test
    @DisplayName("파트너 지원서 저장 성공 테스트")
    void saveApplication_Success() {
        // given
        when(partnerApplicationRepository.save(any(PartnerApplication.class))).thenReturn(application);

        // when
        PartnerApplication savedApplication = partnerApplicationService.saveApplication(application);

        // then
        assertNotNull(savedApplication);
        assertEquals("Test Applicant", savedApplication.getApplicantName());
    }

    @Test
    @DisplayName("모든 지원서 조회 테스트")
    void getAllApplications_Success() {
        // given
        when(partnerApplicationRepository.findAll()).thenReturn(List.of(application));

        // when
        List<PartnerApplication> applications = partnerApplicationService.getAllApplications();

        // then
        assertFalse(applications.isEmpty());
        assertEquals(1, applications.size());
    }

    @Test
    @DisplayName("ID로 지원서 조회 성공 테스트")
    void getApplicationById_Success() {
        // given
        when(partnerApplicationRepository.findById(1L)).thenReturn(Optional.of(application));

        // when
        Optional<PartnerApplication> foundApplication = partnerApplicationService.getApplicationById(1L);

        // then
        assertTrue(foundApplication.isPresent());
        assertEquals(application.getId(), foundApplication.get().getId());
    }

    @Test
    @DisplayName("지원서 상태 업데이트 성공 테스트")
    void updateApplicationStatus_Success() {
        // given
        when(partnerApplicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(partnerApplicationRepository.save(any(PartnerApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        PartnerApplication updatedApplication = partnerApplicationService.updateApplicationStatus(1L, InquiryStatus.COMPLETED, "admin");

        // then
        assertEquals(InquiryStatus.COMPLETED, updatedApplication.getStatus());
        assertEquals("admin", updatedApplication.getAssignedAdmin());
        assertNotNull(updatedApplication.getProcessedAt());
    }

    @Test
    @DisplayName("면접 일정 설정 성공 테스트")
    void scheduleInterview_Success() {
        // given
        LocalDateTime interviewTime = LocalDateTime.now().plusDays(7);
        when(partnerApplicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(partnerApplicationRepository.save(any(PartnerApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        PartnerApplication scheduledApplication = partnerApplicationService.scheduleInterview(1L, interviewTime, "admin");

        // then
        assertEquals(interviewTime, scheduledApplication.getInterviewScheduledAt());
        assertEquals(InquiryStatus.IN_PROGRESS, scheduledApplication.getStatus());
        assertEquals("admin", scheduledApplication.getAssignedAdmin());
    }

    @Test
    @DisplayName("존재하지 않는 지원서 업데이트 시 예외 발생 테스트")
    void updateApplication_NotFound_ThrowsException() {
        // given
        when(partnerApplicationRepository.findById(99L)).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            partnerApplicationService.updateApplicationStatus(99L, InquiryStatus.COMPLETED, "admin");
        });
        assertEquals("지원서를 찾을 수 없습니다. ID: 99", exception.getMessage());
    }
}
