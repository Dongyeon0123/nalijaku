package com.nallijaku.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.nallijaku.backend.repository.UserRepository;

@RestController
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
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
    public String getUserCount() {
        try {
            long count = userRepository.count();
            return "총 사용자 수: " + count + "명";
        } catch (Exception e) {
            return "오류: " + e.getMessage();
        }
    }
    
    @GetMapping("/users/admin")
    public String getAdminUser() {
        try {
            var admin = userRepository.findByUsername("admin");
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
}
