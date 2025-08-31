@echo off
echo =====================================
echo 날리자쿠 백엔드 - 로컬 환경 실행
echo =====================================

set SPRING_PROFILES_ACTIVE=local
set JWT_SECRET=nallijaku-local-development-secret-key-2024
set EMAIL_USERNAME=your-email@gmail.com
set EMAIL_PASSWORD=your-app-password
set FILE_UPLOAD_DIR=./uploads/local

echo 프로파일: %SPRING_PROFILES_ACTIVE%
echo 포트: 9090
echo 컨텍스트 경로: /api
echo.

cd /d "%~dp0.."
.\mvnw.cmd spring-boot:run
