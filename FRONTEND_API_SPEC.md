# 프론트엔드 API 스펙 - 교육도입, 파트너모집, 관리자 콘텐츠

## 📋 개요
프론트엔드에서 교육도입하기, 파트너모집하기 신청 시 백엔드로 전송할 데이터 스펙입니다.

---

## 🔐 인증 시스템

### 토큰 기반 인증
백엔드는 JWT 토큰 기반 인증을 사용합니다.

#### 로그인 응답 (새로운 구조)
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@nallijaku.com",
      "role": "ADMIN",
      "roleDescription": "관리자",
      "organization": "날리자쿠"
    }
  }
}
```

#### 토큰 유효기간
- **Access Token**: 1시간
- **Refresh Token**: 7일

#### 토큰 저장
```javascript
const { accessToken, refreshToken, user } = response.data.data;
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

#### 인증 헤더
```
Authorization: Bearer {accessToken}
```

### 새로운 엔드포인트

#### 토큰 갱신
```
POST /api/auth/refresh
Content-Type: application/json

Body: { "refreshToken": "eyJhbGciOiJIUzUxMiJ9..." }

Response:
{
  "success": true,
  "message": "토큰 갱신 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer"
  }
}
```

#### 현재 사용자 정보 조회
```
GET /api/auth/me
Headers: Authorization: Bearer {accessToken}

Response:
{
  "success": true,
  "message": "사용자 정보 조회 성공",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@nallijaku.com",
    "role": "ADMIN",
    "roleDescription": "관리자"
  }
}
```

### 보호된 API 목록

#### 🔓 공개 API (토큰 불필요)
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인
- GET /api/auth/check-username/{username} - 사용자명 중복 확인
- GET /api/users/count - 사용자 수 조회
- POST /api/education-inquiries - 교육 도입 신청
- POST /api/partner-applications - 파트너 모집 신청
- GET /api/instructors - 강사 목록 조회
- GET /api/instructors/{id} - 강사 상세 조회
- GET /api/lessons - 강의 목록 조회
- GET /api/resources - 학습 자료 조회

#### 🔒 인증 필요 (Access Token 필요)
- GET /api/auth/me - 내 정보
- POST /api/auth/refresh - 토큰 갱신
- GET /api/cart - 장바구니

#### 👑 관리자 전용 (ADMIN 권한 필요)
- GET /api/admin/** - 모든 관리자 API
- GET /api/users - 사용자 목록
- GET /api/education-inquiries - 신청 목록 조회
- DELETE /api/education-inquiries/{id} - 신청 삭제
- GET /api/partner-applications - 신청 목록 조회
- DELETE /api/partner-applications/{id} - 신청 삭제
- POST/PUT/DELETE /api/instructors/** - 강사 관리
- POST/PUT/DELETE /api/lessons/** - 강의 관리
- POST/PUT/DELETE /api/resources/** - 학습 자료 관리

### 에러 응답

#### 401 Unauthorized (인증 실패)
```json
{
  "timestamp": "2025-12-21T14:16:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "인증이 필요합니다.",
  "path": "/api/users"
}
```
**처리**: Refresh Token으로 갱신 시도 → 실패 시 로그인 페이지로 이동

#### 403 Forbidden (권한 부족)
```json
{
  "timestamp": "2025-12-21T14:16:00",
  "status": 403,
  "error": "Forbidden",
  "message": "접근 권한이 없습니다.",
  "path": "/api/admin/users"
}
```
**처리**: "관리자 권한이 필요합니다" 메시지 표시

---

## 1️⃣ 교육도입하기 신청 API

### 엔드포인트
```
POST /api/education-inquiries
```

### 요청 헤더
```
Content-Type: application/json
```

### 요청 본문
```json
{
  "schoolName": "string (필수) - 기관명",
  "contactPerson": "string (필수) - 담당자명",
  "phone": "string (필수) - 연락처",
  "email": "string (필수) - 이메일",
  "studentCount": "number (필수) - 예상 학생 수",
  "budget": "string (선택) - 예산 범위",
  "educationRegion": "string (선택) - 교육 지역",
  "grade": "string (선택) - 대상 학년",
  "preferredDate": "string (선택) - 희망 교육 일정",
  "additionalInfo": "string (선택) - 추가 요청사항",
  "services": [
    "string (선택) - 상담내용 (purchaseInquiry, schoolVisit, careerExperience, boothEntrustment, other)"
  ],
  "selectedCourses": [
    {
      "id": "number - 강의 ID",
      "title": "string - 강의 제목",
      "instructor": "string - 강사명",
      "category": "string - 카테고리"
    }
  ]
}
```

### 응답 (성공 - 201)
```json
{
  "success": true,
  "message": "교육 도입 신청이 접수되었습니다",
  "data": {
    "id": "string - 신청 ID",
    "status": "pending",
    "submittedAt": "ISO 8601 날짜"
  }
}
```

### 응답 (실패 - 400)
```json
{
  "success": false,
  "message": "필수 필드가 누락되었습니다",
  "errors": {
    "schoolName": "기관명은 필수입니다"
  }
}
```

---

## 2️⃣ 파트너모집하기 신청 API

### 엔드포인트
```
POST /api/partner-applications
```

### 요청 헤더
```
Content-Type: application/json
```

### 요청 본문
```json
{
  "contactPerson": "string (필수) - 이름",
  "phone": "string (필수) - 전화번호",
  "email": "string (필수) - 이메일",
  "location": "string (필수) - 활동지역",
  "experience": "string (필수) - 경력 사항",
  "practicalCert": "boolean (선택) - 실기평가조종 자격증",
  "class1Cert": "boolean (선택) - 1종 조종 자격증",
  "class2Cert": "boolean (선택) - 2종 조종 자격증",
  "class3Cert": "boolean (선택) - 3종 조종 자격증",
  "instructorCert": "boolean (선택) - 교관 자격증",
  "other": "boolean (선택) - 기타",
  "otherText": "string (선택) - 기타 자격증명"
}
```

### 응답 (성공 - 201)
```json
{
  "success": true,
  "message": "파트너 모집 신청이 접수되었습니다",
  "data": {
    "id": "string - 신청 ID",
    "status": "pending",
    "submittedAt": "ISO 8601 날짜"
  }
}
```

---

## 3️⃣ 관리자 콘텐츠 조회 API

### 교육도입 신청 목록 조회
```
GET /api/education-inquiries
Authorization: Bearer {admin_token}
```

**응답 데이터 구조:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "schoolName": "string",
      "contactPerson": "string",
      "email": "string",
      "phone": "string",
      "studentCount": "number",
      "budget": "string",
      "grade": "string",
      "preferredDate": "string",
      "additionalInfo": "string",
      "services": ["string"],
      "selectedCourses": [
        {
          "id": "number",
          "title": "string",
          "instructor": "string",
          "category": "string"
        }
      ],
      "status": "pending | in_progress | completed",
      "submittedAt": "ISO 8601 날짜"
    }
  ]
}
```

### 파트너 신청 목록 조회
```
GET /api/partner-applications
Authorization: Bearer {admin_token}
```

**응답 데이터 구조:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "contactPerson": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "experience": "string",
      "practicalCert": "boolean",
      "class1Cert": "boolean",
      "class2Cert": "boolean",
      "class3Cert": "boolean",
      "instructorCert": "boolean",
      "other": "boolean",
      "otherText": "string",
      "status": "pending | in_progress | completed",
      "submittedAt": "ISO 8601 날짜"
    }
  ]
}
```

### 상태 변경 API
```
PATCH /api/education-inquiries/{id}/status
또는
PATCH /api/partner-applications/{id}/status

Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "status": "pending | in_progress | completed"
}
```

---

## 📝 프론트엔드 구현 현황

### ✅ 완료된 기능
- [x] 토큰 기반 인증 시스템 구현
- [x] 자동 토큰 갱신 (401 에러 시)
- [x] 인증이 필요한 API에 자동으로 토큰 추가
- [x] 401/403 에러 처리
- [x] 관리자 권한 확인 (토큰 기반)
- [x] 교육도입하기 폼 제출 (선택된 강의 포함)
- [x] 파트너모집하기 폼 제출 (자격증 정보 포함)
- [x] 관리자 콘텐츠 페이지 - 교육도입 신청 목록 조회 (인증 필요)
- [x] 관리자 콘텐츠 페이지 - 파트너 신청 목록 조회 (인증 필요)
- [x] 관리자 콘텐츠 페이지 - 상세보기 (선택된 강의 표시)
- [x] 관리자 콘텐츠 페이지 - 상태 변경 기능 (인증 필요)
- [x] 관리자 콘텐츠 페이지 - 삭제 기능 (인증 필요)

### 🔧 구현된 유틸리티
- `apiClient.ts`: 인증 토큰 자동 추가 및 에러 처리
  - `apiGet()`: GET 요청
  - `apiPost()`: POST 요청
  - `apiPut()`: PUT 요청
  - `apiPatch()`: PATCH 요청
  - `apiDelete()`: DELETE 요청
  - 자동 토큰 갱신 (401 에러 시)
  - 403 에러 처리

### ⚠️ 백엔드에서 구현 필요
1. **교육도입 신청 저장**
   - `selectedCourses` 배열 저장
   - `services` 배열 저장
   - 상태: `pending` 기본값

2. **파트너 신청 저장**
   - 자격증 정보 (boolean 필드들) 저장
   - 상태: `pending` 기본값

3. **조회 API**
   - 교육도입 신청 목록 조회 (selectedCourses 포함)
   - 파트너 신청 목록 조회 (자격증 정보 포함)

4. **상태 변경 API**
   - PATCH 엔드포인트로 상태 업데이트

---

## 🔄 데이터 흐름

### 교육도입하기
```
사용자 입력 
  ↓
강의 선택 (장바구니)
  ↓
폼 작성 및 제출
  ↓
POST /api/education-inquiries (selectedCourses 포함)
  ↓
백엔드 저장
  ↓
관리자 페이지에서 조회 및 관리
```

### 파트너모집하기
```
사용자 입력
  ↓
자격증 선택 (체크박스)
  ↓
폼 작성 및 제출
  ↓
POST /api/partner-applications (자격증 정보 포함)
  ↓
백엔드 저장
  ↓
관리자 페이지에서 조회 및 관리
```

---

## 🎯 주요 포인트

1. **교육도입하기에서 선택된 강의 정보 저장**
   - 강의 ID, 제목, 강사명, 카테고리를 함께 전송
   - 관리자가 어떤 강의를 선택했는지 확인 가능

2. **파트너 신청에서 자격증 정보 저장**
   - 각 자격증을 boolean으로 저장
   - 관리자 페이지에서 배지 형태로 시각화

3. **상태 관리**
   - pending (확인 전) → in_progress (진행중) → completed (완료)
   - 관리자가 상태를 변경할 수 있음

4. **에러 처리**
   - 필수 필드 검증
   - 개인정보 동의 필수 확인
