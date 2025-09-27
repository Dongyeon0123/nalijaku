package com.nallijaku.backend.controller;

import com.nallijaku.backend.service.TestService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    @Autowired
    private TestService testService;
    
    @GetMapping("/test")
    public String test() {
        return "날리자쿠 백엔드 테스트 성공! 🚀";
    }
    
    @GetMapping("/health")
    public String healthCheck() {
        return "OK - 날리자쿠 서버가 정상 작동 중입니다.";
    }
    
    @GetMapping("/")
    public String home() {
        return """
                <!DOCTYPE html>
                <html lang="ko">
                <head>
                    <meta charset="UTF-8">
                    <title>날리자쿠 백엔드 테스트</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background-color: #f0f8ff; }
                        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        h1 { color: #333; text-align: center; }
                        h2 { color: #555; margin-top: 30px; }
                        button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px 5px; }
                        button:hover { background-color: #0056b3; }
                        #result { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; }
                        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
                        .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚀 날리자쿠 백엔드 API 테스트</h1>
                        
                        <div class="status success">
                            <strong>✅ 상태:</strong> Spring Boot + MySQL 연결 완료!
                        </div>
                        
                        <h2>📋 기본 API 테스트</h2>
                        <p>아래 버튼들을 클릭하여 백엔드 API를 테스트해보세요:</p>
                        <button onclick="testHealthAPI()">서버 상태 확인</button>
                        <button onclick="testAPI()">테스트 API 호출</button>
                        
                        <h2>🗄️ 데이터베이스 테스트</h2>
                        <p>MySQL 데이터베이스와 연동된 기능들:</p>
                        <button onclick="testUserCount()">사용자 수 조회</button>
                        <button onclick="testAdminUser()">관리자 계정 확인</button>
                        
                        <div id="result"></div>
                    </div>
                    <script>
                        async function testHealthAPI() {
                            try {
                                const response = await fetch('/api/health');
                                const data = await response.text();
                                document.getElementById('result').innerHTML = '<strong>✅ Health API 응답:</strong><br>' + data;
                            } catch (error) {
                                document.getElementById('result').innerHTML = '<strong>❌ 오류:</strong><br>' + error.message;
                            }
                        }
                        async function testAPI() {
                            try {
                                const response = await fetch('/api/test');
                                const data = await response.text();
                                document.getElementById('result').innerHTML = '<strong>✅ Test API 응답:</strong><br>' + data;
                            } catch (error) {
                                document.getElementById('result').innerHTML = '<strong>❌ 오류:</strong><br>' + error.message;
                            }
                        }
                        async function testUserCount() {
                            try {
                                const response = await fetch('/api/users/count');
                                const data = await response.text();
                                document.getElementById('result').innerHTML = '<strong>📊 사용자 수:</strong><br>' + data;
                            } catch (error) {
                                document.getElementById('result').innerHTML = '<strong>❌ 오류:</strong><br>' + error.message;
                            }
                        }
                        async function testAdminUser() {
                            try {
                                const response = await fetch('/api/users/admin');
                                const data = await response.text();
                                document.getElementById('result').innerHTML = '<strong>👤 관리자 정보:</strong><br>' + data;
                            } catch (error) {
                                document.getElementById('result').innerHTML = '<strong>❌ 오류:</strong><br>' + error.message;
                            }
                        }
                    </script>
                </body>
                </html>
                """;
    }
    
    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Object>> getUserCount() {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = testService.getUserCount();
            response.put("success", true);
            response.put("count", count);
            response.put("message", "총 사용자 수: " + count + "명");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/users/admin")
    public String getAdminUser() {
        try {
            var admin = testService.getAdminUser();
            if (admin.isPresent()) {
                var user = admin.get();
                return " 사용자명: " + user.getUsername() + 
                       ", 이메일: " + user.getEmail() + 
                       ", 역할: " + user.getRole();
            } else {
                return "관리자 계정을 찾을 수 없습니다.";
            }
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    /**
     * 모든 사용자 목록 조회 (관리자용)
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            var users = testService.getAllUsers();
            response.put("success", true);
            response.put("data", users);
            response.put("count", users.size());
            response.put("message", "사용자 목록 조회 성공");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "사용자 목록 조회 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * 임시 API: 관리자 비밀번호 변경 (개발/테스트용)
     * 운영 배포 후 제거 예정
     */
    @PostMapping("/admin/change-password")
    public ResponseEntity<Map<String, Object>> changeAdminPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.isEmpty()) {
                response.put("success", false);
                response.put("error", "새 비밀번호가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 보안: 최소 길이 검증
            if (newPassword.length() < 6) {
                response.put("success", false);
                response.put("error", "비밀번호는 최소 6자 이상이어야 합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean updated = testService.changeAdminPassword(newPassword);
            if (updated) {
                response.put("success", true);
                response.put("message", "관리자 비밀번호가 안전하게 변경되었습니다.");
                response.put("note", "새로운 BCrypt 해시로 암호화되었습니다.");
            } else {
                response.put("success", false);
                response.put("error", "관리자 계정을 찾을 수 없습니다.");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "비밀번호 변경 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * 임시 API: 관리자 제외 모든 사용자 삭제 (테스트 계정 정리용)
     * 운영 배포 후 제거 예정
     */
    @PostMapping("/admin/delete-test-users")
    public ResponseEntity<Map<String, Object>> deleteTestUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            int deletedCount = testService.deleteAllUsersExceptAdmin();
            response.put("success", true);
            response.put("deletedCount", deletedCount);
            response.put("message", "관리자 제외 " + deletedCount + "명의 테스트 계정이 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "계정 삭제 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}
