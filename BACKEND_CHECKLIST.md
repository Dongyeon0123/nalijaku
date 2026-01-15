# 백엔드 역할 변경 API 체크리스트

## 🔴 현재 문제
프론트엔드에서 `PUT /api/users/13/role` 요청 시 **500 Internal Server Error** 발생

## 📋 백엔드 개발자 확인 사항

### 1. 엔드포인트 구현 확인
```java
// UserController.java에 다음 엔드포인트가 있는지 확인
@PutMapping("/users/{id}/role")
public ResponseEntity<?> updateUserRole(
    @PathVariable Long id,
    @RequestBody RoleUpdateRequest request
) {
    // 구현 내용
}
```

### 2. 요청 데이터 형식
프론트엔드가 보내는 데이터:
```json
{
  "role": "GENERAL" | "TEACHER" | "ADMIN"
}
```

### 3. DTO 클래스 확인
```java
// RoleUpdateRequest.java
public class RoleUpdateRequest {
    private String role;  // GENERAL, TEACHER, ADMIN
    
    // getter, setter
}
```

### 4. 역할 Enum 확인
```java
// Role.java 또는 UserRole.java
public enum Role {
    GENERAL,   // 일반 사용자
    TEACHER,   // 강사
    ADMIN      // 관리자
}
```

### 5. SecurityConfig 권한 설정
```java
// SecurityConfig.java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/users/*/role").hasRole("ADMIN")  // 관리자만 접근
    // ...
);
```

### 6. 서비스 로직 확인
```java
// UserService.java
public User updateUserRole(Long userId, String role) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다"));
    
    // 역할 유효성 검증
    if (!isValidRole(role)) {
        throw new InvalidRoleException("유효하지 않은 역할입니다");
    }
    
    user.setRole(Role.valueOf(role));
    return userRepository.save(user);
}
```

### 7. 예외 처리
```java
// GlobalExceptionHandler.java
@ExceptionHandler(Exception.class)
public ResponseEntity<?> handleException(Exception e) {
    log.error("서버 오류 발생", e);  // 로그 확인!
    return ResponseEntity.status(500)
        .body(new ErrorResponse("서버 오류가 발생했습니다"));
}
```

## 🔍 디버깅 방법

### 1. 서버 로그 확인
```bash
# Spring Boot 로그에서 에러 스택 트레이스 확인
tail -f logs/application.log
```

### 2. 요청 로깅 추가
```java
@PutMapping("/users/{id}/role")
public ResponseEntity<?> updateUserRole(
    @PathVariable Long id,
    @RequestBody RoleUpdateRequest request
) {
    log.info("역할 변경 요청 - userId: {}, newRole: {}", id, request.getRole());
    
    try {
        // 로직 실행
    } catch (Exception e) {
        log.error("역할 변경 실패", e);  // 구체적인 에러 확인
        throw e;
    }
}
```

### 3. Postman으로 직접 테스트
```
PUT http://localhost:8080/api/users/13/role
Headers:
  Authorization: Bearer {admin_token}
  Content-Type: application/json

Body:
{
  "role": "TEACHER"
}
```

## 🎯 예상 원인

### 가능성 1: 엔드포인트 미구현
- `PUT /api/users/{id}/role` 엔드포인트가 없음
- 해결: UserController에 엔드포인트 추가

### 가능성 2: 역할 이름 불일치
- 백엔드: `USER`, `INSTRUCTOR`, `ADMIN`
- 프론트엔드: `GENERAL`, `TEACHER`, `ADMIN`
- 해결: 역할 이름 통일 필요

### 가능성 3: 권한 부족
- 관리자 권한이 없는 사용자가 요청
- 해결: SecurityConfig에서 권한 설정 확인

### 가능성 4: 데이터베이스 오류
- MongoDB 연결 문제
- User 컬렉션 스키마 불일치
- 해결: DB 연결 및 스키마 확인

### 가능성 5: DTO 매핑 오류
- @RequestBody 파싱 실패
- 필드명 불일치 (role vs userRole)
- 해결: DTO 클래스 확인

## ✅ 올바른 응답 형식

### 성공 (200 OK)
```json
{
  "success": true,
  "message": "역할이 변경되었습니다",
  "data": {
    "id": 13,
    "username": "user123",
    "role": "TEACHER"
  }
}
```

### 실패 (400 Bad Request)
```json
{
  "success": false,
  "message": "유효하지 않은 역할입니다",
  "code": "INVALID_ROLE"
}
```

### 실패 (404 Not Found)
```json
{
  "success": false,
  "message": "사용자를 찾을 수 없습니다",
  "code": "USER_NOT_FOUND"
}
```

## 📞 다음 단계

1. **백엔드 서버 로그 확인** - 구체적인 에러 메시지 파악
2. **엔드포인트 구현 여부 확인** - UserController.java 확인
3. **역할 이름 통일** - GENERAL/TEACHER/ADMIN 사용
4. **Postman 테스트** - API가 정상 작동하는지 확인
5. **프론트엔드 재테스트** - 백엔드 수정 후 다시 시도

---

**마지막 업데이트**: 2025-01-15
