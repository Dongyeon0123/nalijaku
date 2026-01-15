# 🔐 보안 업데이트 완료 (JWT 토큰 기반)

## 개요
백엔드에 JWT 토큰 기반 인증 시스템이 추가되어, 프론트엔드를 업데이트했습니다.

---

## ✅ 완료된 작업

### 1. 새로운 로그인 응답 구조 적용

#### 변경 전
```json
{
  "success": true,
  "data": {
    "token": "temporary_session_1",
    "user": { ... }
  }
}
```

#### 변경 후
```json
{
  "success": true,
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

### 2. 토큰 관리

#### 저장 위치
- `accessToken`: localStorage (1시간 유효)
- `refreshToken`: localStorage (7일 유효)
- `user`: localStorage (사용자 정보 전체)

#### API 설정 업데이트 (`src/config/api.ts`)
- `saveTokens()`: accessToken과 refreshToken을 localStorage에 저장
- `getAccessToken()`: localStorage에서 accessToken 가져오기
- `getRefreshToken()`: localStorage에서 refreshToken 가져오기
- `clearTokens()`: 로그아웃 시 토큰 삭제
- `getAuthHeaders()`: 자동으로 Authorization 헤더 생성

#### 인증 서비스 업데이트 (`src/services/authService.ts`)
- `refreshAccessToken()`: 토큰 갱신 함수
- `getCurrentUser()`: 현재 사용자 정보 조회 (토큰 기반)
- `login()`: 로그인 시 accessToken, refreshToken, user 저장
- `logout()`: 로그아웃 시 모든 토큰 및 사용자 정보 삭제

### 3. API 클라이언트 유틸리티 (`src/utils/apiClient.ts`)

모든 API 요청에 자동으로 인증 토큰을 추가하고 에러를 처리하는 유틸리티 함수:

```typescript
// GET 요청
await apiGet('/api/endpoint', true); // true = 인증 필요

// POST 요청
await apiPost('/api/endpoint', data, true);

// PUT 요청
await apiPut('/api/endpoint', data, true);

// PATCH 요청
await apiPatch('/api/endpoint', data, true);

// DELETE 요청
await apiDelete('/api/endpoint', true);
```

#### 주요 기능
- ✅ 자동으로 Authorization 헤더 추가
- ✅ 401 에러 시 자동 토큰 갱신 후 재시도
- ✅ 403 에러 처리 (권한 없음)
- ✅ 토큰 만료 시 자동 로그아웃 및 리다이렉트

### 4. 컴포넌트 업데이트

#### Header 컴포넌트 (`src/components/Header.tsx`)
- 로그인 시 accessToken, refreshToken, user 저장
- 로그아웃 시 모든 토큰 및 사용자 정보 삭제
- user.role로 관리자 권한 확인 (API 호출 불필요)

#### 관리자 레이아웃 (`src/app/admin/layout.tsx`)
- localStorage의 user.role로 관리자 권한 확인
- 권한 없을 시 메인 페이지로 리다이렉트

#### 관리자 콘텐츠 페이지 (`src/app/admin/content/page.tsx`)
- 모든 API 호출에 인증 토큰 포함
- 401/403 에러 처리

---

## 🔒 API 접근 제어 정책

### 🔓 공개 API (토큰 불필요)
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

### 🔒 인증 필요 (Access Token 필요)
- GET /api/auth/me - 내 정보
- POST /api/auth/refresh - 토큰 갱신
- GET /api/cart - 장바구니

### 👑 관리자 전용 (ADMIN 권한 필요)
- GET /api/admin/** - 모든 관리자 API
- GET /api/users - 사용자 목록
- GET /api/education-inquiries - 신청 목록 조회
- DELETE /api/education-inquiries/{id} - 신청 삭제
- GET /api/partner-applications - 신청 목록 조회
- DELETE /api/partner-applications/{id} - 신청 삭제
- POST/PUT/DELETE /api/instructors/** - 강사 관리
- POST/PUT/DELETE /api/lessons/** - 강의 관리
- POST/PUT/DELETE /api/resources/** - 학습 자료 관리

---

## 📝 에러 처리

### 401 Unauthorized
- 토큰이 만료되었거나 유효하지 않음
- 자동으로 Refresh Token으로 갱신 시도
- 갱신 실패 시 로그아웃 및 메인 페이지로 리다이렉트

### 403 Forbidden
- 권한이 없음 (예: 일반 사용자가 관리자 API 호출)
- 에러 메시지 표시

---

## 🚀 사용 방법

### 1. 로그인
```typescript
import { login } from '@/services/authService';

const result = await login({
  username: 'user123',
  password: 'password123',
  rememberMe: false
});

// accessToken, refreshToken, user가 자동으로 localStorage에 저장됨
// result.data.user에 사용자 정보 포함
```

### 2. 인증이 필요한 API 호출
```typescript
import { apiGet } from '@/utils/apiClient';

// 자동으로 Authorization 헤더가 추가됨
const data = await apiGet('/api/education-inquiries', true);
```

### 3. 로그아웃
```typescript
import { logout } from '@/services/authService';

await logout();
// accessToken, refreshToken, user, userInfo가 모두 삭제됨
```

### 4. 관리자 권한 확인
```typescript
// localStorage에서 user 정보 가져오기
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (user.role === 'ADMIN') {
  // 관리자 기능 실행
}
```

---

## 🔧 토큰 갱신 흐름

1. API 요청 시 401 에러 발생
2. `apiClient.ts`가 자동으로 Refresh Token으로 갱신 시도
3. 새로운 Access Token 받아서 localStorage에 저장
4. 원래 요청 재시도
5. Refresh Token도 만료된 경우 로그아웃 처리

---

## 🔧 다음 단계

### 관리자 페이지 업데이트 필요
다음 파일들도 `apiClient` 유틸리티를 사용하도록 업데이트해야 합니다:

- [ ] `src/app/admin/page.tsx` (대시보드)
- [ ] `src/app/admin/users/page.tsx` (사용자 관리)
- [ ] `src/app/admin/instructors/page.tsx` (강사 관리)
- [ ] `src/app/admin/courses/page.tsx` (강의 관리)
- [ ] `src/app/admin/statistics/page.tsx` (통계)

### 업데이트 방법
1. `fetch()` 호출을 `apiGet()`, `apiPost()` 등으로 변경
2. 세 번째 파라미터에 `true` 전달 (인증 필요)
3. 에러 처리 추가

예시:
```typescript
// Before
const response = await fetch(`${API_BASE_URL}/api/users`);
const data = await response.json();

// After
import { apiGet } from '@/utils/apiClient';
const data = await apiGet('/api/users', true);
```

---

## 📚 참고 문서

- [FRONTEND_API_SPEC.md](./FRONTEND_API_SPEC.md) - API 스펙 문서
- [src/utils/apiClient.ts](./src/utils/apiClient.ts) - API 클라이언트 유틸리티
- [src/services/authService.ts](./src/services/authService.ts) - 인증 서비스
- [src/config/api.ts](./src/config/api.ts) - API 설정
