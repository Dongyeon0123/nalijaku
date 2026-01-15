# 강사 강의 관리 API 명세서

## 📌 개요
강사가 자신에게 할당된 강의를 관리하고, 수강생 정보를 확인할 수 있는 API 명세입니다.

---

## 🎯 주요 기능

1. **강사 강의 목록 조회** - 강사에게 할당된 강의 목록
2. **강의 상세 정보 조회** - 특정 강의의 상세 정보 및 수강생 목록
3. **강의 자료 관리** - 강의 자료 업로드/수정/삭제
4. **수강생 진행률 조회** - 수강생별 학습 진행 상황
5. **공지사항 관리** - 강의별 공지사항 작성/수정

---

## 📚 API 엔드포인트

### 1. 강사 강의 목록 조회

```
GET /api/instructors/{instructorId}/courses
Authorization: Bearer {token}
```

**설명**: 특정 강사에게 할당된 모든 강의 목록을 조회합니다.

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "드론 기초 과정",
      "thumbnail": "/images/drone-basic.jpg",
      "description": "드론의 기초부터 실전까지 배우는 과정입니다.",
      "studentCount": 25,
      "avgProgress": 68.5,
      "status": "active",
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "title": "드론 코딩 심화",
      "thumbnail": "/images/drone-coding.jpg",
      "description": "Python을 활용한 드론 자율비행 프로그래밍",
      "studentCount": 18,
      "avgProgress": 45.2,
      "status": "active",
      "createdAt": "2025-01-15T00:00:00Z"
    }
  ]
}
```

**필드 설명**:
- `id`: 강의 ID
- `title`: 강의 제목
- `thumbnail`: 썸네일 이미지 URL
- `description`: 강의 설명
- `studentCount`: 수강생 수
- `avgProgress`: 평균 진행률 (0-100)
- `status`: 강의 상태 (`active` | `completed`)
- `createdAt`: 강의 생성일

---

### 2. 강의 상세 정보 조회

```
GET /api/courses/{courseId}
Authorization: Bearer {token}
```

**설명**: 특정 강의의 상세 정보를 조회합니다.

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "드론 기초 과정",
    "thumbnail": "/images/drone-basic.jpg",
    "description": "드론의 기초부터 실전까지 배우는 과정입니다.",
    "instructorId": 5,
    "instructorName": "이동연",
    "studentCount": 25,
    "avgProgress": 68.5,
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z",
    "materials": [
      {
        "id": 1,
        "title": "1주차 - 드론 소개",
        "fileUrl": "/materials/week1.pdf",
        "fileType": "pdf",
        "uploadedAt": "2025-01-01T00:00:00Z"
      },
      {
        "id": 2,
        "title": "2주차 - 드론 조종 기초",
        "fileUrl": "/materials/week2.pdf",
        "fileType": "pdf",
        "uploadedAt": "2025-01-08T00:00:00Z"
      }
    ],
    "announcements": [
      {
        "id": 1,
        "title": "첫 수업 안내",
        "content": "다음 주 월요일부터 수업이 시작됩니다.",
        "createdAt": "2024-12-25T00:00:00Z"
      }
    ]
  }
}
```

---

### 3. 강의 수강생 목록 조회

```
GET /api/courses/{courseId}/students
Authorization: Bearer {token}
```

**설명**: 특정 강의의 수강생 목록과 진행률을 조회합니다.

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "data": {
    "courseId": 1,
    "courseTitle": "드론 기초 과정",
    "students": [
      {
        "userId": 10,
        "username": "김철수",
        "email": "chulsoo@example.com",
        "enrolledAt": "2025-01-05T00:00:00Z",
        "progress": 85,
        "lastAccessedAt": "2025-01-14T15:30:00Z",
        "completedAt": null
      },
      {
        "userId": 11,
        "username": "박영희",
        "email": "younghee@example.com",
        "enrolledAt": "2025-01-06T00:00:00Z",
        "progress": 100,
        "lastAccessedAt": "2025-01-13T10:20:00Z",
        "completedAt": "2025-01-13T10:20:00Z"
      }
    ],
    "totalStudents": 25,
    "completedStudents": 8
  }
}
```

**필드 설명**:
- `progress`: 학습 진행률 (0-100)
- `lastAccessedAt`: 마지막 접속 시간
- `completedAt`: 수료 완료 시간 (null이면 미완료)

---

### 4. 강의 자료 업로드

```
POST /api/courses/{courseId}/materials
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**요청 본문**:
```
title: "3주차 - 드론 안전 수칙"
file: [파일]
```

**응답 (성공 - 201)**:
```json
{
  "success": true,
  "message": "강의 자료가 업로드되었습니다",
  "data": {
    "id": 3,
    "title": "3주차 - 드론 안전 수칙",
    "fileUrl": "/materials/week3.pdf",
    "fileType": "pdf",
    "uploadedAt": "2025-01-15T14:30:00Z"
  }
}
```

---

### 5. 강의 자료 삭제

```
DELETE /api/courses/{courseId}/materials/{materialId}
Authorization: Bearer {token}
```

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "message": "강의 자료가 삭제되었습니다"
}
```

---

### 6. 공지사항 작성

```
POST /api/courses/{courseId}/announcements
Authorization: Bearer {token}
Content-Type: application/json
```

**요청 본문**:
```json
{
  "title": "중간고사 안내",
  "content": "다음 주 수요일에 중간고사가 있습니다. 1-5주차 내용을 복습해주세요."
}
```

**응답 (성공 - 201)**:
```json
{
  "success": true,
  "message": "공지사항이 작성되었습니다",
  "data": {
    "id": 2,
    "title": "중간고사 안내",
    "content": "다음 주 수요일에 중간고사가 있습니다. 1-5주차 내용을 복습해주세요.",
    "createdAt": "2025-01-15T16:00:00Z"
  }
}
```

---

### 7. 공지사항 수정

```
PUT /api/courses/{courseId}/announcements/{announcementId}
Authorization: Bearer {token}
Content-Type: application/json
```

**요청 본문**:
```json
{
  "title": "중간고사 일정 변경",
  "content": "중간고사가 다음 주 금요일로 변경되었습니다."
}
```

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "message": "공지사항이 수정되었습니다"
}
```

---

### 8. 공지사항 삭제

```
DELETE /api/courses/{courseId}/announcements/{announcementId}
Authorization: Bearer {token}
```

**응답 (성공 - 200)**:
```json
{
  "success": true,
  "message": "공지사항이 삭제되었습니다"
}
```

---

## 🗄️ MongoDB 컬렉션 스키마

### Course 컬렉션
```javascript
{
  _id: ObjectId,
  title: String (required),
  thumbnail: String,
  description: String,
  instructorId: ObjectId (required),
  instructorName: String,
  status: String (active | completed),
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.courses.createIndex({ instructorId: 1 })
db.courses.createIndex({ status: 1 })
```

### CourseMaterial 컬렉션
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (required),
  title: String (required),
  fileUrl: String (required),
  fileType: String (pdf | video | image | etc),
  uploadedAt: Date
}

// 인덱스
db.courseMaterials.createIndex({ courseId: 1 })
```

### CourseEnrollment 컬렉션
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (required),
  userId: ObjectId (required),
  enrolledAt: Date,
  progress: Number (0-100),
  lastAccessedAt: Date,
  completedAt: Date (nullable)
}

// 인덱스
db.courseEnrollments.createIndex({ courseId: 1 })
db.courseEnrollments.createIndex({ userId: 1 })
db.courseEnrollments.createIndex({ courseId: 1, userId: 1 }, { unique: true })
```

### CourseAnnouncement 컬렉션
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (required),
  title: String (required),
  content: String (required),
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.courseAnnouncements.createIndex({ courseId: 1 })
db.courseAnnouncements.createIndex({ createdAt: -1 })
```

---

## 🔐 권한 관리

### 강사 권한 확인
- 강사는 자신에게 할당된 강의만 조회/수정 가능
- `instructorId`와 로그인한 사용자의 ID가 일치하는지 확인 필요

### SecurityConfig 설정 예시
```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/instructors/*/courses").hasAnyRole("TEACHER", "ADMIN")
    .requestMatchers("/api/courses/*/students").hasAnyRole("TEACHER", "ADMIN")
    .requestMatchers("/api/courses/*/materials").hasAnyRole("TEACHER", "ADMIN")
    .requestMatchers("/api/courses/*/announcements").hasAnyRole("TEACHER", "ADMIN")
);
```

---

## 📊 통계 계산 로직

### 평균 진행률 계산
```javascript
// MongoDB Aggregation 예시
db.courseEnrollments.aggregate([
  { $match: { courseId: ObjectId("...") } },
  { $group: {
      _id: "$courseId",
      avgProgress: { $avg: "$progress" },
      studentCount: { $sum: 1 },
      completedCount: {
        $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] }
      }
    }
  }
])
```

---

## ⚠️ 에러 응답

### 403 Forbidden (권한 없음)
```json
{
  "success": false,
  "message": "이 강의에 대한 권한이 없습니다",
  "code": "FORBIDDEN"
}
```

### 404 Not Found (강의 없음)
```json
{
  "success": false,
  "message": "강의를 찾을 수 없습니다",
  "code": "COURSE_NOT_FOUND"
}
```

---

## 🚀 구현 우선순위

### Phase 1 (필수)
1. ✅ 강사 강의 목록 조회 API
2. ✅ 강의 상세 정보 조회 API
3. ✅ 수강생 목록 및 진행률 조회 API

### Phase 2 (중요)
1. 강의 자료 업로드/삭제 API
2. 공지사항 작성/수정/삭제 API

### Phase 3 (추가)
1. 수강생별 상세 학습 기록
2. 강의 통계 대시보드
3. 실시간 알림 기능

---

## 📝 프론트엔드 구현 완료

### ✅ 완료된 기능
- [x] 강사 역할 확인 로직
- [x] "내 강의" 탭 추가 (TEACHER 역할만 표시)
- [x] 강의 목록 UI
- [x] 강의 통계 카드 (담당 강의, 총 수강생, 평균 진행률)
- [x] 강의 카드 디자인 (썸네일, 제목, 설명, 수강생 수, 진행률)
- [x] 강의 관리 버튼 (클릭 시 `/instructor/courses/{id}` 이동)

### 🔜 백엔드 구현 필요
- [ ] `GET /api/instructors/{instructorId}/courses` - 강사 강의 목록
- [ ] `GET /api/courses/{courseId}` - 강의 상세 정보
- [ ] `GET /api/courses/{courseId}/students` - 수강생 목록
- [ ] `POST /api/courses/{courseId}/materials` - 강의 자료 업로드
- [ ] `POST /api/courses/{courseId}/announcements` - 공지사항 작성

---

**마지막 업데이트**: 2025-01-15
**작성자**: 프론트엔드 팀
