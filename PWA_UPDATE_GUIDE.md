# PWA 업데이트 가이드

## 문제: PWA에서 페이지를 열 수 없음

### 원인
- 이전 버전의 Service Worker가 API 요청을 제대로 처리하지 못함
- 캐시된 데이터가 새 버전과 충돌

### 해결 방법

#### 방법 1: 앱 내에서 캐시 삭제 (권장)
1. PWA 앱 실행
2. 설정 탭으로 이동
3. "캐시 삭제" 메뉴 선택
4. "캐시 삭제" 버튼 클릭
5. 앱이 자동으로 재시작됨

#### 방법 2: 브라우저에서 직접 삭제
1. 브라우저에서 https://nallijaku.com 접속
2. 개발자 도구 열기 (F12 또는 Cmd+Option+I)
3. Application 탭 선택
4. Service Workers 섹션에서 "Unregister" 클릭
5. Storage 섹션에서 "Clear site data" 클릭
6. 페이지 새로고침 (Cmd+Shift+R 또는 Ctrl+Shift+R)

#### 방법 3: PWA 재설치
1. 홈 화면에서 PWA 앱 삭제
2. 브라우저에서 https://nallijaku.com/teacher/login 접속
3. 캐시 삭제 (위 방법 2 참고)
4. PWA 다시 설치

## 변경 사항 (v5)

### Service Worker 수정
- API 요청이 항상 네트워크로 전달되도록 수정
- POST/PUT/DELETE 요청도 명시적으로 네트워크로 전달
- 캐시 버전을 v5로 업데이트

### 로그인 API 수정
- 프론트엔드가 항상 Next.js API 라우트 사용 (CORS 문제 해결)
- 백엔드 URL 정규화 (이중 슬래시 제거)
- 올바른 엔드포인트 사용 (/api/auth/teacher-login)

## 배포 체크리스트

- [x] Service Worker 버전 업데이트 (v4 → v5)
- [x] API 요청 처리 로직 수정
- [x] 로그인 페이지 수정
- [x] 캐시 삭제 기능 강화
- [ ] 배포 후 테스트
  - [ ] 웹 브라우저에서 로그인 테스트
  - [ ] PWA에서 로그인 테스트
  - [ ] 캐시 삭제 기능 테스트

## 테스트 방법

### 로컬 테스트
```bash
npm run build
npm run start
```

### 배포 후 테스트
1. https://nallijaku.com/teacher/login 접속
2. 개발자 도구 콘솔 확인
3. 로그인 시도
4. 네트워크 탭에서 API 요청 확인
   - URL: `/api/auth/teacher-login` (상대 경로)
   - 이중 슬래시 없음
   - CORS 에러 없음

## 문제 발생 시

### 여전히 로그인이 안 되는 경우
1. 콘솔 로그 확인
2. 네트워크 탭에서 요청/응답 확인
3. Service Worker 상태 확인 (Application > Service Workers)
4. 캐시 완전 삭제 후 재시도

### 백엔드 확인 사항
- `/api/auth/teacher-login` 엔드포인트 존재 확인
- CORS 설정 확인 (https://nallijaku.com 허용)
- 로그인 로직 정상 작동 확인
