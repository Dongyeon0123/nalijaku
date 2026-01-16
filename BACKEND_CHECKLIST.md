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

---

# 강사 강의 관리 API 체크리스트

## 📋 새로 추가된 기능

### 1. 관리자 - 강사별 할당된 강의 조회
**엔드포인트**: `GET /api/instructors/{instructorId}/courses`

**설명**: 특정 강사에게 할당된 모든 강의 목록을 조회합니다.

**요청 예시**:
```
GET /api/instructors/5/courses
Headers:
  Authorization: Bearer {admin_token}
```

**응답 예시** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "materialId": 10,
      "title": "드론 기초 과정",
      "subtitle": "드론 조종의 기본을 배웁니다",
      "thumbnail": "/uploads/drone-basic.jpg",
      "description": "드론 조종 기초 교육",
      "categoryName": "드론",
      "instructorName": "김강사",
      "studentCount": 25,
      "avgProgress": 45.5,
      "status": "active",
      "startDate": "2025-01-10",
      "endDate": "2025-03-10",
      "assignedAt": "2025-01-08T10:00:00Z",
      "externalLink": "https://zoom.us/j/123456789"
    }
  ]
}
```

**필드 설명**:
- `id`: 강의 할당 ID
- `materialId`: 학습자료 ID
- `title`: 강의명
- `subtitle`: 강의 부제목
- `thumbnail`: 썸네일 이미지 URL
- `description`: 강의 설명
- `categoryName`: 카테고리 (창업/드론/AI/환경)
- `instructorName`: 강사명
- `studentCount`: 수강생 수
- `avgProgress`: 평균 진행률 (0-100)
- `status`: 강의 상태 (`active` | `completed`)
- `startDate`: 강의 시작일
- `endDate`: 강의 종료일
- `assignedAt`: 할당 일시
- `externalLink`: 외부 강의 링크 (선택)
- `announcement`: 공지사항 내용 (선택)

---

### 2. 관리자 - 강사의 특정 강의 삭제
**엔드포인트**: `DELETE /api/instructors/{instructorId}/courses/{courseId}`

**설명**: 강사에게 할당된 특정 강의를 삭제합니다.

**요청 예시**:
```
DELETE /api/instructors/5/courses/1
Headers:
  Authorization: Bearer {admin_token}
```

**응답 예시** (200 OK):
```json
{
  "success": true,
  "message": "강의가 삭제되었습니다"
}
```

**에러 응답** (404 Not Found):
```json
{
  "success": false,
  "message": "강의를 찾을 수 없습니다",
  "code": "COURSE_NOT_FOUND"
}
```

---

### 3. 관리자 - 강의 공지사항 등록/수정
**엔드포인트**: `PUT /api/instructors/{instructorId}/courses/{courseId}/announcement`

**설명**: 관리자가 강사의 강의에 공지사항(외부 링크)을 등록하거나 수정합니다.

**요청 예시**:
```
PUT /api/instructors/5/courses/1/announcement
Headers:
  Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "externalLink": "https://zoom.us/j/987654321"
}
```

**응답 예시** (200 OK):
```json
{
  "success": true,
  "message": "공지사항이 저장되었습니다",
  "data": {
    "id": 1,
    "externalLink": "https://zoom.us/j/987654321"
  }
}
```

**에러 응답** (403 Forbidden):
```json
{
  "success": false,
  "message": "관리자만 공지사항을 수정할 수 있습니다",
  "code": "FORBIDDEN"
}
```

---

## 🔧 백엔드 구현 가이드

### 1. 데이터 모델 (MongoDB)

#### InstructorCourse Collection
```javascript
{
  _id: ObjectId,
  instructorId: Number,        // 강사 ID
  materialId: Number,          // 학습자료 ID
  title: String,               // 강의명 (학습자료에서 복사)
  subtitle: String,            // 부제목
  thumbnail: String,           // 썸네일 URL
  description: String,         // 설명
  categoryName: String,        // 카테고리
  instructorName: String,      // 강사명
  studentCount: Number,        // 수강생 수
  avgProgress: Number,         // 평균 진행률
  status: String,              // 'active' | 'completed'
  startDate: Date,             // 시작일
  endDate: Date,               // 종료일
  assignedAt: Date,            // 할당 일시
  externalLink: String,        // 외부 강의 링크 (선택)
  announcement: String,        // 공지사항 내용 (선택)
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Controller 구현

```java
@RestController
@RequestMapping("/api/instructors")
public class InstructorCourseController {

    @Autowired
    private InstructorCourseService instructorCourseService;

    // 강사별 할당된 강의 조회
    @GetMapping("/{instructorId}/courses")
    public ResponseEntity<?> getInstructorCourses(@PathVariable Long instructorId) {
        List<InstructorCourse> courses = instructorCourseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(new ApiResponse(true, courses));
    }

    // 강의 삭제
    @DeleteMapping("/{instructorId}/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(
        @PathVariable Long instructorId,
        @PathVariable Long courseId
    ) {
        instructorCourseService.deleteCourse(instructorId, courseId);
        return ResponseEntity.ok(new ApiResponse(true, "강의가 삭제되었습니다"));
    }

    // 공지사항 등록/수정
    @PutMapping("/{instructorId}/courses/{courseId}/announcement")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAnnouncement(
        @PathVariable Long instructorId,
        @PathVariable Long courseId,
        @RequestBody AnnouncementRequest request
    ) {
        InstructorCourse course = instructorCourseService.updateAnnouncement(
            instructorId, courseId, request.getExternalLink()
        );
        return ResponseEntity.ok(new ApiResponse(true, "공지사항이 저장되었습니다", course));
    }
}
```

### 3. Service 구현

```java
@Service
public class InstructorCourseService {

    @Autowired
    private InstructorCourseRepository instructorCourseRepository;

    public List<InstructorCourse> getCoursesByInstructor(Long instructorId) {
        return instructorCourseRepository.findByInstructorId(instructorId);
    }

    public void deleteCourse(Long instructorId, Long courseId) {
        InstructorCourse course = instructorCourseRepository
            .findByIdAndInstructorId(courseId, instructorId)
            .orElseThrow(() -> new CourseNotFoundException("강의를 찾을 수 없습니다"));
        
        instructorCourseRepository.delete(course);
    }

    public InstructorCourse updateAnnouncement(Long instructorId, Long courseId, String externalLink) {
        InstructorCourse course = instructorCourseRepository
            .findByIdAndInstructorId(courseId, instructorId)
            .orElseThrow(() -> new CourseNotFoundException("강의를 찾을 수 없습니다"));
        
        course.setExternalLink(externalLink);
        course.setUpdatedAt(new Date());
        return instructorCourseRepository.save(course);
    }
}
```

### 4. Repository 구현

```java
public interface InstructorCourseRepository extends MongoRepository<InstructorCourse, Long> {
    List<InstructorCourse> findByInstructorId(Long instructorId);
    Optional<InstructorCourse> findByIdAndInstructorId(Long id, Long instructorId);
}
```

### 5. DTO 클래스

```java
// AnnouncementRequest.java
public class AnnouncementRequest {
    private String externalLink;
    private String announcement;
    
    // getter, setter
}
```

---

## ✅ 테스트 체크리스트

### 1. 강의 조회 테스트
- [ ] 강사에게 할당된 강의 목록이 정상적으로 조회되는가?
- [ ] 할당된 강의가 없을 때 빈 배열을 반환하는가?
- [ ] 강의 정보가 올바르게 포함되어 있는가? (제목, 수강생 수, 진행률 등)

### 2. 강의 삭제 테스트
- [ ] 관리자가 강의를 삭제할 수 있는가?
- [ ] 일반 사용자는 강의를 삭제할 수 없는가?
- [ ] 존재하지 않는 강의 삭제 시 404 에러를 반환하는가?

### 3. 공지사항 등록/수정 테스트
- [ ] 관리자가 강의에 외부 링크를 등록할 수 있는가?
- [ ] 관리자가 강의에 공지사항 내용을 등록할 수 있는가?
- [ ] 외부 링크와 공지사항을 동시에 등록할 수 있는가?
- [ ] 외부 링크만 등록할 수 있는가?
- [ ] 공지사항만 등록할 수 있는가?
- [ ] 공지사항 수정이 정상적으로 동작하는가?
- [ ] 일반 사용자는 공지사항을 등록할 수 없는가?

---

**마지막 업데이트**: 2025-01-15


---

# 학습자료 삭제 시 외래 키 제약 조건 처리

## 🔴 현재 문제
학습자료 삭제 시 다음 에러 발생:
```
Cannot delete or update a parent row: a foreign key constraint fails 
(`nallijaku_prod_db`.`instructor_courses`, CONSTRAINT `FKmvcobjo2ywb88ddbbyi6gaot1` 
FOREIGN KEY (`learning_material_id`) REFERENCES `learning_materials` (`id`))
```

## 📋 문제 원인
- `learning_materials` 테이블의 강좌를 삭제하려고 할 때
- `instructor_courses` 테이블에서 해당 강좌를 참조하고 있음 (외래 키)
- 참조 무결성 제약 조건 때문에 삭제 불가

## ✅ 해결 방법

### 방법 1: CASCADE 삭제 설정 (권장)
강좌 삭제 시 관련된 강사 연결도 자동으로 삭제

#### JPA Entity 수정
```java
// LearningMaterial.java
@Entity
@Table(name = "learning_materials")
public class LearningMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 다른 필드들...
    
    @OneToMany(mappedBy = "learningMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InstructorCourse> instructorCourses;
}
```

#### 또는 데이터베이스 제약 조건 수정
```sql
-- 기존 외래 키 제약 조건 삭제
ALTER TABLE instructor_courses 
DROP FOREIGN KEY FKmvcobjo2ywb88ddbbyi6gaot1;

-- CASCADE 옵션으로 다시 생성
ALTER TABLE instructor_courses
ADD CONSTRAINT FKmvcobjo2ywb88ddbbyi6gaot1
FOREIGN KEY (learning_material_id) 
REFERENCES learning_materials(id)
ON DELETE CASCADE;
```

### 방법 2: 수동 삭제 (현재 구현 필요)
강좌 삭제 전에 관련된 강사 연결을 먼저 삭제

#### Service 구현
```java
@Service
public class LearningMaterialService {
    
    @Autowired
    private LearningMaterialRepository learningMaterialRepository;
    
    @Autowired
    private InstructorCourseRepository instructorCourseRepository;
    
    @Transactional
    public void deleteLearningMaterial(Long id) {
        // 1. 먼저 instructor_courses에서 관련 레코드 삭제
        List<InstructorCourse> relatedCourses = 
            instructorCourseRepository.findByLearningMaterialId(id);
        
        if (!relatedCourses.isEmpty()) {
            log.info("학습자료 ID {}와 연결된 강사 강의 {}개를 먼저 삭제합니다", 
                id, relatedCourses.size());
            instructorCourseRepository.deleteAll(relatedCourses);
        }
        
        // 2. 학습자료 삭제
        LearningMaterial material = learningMaterialRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("학습자료를 찾을 수 없습니다"));
        
        learningMaterialRepository.delete(material);
        log.info("학습자료 ID {}가 삭제되었습니다", id);
    }
}
```

#### Repository 추가
```java
public interface InstructorCourseRepository extends JpaRepository<InstructorCourse, Long> {
    List<InstructorCourse> findByLearningMaterialId(Long learningMaterialId);
    void deleteByLearningMaterialId(Long learningMaterialId);
}
```

#### Controller 수정
```java
@DeleteMapping("/resources/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> deleteLearningMaterial(@PathVariable Long id) {
    try {
        learningMaterialService.deleteLearningMaterial(id);
        return ResponseEntity.ok(new ApiResponse(true, "학습자료가 삭제되었습니다"));
    } catch (ResourceNotFoundException e) {
        return ResponseEntity.status(404)
            .body(new ApiResponse(false, e.getMessage(), "RESOURCE_NOT_FOUND"));
    } catch (Exception e) {
        log.error("학습자료 삭제 실패", e);
        return ResponseEntity.status(500)
            .body(new ApiResponse(false, "학습자료 삭제 중 오류가 발생했습니다"));
    }
}
```

### 방법 3: Soft Delete (선택적)
실제로 삭제하지 않고 삭제 플래그만 설정

```java
@Entity
@Table(name = "learning_materials")
public class LearningMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 다른 필드들...
    
    @Column(name = "deleted")
    private Boolean deleted = false;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}

// Service
public void softDeleteLearningMaterial(Long id) {
    LearningMaterial material = learningMaterialRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("학습자료를 찾을 수 없습니다"));
    
    material.setDeleted(true);
    material.setDeletedAt(LocalDateTime.now());
    learningMaterialRepository.save(material);
}
```

## 🔍 디버깅 체크리스트

### 1. 현재 외래 키 제약 조건 확인
```sql
-- MySQL
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'instructor_courses'
AND REFERENCED_TABLE_NAME = 'learning_materials';
```

### 2. 삭제하려는 강좌가 참조되고 있는지 확인
```sql
SELECT COUNT(*) 
FROM instructor_courses 
WHERE learning_material_id = ?;
```

### 3. 로그 확인
```java
// 삭제 전 로깅 추가
log.info("학습자료 ID {} 삭제 시도", id);
log.info("연결된 강사 강의 수: {}", 
    instructorCourseRepository.countByLearningMaterialId(id));
```

## 📊 권장 사항

1. **방법 1 (CASCADE)** 사용 권장
   - 가장 간단하고 안전
   - 데이터 무결성 자동 유지
   - 실수로 고아 레코드 생성 방지

2. **방법 2 (수동 삭제)** 사용 시
   - `@Transactional` 필수
   - 삭제 순서 중요 (자식 → 부모)
   - 에러 처리 철저히

3. **방법 3 (Soft Delete)** 고려 사항
   - 데이터 복구 가능
   - 감사 추적 용이
   - 저장 공간 더 필요

## ✅ 테스트 체크리스트

- [ ] 강사와 연결되지 않은 강좌 삭제 테스트
- [ ] 강사와 연결된 강좌 삭제 테스트
- [ ] 여러 강사와 연결된 강좌 삭제 테스트
- [ ] 삭제 후 instructor_courses 테이블 확인
- [ ] 트랜잭션 롤백 테스트 (중간에 에러 발생 시)
- [ ] 권한 없는 사용자의 삭제 시도 테스트

---

**마지막 업데이트**: 2025-01-15
