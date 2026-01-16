# 백엔드 API 구현 요청

## 🔴 긴급 이슈: 공지사항 API 500 에러

### 에러 내용
```
PUT /api/instructors/13/class-groups/2/announcement
500 Internal Server Error
"No static resource instructors/13/class-groups/2/announcement"
```

**원인**: Spring Boot 컨트롤러에 해당 엔드포인트 매핑이 없어서 정적 리소스로 인식됨

### 해결 방법
컨트롤러에 다음 엔드포인트를 추가해야 합니다:

```java
@RestController
@RequestMapping("/api/instructors")
public class InstructorController {
    
    // 공지사항 업데이트
    @PutMapping("/{instructorId}/class-groups/{groupId}/announcement")
    public ResponseEntity<?> updateClassGroupAnnouncement(
            @PathVariable Long instructorId,
            @PathVariable Long groupId,
            @RequestBody AnnouncementRequest request) {
        
        try {
            // 1. 그룹 존재 확인
            InstructorClassGroup group = classGroupRepository
                .findByIdAndInstructorId(groupId, instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("강의 그룹을 찾을 수 없습니다"));
            
            // 2. 공지사항 업데이트
            group.setClassLink(request.getClassLink());
            group.setAnnouncement(request.getAnnouncement());
            group.setUpdatedAt(LocalDateTime.now());
            
            InstructorClassGroup updated = classGroupRepository.save(group);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공지사항이 업데이트되었습니다",
                "data", Map.of(
                    "id", updated.getId(),
                    "classLink", updated.getClassLink(),
                    "announcement", updated.getAnnouncement(),
                    "updatedAt", updated.getUpdatedAt()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "공지사항 업데이트 실패",
                "error", e.getMessage()
            ));
        }
    }
}

// DTO 클래스
@Data
public class AnnouncementRequest {
    private String classLink;
    private String announcement;
}
```

---

## 문제 상황
관리자 페이지에서 강의를 할당해도 "강의 관리" 모달에 표시되지 않습니다.

## 필요한 API 구현

### 1. 강의 그룹 생성 API ✅ (구현 필요)
```
POST /api/instructors/{instructorId}/class-groups
Content-Type: application/json

요청 본문:
{
  "schoolName": "서울초등학교",
  "studentCount": 30,
  "startDate": "2025-01-16",
  "endDate": "2025-03-16",
  "materialIds": [1, 2, 3, 4]
}

응답 (201 Created):
{
  "success": true,
  "message": "강의 그룹이 할당되었습니다",
  "data": {
    "id": 1,
    "instructorId": 14,
    "schoolName": "서울초등학교",
    "studentCount": 30,
    "startDate": "2025-01-16",
    "endDate": "2025-03-16",
    "status": "active",
    "courseCount": 4,
    "courses": [
      {
        "id": 1,
        "title": "드론 기초",
        "subtitle": "드론의 기초를 배웁니다",
        "thumbnail": "/uploads/drone.jpg",
        "category": "드론"
      },
      ...
    ],
    "createdAt": "2025-01-16T10:00:00Z",
    "updatedAt": "2025-01-16T10:00:00Z"
  }
}
```

**Spring Boot 구현 예시:**
```java
@PostMapping("/{instructorId}/class-groups")
public ResponseEntity<?> createClassGroup(
        @PathVariable Long instructorId,
        @RequestBody ClassGroupRequest request) {
    
    // 1. 강사 존재 확인
    Instructor instructor = instructorRepository.findById(instructorId)
        .orElseThrow(() -> new ResourceNotFoundException("강사를 찾을 수 없습니다"));
    
    // 2. 그룹 생성
    InstructorClassGroup group = new InstructorClassGroup();
    group.setInstructor(instructor);
    group.setSchoolName(request.getSchoolName());
    group.setStudentCount(request.getStudentCount());
    group.setStartDate(request.getStartDate());
    group.setEndDate(request.getEndDate());
    group.setStatus("active");
    
    InstructorClassGroup saved = classGroupRepository.save(group);
    
    // 3. 학습자료 연결
    List<LearningMaterial> materials = learningMaterialRepository
        .findAllById(request.getMaterialIds());
    
    for (LearningMaterial material : materials) {
        InstructorClassGroupMaterial link = new InstructorClassGroupMaterial();
        link.setClassGroup(saved);
        link.setMaterial(material);
        classGroupMaterialRepository.save(link);
    }
    
    // 4. 응답 생성
    ClassGroupResponse response = buildClassGroupResponse(saved);
    
    return ResponseEntity.status(201).body(Map.of(
        "success", true,
        "message", "강의 그룹이 할당되었습니다",
        "data", response
    ));
}
```

### 2. 강의 그룹 목록 조회 API ✅ (구현 필요)
```
GET /api/instructors/{instructorId}/courses

응답 (200 OK):
{
  "success": true,
  "message": "할당된 강의 그룹 목록 조회 성공",
  "data": [
    {
      "id": 1,
      "schoolName": "서울초등학교",
      "studentCount": 30,
      "startDate": "2025-01-16",
      "endDate": "2025-03-16",
      "status": "active",
      "courseCount": 4,
      "courses": [
        {
          "id": 1,
          "title": "드론 기초",
          "subtitle": "드론의 기초를 배웁니다",
          "thumbnail": "/uploads/drone.jpg",
          "category": "드론"
        },
        ...
      ],
      "classLink": "https://zoom.us/j/123456789",
      "announcement": "다음 주 월요일 수업입니다.",
      "createdAt": "2025-01-16T10:00:00Z",
      "updatedAt": "2025-01-16T10:00:00Z"
    }
  ]
}
```

**Spring Boot 구현 예시:**
```java
@GetMapping("/{instructorId}/courses")
public ResponseEntity<?> getInstructorClassGroups(@PathVariable Long instructorId) {
    
    List<InstructorClassGroup> groups = classGroupRepository
        .findByInstructorIdOrderByCreatedAtDesc(instructorId);
    
    List<ClassGroupResponse> responses = groups.stream()
        .map(this::buildClassGroupResponse)
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "할당된 강의 그룹 목록 조회 성공",
        "data", responses
    ));
}

private ClassGroupResponse buildClassGroupResponse(InstructorClassGroup group) {
    // 그룹에 연결된 학습자료 조회
    List<InstructorClassGroupMaterial> links = classGroupMaterialRepository
        .findByClassGroupId(group.getId());
    
    List<CourseInfo> courses = links.stream()
        .map(link -> {
            LearningMaterial material = link.getMaterial();
            return CourseInfo.builder()
                .id(material.getId())
                .title(material.getTitle())
                .subtitle(material.getSubtitle())
                .thumbnail(material.getImage())
                .category(material.getCategory())
                .build();
        })
        .collect(Collectors.toList());
    
    return ClassGroupResponse.builder()
        .id(group.getId())
        .schoolName(group.getSchoolName())
        .studentCount(group.getStudentCount())
        .startDate(group.getStartDate())
        .endDate(group.getEndDate())
        .status(group.getStatus())
        .courseCount(courses.size())
        .courses(courses)
        .classLink(group.getClassLink())
        .announcement(group.getAnnouncement())
        .createdAt(group.getCreatedAt())
        .updatedAt(group.getUpdatedAt())
        .build();
}
```

### 3. 강의 그룹 공지사항 업데이트 API 🔴 (500 에러 발생 중)
```
PUT /api/instructors/{instructorId}/class-groups/{groupId}/announcement
Content-Type: application/json

요청 본문:
{
  "classLink": "https://zoom.us/j/123456789",
  "announcement": "다음 주 월요일 수업입니다. 준비물: 노트북"
}

응답 (200 OK):
{
  "success": true,
  "message": "공지사항이 업데이트되었습니다",
  "data": {
    "id": 1,
    "classLink": "https://zoom.us/j/123456789",
    "announcement": "다음 주 월요일 수업입니다. 준비물: 노트북",
    "updatedAt": "2025-01-16T11:00:00Z"
  }
}
```

### 4. 강의 그룹 삭제 API ✅ (구현 필요)
```
DELETE /api/instructors/{instructorId}/class-groups/{groupId}

응답 (200 OK):
{
  "success": true,
  "message": "강의 그룹이 삭제되었습니다"
}
```

**Spring Boot 구현 예시:**
```java
@DeleteMapping("/{instructorId}/class-groups/{groupId}")
public ResponseEntity<?> deleteClassGroup(
        @PathVariable Long instructorId,
        @PathVariable Long groupId) {
    
    InstructorClassGroup group = classGroupRepository
        .findByIdAndInstructorId(groupId, instructorId)
        .orElseThrow(() -> new ResourceNotFoundException("강의 그룹을 찾을 수 없습니다"));
    
    classGroupRepository.delete(group);
    
    return ResponseEntity.ok(Map.of(
        "success", true,
        "message", "강의 그룹이 삭제되었습니다"
    ));
}
```

## 데이터베이스 스키마 제안

### instructor_class_groups 테이블
```sql
CREATE TABLE instructor_class_groups (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  instructor_id BIGINT NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  student_count INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  class_link TEXT,
  announcement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);
```

### instructor_class_group_materials 테이블 (다대다 관계)
```sql
CREATE TABLE instructor_class_group_materials (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_group_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_group_id) REFERENCES instructor_class_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES learning_materials(id) ON DELETE CASCADE,
  UNIQUE KEY unique_group_material (class_group_id, material_id)
);
```

## Entity 클래스 예시

```java
@Entity
@Table(name = "instructor_class_groups")
@Data
public class InstructorClassGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;
    
    @Column(name = "school_name", nullable = false)
    private String schoolName;
    
    @Column(name = "student_count", nullable = false)
    private Integer studentCount;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "status")
    private String status = "active";
    
    @Column(name = "class_link", columnDefinition = "TEXT")
    private String classLink;
    
    @Column(name = "announcement", columnDefinition = "TEXT")
    private String announcement;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

@Entity
@Table(name = "instructor_class_group_materials")
@Data
public class InstructorClassGroupMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "class_group_id", nullable = false)
    private InstructorClassGroup classGroup;
    
    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private LearningMaterial material;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

## Repository 인터페이스

```java
public interface InstructorClassGroupRepository extends JpaRepository<InstructorClassGroup, Long> {
    List<InstructorClassGroup> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);
    Optional<InstructorClassGroup> findByIdAndInstructorId(Long id, Long instructorId);
}

public interface InstructorClassGroupMaterialRepository extends JpaRepository<InstructorClassGroupMaterial, Long> {
    List<InstructorClassGroupMaterial> findByClassGroupId(Long classGroupId);
}
```

## 프론트엔드 현재 상태
- ✅ UI 구현 완료 (그룹 카드, 공지사항 등록 버튼)
- ✅ API 호출 코드 작성 완료
- ✅ 에러 로깅 추가 완료
- ⏳ 백엔드 API 구현 대기 중

## 테스트 방법
1. 관리자 페이지 → 강사 관리 → [강의 할당] 버튼 클릭
2. 학교명, 수강 인원, 기간 입력 후 강의 선택
3. [할당하기] 버튼 클릭
4. [강의 관리] 버튼 클릭하여 할당된 그룹 확인
5. [공지 등록] 버튼으로 URL과 공지사항 입력

---
**작성일**: 2025-01-16
**최종 업데이트**: 2025-01-16 (공지사항 API 500 에러 추가)
**우선순위**: 긴급 🔴

