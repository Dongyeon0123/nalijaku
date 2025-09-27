package com.nallijaku.backend.controller;

import com.nallijaku.backend.entity.PartnerApplication;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.service.PartnerApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/partner-applications")
public class PartnerApplicationController {

    @Autowired
    private PartnerApplicationService partnerApplicationService;

    /**
     * 파트너 지원서 제출 (프론트엔드에서 호출)
     * POST /api/partner-applications
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitApplication(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 프론트엔드 데이터를 엔티티로 변환하여 저장
            PartnerApplication savedApplication = partnerApplicationService.saveApplicationFromMap(requestData);
            
            response.put("success", true);
            response.put("message", "파트너 모집 신청이 성공적으로 접수되었습니다.");
            response.put("applicationId", savedApplication.getId()); // 프론트엔드에서 기대하는 필드명
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "지원서 접수 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 모든 지원서 조회 (관리자용)
     * GET /api/partner-applications
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String applicantName,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String certification) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PartnerApplication> applications;
            
            if (status != null) {
                InquiryStatus inquiryStatus = InquiryStatus.valueOf(status.toUpperCase());
                applications = partnerApplicationService.getApplicationsByStatus(inquiryStatus);
            } else if (applicantName != null) {
                applications = partnerApplicationService.searchByApplicantName(applicantName);
            } else if (location != null) {
                applications = partnerApplicationService.searchByLocation(location);
            } else if (certification != null) {
                applications = partnerApplicationService.getApplicationsByCertification(certification);
            } else {
                applications = partnerApplicationService.getAllApplications();
            }
            
            response.put("success", true);
            response.put("message", "지원서 목록 조회 성공");
            response.put("data", applications);
            response.put("count", applications.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "지원서 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 특정 지원서 조회 (관리자용)
     * GET /api/partner-applications/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getApplicationById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<PartnerApplication> application = partnerApplicationService.getApplicationById(id);
            
            if (application.isPresent()) {
                response.put("success", true);
                response.put("message", "지원서 조회 성공");
                response.put("data", application.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "해당 ID의 지원서를 찾을 수 없습니다.");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "지원서 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 지원서 상태 업데이트 (관리자용)
     * PUT /api/partner-applications/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String adminUsername) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            InquiryStatus inquiryStatus = InquiryStatus.valueOf(status.toUpperCase());
            String admin = (adminUsername != null) ? adminUsername : "admin";
            
            PartnerApplication updatedApplication = partnerApplicationService.updateApplicationStatus(id, inquiryStatus, admin);
            
            response.put("success", true);
            response.put("message", "지원서 상태가 업데이트되었습니다.");
            response.put("data", updatedApplication);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "잘못된 상태값입니다: " + status);
            return ResponseEntity.badRequest().body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "상태 업데이트 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 면접 일정 설정 (관리자용)
     * PUT /api/partner-applications/{id}/interview
     */
    @PutMapping("/{id}/interview")
    public ResponseEntity<Map<String, Object>> scheduleInterview(
            @PathVariable Long id, 
            @RequestParam String interviewDate,
            @RequestParam(required = false) String adminUsername) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 날짜 문자열을 LocalDateTime으로 변환
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime interview = LocalDateTime.parse(interviewDate, formatter);
            String admin = (adminUsername != null) ? adminUsername : "admin";
            
            PartnerApplication updatedApplication = partnerApplicationService.scheduleInterview(id, interview, admin);
            
            response.put("success", true);
            response.put("message", "면접 일정이 설정되었습니다.");
            response.put("data", updatedApplication);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "면접 일정 설정 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 관리자 메모 추가 (관리자용)
     * PUT /api/partner-applications/{id}/notes
     */
    @PutMapping("/{id}/notes")
    public ResponseEntity<Map<String, Object>> addAdminNotes(
            @PathVariable Long id, 
            @RequestParam String notes,
            @RequestParam(required = false) String adminUsername) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String admin = (adminUsername != null) ? adminUsername : "admin";
            PartnerApplication updatedApplication = partnerApplicationService.addAdminNotes(id, notes, admin);
            
            response.put("success", true);
            response.put("message", "관리자 메모가 추가되었습니다.");
            response.put("data", updatedApplication);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "메모 추가 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 최근 지원서 조회 (관리자용)
     * GET /api/partner-applications/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentApplications() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PartnerApplication> recentApplications = partnerApplicationService.getRecentApplications();
            
            response.put("success", true);
            response.put("message", "최근 지원서 조회 성공");
            response.put("data", recentApplications);
            response.put("count", recentApplications.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "최근 지원서 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 대기중인 지원서 수 조회 (관리자용)
     * GET /api/partner-applications/pending/count
     */
    @GetMapping("/pending/count")
    public ResponseEntity<Map<String, Object>> getPendingCount() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long pendingCount = partnerApplicationService.getPendingApplicationCount();
            
            response.put("success", true);
            response.put("message", "대기중인 지원서 수 조회 성공");
            response.put("pendingCount", pendingCount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "대기중인 지원서 수 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 면접 예정자 조회 (관리자용)
     * GET /api/partner-applications/interviews
     */
    @GetMapping("/interviews")
    public ResponseEntity<Map<String, Object>> getScheduledInterviews() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PartnerApplication> interviews = partnerApplicationService.getScheduledInterviews();
            
            response.put("success", true);
            response.put("message", "면접 예정자 조회 성공");
            response.put("data", interviews);
            response.put("count", interviews.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "면접 예정자 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}



