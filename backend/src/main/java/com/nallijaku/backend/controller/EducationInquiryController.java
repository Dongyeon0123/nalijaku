package com.nallijaku.backend.controller;

import com.nallijaku.backend.entity.EducationInquiry;
import com.nallijaku.backend.entity.InquiryStatus;
import com.nallijaku.backend.service.EducationInquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/education-inquiries")
public class EducationInquiryController {

    @Autowired
    private EducationInquiryService educationInquiryService;

    /**
     * 교육 도입문의 제출 (프론트엔드에서 호출)
     * POST /api/education-inquiries
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitInquiry(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 프론트엔드 데이터를 엔티티로 변환하여 저장
            EducationInquiry savedInquiry = educationInquiryService.saveInquiryFromMap(requestData);
            
            response.put("success", true);
            response.put("message", "교육 도입 신청이 성공적으로 접수되었습니다.");
            response.put("applicationId", savedInquiry.getId()); // 프론트엔드에서 기대하는 필드명
            response.put("inquiryId", savedInquiry.getId()); // 기존 호환성 유지
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "문의 접수 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 모든 문의 조회 (관리자용)
     * GET /api/education-inquiries
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllInquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String organizationName,
            @RequestParam(required = false) String contactPerson) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<EducationInquiry> inquiries;
            
            if (status != null) {
                InquiryStatus inquiryStatus = InquiryStatus.valueOf(status.toUpperCase());
                inquiries = educationInquiryService.getInquiriesByStatus(inquiryStatus);
            } else if (organizationName != null) {
                inquiries = educationInquiryService.searchByOrganizationName(organizationName);
            } else if (contactPerson != null) {
                inquiries = educationInquiryService.searchByContactPerson(contactPerson);
            } else {
                inquiries = educationInquiryService.getAllInquiries();
            }
            
            response.put("success", true);
            response.put("message", "문의 목록 조회 성공");
            response.put("data", inquiries);
            response.put("count", inquiries.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "문의 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 특정 문의 조회 (관리자용)
     * GET /api/education-inquiries/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInquiryById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<EducationInquiry> inquiry = educationInquiryService.getInquiryById(id);
            
            if (inquiry.isPresent()) {
                response.put("success", true);
                response.put("message", "문의 조회 성공");
                response.put("data", inquiry.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "해당 ID의 문의를 찾을 수 없습니다.");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "문의 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 문의 상태 업데이트 (관리자용)
     * PUT /api/education-inquiries/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateInquiryStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String adminUsername) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            InquiryStatus inquiryStatus = InquiryStatus.valueOf(status.toUpperCase());
            String admin = (adminUsername != null) ? adminUsername : "admin";
            
            EducationInquiry updatedInquiry = educationInquiryService.updateInquiryStatus(id, inquiryStatus, admin);
            
            response.put("success", true);
            response.put("message", "문의 상태가 업데이트되었습니다.");
            response.put("data", updatedInquiry);
            
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
     * 관리자 메모 추가 (관리자용)
     * PUT /api/education-inquiries/{id}/notes
     */
    @PutMapping("/{id}/notes")
    public ResponseEntity<Map<String, Object>> addAdminNotes(
            @PathVariable Long id, 
            @RequestParam String notes,
            @RequestParam(required = false) String adminUsername) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String admin = (adminUsername != null) ? adminUsername : "admin";
            EducationInquiry updatedInquiry = educationInquiryService.addAdminNotes(id, notes, admin);
            
            response.put("success", true);
            response.put("message", "관리자 메모가 추가되었습니다.");
            response.put("data", updatedInquiry);
            
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
     * 최근 문의 조회 (관리자용)
     * GET /api/education-inquiries/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentInquiries() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<EducationInquiry> recentInquiries = educationInquiryService.getRecentInquiries();
            
            response.put("success", true);
            response.put("message", "최근 문의 조회 성공");
            response.put("data", recentInquiries);
            response.put("count", recentInquiries.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "최근 문의 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 대기중인 문의 수 조회 (관리자용)
     * GET /api/education-inquiries/pending/count
     */
    @GetMapping("/pending/count")
    public ResponseEntity<Map<String, Object>> getPendingCount() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long pendingCount = educationInquiryService.getPendingInquiryCount();
            
            response.put("success", true);
            response.put("message", "대기중인 문의 수 조회 성공");
            response.put("pendingCount", pendingCount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "대기중인 문의 수 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}



