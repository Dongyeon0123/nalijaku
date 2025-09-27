# 날리자쿠 현재 운영 아키텍처 (2025.09.14 기준)

## 🏗️ 전체 시스템 아키텍처

```mermaid
graph TB
    %% 사용자 레이어
    subgraph "👥 사용자"
        U1[일반 사용자<br/>교육 문의]
        U2[관리자<br/>admin@nallijaku.com]
        U3[파트너 강사<br/>지원서 제출]
    end

    %% 프론트엔드 레이어
    subgraph "🌐 프론트엔드"
        WEB[React/Next.js<br/>nallijaku.com]
        ADMIN[관리자 대시보드<br/>권한 기반 접근]
    end

    %% 인터넷/DNS
    subgraph "🌍 인터넷"
        DNS[DNS<br/>nallijaku.com<br/>api.nallijaku.com]
    end

    %% AWS EC2 인스턴스
    subgraph "☁️ AWS EC2 (13.209.55.84)"
        subgraph "🔒 nginx (Port 443/80)"
            NGINX[nginx 리버스 프록시<br/>SSL 종료<br/>정적 파일 서빙]
        end
        
        subgraph "⚙️ Spring Boot (Port 8080)"
            APP[날리자쿠 백엔드<br/>Java 17 + Spring Boot 3.2.1]
            
            subgraph "📋 API Controllers"
                AUTH_API[AuthController<br/>/api/auth/*]
                EDU_API[EducationInquiryController<br/>/api/education-inquiries]
                PARTNER_API[PartnerApplicationController<br/>/api/partner-applications]
                USER_API[TestController<br/>/api/users, /api/health]
            end
        end
        
        subgraph "🗄️ MySQL (로컬)"
            DB[(MySQL 8.0<br/>nallijaku_db)]
            T1[users 테이블<br/>현재: admin 1명]
            T2[education_inquiries<br/>테스트 데이터 1건]
            T3[partner_applications<br/>테스트 데이터 1건]
        end
    end

    %% 개발 환경
    subgraph "💻 로컬 개발"
        LOCAL[개발자 PC<br/>localhost:9090]
        LOCAL_DB[(MySQL 로컬<br/>nallijaku_user)]
    end

    %% 배포 프로세스
    subgraph "🚀 배포"
        BUILD[Maven 빌드<br/>JAR 생성]
        SSH[SSH 업로드<br/>nallijaku-key.pem]
        SYSTEMCTL[systemctl<br/>서비스 재시작]
    end

    %% 연결 관계
    U1 --> WEB
    U2 --> ADMIN
    U3 --> WEB
    
    WEB --> DNS
    ADMIN --> DNS
    DNS --> NGINX
    
    NGINX --> APP
    
    APP --> AUTH_API
    APP --> EDU_API
    APP --> PARTNER_API
    APP --> USER_API
    
    APP --> DB
    DB --> T1
    DB --> T2
    DB --> T3
    
    BUILD --> SSH
    SSH --> SYSTEMCTL
    SYSTEMCTL --> APP

    %% 스타일링
    classDef userClass fill:#e1f5fe
    classDef frontendClass fill:#f3e5f5
    classDef infraClass fill:#fff3e0
    classDef backendClass fill:#e8f5e8
    classDef dbClass fill:#ffebee
    classDef deployClass fill:#f1f8e9
    
    class U1,U2,U3 userClass
    class WEB,ADMIN frontendClass
    class DNS,NGINX infraClass
    class APP,AUTH_API,EDU_API,PARTNER_API,USER_API backendClass
    class DB,T1,T2,T3,LOCAL_DB dbClass
    class BUILD,SSH,SYSTEMCTL deployClass
```

## 📊 현재 운영 상태

### 🖥️ **서버 인프라**
- **클라우드**: AWS EC2 (Ubuntu 22.04)
- **IP 주소**: `13.209.55.84`
- **도메인**: `api.nallijaku.com`
- **SSL**: Let's Encrypt 인증서
- **가동 시간**: 연속 운영 중

### 🌐 **웹 서버 (nginx)**
```nginx
# 현재 설정
server_name: api.nallijaku.com
listen: 443 ssl http2, 80 (redirect)
proxy_pass: http://localhost:8080
ssl_certificate: Let's Encrypt
```

**주요 기능:**
- ✅ HTTPS 강제 리다이렉트
- ✅ SSL/TLS 종료
- ✅ 보안 헤더 자동 추가
- ✅ 정적 파일 캐싱 (1년)
- ✅ 업로드 제한 (10MB)

### ⚙️ **애플리케이션 서버**
```yaml
# Spring Boot 설정
port: 8080
profile: local (⚠️ prod로 변경 필요)
context-path: /api
memory: 512MB-1024MB
```

**현재 API 엔드포인트:**
```
✅ GET  /api/health                    # 서버 상태
✅ GET  /api/users                     # 사용자 목록 (관리자)
✅ GET  /api/users/count               # 사용자 수
✅ GET  /api/auth/check-admin/{user}   # 권한 확인
✅ POST /api/education-inquiries       # 교육 문의 등록
✅ GET  /api/education-inquiries       # 교육 문의 목록
✅ POST /api/partner-applications      # 파트너 지원
✅ GET  /api/partner-applications      # 파트너 지원 목록
```

### 🗄️ **데이터베이스**
```sql
-- 현재 MySQL 로컬 인스턴스
Database: nallijaku_db
User: nallijaku_user
Tables: users, education_inquiries, partner_applications

-- 현재 데이터
users: 1명 (admin)
education_inquiries: 1건 (테스트)
partner_applications: 1건 (테스트)
```

## 🔄 **데이터 플로우**

### **1. 사용자 요청 흐름**
```
사용자 → nallijaku.com → nginx (443) → Spring Boot (8080) → MySQL → 응답
```

### **2. API 호출 흐름**
```
프론트엔드 → api.nallijaku.com/users → nginx → /api/users → Controller → Service → Repository → MySQL
```

### **3. 배포 프로세스**
```
로컬 개발 → Maven 빌드 → SSH 업로드 → systemctl restart → 서비스 재시작
```

## 🔐 **보안 구성**

### **nginx 보안**
- ✅ SSL/TLS 1.2, 1.3
- ✅ HSTS 헤더
- ✅ XSS 보호
- ✅ Content-Type 보호
- ✅ Frame 옵션 DENY

### **Spring Boot 보안**
- ✅ BCrypt 비밀번호 암호화
- ✅ CORS 설정
- ✅ 입력 데이터 검증
- 🔄 JWT 인증 (향후 구현)

## 📈 **성능 특성**

### **현재 성능**
- **동시 접속**: Tomcat 기본 설정
- **응답 시간**: nginx 캐싱으로 최적화
- **데이터베이스**: 로컬 MySQL (단일 인스턴스)
- **메모리**: JVM 힙 512MB-1024MB

### **병목 지점**
1. **데이터베이스**: 로컬 MySQL (확장성 제한)
2. **단일 서버**: EC2 인스턴스 1대
3. **세션 관리**: 메모리 기반 (확장 시 문제)

## 🎯 **현재 vs 계획된 아키텍처**

### **현재 (운영 중)**
```
nginx → Spring Boot → MySQL (로컬)
```

### **계획 (AWS RDS 전환)**
```
nginx → Spring Boot → AWS RDS MySQL
```

### **향후 확장 계획**
```
Load Balancer → nginx → Spring Boot (다중) → AWS RDS (Multi-AZ)
                  ↓
               Redis Cache
```

## 🛠️ **운영 관리**

### **서비스 관리**
```bash
# 서비스 상태 확인
sudo systemctl status nallijaku

# 서비스 재시작
sudo systemctl restart nallijaku

# 로그 확인
sudo journalctl -u nallijaku -f
tail -f /var/log/nginx/nallijaku-access.log
```

### **배포 명령어**
```bash
# 로컬에서
./mvnw.cmd clean package -DskipTests
scp -i ~/.ssh/nallijaku-key.pem target/*.jar ubuntu@13.209.55.84:/tmp/

# 서버에서
sudo systemctl stop nallijaku
sudo mv /tmp/*.jar /opt/nallijaku/app.jar
sudo systemctl start nallijaku
```

## 📊 **모니터링 현황**

### **현재 모니터링**
- ✅ nginx 액세스/에러 로그
- ✅ Spring Boot 애플리케이션 로그
- ✅ systemctl 서비스 상태
- ✅ 수동 헬스체크 (`/api/health`)

### **개선 필요 사항**
- 🔄 자동화된 모니터링 (CloudWatch)
- 🔄 알림 시스템
- 🔄 성능 메트릭 수집
- 🔄 로그 중앙화

## 🎉 **현재 아키텍처의 장점**

1. **안정성**: nginx + Spring Boot 조합으로 안정적 운영
2. **보안**: SSL 인증서 + 보안 헤더로 보안 강화
3. **확장성**: nginx 리버스 프록시로 확장 준비
4. **유지보수**: 단순한 구조로 관리 용이
5. **성능**: 정적 파일 캐싱으로 응답 속도 최적화

이 아키텍처는 중소규모 서비스에 적합한 견고하고 확장 가능한 구조입니다! 🚀