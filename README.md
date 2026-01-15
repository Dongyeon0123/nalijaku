# 날리자쿠 (Nallijaku) 프로젝트 문서

## 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [문제 정의 & 목표](#2-문제-정의--목표)
3. [기술 스택](#3-기술-스택)
4. [시스템 아키텍처](#4-시스템-아키텍처)
5. [사용자 흐름](#5-사용자-흐름)
6. [ERD](#6-erd)
7. [API 명세](#7-api-명세)
8. [핵심 기능 설계](#8-핵심-기능-설계)
9. [트러블슈팅](#9-트러블슈팅)
10. [배포/운영](#10-배포운영)
11. [한계 및 개선](#11-한계-및-개선)

---

## 1. 프로젝트 개요

### 프로젝트명
**날리자쿠 (Nallijaku)** – 학교·강사 연결 기반 비교과 교육 운영 SaaS

## 프로젝트 설명
**날리자쿠(Nallijaku)** 는 학교와 전문 강사를 연결하여, 비교과 교육 콘텐츠(드론, AI, 창업, 환경 등)를 커리큘럼 단위로 설계·신청·운영까지 통합 관리할 수 있는 AI 기반 온라인 교육 플랫폼입니다.
학교 및 교육 기관은 맞춤형 비교과 교육 커리큘럼을 효율적으로 구성하고 운영할 수 있으며, 강사는 강사 관리, 학습 자료 관리, 차시별 학습 콘텐츠 관리를 하나의 시스템에서 체계적으로 수행할 수 있습니다.

---
## 문제 정의
현재 비교과 교육 시장은 다음과 같은 구조적 문제를 가지고 있습니다.

1. 교육 콘텐츠, 강사, 일정 정보가 여러 채널에 분산되어 있어 통합 관리가 어렵습니다.
2. 학교별 상황과 요구에 맞는 맞춤형 비교과 커리큘럼을 구성하는 과정이 복잡하고 비효율적입니다.
3. 강사 섭외, 교육 신청, 승인 및 운영 관리가 수작업 중심으로 이루어져 학교 행정 부담이 큽니다.


## 해결 방식
날리자쿠는 비교과 교육 운영 전 과정을 디지털화하여 다음과 같은 방식으로 문제를 해결합니다.

1. **학습 자료, 강사, 수강생, 교육 차시를 하나의 플랫폼에서 통합 관리하는 교육 운영 시스템을 제공**
   비교과 교육에 필요한 모든 요소를 단일 시스템에서 관리하여 운영 복잡도를 최소화합니다.

2. **장바구니 기반 커리큘럼 설계 기능을 통해 기관별 맞춤형 교육 프로그램을 구성하고,
   교육 도입 신청 → 승인/거부 → 운영까지 이어지는 자동화된 프로세스를 구현**
   학교는 원하는 교육을 손쉽게 조합하고, 행정 절차를 효율적으로 처리할 수 있습니다.

## 타겟 사용자

### 1. 학교 및 교육 기관 관리자
* 비교과 교육 프로그램을 기획·신청·운영하는 담당자
* 학교별 맞춤형 커리큘럼 구성 및 교육 운영 관리 주체

### 2. 전문 강사
* 드론, AI, 창업, 환경 등 분야별 교육 콘텐츠를 보유한 강사
* 강의 개설 및 교육 프로그램 운영 담당

### 3. 학생 (간접 사용자)
* 학교를 통해 날리자쿠 기반 비교과 교육 콘텐츠를 수강하는 학습자

### 주요 기능
- **학습자료실**: 카테고리별 학습 콘텐츠 조회 및 필터링
- **강의하기**: 강사 정보 및 강의 소개
- **교실**: 수업 관리 및 학습 진행
- **관리자 페이지**: 강좌, 강사, 사용자, 카테고리 통합 관리
- **교육 도입 신청**: 기관별 맞춤형 교육 커리큘럼 생성

### 개발 기간
2024년 11월 ~ 2026년 1월 (진행 중)

### 팀 구성
- Frontend: 1명
- Backend: 1명
- Design: 1명

---

## 2. 문제 정의 & 목표

### 문제 정의

**2.1 교육 콘텐츠 관리의 어려움**
- 기존 교육 자료가 산재되어 있어 통합 관리 어려움
- 강사별, 카테고리별 콘텐츠 분류 체계 부재
- 차시별 학습 자료 관리 및 배포의 비효율성

**2.2 맞춤형 교육 제공의 한계**
- 학교/기관별 특성에 맞는 커리큘럼 구성 어려움
- 교육 도입 신청 프로세스의 복잡성
- 실시간 교육 현황 파악 불가

**2.3 관리자 운영 부담**
- 수작업으로 진행되는 콘텐츠 등록 및 관리
- 사용자 및 강사 정보 관리의 비효율성
- 통계 및 현황 파악의 어려움

### 목표

**2.1 통합 교육 플랫폼 구축**
- 모든 교육 콘텐츠를 한 곳에서 관리
- 직관적인 UI/UX로 사용자 접근성 향상
- 카테고리 및 서브카테고리 기반 체계적 분류

**2.2 효율적인 관리 시스템**
- 관리자 대시보드를 통한 실시간 현황 파악
- 강좌, 강사, 사용자 통합 관리
- 교육 신청 승인/거부 자동화

**2.3 확장 가능한 아키텍처**
- RESTful API 기반 프론트엔드-백엔드 분리
- 역할 기반 접근 제어 (RBAC)
- 대용량 파일 업로드 지원

**2.4 사용자 경험 최적화**
- 반응형 디자인으로 모바일 지원
- 빠른 페이지 로딩 속도
- 직관적인 네비게이션

---

## 3. 기술 스택

### Frontend
- **Framework**: Next.js 16.0.7 (React 19.0.0)
- **Language**: TypeScript 5
- **Styling**: CSS Modules
- **HTTP Client**: Axios 1.13.2
- **Icons**: React Icons 5.5.0
- **Build Tool**: Turbopack

### Backend
- **Framework**: Spring Boot (Java)
- **Database**: MySQL
- **Authentication**: JWT (Bearer Token)

### Deployment
- **Frontend**: Vercel
- **Backend**: AWS EC2 (api.nallijaku.com)
- **Domain**: nallijaku.com

---

## 4. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │    Tablet    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages & Components                                   │   │
│  │  - 홈페이지 (/)                                       │   │
│  │  - 학습자료실 (/resources)                            │   │
│  │  - 강의하기 (/instructor)                             │   │
│  │  - 교실 (/classroom)                                  │   │
│  │  - 관리자 (/admin)                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  State Management                                     │   │
│  │  - React Hooks (useState, useEffect)                 │   │
│  │  - Local Storage (인증 토큰, 사용자 정보)             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTTP Client (Axios)                                  │   │
│  │  - Interceptors (자동 토큰 추가)                      │   │
│  │  - Base URL: https://api.nallijaku.com               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Spring Boot)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers                                          │   │
│  │  - AuthController                                     │   │
│  │  - ResourceController                                 │   │
│  │  - CategoryController                                 │   │
│  │  - UserController                                     │   │
│  │  - InstructorController                               │   │
│  │  - EducationInquiryController                         │   │
│  │  - PartnerApplicationController                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services                                             │   │
│  │  - Business Logic                                     │   │
│  │  - Data Validation                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security                                             │   │
│  │  - JWT Authentication                                 │   │
│  │  - Role-based Authorization (USER, INSTRUCTOR, ADMIN) │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JPA/Hibernate
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables                                               │   │
│  │  - users (사용자)                                     │   │
│  │  - learning_materials (학습자료)                      │   │
│  │  - lessons (차시)                                     │   │
│  │  - categories (카테고리)                              │   │
│  │  - instructors (강사)                                 │   │
│  │  - education_inquiries (교육 도입 신청)               │   │
│  │  - partner_applications (파트너 모집 신청)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 주요 기능 흐름

#### 1. 인증 흐름
```
User → Login → Backend (JWT 발급) → Frontend (토큰 저장)
     → 이후 모든 요청에 Bearer Token 자동 포함
```

#### 2. 학습자료 조회 흐름
```
User → /resources → GET /api/resources → Backend
     → 카테고리별 필터링 → 카드 형태로 표시
     → 카드 클릭 → /resources/{id} → GET /api/resources/{id}
     → 차시 목록 및 PDF 뷰어 표시
```

#### 3. 관리자 기능 흐름
```
Admin → /admin → 역할 확인 (ADMIN)
      → 강좌 관리 → CRUD 작업 → Backend API
      → 사용자 관리 → 역할 변경 → PUT /api/users/{id}/role
      → 콘텐츠 관리 → 신청 승인/거부 → PUT /api/education-inquiries/{id}/status
```

---

## 5. 사용자 흐름

### 5.1 일반 사용자 흐름

```
[홈페이지 접속]
    ↓
[로그인/회원가입]
    ↓
[메인 대시보드]
    ├─→ [학습자료실]
    │       ↓
    │   [카테고리 선택]
    │       ↓
    │   [서브카테고리 필터링]
    │       ↓
    │   [강좌 카드 클릭]
    │       ↓
    │   [강좌 상세 페이지]
    │       ↓
    │   [차시 선택]
    │       ↓
    │   [PDF 뷰어로 학습]
    │
    ├─→ [강의하기]
    │       ↓
    │   [강사 목록 조회]
    │       ↓
    │   [강사 프로필 클릭]
    │       ↓
    │   [강사 상세 정보]
    │
    └─→ [교실]
            ↓
        [수업 목록 조회]
            ↓
        [수업 상세 페이지]
```

### 5.2 관리자 흐름

```
[관리자 로그인]
    ↓
[관리자 대시보드]
    ├─→ [통계 확인]
    │       ├─ 교육 도입 신청 현황
    │       ├─ 파트너 모집 현황
    │       └─ 사용자 수 통계
    │
    ├─→ [강좌 관리]
    │       ├─ [강좌 추가]
    │       │       ↓
    │       │   [카테고리 선택]
    │       │       ↓
    │       │   [서브카테고리 선택]
    │       │       ↓
    │       │   [강좌 정보 입력]
    │       │       ↓
    │       │   [이미지 업로드]
    │       │       ↓
    │       │   [저장]
    │       │
    │       ├─ [강좌 수정]
    │       │       ↓
    │       │   [차시 관리]
    │       │       ↓
    │       │   [차시 추가/수정/삭제]
    │       │       ↓
    │       │   [PDF 업로드]
    │       │
    │       └─ [강좌 삭제]
    │
    ├─→ [카테고리 관리]
    │       ├─ [메인 카테고리 추가/삭제]
    │       └─ [서브카테고리 추가/삭제]
    │
    ├─→ [사용자 관리]
    │       ├─ [사용자 목록 조회]
    │       ├─ [사용자 정보 확인]
    │       └─ [역할 변경 (USER/INSTRUCTOR/ADMIN)]
    │
    ├─→ [강사 관리]
    │       ├─ [강사 추가]
    │       ├─ [강사 정보 수정]
    │       └─ [강사 삭제]
    │
    └─→ [콘텐츠 관리]
            ├─ [교육 도입 신청]
            │       ├─ 승인
            │       ├─ 거부
            │       └─ 삭제
            │
            └─ [파트너 모집 신청]
                    ├─ 승인
                    ├─ 거부
                    └─ 삭제
```

### 5.3 교육 도입 신청 흐름

```
[기관 담당자]
    ↓
[교육 도입 신청 페이지]
    ↓
[기관 정보 입력]
    ├─ 기관명
    ├─ 담당자 정보
    ├─ 연락처
    └─ 희망 교육 분야
    ↓
[장바구니에 강좌 추가]
    ↓
[맞춤형 커리큘럼 요청]
    ↓
[신청 완료]
    ↓
[관리자 검토]
    ├─→ [승인] → [이메일 발송]
    └─→ [거부] → [사유 안내]
```

---

## 6. ERD

### 6.1 주요 엔티티

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│    │ email           │ VARCHAR(255) UNIQUE NOT NULL          │
│    │ password        │ VARCHAR(255) NOT NULL                 │
│    │ name            │ VARCHAR(100) NOT NULL                 │
│    │ role            │ ENUM('USER','INSTRUCTOR','ADMIN')     │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
│    │ updated_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LearningMaterials                         │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│ FK │ category_id     │ BIGINT                                │
│ FK │ sub_category_id │ BIGINT (nullable)                     │
│    │ title           │ VARCHAR(255) NOT NULL                 │
│    │ subtitle        │ TEXT                                  │
│    │ description     │ TEXT                                  │
│    │ image           │ VARCHAR(500)                          │
│    │ alt             │ VARCHAR(255)                          │
│    │ instructor      │ VARCHAR(100) NOT NULL                 │
│    │ price           │ INT DEFAULT 0                         │
│    │ duration        │ VARCHAR(50)                           │
│    │ level           │ VARCHAR(50)                           │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
│    │ updated_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Lessons                              │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│ FK │ material_id     │ BIGINT NOT NULL                       │
│    │ order           │ INT NOT NULL                          │
│    │ title           │ VARCHAR(255) NOT NULL                 │
│    │ materials       │ VARCHAR(255) (deprecated)             │
│    │ description     │ TEXT NOT NULL                         │
│    │ type            │ VARCHAR(50) DEFAULT '이론'            │
│    │                 │ ('이론','실습','게임','토론','수료증') │
│    │ pdf_url         │ VARCHAR(500)                          │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Categories                             │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│    │ name            │ VARCHAR(100) UNIQUE NOT NULL          │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SubCategories                            │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│ FK │ parent_id       │ BIGINT NOT NULL                       │
│    │ name            │ VARCHAR(100) NOT NULL                 │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Instructors                             │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│    │ name            │ VARCHAR(100) NOT NULL                 │
│    │ bio             │ TEXT                                  │
│    │ image           │ VARCHAR(500)                          │
│    │ expertise       │ TEXT                                  │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
│    │ updated_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EducationInquiries                          │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│    │ organization    │ VARCHAR(255) NOT NULL                 │
│    │ contact_name    │ VARCHAR(100) NOT NULL                 │
│    │ contact_email   │ VARCHAR(255) NOT NULL                 │
│    │ contact_phone   │ VARCHAR(50)                           │
│    │ field           │ VARCHAR(100)                          │
│    │ status          │ ENUM('PENDING','APPROVED','REJECTED') │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 PartnerApplications                          │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BIGINT                                │
│    │ company_name    │ VARCHAR(255) NOT NULL                 │
│    │ contact_name    │ VARCHAR(100) NOT NULL                 │
│    │ contact_email   │ VARCHAR(255) NOT NULL                 │
│    │ contact_phone   │ VARCHAR(50)                           │
│    │ business_type   │ VARCHAR(100)                          │
│    │ status          │ ENUM('PENDING','APPROVED','REJECTED') │
│    │ created_at      │ TIMESTAMP DEFAULT CURRENT_TIMESTAMP   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 관계 설명

**1. Users ↔ LearningMaterials**
- 관계: 1:N (한 사용자가 여러 학습자료 생성 가능)
- 외래키: `created_by` (현재 미구현, 향후 추가 예정)

**2. Categories ↔ SubCategories**
- 관계: 1:N (한 카테고리가 여러 서브카테고리 보유)
- 외래키: `parent_id`
- 계층형 구조 지원

**3. LearningMaterials ↔ Categories/SubCategories**
- 관계: N:1 (여러 학습자료가 하나의 카테고리에 속함)
- 외래키: `category_id`, `sub_category_id`
- `sub_category_id`는 nullable (서브카테고리 선택 안 할 수 있음)

**4. LearningMaterials ↔ Lessons**
- 관계: 1:N (한 학습자료가 여러 차시 보유)
- 외래키: `material_id`
- `order` 필드로 차시 순서 관리

---

## 7. API 명세

### 인증 (Authentication)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/auth/login` | POST | `{ email, password }` | `{ accessToken, user }` | 200, 401 | ❌ |
| `/api/auth/register` | POST | `{ email, password, name }` | `{ success, message }` | 201, 400 | ❌ |

### 학습자료 (Learning Materials)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/resources` | GET | - | `{ success, data: Material[] }` | 200 | ✅ |
| `/api/resources/{id}` | GET | - | `{ success, data: Material }` | 200, 404 | ✅ |
| `/api/resources` | POST | `FormData (multipart)` | `{ success, data: Material }` | 201, 400 | ✅ (ADMIN) |
| `/api/resources/{id}` | PUT | `{ category, title, ... }` | `{ success, data: Material }` | 200, 404 | ✅ (ADMIN) |
| `/api/resources/{id}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/resources/upload-image` | POST | `FormData (file)` | `{ filePath }` | 200, 400 | ✅ (ADMIN) |

### 차시 (Lessons)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/resources/{id}/lessons` | POST | `FormData (order, title, materials, description, type, pdfFile)` | `{ success, data: Lesson }` | 201, 400 | ✅ (ADMIN) |
| `/api/resources/{id}/lessons/{order}` | PUT | `FormData (title, materials, description, type, pdfFile)` | `{ success, data: Lesson }` | 200, 404 | ✅ (ADMIN) |
| `/api/resources/{id}/lessons/{order}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |

### 카테고리 (Categories)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/categories` | GET | - | `{ success, data: { categories: Category[] } }` | 200 | ✅ |
| `/api/categories/subcategories` | GET | - | `{ success, data: SubCategory[] }` | 200 | ✅ |
| `/api/admin/categories` | POST | `{ name }` | `{ success, data: Category }` | 201, 400 | ✅ (ADMIN) |
| `/api/admin/categories/{name}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/admin/categories/subcategories` | POST | `{ name, parentId }` | `{ success, data: SubCategory }` | 201, 400 | ✅ (ADMIN) |
| `/api/admin/categories/{parentName}/subcategories/{subName}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |

### 사용자 (Users)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/users` | GET | - | `{ success, data: User[] }` | 200 | ✅ (ADMIN) |
| `/api/users/count` | GET | - | `{ success, count: number }` | 200 | ✅ (ADMIN) |
| `/api/users/{id}/role` | PUT | `{ role }` | `{ success, data: User }` | 200, 404 | ✅ (ADMIN) |

### 강사 (Instructors)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/instructors` | GET | - | `{ success, data: Instructor[] }` | 200 | ✅ |
| `/api/instructors/{id}` | GET | - | `{ success, data: Instructor }` | 200, 404 | ✅ |
| `/api/instructors` | POST | `FormData (name, bio, image, ...)` | `{ success, data: Instructor }` | 201, 400 | ✅ (ADMIN) |
| `/api/instructors/{id}` | PUT | `FormData (name, bio, image, ...)` | `{ success, data: Instructor }` | 200, 404 | ✅ (ADMIN) |
| `/api/instructors/{id}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |

### 교육 도입 신청 (Education Inquiries)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/education-inquiries` | GET | - | `{ success, data: Inquiry[] }` | 200 | ✅ (ADMIN) |
| `/api/education-inquiries/{id}/approve` | PUT | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/education-inquiries/{id}/reject` | PUT | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/education-inquiries/{id}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |

### 파트너 모집 신청 (Partner Applications)
| Endpoint | Method | Request | Response | Status Code | 인증 필요 |
|----------|--------|---------|----------|-------------|-----------|
| `/api/partner-applications` | GET | - | `{ success, data: Application[] }` | 200 | ✅ (ADMIN) |
| `/api/partner-applications/{id}/approve` | PUT | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/partner-applications/{id}/reject` | PUT | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |
| `/api/partner-applications/{id}` | DELETE | - | `{ success, message }` | 200, 404 | ✅ (ADMIN) |

---

## 데이터 모델

### User
```typescript
{
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: string;
}
```

### Material (Learning Material)
```typescript
{
  id: number;
  category: string;
  subCategory?: string;
  image: string;
  alt: string;
  instructor: string;
  title: string;
  subtitle: string;
  description: string;
  price?: number;
  duration?: string;
  level?: string;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}
```

### Lesson
```typescript
{
  id: number;
  order: number;
  title: string;
  materials: string;
  description: string;
  pdfUrl?: string;
  type: '이론' | '실습' | '게임' | '토론' | '수료증';
}
```

### Category
```typescript
{
  id: number;
  name: string;
  subCategories?: SubCategory[];
}
```

### SubCategory
```typescript
{
  id: number;
  name: string;
  parentId: number;
  parentName?: string;
}
```

### Instructor
```typescript
{
  id: number;
  name: string;
  bio: string;
  image: string;
  expertise?: string[];
  createdAt: string;
}
```

---

## 인증 및 권한

### 인증 방식
- JWT (JSON Web Token) 기반 인증
- Bearer Token을 Authorization 헤더에 포함
- 토큰은 localStorage에 저장 (`accessToken`)

### 권한 레벨
1. **USER**: 일반 사용자
   - 학습자료 조회
   - 강사 정보 조회
   
2. **INSTRUCTOR**: 강사
   - USER 권한 + 강의 관련 기능

3. **ADMIN**: 관리자
   - 모든 권한
   - 사용자 관리
   - 콘텐츠 관리 (강좌, 강사, 카테고리)
   - 신청 관리 (교육 도입, 파트너 모집)

### Axios Interceptor
```typescript
// 모든 요청에 자동으로 토큰 추가
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 환경 변수

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.nallijaku.com
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/nallijaku?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

---

## 배포 정보

### Frontend
- **플랫폼**: Vercel
- **도메인**: nallijaku.com
- **빌드 명령어**: `npm run build`
- **시작 명령어**: `npm start`

### Backend
- **플랫폼**: AWS EC2
- **도메인**: api.nallijaku.com
- **포트**: 443 (HTTPS)

---

## 개발 가이드

### Frontend 개발 서버 실행
```bash
cd nalijaku-1
npm install
npm run dev
```

### 코드 구조
```
nalijaku-1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # 관리자 페이지
│   │   ├── resources/         # 학습자료실
│   │   ├── instructor/        # 강의하기
│   │   ├── classroom/         # 교실
│   │   └── layout.tsx         # 루트 레이아웃
│   ├── components/            # 재사용 컴포넌트
│   │   └── Header.tsx
│   ├── lib/                   # 유틸리티
│   │   └── axios.ts          # Axios 설정
│   └── utils/                 # 헬퍼 함수
│       └── auth.ts           # 인증 관련
├── public/                    # 정적 파일
└── package.json
```

---

## 주요 기능

### 1. 학습자료 관리
- 카테고리별 학습자료 조회
- 서브카테고리 필터링
- 차시별 PDF 뷰어
- 장바구니 기능

### 2. 관리자 기능
- 강좌 CRUD
- 차시 관리 (PDF 업로드 포함)
- 카테고리 관리 (계층형 구조)
- 사용자 역할 변경
- 신청 승인/거부

### 3. 강사 관리
- 강사 프로필 조회
- 강사별 상세 페이지

### 4. 통계 대시보드
- 교육 도입 신청 통계
- 파트너 모집 신청 통계
- 사용자 수 통계

---

## 보안 고려사항

1. **XSS 방지**: React의 기본 이스케이핑 사용
2. **CSRF 방지**: JWT 토큰 사용으로 CSRF 공격 방지
3. **인증 토큰 관리**: localStorage에 저장 (HttpOnly 쿠키 권장)
4. **HTTPS**: 모든 통신은 HTTPS로 암호화
5. **역할 기반 접근 제어**: 백엔드에서 권한 검증

---

## 9. 트러블슈팅

### 9.1 서브카테고리 삭제 후 화면 미반영

**문제:**
```
관리자 페이지에서 서브카테고리 삭제 시 백엔드에서는 삭제 성공하지만,
프론트엔드 화면에 반영되지 않는 문제
```

**원인:**
```typescript
// 로컬 상태만 업데이트하고 서버 데이터 재조회 안 함
const response = await api.delete(deleteUrl);
console.log('서브카테고리 삭제 성공:', response.data);
// loadCourses() 호출이 제대로 실행되지 않음
```

**해결:**
```typescript
await api.delete(deleteUrl);
console.log('서브카테고리 삭제 성공');

// 전체 카테고리 데이터 재로드
await loadCourses();
console.log('카테고리 목록 다시 로드 완료');

alert('서브카테고리가 삭제되었습니다.');
```

**교훈:**
- 삭제/수정 작업 후 반드시 서버 데이터 재조회
- 낙관적 업데이트 사용 시 실패 케이스 고려 필요

---

### 9.2 강좌 추가 시 categoryId 누락 에러

**문제:**
```
POST /api/resources 호출 시
"Required request parameter 'categoryId' for method parameter type Long is not present"
```

**원인:**
```typescript
// 백엔드가 categoryId를 요구하지만 프론트엔드는 이름만 전송
multipartFormData.append('category', formData.category); // ❌ 이름 전송
```

**해결:**
```typescript
// 카테고리 이름 -> ID 매핑 사용
const categoryId = categoryMap[formData.category];
if (!categoryId) {
  alert('카테고리를 선택해주세요.');
  return;
}

multipartFormData.append('categoryId', String(categoryId)); // ✅ ID 전송
```

**교훈:**
- 백엔드 API 스펙 정확히 확인
- 프론트엔드-백엔드 간 데이터 형식 사전 협의 필요

---

### 9.3 차시 필드명 변경 (materials → title)

**문제:**
```
프론트엔드에서 'title' 필드로 전송했지만
백엔드가 'materials' 필드를 요구하여 에러 발생
```

**임시 해결:**
```typescript
// 백엔드 호환성을 위해 두 필드 모두 전송
formData.append('title', lessonFormData.title);
formData.append('materials', lessonFormData.title); // 백엔드 호환
```

**장기 해결:**
```
백엔드 API 수정 요청:
- 필드명을 'materials' → 'title'로 변경
- 또는 두 필드 모두 허용하도록 수정
```

**교훈:**
- API 변경 시 프론트엔드-백엔드 동시 배포 필요
- 하위 호환성 고려한 점진적 마이그레이션

---

### 9.4 대용량 PDF 업로드 타임아웃

**문제:**
```
100MB 이상 PDF 파일 업로드 시 30초 타임아웃 발생
```

**해결:**
```typescript
// 1. 타임아웃 연장
xhr.timeout = 5 * 60 * 1000; // 5분

// 2. 파일 크기 사전 검증
if (lessonPdfFile.size > 100 * 1024 * 1024) {
  alert(`파일 크기가 100MB를 초과합니다.`);
  return;
}

// 3. 진행률 표시로 사용자 대기 유도
xhr.upload.addEventListener('progress', (e) => {
  const percentComplete = (e.loaded / e.total) * 100;
  setUploadProgress(Math.round(percentComplete));
});
```

**추가 개선:**
- 청크 업로드 구현 (파일을 여러 조각으로 나눠 전송)
- 백엔드에서 멀티파트 업로드 지원
- CDN 직접 업로드 (Presigned URL 사용)

---

### 9.5 CORS 에러

**문제:**
```
Access to XMLHttpRequest at 'https://api.nallijaku.com/api/resources'
from origin 'https://nallijaku.com' has been blocked by CORS policy
```

**원인:**
```
백엔드에서 Access-Control-Allow-Origin 헤더 미설정
```

**해결 (백엔드):**
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://nallijaku.com", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

**교훈:**
- 개발 환경과 프로덕션 환경의 CORS 설정 분리
- Preflight 요청 (OPTIONS) 처리 필요

---

### 9.6 토큰 만료 후 무한 리다이렉트

**문제:**
```
Access Token 만료 시 로그인 페이지로 리다이렉트되지만
다시 원래 페이지로 돌아가는 무한 루프 발생
```

**원인:**
```typescript
// 401 에러 시 무조건 로그아웃 처리
if (error.response?.status === 401) {
  logout();
  window.location.href = '/'; // 무한 루프 발생
}
```

**해결:**
```typescript
// _retry 플래그로 재시도 제한
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  
  try {
    // Refresh Token으로 갱신 시도
    const response = await axios.post('/api/auth/refresh', { refreshToken });
    // 성공 시 원래 요청 재시도
    return api(originalRequest);
  } catch (refreshError) {
    // Refresh Token도 만료된 경우에만 로그아웃
    logout();
    window.location.href = '/';
  }
}
```

**교훈:**
- 재시도 로직에 반드시 플래그 사용
- Refresh Token 갱신 실패 시에만 로그아웃

---

### 9.7 이미지 로드 실패

**문제:**
```
백엔드에서 반환한 이미지 경로가 상대 경로여서 로드 실패
예: "/학습자료/진로-배송.png"
```

**해결:**
```typescript
<img
  src={material.image.startsWith('http') 
    ? material.image 
    : `https://api.nallijaku.com${material.image}`}
  alt={material.alt}
  onError={(e) => {
    console.error('이미지 로드 실패:', material.image);
    (e.target as HTMLImageElement).src = '/placeholder.png';
  }}
/>
```

**개선:**
- 백엔드에서 절대 URL 반환하도록 수정
- CDN 사용으로 이미지 로딩 속도 개선

---

### 9.8 서브카테고리 저장 안 됨 (PUT 요청)

**문제:**
```
강좌 수정 시 서브카테고리를 설정하고 저장하면
"저장되었습니다" 메시지가 나오지만 실제로는 저장 안 됨
```

**원인 분석:**
```
1. 프론트엔드: subCategory: "배송" 전송 ✅
2. 백엔드: 200 OK 응답 ✅
3. 백엔드 응답: subCategory: null ❌
```

**결론:**
```
백엔드에서 subCategory 값을 받아서 DB에 저장하지 않는 문제
프론트엔드는 정상 작동 중
```

**백엔드 수정 요청:**
```java
// LearningMaterial Entity
@Column(name = "sub_category")
private String subCategory; // 필드 추가

// Controller
public ResponseEntity<?> updateMaterial(
    @PathVariable Long id,
    @RequestBody MaterialUpdateRequest request
) {
    material.setSubCategory(request.getSubCategory()); // 저장 로직 추가
    // ...
}
```

---

## 10. 배포/운영

### 10.1 배포 환경

**Frontend (Vercel)**
- **플랫폼**: Vercel
- **도메인**: nallijaku.com
- **빌드 명령어**: `npm run build`
- **출력 디렉토리**: `.next`
- **Node.js 버전**: 20.x
- **환경 변수**:
  ```
  NEXT_PUBLIC_API_URL=https://api.nallijaku.com
  ```

**Backend (AWS EC2)**
- **플랫폼**: AWS EC2
- **인스턴스 타입**: t3.medium (추정)
- **OS**: Ubuntu 22.04 LTS
- **도메인**: api.nallijaku.com
- **포트**: 8080 (내부), 443 (외부 HTTPS)
- **웹 서버**: Nginx (리버스 프록시)
- **애플리케이션**: Spring Boot JAR

**Database**
- **플랫폼**: AWS RDS (추정) 또는 EC2 내부
- **DBMS**: MySQL
- **백업**: 자동 백업 설정 (일 1회)

---

### 10.2 CI/CD 파이프라인

**Frontend (Vercel 자동 배포)**
```
GitHub Push
    ↓
Vercel Webhook 트리거
    ↓
자동 빌드 (npm run build)
    ↓
프리뷰 배포 (PR)
    ↓
프로덕션 배포 (main 브랜치)
    ↓
CDN 캐시 무효화
```

**Backend (수동 배포)**
```
로컬 개발
    ↓
Git Push to main
    ↓
SSH 접속 to EC2
    ↓
git pull origin main
    ↓
./gradlew build
    ↓
sudo systemctl restart nallijaku
    ↓
로그 확인 (journalctl -u nallijaku -f)
```

**개선 필요:**
- GitHub Actions를 통한 자동 배포
- Docker 컨테이너화
- Blue-Green 배포 전략

---

### 10.3 모니터링

**현재 상태:**
- 수동 로그 확인
- 서버 상태 체크 (ping, curl)

**도입 필요:**

**1. 애플리케이션 모니터링**
```
- Sentry (에러 트래킹)
- Google Analytics (사용자 행동 분석)
- Vercel Analytics (프론트엔드 성능)
```

**2. 서버 모니터링**
```
- AWS CloudWatch (EC2 메트릭)
- Prometheus + Grafana (커스텀 메트릭)
- Uptime Robot (서비스 가용성)
```

**3. 로그 관리**
```
- ELK Stack (Elasticsearch, Logstash, Kibana)
- CloudWatch Logs
```

---

### 10.4 백업 전략

**데이터베이스 백업**
```bash
# 일일 자동 백업 (cron)
0 2 * * * mysqldump -u $DB_USERNAME -p nallijaku > /backup/db_$(date +\%Y\%m\%d).sql

# 주간 백업 S3 업로드
0 3 * * 0 aws s3 cp /backup/ s3://nallijaku-backup/ --recursive
```

**파일 백업 (이미지, PDF)**
```bash
# S3 동기화
aws s3 sync /var/www/uploads s3://nallijaku-files/
```

**코드 백업**
```
- GitHub Repository (자동)
- 주요 릴리스 태그 생성
```

---

### 10.5 보안 설정

**SSL/TLS 인증서**
```
- Let's Encrypt (무료 SSL)
- 자동 갱신 설정 (certbot)
```

**방화벽 설정**
```bash
# UFW (Ubuntu Firewall)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

**환경 변수 관리**
```bash
# .env 파일 (절대 Git에 커밋 안 함)
DB_PASSWORD=***
JWT_SECRET=***
AWS_ACCESS_KEY=***
```

**정기 보안 업데이트**
```bash
# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 의존성 취약점 검사
npm audit fix
```

---

### 10.6 성능 최적화

**Frontend**
```
- Next.js Image 최적화
- 코드 스플리팅
- CDN 사용 (Vercel Edge Network)
- Gzip 압축
```

**Backend**
```
- 데이터베이스 인덱스 최적화
- 쿼리 최적화 (N+1 문제 해결)
- Redis 캐싱 (향후 도입)
- Connection Pool 설정
```

**Database**
```sql
-- 인덱스 생성
CREATE INDEX idx_materials_category ON learning_materials(category_id);
CREATE INDEX idx_lessons_material ON lessons(material_id);
CREATE INDEX idx_users_email ON users(email);
```

---

### 10.7 장애 대응

**장애 발생 시 프로세스**
```
1. 알림 수신 (이메일, Slack)
2. 로그 확인
3. 원인 파악
4. 긴급 패치 또는 롤백
5. 사후 분석 (Post-mortem)
```

**롤백 절차**
```bash
# Frontend (Vercel)
- Vercel 대시보드에서 이전 배포로 롤백

# Backend
git checkout <previous-commit>
./gradlew build
sudo systemctl restart nallijaku
```

---

## 11. 한계 및 개선

### 11.1 현재 한계점

**1. 인증/보안**
- localStorage에 토큰 저장 (XSS 취약)
- Refresh Token 미구현 (일부 구현되었으나 완전하지 않음)
- CSRF 토큰 미사용
- Rate Limiting 미구현

**2. 성능**
- 이미지 최적화 부족 (Next.js Image 미사용)
- 대량 데이터 로딩 시 성능 저하
- 캐싱 전략 부재
- 가상 스크롤링 미구현

**3. 사용자 경험**
- 오프라인 지원 없음
- 로딩 상태 일관성 부족
- 에러 메시지 개선 필요
- 모바일 최적화 부족

**4. 코드 품질**
- 테스트 코드 부재
- 타입 안정성 개선 필요
- 컴포넌트 재사용성 낮음
- 전역 상태 관리 부재

**5. 운영**
- 자동 배포 파이프라인 부재
- 모니터링 시스템 미구현
- 로그 관리 체계 부족
- 장애 대응 매뉴얼 부재

---

### 11.2 향후 개선 사항
**1. 성능 최적화**
   - 이미지 최적화 (Next.js Image 컴포넌트 활용)
   - 코드 스플리팅
   - 캐싱 전략 (React Query, SWR)
   - 가상 스크롤링 (react-window)
   - CDN 도입

**2. 보안 강화**
   - HttpOnly 쿠키로 토큰 저장
   - Refresh Token 완전 구현
   - CSRF 토큰 추가
   - Rate Limiting (클라이언트/서버)
   - 입력 값 Sanitization

**3. 사용자 경험**
   - PWA 구현 (오프라인 지원)
   - 로딩 상태 개선 (Skeleton UI)
   - 에러 처리 강화 (Error Boundary)
   - 다국어 지원 (i18n)
   - 접근성 개선 (ARIA, 키보드 네비게이션)

**4. 테스트**
   - 단위 테스트 (Jest, React Testing Library)
   - E2E 테스트 (Playwright, Cypress)
   - API 테스트 자동화
   - 성능 테스트 (Lighthouse CI)

**5. 아키텍처**
   - 마이크로서비스 전환 검토
   - GraphQL 도입 검토
   - WebSocket 실시간 통신
   - 이벤트 기반 아키텍처

**6. 운영**
   - CI/CD 파이프라인 구축
   - Docker 컨테이너화
   - Kubernetes 오케스트레이션
   - 모니터링 시스템 (Sentry, Datadog)
   - 로그 관리 (ELK Stack)

**7. 기능 확장**
   - 실시간 채팅 (강사-학생)
   - 화상 강의 통합
   - 학습 진도 추적
   - 퀴즈/시험 기능
   - 수료증 자동 발급
   - 결제 시스템 통합

---

## 프로젝트 회고

### 잘한 점
- RESTful API 설계로 프론트엔드-백엔드 명확한 분리
- Axios Interceptor를 통한 토큰 자동 갱신 구현
- 계층형 카테고리 시스템으로 확장성 확보
- 대용량 파일 업로드 진행률 표시로 UX 개선

### 아쉬운 점
- 초기 설계 단계에서 ERD 및 API 명세 부족
- 테스트 코드 작성 미루다가 결국 작성 안 함
- 전역 상태 관리 라이브러리 미도입으로 prop drilling 발생
- 모바일 최적화 후순위로 밀림

### 배운 점
- 프론트엔드-백엔드 간 명확한 API 스펙 협의 중요성
- 에러 처리 및 로깅의 중요성
- 사용자 피드백의 가치 (진행률 표시, 로딩 상태 등)
- 점진적 개선의 중요성 (완벽보다는 동작하는 코드 우선)

---

## 8. 핵심 기능 설계

### 1. 인증/인가 구조

#### 문제점
- JWT 토큰 만료 시 사용자 경험 저하
- 페이지 새로고침 시 인증 상태 유지
- 역할 기반 접근 제어 구현

#### 해결 방안

**1.1 자동 토큰 갱신 (Axios Interceptor)**

```typescript
// src/lib/axios.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 발생 시 자동으로 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        // Refresh Token으로 새 Access Token 발급
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data.data;
        
        // 새 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        
        // 실패한 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃
        logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**핵심 포인트:**
- `_retry` 플래그로 무한 루프 방지
- Refresh Token 실패 시 자동 로그아웃
- 원본 요청을 새 토큰으로 재시도

**1.2 클라이언트 사이드 인증 상태 관리**

```typescript
// src/utils/auth.ts
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN';
};

// 페이지 컴포넌트에서 사용
useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) {
    alert('로그인이 필요한 페이지입니다.');
    window.location.href = '/';
  }
}, []);
```

**문제점과 개선:**
- **문제**: localStorage는 XSS 공격에 취약
- **개선 방안**: HttpOnly 쿠키 사용 권장 (백엔드 수정 필요)

**1.3 역할 기반 라우트 보호**

```typescript
// 관리자 페이지 접근 제어
useEffect(() => {
  const user = getUser();
  if (user?.role !== 'ADMIN') {
    alert('관리자만 접근할 수 있습니다.');
    window.location.href = '/';
  }
}, []);
```

**개선 사항:**
- Next.js Middleware를 사용한 서버 사이드 라우트 보호
- HOC(Higher-Order Component)로 재사용 가능한 인증 로직 구현

---

### 2. 대용량 파일 업로드 (PDF, 이미지)

#### 문제점
- 100MB 이상의 PDF 파일 업로드 시 타임아웃
- 업로드 진행률 표시 필요
- 네트워크 오류 시 재시도 로직

#### 해결 방안

**2.1 XMLHttpRequest를 사용한 진행률 추적**

```typescript
// src/app/admin/courses/page.tsx - handleSaveLesson
const xhr = new XMLHttpRequest();

// 업로드 진행률 이벤트
xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percentComplete = (e.loaded / e.total) * 100;
    setUploadProgress(Math.round(percentComplete));
  }
});

// 타임아웃 설정 (5분)
xhr.timeout = 5 * 60 * 1000;

xhr.addEventListener('timeout', () => {
  alert('업로드 시간이 초과되었습니다. 파일 크기를 확인해주세요.');
  setIsUploading(false);
});

// FormData로 파일 전송
const formData = new FormData();
formData.append('pdfFile', lessonPdfFile);
formData.append('order', lessonFormData.order.toString());
formData.append('title', lessonFormData.title);

xhr.open('POST', `/api/resources/${courseId}/lessons`);
xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
xhr.send(formData);
```

**핵심 포인트:**
- Axios 대신 XMLHttpRequest 사용 (진행률 추적 가능)
- 5분 타임아웃 설정으로 대용량 파일 지원
- 파일 크기 사전 검증 (100MB 제한)

**2.2 파일 크기 검증**

```typescript
if (lessonPdfFile && lessonPdfFile.size > 100 * 1024 * 1024) {
  const sizeMB = (lessonPdfFile.size / (1024 * 1024)).toFixed(2);
  alert(`PDF 파일 크기가 100MB를 초과합니다. (현재: ${sizeMB}MB)`);
  return;
}
```

**2.3 UI 피드백**

```typescript
// 업로드 진행률 바
<div style={{ width: '100%', height: '24px', backgroundColor: '#e0e0e0' }}>
  <div style={{
    width: `${uploadProgress}%`,
    height: '100%',
    backgroundColor: '#04AD74',
    transition: 'width 0.3s ease'
  }}>
    {uploadProgress > 10 && `${uploadProgress}%`}
  </div>
</div>
```

**개선 사항:**
- 청크 업로드 구현 (파일을 여러 조각으로 나눠 전송)
- 업로드 실패 시 자동 재시도
- 백그라운드 업로드 지원

---

### 3. 계층형 카테고리 시스템

#### 문제점
- 메인 카테고리와 서브카테고리의 관계 관리
- 카테고리 ID와 이름 매핑
- 동적 필터링 구현

#### 해결 방안

**3.1 카테고리 데이터 구조 변환**

```typescript
// API 응답 (계층형 구조)
{
  categories: [
    {
      id: 1,
      name: "드론",
      subCategories: [
        { id: 10, name: "기초" },
        { id: 11, name: "배송" }
      ]
    }
  ]
}

// 프론트엔드 변환
const categoryMap: { [name: string]: number } = {};
const subCategoryMap: { [key: string]: string[] } = {};

categoryData.forEach((cat) => {
  // 이름 -> ID 매핑
  categoryMap[cat.name] = cat.id;
  
  // 서브카테고리 맵 생성
  if (cat.subCategories && cat.subCategories.length > 0) {
    subCategoryMap[cat.name] = cat.subCategories.map(sub => sub.name);
  }
});
```

**3.2 동적 서브카테고리 필터**

```typescript
// 메인 카테고리 선택 시 서브카테고리 표시
{selectedCategory !== '전체' && subCategories[selectedCategory] && (
  <div>
    <button onClick={() => setSelectedSubCategory(null)}>전체</button>
    {subCategories[selectedCategory].map((sub) => (
      <button
        key={sub}
        onClick={() => setSelectedSubCategory(sub)}
        style={{
          border: selectedSubCategory === sub ? '2px solid #04AD74' : '1px solid #ddd'
        }}
      >
        {sub}
      </button>
    ))}
  </div>
)}
```

**3.3 카테고리 추가 시 ID 전송**

```typescript
// 문제: 백엔드가 categoryId를 요구하지만 프론트엔드는 이름만 가지고 있음
// 해결: 이름 -> ID 매핑 사용

const categoryId = categoryMap[formData.category];
if (!categoryId) {
  alert('카테고리를 선택해주세요.');
  return;
}

multipartFormData.append('categoryId', String(categoryId));
```

**핵심 포인트:**
- 백엔드는 ID로 관계 관리, 프론트엔드는 이름으로 표시
- 매핑 객체를 통한 변환 레이어 구현
- 카테고리 변경 시 서브카테고리 초기화

---

### 4. 상태 관리 전략

#### 문제점
- 여러 컴포넌트 간 데이터 공유
- API 호출 최적화
- 낙관적 업데이트 vs 비관적 업데이트

#### 해결 방안

**4.1 로컬 상태 관리 (useState)**

```typescript
// 관리자 페이지 - 강좌 관리
const [courses, setCourses] = useState<Course[]>([]);
const [categories, setCategories] = useState<string[]>([]);
const [subCategories, setSubCategories] = useState<{ [key: string]: string[] }>({});
const [categoryMap, setCategoryMap] = useState<{ [name: string]: number }>({});
```

**문제점:**
- 페이지 이동 시 상태 초기화
- 중복 API 호출 발생

**개선 방안:**
- React Query 또는 SWR 도입으로 캐싱 및 자동 재검증
- Context API로 전역 상태 관리

**4.2 낙관적 업데이트 구현**

```typescript
// 서브카테고리 추가 시
const newSubCategories = { ...subCategories };
if (!newSubCategories[categoryFormData.parentCategory]) {
  newSubCategories[categoryFormData.parentCategory] = [];
}
newSubCategories[categoryFormData.parentCategory].push(categoryFormData.name);
setSubCategories(newSubCategories); // 즉시 UI 업데이트

// API 호출
await api.post('/api/admin/categories/subcategories', {
  name: categoryFormData.name,
  parentId: parentId
});

// 실패 시 롤백 (에러 처리에서)
```

**4.3 데이터 동기화 문제**

```typescript
// 문제: 서브카테고리 삭제 후 화면에 반영 안 됨
// 원인: 로컬 상태만 업데이트하고 서버 데이터 재조회 안 함

// 해결: 삭제 후 전체 데이터 재로드
await api.delete(`/api/admin/categories/${category}/subcategories/${sub}`);
await loadCourses(); // 카테고리 목록 다시 로드
```

**핵심 포인트:**
- 낙관적 업데이트로 빠른 UI 반응
- 실패 시 롤백 로직 필수
- 중요한 작업은 서버 응답 후 재조회

---

### 5. PDF 뷰어 구현

#### 문제점
- 브라우저별 PDF 렌더링 차이
- CORS 문제
- 대용량 PDF 로딩 성능

#### 해결 방안

**5.1 Google Docs Viewer 사용**

```typescript
const fullPdfUrl = `https://api.nallijaku.com${selectedLessonData.pdfUrl}`;
const pdfViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;

<iframe
  src={pdfViewerUrl}
  style={{ width: '100%', height: '600px', border: 'none' }}
  title="PDF Viewer"
/>
```

**장점:**
- 브라우저 호환성 문제 해결
- 별도 라이브러리 불필요
- 모바일 지원

**단점:**
- 외부 서비스 의존
- 오프라인 지원 불가
- 커스터마이징 제한

**대안:**
- react-pdf 라이브러리 사용
- PDF.js 직접 통합
- 서버 사이드 PDF 렌더링

---

### 6. 실시간 데이터 동기화

#### 문제점
- 관리자가 데이터 수정 시 다른 사용자 화면 업데이트
- 폴링 vs WebSocket 선택

#### 현재 구현
```typescript
// 폴링 방식 (주기적 재조회)
useEffect(() => {
  const interval = setInterval(() => {
    loadCourses();
  }, 30000); // 30초마다 재조회

  return () => clearInterval(interval);
}, []);
```

**개선 방안:**

**6.1 WebSocket 구현**
```typescript
// Socket.io 사용
const socket = io('https://api.nallijaku.com');

socket.on('course-updated', (data) => {
  setCourses(prev => prev.map(c => 
    c.id === data.id ? data : c
  ));
});

socket.on('course-deleted', (id) => {
  setCourses(prev => prev.filter(c => c.id !== id));
});
```

**6.2 Server-Sent Events (SSE)**
```typescript
const eventSource = new EventSource('/api/courses/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateCourses(data);
};
```

**선택 기준:**
- 실시간성 요구사항: WebSocket > SSE > 폴링
- 서버 부하: 폴링 > WebSocket > SSE
- 구현 복잡도: 폴링 < SSE < WebSocket

---

### 7. 이미지 최적화

#### 문제점
- 대용량 이미지 로딩 시간
- 다양한 화면 크기 대응
- CDN 미사용

#### 현재 구현
```typescript
<img
  src={material.image.startsWith('http') 
    ? material.image 
    : `https://api.nallijaku.com${material.image}`}
  alt={material.alt}
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder.png';
  }}
/>
```

**개선 방안:**

**7.1 Next.js Image 컴포넌트 사용**
```typescript
import Image from 'next/image';

<Image
  src={material.image}
  alt={material.alt}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="/placeholder.png"
  loading="lazy"
/>
```

**장점:**
- 자동 이미지 최적화
- WebP 변환
- Lazy loading
- 반응형 이미지

**7.2 CDN 도입**
```typescript
// Cloudflare Images 또는 AWS CloudFront
const imageUrl = `https://cdn.nallijaku.com/images/${material.image}`;
```

---

## 성능 최적화 전략

### 1. 코드 스플리팅
```typescript
// 동적 import로 번들 크기 감소
const AdminPage = dynamic(() => import('@/app/admin/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 2. 메모이제이션
```typescript
// 비용이 큰 계산 캐싱
const filteredMaterials = useMemo(() => {
  return materialsData.filter(material => {
    if (selectedCategory !== '전체' && material.category !== selectedCategory) {
      return false;
    }
    if (selectedSubCategory && material.subCategory !== selectedSubCategory) {
      return false;
    }
    return true;
  });
}, [materialsData, selectedCategory, selectedSubCategory]);

// 콜백 함수 캐싱
const handleLessonClick = useCallback((lesson: { id: number }) => {
  setSelectedLesson(lesson.id);
}, []);
```

### 3. 가상 스크롤링
```typescript
// react-window 사용 (대량 데이터 렌더링)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={courses.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {courses[index].title}
    </div>
  )}
</FixedSizeList>
```

---

## 보안 강화 방안

### 1. XSS 방지
```typescript
// dangerouslySetInnerHTML 사용 시 sanitize
import DOMPurify from 'dompurify';

<p dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(material.subtitle) 
}} />
```

### 2. CSRF 방지
```typescript
// CSRF 토큰 추가
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

### 3. Rate Limiting (클라이언트)
```typescript
// 중복 요청 방지
let isLoading = false;

const loadCourses = async () => {
  if (isLoading) return;
  isLoading = true;
  
  try {
    const response = await api.get('/api/resources');
    setCourses(response.data);
  } finally {
    isLoading = false;
  }
};
```

---

## 문의

프로젝트 관련 문의사항은 아래로 연락주세요:
- 이메일: ldy195112@naver.com
- 전화: 010-3200-1951
