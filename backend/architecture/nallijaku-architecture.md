# 날리자쿠 서비스 아키텍처

## 🏗️ 시스템 아키텍처 다이어그램

```mermaid
graph TB
    %% 사용자 레이어
    subgraph "👥 사용자"
        U1[일반 사용자]
        U2[관리자]
        U3[파트너 강사]
    end

    %% 프론트엔드 레이어
    subgraph "🌐 프론트엔드"
        WEB[React/Next.js<br/>날리자쿠 웹사이트]
        ADMIN[관리자 대시보드]
    end

    %% API 게이트웨이/로드밸런서
    subgraph "🚪 API Gateway"
        LB[Load Balancer<br/>nginx/CloudFlare]
    end

    %% 백엔드 서비스
    subgraph "⚙️ 백엔드 서비스 (AWS EC2)"
        subgraph "🚀 Spring Boot Application"
            API[REST API Server<br/>Port: 8080]
            
            subgraph "📋 Controllers"
                AUTH_CTRL[AuthController<br/>인증/권한]
                EDU_CTRL[EducationInquiryController<br/>교육문의]
                PARTNER_CTRL[PartnerApplicationController<br/>파트너지원]
                TEST_CTRL[TestController<br/>시스템관리]
            end
            
            subgraph "🔧 Services"
                AUTH_SVC[AuthService]
                EDU_SVC[EducationInquiryService]
                PARTNER_SVC[PartnerApplicationService]
                TEST_SVC[TestService]
            end
            
            subgraph "🗃️ Repositories"
                USER_REPO[UserRepository]
                EDU_REPO[EducationInquiryRepository]
                PARTNER_REPO[PartnerApplicationRepository]
            end
        end
    end

    %% 데이터베이스
    subgraph "🗄️ 데이터베이스"
        DB[(MySQL 8.0<br/>AWS RDS)]
        
        subgraph "📊 테이블"
            T1[users<br/>사용자 정보]
            T2[education_inquiries<br/>교육 문의]
            T3[partner_applications<br/>파트너 지원]
        end
    end

    %% 보안 & 인증
    subgraph "🔐 보안"
        BCRYPT[BCrypt<br/>비밀번호 암호화]
        JWT[JWT 토큰<br/>(향후 구현)]
        CORS[CORS 설정]
    end

    %% 배포 & 모니터링
    subgraph "🚀 배포 & 운영"
        DEPLOY[SSH 배포<br/>systemctl]
        LOG[로그 모니터링<br/>journalctl]
        BACKUP[데이터 백업<br/>(향후 구현)]
    end

    %% 연결 관계
    U1 --> WEB
    U2 --> ADMIN
    U3 --> WEB
    
    WEB --> LB
    ADMIN --> LB
    
    LB --> API
    
    API --> AUTH_CTRL
    API --> EDU_CTRL
    API --> PARTNER_CTRL
    API --> TEST_CTRL
    
    AUTH_CTRL --> AUTH_SVC
    EDU_CTRL --> EDU_SVC
    PARTNER_CTRL --> PARTNER_SVC
    TEST_CTRL --> TEST_SVC
    
    AUTH_SVC --> USER_REPO
    EDU_SVC --> EDU_REPO
    PARTNER_SVC --> PARTNER_REPO
    TEST_SVC --> USER_REPO
    
    USER_REPO --> DB
    EDU_REPO --> DB
    PARTNER_REPO --> DB
    
    DB --> T1
    DB --> T2
    DB --> T3
    
    API --> BCRYPT
    API --> CORS
    
    %% 스타일링
    classDef userClass fill:#e1f5fe
    classDef frontendClass fill:#f3e5f5
    classDef backendClass fill:#e8f5e8
    classDef dbClass fill:#fff3e0
    classDef securityClass fill:#ffebee
    classDef deployClass fill:#f1f8e9
    
    class U1,U2,U3 userClass
    class WEB,ADMIN frontendClass
    class API,AUTH_CTRL,EDU_CTRL,PARTNER_CTRL,TEST_CTRL,AUTH_SVC,EDU_SVC,PARTNER_SVC,TEST_SVC,USER_REPO,EDU_REPO,PARTNER_REPO backendClass
    class DB,T1,T2,T3 dbClass
    class BCRYPT,JWT,CORS securityClass
    class DEPLOY,LOG,BACKUP deployClass
```

## 📋 주요 API 엔드포인트

### 🔐 인증 관리
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/check-admin/{username}` - 관리자 권한 확인

### 📚 교육 문의
- `POST /api/education-inquiries` - 교육 문의 등록
- `GET /api/education-inquiries` - 문의 목록 조회 (관리자)

### 👨‍🏫 파트너 지원
- `POST /api/partner-applications` - 파트너 지원서 제출
- `GET /api/partner-applications` - 지원서 목록 조회 (관리자)

### 👥 사용자 관리
- `GET /api/users` - 사용자 목록 조회 (관리자)
- `GET /api/users/count` - 사용자 수 조회

## 🛠️ 기술 스택

### Frontend
- **Framework**: React/Next.js
- **Styling**: CSS/Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.1
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Security**: BCrypt, CORS
- **Build Tool**: Maven

### Infrastructure
- **Server**: AWS EC2 (Ubuntu 22.04)
- **Database**: MySQL (로컬/AWS RDS)
- **Deployment**: SSH + systemctl
- **Domain**: nallijaku.com

## 🔄 데이터 플로우

1. **사용자 요청** → 프론트엔드 → API 서버
2. **API 서버** → 컨트롤러 → 서비스 → 리포지토리
3. **리포지토리** → MySQL 데이터베이스
4. **응답** → 서비스 → 컨트롤러 → 프론트엔드 → 사용자

## 🎯 현재 구현 상태

- ✅ **백엔드 API**: 완전 구현
- ✅ **데이터베이스**: 설계 및 연동 완료
- ✅ **인증 시스템**: 기본 구현 완료
- ✅ **관리자 시스템**: 권한 확인 로직 완성
- 🔄 **프론트엔드**: API 연동 진행 중
- 🔄 **JWT 인증**: 향후 구현 예정
- 🔄 **이메일 알림**: 향후 구현 예정

## 📈 향후 확장 계획

1. **JWT 토큰 기반 인증**
2. **이메일 알림 시스템**
3. **파일 업로드 기능**
4. **실시간 알림 (WebSocket)**
5. **모니터링 & 로깅 시스템**
6. **CI/CD 파이프라인**