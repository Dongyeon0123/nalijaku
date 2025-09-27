
package com.nallijaku.backend.service;

import com.nallijaku.backend.entity.EducationInquiry;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.repository.EducationInquiryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EducationInquiryServiceTest {

    @Mock
    private EducationInquiryRepository educationInquiryRepository;

    @InjectMocks
    private EducationInquiryService educationInquiryService;

    private EducationInquiry inquiry;

    @BeforeEach
    void setUp() {
        inquiry = new EducationInquiry(
                "Test School",
                "Test Teacher",
                "01012345678",
                "teacher@test.com",
                "30",
                "3",
                "2024-10-01",
                "Test message",
                true, false, true, false, false, "",
                true, false
        );
        inquiry.setId(1L);
    }

    @Test
    @DisplayName("교육 문의 저장 성공 테스트")
    void saveInquiry_Success() {
        // given
        when(educationInquiryRepository.save(any(EducationInquiry.class))).thenReturn(inquiry);

        // when
        EducationInquiry savedInquiry = educationInquiryService.saveInquiry(new EducationInquiry());

        // then
        assertNotNull(savedInquiry);
    }

    @Test
    @DisplayName("모든 교육 문의 조회 테스트")
    void getAllInquiries_Success() {
        // given
        when(educationInquiryRepository.findAll()).thenReturn(List.of(inquiry));

        // when
        List<EducationInquiry> inquiries = educationInquiryService.getAllInquiries();

        // then
        assertFalse(inquiries.isEmpty());
        assertEquals(1, inquiries.size());
    }

    @Test
    @DisplayName("ID로 교육 문의 조회 성공 테스트")
    void getInquiryById_Success() {
        // given
        when(educationInquiryRepository.findById(1L)).thenReturn(Optional.of(inquiry));

        // when
        Optional<EducationInquiry> foundInquiry = educationInquiryService.getInquiryById(1L);

        // then
        assertTrue(foundInquiry.isPresent());
        assertEquals(inquiry.getId(), foundInquiry.get().getId());
    }

    @Test
    @DisplayName("존재하지 않는 ID로 교육 문의 조회 시 빈 Optional 반환 테스트")
    void getInquiryById_NotFound() {
        // given
        when(educationInquiryRepository.findById(99L)).thenReturn(Optional.empty());

        // when
        Optional<EducationInquiry> foundInquiry = educationInquiryService.getInquiryById(99L);

        // then
        assertFalse(foundInquiry.isPresent());
    }

    @Test
    @DisplayName("교육 문의 상태 업데이트 성공 테스트")
    void updateInquiryStatus_Success() {
        // given
        when(educationInquiryRepository.findById(1L)).thenReturn(Optional.of(inquiry));
        when(educationInquiryRepository.save(any(EducationInquiry.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        EducationInquiry updatedInquiry = educationInquiryService.updateInquiryStatus(1L, InquiryStatus.COMPLETED, "admin");

        // then
        assertEquals(InquiryStatus.COMPLETED, updatedInquiry.getStatus());
        assertEquals("admin", updatedInquiry.getAssignedAdmin());
        assertNotNull(updatedInquiry.getProcessedAt());
    }

    @Test
    @DisplayName("존재하지 않는 문의 상태 업데이트 시 예외 발생 테스트")
    void updateInquiryStatus_NotFound_ThrowsException() {
        // given
        when(educationInquiryRepository.findById(99L)).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            educationInquiryService.updateInquiryStatus(99L, InquiryStatus.COMPLETED, "admin");
        });
        assertEquals("문의를 찾을 수 없습니다. ID: 99", exception.getMessage());
    }
}
