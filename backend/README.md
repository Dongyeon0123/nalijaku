# 날리자쿠 백엔드 API 서버

드론 교육과 커뮤니티를 연결하는 학습·소통 웹사이트의 백엔드 API 서버입니다.

## 🚀 배포 정보

- **서버 주소**: http://13.124.1.128:8080/api
- **환경**: AWS EC2 (Ubuntu 22.04 LTS)
- **Java**: OpenJDK 17
- **데이터베이스**: MySQL 8.0
- **실행 프로필**: local (운영환경에서 사용)
- **서비스 관리**: systemd

## 📋 API 엔드포인트

### 🔐 인증 API
```
POST   /api/auth/signup                # 회원가입
POST   /api/auth/login                 # 로그인  
POST   /api/auth/logout                # 로그아웃
GET    /api/auth/check-username/{username}  # 아이디 중복확인
GET    /api/auth/me                    # 현재 사용자 정보
```

### 📝 문의/지원 API
```
POST   /api/education-inquiries        # 교육 도입문의 등록
GET    /api/education-inquiries        # 교육 도입문의 조회
POST   /api/partner-applications       # 파트너 지원 등록  
GET    /api/partner-applications       # 파트너 지원 조회
```

### 🔍 테스트 API
```
GET    /api/health                     # 서버 상태 확인
GET    /api/users/count                # DB 연결 테스트
```

## 🛠️ 로컬 개발 환경

### 실행 방법
```bash
# Maven Wrapper 사용
./mvnw.cmd spring-boot:run

# 또는 로컬 스크립트 사용  
./scripts/run-local.cmd
```

### 환경별 설정
- **로컬 개발**: `application-local.yml` (포트 9090)
- **개발 서버**: `application-dev.yml` (포트 8080)  
- **운영 서버**: `application-prod.yml` (포트 8080)

### 데이터베이스 설정
로컬 개발 시 MySQL 8.0이 필요합니다:
```sql
CREATE DATABASE nallijaku_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nallijaku_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON nallijaku_db.* TO 'nallijaku_user'@'localhost';
```

## 🔧 배포 프로세스

### 1. 빌드
```bash
./mvnw.cmd clean package -DskipTests
```

### 2. AWS EC2 업로드
```bash
scp -i nallijaku-key.pem target/backend-0.0.1-SNAPSHOT.jar ubuntu@13.124.1.128:/tmp/
```

### 3. 서버에서 배포
```bash
sudo mv /tmp/backend-0.0.1-SNAPSHOT.jar /opt/nallijaku/app.jar
sudo chown nallijaku:nallijaku /opt/nallijaku/app.jar
sudo systemctl restart nallijaku
```

### 4. 상태 확인
```bash
sudo systemctl status nallijaku
sudo ss -tlnp | grep 8080
curl http://localhost:8080/api/health
```

## 📊 기술 스택

### Backend Framework
- **Spring Boot**: 3.2.1
- **Spring Data JPA**: 데이터베이스 ORM
- **Spring Security**: 인증/인가 (JWT 예정)
- **Spring Web**: REST API

### Database
- **MySQL**: 8.0
- **HikariCP**: 커넥션 풀

### Build & Deploy  
- **Maven**: 빌드 도구
- **systemd**: 서비스 관리
- **AWS EC2**: 클라우드 인프라

### Development
- **Java**: OpenJDK 17
- **Maven Wrapper**: 빌드 환경 통일

## 📁 프로젝트 구조

```
backend/
├── src/main/java/com/nallijaku/backend/
│   ├── NallijakuBackendApplication.java     # 메인 애플리케이션
│   ├── config/
│   │   └── WebConfig.java                   # CORS 설정
│   ├── controller/                          # REST 컨트롤러
│   │   ├── AuthController.java
│   │   ├── EducationInquiryController.java
│   │   ├── PartnerApplicationController.java
│   │   └── TestController.java
│   ├── dto/                                 # 데이터 전송 객체
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   └── SignUpRequest.java
│   ├── entity/                              # JPA 엔티티
│   │   ├── User.java
│   │   ├── EducationInquiry.java
│   │   ├── PartnerApplication.java
│   │   ├── Role.java
│   │   └── InquiryStatus.java
│   ├── repository/                          # 데이터 액세스
│   │   ├── UserRepository.java
│   │   ├── EducationInquiryRepository.java
│   │   └── PartnerApplicationRepository.java
│   └── service/                             # 비즈니스 로직
│       ├── EducationInquiryService.java
│       └── PartnerApplicationService.java
├── src/main/resources/
│   ├── application.yml                      # 공통 설정
│   ├── application-local.yml                # 로컬 환경
│   ├── application-dev.yml                  # 개발 환경  
│   ├── application-prod.yml                 # 운영 환경
│   └── schema.sql                           # 데이터베이스 스키마
├── scripts/
│   └── run-local.cmd                        # 로컬 실행 스크립트
├── deploy/                                  # 배포 관련 파일
│   ├── deploy.sh
│   ├── setup-ec2.sh
│   └── nginx-config
└── pom.xml                                  # Maven 설정
```

## 🔒 보안 설정

### CORS 정책
- `https://nallijaku.com`
- `https://www.nallijaku.com`  
- `http://localhost:3000` (개발용)
- `http://localhost:3001` (개발용)

### 환경 변수 (운영 서버)
```bash
SPRING_PROFILES_ACTIVE=local
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/nallijaku_prod_db
SPRING_DATASOURCE_USERNAME=nallijaku_prod_user
SPRING_DATASOURCE_PASSWORD=nallijaku-db-password-123!
JWT_SECRET=nallijaku-jwt-secret-key-2025-production-environment
```

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 통해 연락해 주세요.