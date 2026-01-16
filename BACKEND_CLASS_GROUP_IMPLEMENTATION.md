# 강의 그룹 기능 구현 요청

## ⚠️ 현재 상태
- 프론트엔드: 학교/기관 이름 입력 필드 추가 완료
- 임시로 기존 API(`/api/instructors/{id}/assign-courses`) 사용 중
- 백엔드 새 API 구현 후 프론트엔드 전환 예정

## 📋 변경 사항 요약

### 기존 방식
- 강의 1개 = 카드 1개
- API: `POST /api/instructors/{id}/assign-courses`

### 새로운 방식  
- 학교/기관 1개 = 카드 1개 (여러 강의 포함)
- API: `POST /api/instructors/{id}/class-groups`

## 🔌 구현해야 할 API

### 0. 기존 API 수정 (임시 대응)
현재 프론트엔드가 사용 중인 API에 `schoolName` 필드 추가:

```
POST /api/instructors/{instructorId}/assign-courses
Authorization: Bearer {admin_token}
Content-Type: application/json

요청:
{
  "schoolName": "서울초등학교",  // 새로 추가
  "studentCount": 30,
  "startDate": "2025-01-15",
  "endDate": "2025-03-15",
  "materialIds": [1, 2, 3, 4]
}

응답 (201):
{
  "success": true,
  "message": "강의가 할당되었습니다"
}
```

**참고**: `schoolName`은 현재 저장하지 않아도 됩니다. 나중에 새 API로 전환할 때 사용할 예정입니다.

---

### 1. 강의 그룹 할당 (최우선)
```
POST /api/instructors/{instructorId}/class-groups
Authorization: Bearer {admin_token}
Content-Type: application/json

요청:
{
  "schoolName": "서울초등학교",
  "studentCount": 30,
  "startDate": "2025-01-15",
  "endDate": "2025-03-15",
  "materialIds": [1, 2, 3, 4]
}

응답 (201):
{
  "success": true,
  "message": "강의 그룹이 할당되었습니다",
  "data": {
    "id": 1,
    "instructorId": 14,
    "schoolName": "서울초등학교",
    "studentCount": 30,
    "startDate": "2025-01-15",
    "endDate": "2025-03-15",
    "status": "active",
    "courses": [...]
  }
}
```

### 2. 강의 그룹 목록 조회
```
GET /api/instructors/{instructorId}/class-groups

응답 (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "schoolName": "서울초등학교",
      "studentCount": 30,
      "startDate": "2025-01-15",
      "endDate": "2025-03-15",
      "courseCount": 4,
      "courses": [...]
    }
  ]
}
```

### 3. 강의 그룹 삭제
```
DELETE /api/instructors/{instructorId}/class-groups/{groupId}

응답 (200):
{
  "success": true,
  "message": "강의 그룹이 삭제되었습니다"
}
```

## 📊 데이터베이스 스키마

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);
```

### instructor_class_group_courses 테이블 (다대다 관계)
```sql
CREATE TABLE instructor_class_group_courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_group_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_group_id) REFERENCES instructor_class_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES learning_materials(id) ON DELETE CASCADE
);
```

## ✅ 구현 체크리스트

- [ ] `InstructorClassGroup` 엔티티 생성
- [ ] `InstructorClassGroupCourse` 엔티티 생성 (조인 테이블)
- [ ] POST `/api/instructors/{id}/class-groups` 구현
- [ ] GET `/api/instructors/{id}/class-groups` 구현
- [ ] DELETE `/api/instructors/{id}/class-groups/{groupId}` 구현
- [ ] 기존 `/api/instructors/{id}/courses` API 유지 (하위 호환성)

## 🔄 마이그레이션

기존 `instructor_courses` 데이터를 새로운 구조로 마이그레이션:

```sql
-- 1. 기존 강의들을 "미지정" 그룹으로 묶기
INSERT INTO instructor_class_groups (instructor_id, school_name, student_count, start_date, end_date, status)
SELECT DISTINCT
  instructor_id,
  '미지정' as school_name,
  0 as student_count,
  CURDATE() as start_date,
  DATE_ADD(CURDATE(), INTERVAL 3 MONTH) as end_date,
  'active' as status
FROM instructor_courses
GROUP BY instructor_id;

-- 2. 강의 연결
INSERT INTO instructor_class_group_courses (class_group_id, material_id)
SELECT 
  icg.id as class_group_id,
  ic.learning_material_id as material_id
FROM instructor_courses ic
JOIN instructor_class_groups icg ON ic.instructor_id = icg.instructor_id
WHERE icg.school_name = '미지정';
```

## 📝 참고 문서

- 상세 스펙: `INSTRUCTOR_CLASS_GROUP_SPEC.md`
- 백엔드 체크리스트: `BACKEND_CHECKLIST.md`

---

**작성일**: 2025-01-15
**우선순위**: 🔴 높음
