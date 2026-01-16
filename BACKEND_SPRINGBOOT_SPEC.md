# 날리자쿠 백엔드 API 명세서 (Spring Boot + MongoDB)

## 📌 프로젝트 개요
- **프로젝트명**: 날리자쿠 (드론 교육 플랫폼)
- **프론트엔드**: Next.js 15 (TypeScript)
- **백엔드**: Spring Boot + MongoDB
- **API 기본 URL**: `http://localhost:8080/api` (개발) / `https://api.nallijaku.com` (프로덕션)
- **인증**: JWT Bearer Token

---

## 🔐 인증 API

### 1. 회원가입
```
POST /api/auth/signup
Content-Type: application/json

요청 본문:
{
  "username": "string (3자 이상, 영문/숫자)",
  "password": "string (6자 이상)",
  "confirmPassword": "string",
  "email": "string (이메일 형식)",
  "organization": "string (선택사항)",
  "role": "GENERAL | TEACHER | ADMIN (기본값: GENERAL)",
  "phone": "string (선택사항)",
  "droneExperience": boolean,
  "termsAgreed": boolean (필수)
}

응답 (성공 - 200):
{
  "success": true,
  "message": "회원가입 성공",
  "data": {
    "userId": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "GENERAL"
  }
}

응답 (실패 - 400/409):
{
  "success": false,
  "message": "에러 메시지",
  "code": "DUPLICATE_USERNAME"
}
```

### 2. 로그인
```
POST /api/auth/login
Content-Type: application/json

요청 본문:
{
  "username": "string",
  "password": "string"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "userId": "ObjectId",
    "username": "string",
    "email": "string",
    "role": "GENERAL | TEACHER | ADMIN",
    "token": "JWT_TOKEN",
    "refreshToken": "REFRESH_TOKEN",
    "expiresIn": 86400
  }
}

응답 (실패 - 401):
{
  "success": false,
  "message": "아이디 또는 비밀번호가 잘못되었습니다",
  "code": "INVALID_CREDENTIALS"
}
```

### 3. 로그아웃
```
POST /api/auth/logout
Authorization: Bearer {token}

응답 (성공 - 200):
{
  "success": true,
  "message": "로그아웃 성공"
}
```

### 4. 토큰 갱신
```
POST /api/auth/refresh
Content-Type: application/json

요청 본문:
{
  "refreshToken": "string"
}

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "token": "NEW_JWT_TOKEN",
    "refreshToken": "NEW_REFRESH_TOKEN",
    "expiresIn": 86400
  }
}
```

---

## 📚 학습자료 API

### 1. 학습자료 목록 조회
```
GET /api/resources
GET /api/resources?category=진로
GET /api/resources?search=키워드
GET /api/resources?page=0&size=12

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "ObjectId",
        "category": "진로",
        "image": "/학습자료/진로-배송.png",
        "alt": "진로-배송",
        "instructor": "유한상 강사",
        "title": "진로-배송",
        "subtitle": "24년 2학기 디지털 새싹 데이터 분석가 전용 커리큘럼",
        "description": "상세 설명",
        "price": 0,
        "duration": "2시간",
        "level": "초급",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalElements": 12,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 12
  }
}
```

### 2. 학습자료 상세 조회
```
GET /api/resources/{id}

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "id": "ObjectId",
    "category": "진로",
    "image": "/학습자료/진로-배송.png",
    "alt": "진로-배송",
    "instructor": "유한상 강사",
    "title": "진로-배송",
    "subtitle": "24년 2학기 디지털 새싹 데이터 분석가 전용 커리큘럼",
    "description": "상세 설명",
    "price": 0,
    "duration": "2시간",
    "level": "초급",
    "content": "강의 내용",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 3. 카테고리 목록 조회
```
GET /api/resources/categories

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "categories": [
      "전체",
      "진로",
      "항공법",
      "군 드론",
      "드론 기초",
      "항공 역학",
      "항공촬영기법",
      "드론 조종",
      "과학교과연계",
      "전보교과연계",
      "메이커톤",
      "더아이엠씨",
      "젯슨나노"
    ]
  }
}
```

### 4. 학습자료 추가 (관리자)
```
POST /api/resources
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

요청 본문:
{
  "categoryId": number (필수),
  "subCategory": "string (선택사항)",
  "title": "string (필수)",
  "subtitle": "string (필수)",
  "description": "string (선택사항)",
  "instructor": "string (필수)",
  "price": number (선택사항, 기본값: 0),
  "duration": "string (선택사항)",
  "level": "string (선택사항)",
  "alt": "string (선택사항)",
  "file": File (이미지 파일, 선택사항),
  "imageUrl": "string (이미지 URL, 선택사항)"
}

응답 (성공 - 201):
{
  "success": true,
  "message": "학습자료가 추가되었습니다",
  "data": {
    "id": "ObjectId",
    "category": "진로",
    "subCategory": "배송",
    "title": "진로-배송",
    "subtitle": "24년 2학기 디지털 새싹 데이터 분석가 전용 커리큘럼",
    "image": "/uploads/images/xxx.png",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 5. 학습자료 수정 (관리자)
```
PUT /api/resources/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "category": "string (필수)",
  "subCategory": "string (선택사항)",
  "title": "string (필수)",
  "subtitle": "string (필수)",
  "description": "string (선택사항)",
  "instructor": "string (필수)",
  "price": number (선택사항),
  "duration": "string (선택사항)",
  "level": "string (선택사항)",
  "alt": "string (선택사항)",
  "image": "string (이미지 URL)"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "학습자료가 수정되었습니다",
  "data": {
    "id": "ObjectId",
    "category": "진로",
    "title": "진로-배송",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

### 6. 학습자료 삭제 (관리자)
```
DELETE /api/resources/{id}
Authorization: Bearer {admin_token}

⚠️ 중요: 삭제 시 외래 키 제약 조건 처리 필요
- instructor_courses 테이블에서 해당 learning_material_id를 참조하는 레코드를 먼저 삭제해야 함
- 또는 CASCADE 삭제 설정 필요

백엔드 구현 예시:
1. instructor_courses에서 learning_material_id = {id}인 레코드 삭제
2. learning_materials에서 id = {id}인 레코드 삭제

응답 (성공 - 200):
{
  "success": true,
  "message": "학습자료가 삭제되었습니다"
}

응답 (실패 - 404):
{
  "success": false,
  "message": "학습자료를 찾을 수 없습니다",
  "code": "RESOURCE_NOT_FOUND"
}

응답 (실패 - 403):
{
  "success": false,
  "message": "권한이 없습니다",
  "code": "FORBIDDEN"
}

응답 (실패 - 409):
{
  "success": false,
  "message": "다른 데이터에서 참조 중인 학습자료는 삭제할 수 없습니다",
  "code": "FOREIGN_KEY_CONSTRAINT",
  "details": {
    "referencedBy": ["instructor_courses"]
  }
}
```

---

## � 카 테고리 관리 API (관리자)

### 1. 계층형 카테고리 목록 조회
```
GET /api/categories

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "전체",
        "subCategories": []
      },
      {
        "id": 2,
        "name": "드론",
        "subCategories": [
          {
            "id": 10,
            "name": "촬영드론",
            "parentId": 2
          },
          {
            "id": 11,
            "name": "레이싱드론",
            "parentId": 2
          }
        ]
      },
      {
        "id": 3,
        "name": "AI",
        "subCategories": [
          {
            "id": 20,
            "name": "머신러닝",
            "parentId": 3
          }
        ]
      }
    ]
  }
}
```

### 2. 메인 카테고리 추가 (관리자)
```
POST /api/admin/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "name": "string (필수, 카테고리명)"
}

응답 (성공 - 201):
{
  "success": true,
  "message": "카테고리가 추가되었습니다",
  "data": {
    "id": 4,
    "name": "환경",
    "subCategories": []
  }
}

응답 (실패 - 409):
{
  "success": false,
  "message": "이미 존재하는 카테고리입니다",
  "code": "DUPLICATE_CATEGORY"
}
```

### 3. 서브카테고리 추가 (관리자)
```
POST /api/admin/categories/subcategories
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "name": "string (필수, 서브카테고리명)",
  "parentId": number (필수, 부모 카테고리 ID)
}

응답 (성공 - 201):
{
  "success": true,
  "message": "서브카테고리가 추가되었습니다",
  "data": {
    "id": 21,
    "name": "딥러닝",
    "parentId": 3
  }
}

응답 (실패 - 404):
{
  "success": false,
  "message": "부모 카테고리를 찾을 수 없습니다",
  "code": "PARENT_CATEGORY_NOT_FOUND"
}

응답 (실패 - 409):
{
  "success": false,
  "message": "이미 존재하는 서브카테고리입니다",
  "code": "DUPLICATE_SUBCATEGORY"
}
```

### 4. 메인 카테고리 삭제 (관리자)
```
DELETE /api/admin/categories/{categoryId}
Authorization: Bearer {admin_token}

⚠️ 중요: 
- 해당 카테고리에 속한 모든 서브카테고리도 함께 삭제됩니다
- 해당 카테고리를 사용하는 학습자료가 있으면 삭제 실패

응답 (성공 - 200):
{
  "success": true,
  "message": "카테고리가 삭제되었습니다"
}

응답 (실패 - 404):
{
  "success": false,
  "message": "카테고리를 찾을 수 없습니다",
  "code": "CATEGORY_NOT_FOUND"
}

응답 (실패 - 409):
{
  "success": false,
  "message": "이 카테고리를 사용하는 학습자료가 있어 삭제할 수 없습니다",
  "code": "CATEGORY_IN_USE",
  "details": {
    "resourceCount": 5
  }
}
```

### 5. 서브카테고리 삭제 (관리자)
```
DELETE /api/admin/categories/{categoryId}/subcategories/{subCategoryName}
Authorization: Bearer {admin_token}

⚠️ 중요:
- categoryId는 부모 카테고리의 ID입니다
- subCategoryName은 URL 인코딩되어 전달됩니다 (예: "촬영드론" → "%EC%B4%AC%EC%98%81%EB%93%9C%EB%A1%A0")
- 백엔드에서 URL 디코딩 처리 필요
- 해당 서브카테고리를 사용하는 학습자료가 있으면 삭제 실패

백엔드 구현 예시:
```java
@DeleteMapping("/admin/categories/{categoryId}/subcategories/{subCategoryName}")
public ResponseEntity<?> deleteSubCategory(
    @PathVariable Long categoryId,
    @PathVariable String subCategoryName  // Spring이 자동으로 URL 디코딩
) {
    // 1. 부모 카테고리 존재 확인
    Category parentCategory = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new CategoryNotFoundException("부모 카테고리를 찾을 수 없습니다: " + categoryId));
    
    // 2. 서브카테고리 찾기
    SubCategory subCategory = subCategoryRepository
        .findByParentIdAndName(categoryId, subCategoryName)
        .orElseThrow(() -> new SubCategoryNotFoundException("서브카테고리를 찾을 수 없습니다: " + subCategoryName));
    
    // 3. 사용 중인지 확인
    long resourceCount = learningMaterialRepository.countBySubCategory(subCategoryName);
    if (resourceCount > 0) {
        throw new SubCategoryInUseException("이 서브카테고리를 사용하는 학습자료가 " + resourceCount + "개 있습니다");
    }
    
    // 4. 삭제
    subCategoryRepository.delete(subCategory);
    
    return ResponseEntity.ok(new ApiResponse(true, "서브카테고리가 삭제되었습니다"));
}
```

응답 (성공 - 200):
{
  "success": true,
  "message": "서브카테고리가 삭제되었습니다"
}

응답 (실패 - 400):
{
  "success": false,
  "message": "부모 카테고리를 찾을 수 없습니다: 3",
  "code": "PARENT_CATEGORY_NOT_FOUND"
}

응답 (실패 - 404):
{
  "success": false,
  "message": "서브카테고리를 찾을 수 없습니다: 촬영드론",
  "code": "SUBCATEGORY_NOT_FOUND"
}

응답 (실패 - 409):
{
  "success": false,
  "message": "이 서브카테고리를 사용하는 학습자료가 3개 있습니다",
  "code": "SUBCATEGORY_IN_USE",
  "details": {
    "resourceCount": 3
  }
}
```

### 6. 서브카테고리 목록 조회
```
GET /api/categories/subcategories

응답 (성공 - 200):
{
  "success": true,
  "data": [
    {
      "id": 10,
      "name": "촬영드론",
      "parentId": 2,
      "parentName": "드론"
    },
    {
      "id": 11,
      "name": "레이싱드론",
      "parentId": 2,
      "parentName": "드론"
    },
    {
      "id": 20,
      "name": "머신러닝",
      "parentId": 3,
      "parentName": "AI"
    }
  ]
}
```

---

## 👨‍🏫 강사 API

### 1. 강사 목록 조회
```
GET /api/instructors
GET /api/instructors?region=서울
GET /api/instructors?page=0&size=10

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "ObjectId",
        "name": "이동연",
        "region": "수원",
        "image": "dongyeon.jpeg",
        "subtitle": "코딩으로 배우는 드론",
        "bio": "강사 소개",
        "experience": "5년",
        "specialties": ["드론 조종", "코딩"],
        "rating": 4.8,
        "reviewCount": 25,
        "contact": "010-0000-0000",
        "email": "instructor@example.com"
      }
    ],
    "totalElements": 4,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### 2. 강사 상세 조회
```
GET /api/instructors/{id}

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "id": "ObjectId",
    "name": "이동연",
    "region": "수원",
    "image": "dongyeon.jpeg",
    "subtitle": "코딩으로 배우는 드론",
    "bio": "강사 소개",
    "experience": "5년",
    "specialties": ["드론 조종", "코딩"],
    "rating": 4.8,
    "reviewCount": 25,
    "curriculum": [
      {
        "id": "ObjectId",
        "title": "드론 기초",
        "description": "드론의 기초를 배웁니다"
      }
    ],
    "contact": "010-0000-0000",
    "email": "instructor@example.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 3. 지역 목록 조회
```
GET /api/instructors/regions

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "regions": [
      "전체",
      "서울",
      "경기",
      "충북",
      "충남",
      "강원",
      "전북",
      "전남",
      "경북",
      "경남",
      "제주"
    ]
  }
}
```

### 4. 강사 초대 요청
```
POST /api/instructors/{id}/invite
Authorization: Bearer {token}
Content-Type: application/json

요청 본문:
{
  "schoolName": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "message": "string (선택사항)"
}

응답 (성공 - 201):
{
  "success": true,
  "message": "강사 초대 요청이 전송되었습니다",
  "data": {
    "inviteId": "ObjectId",
    "status": "pending"
  }
}
```

---

## 🛒 장바구니 API

### 1. 장바구니 추가
```
POST /api/cart
Authorization: Bearer {token}
Content-Type: application/json

요청 본문:
{
  "materialId": "ObjectId",
  "quantity": 1
}

응답 (성공 - 201):
{
  "success": true,
  "message": "장바구니에 추가되었습니다",
  "data": {
    "cartId": "ObjectId",
    "items": [
      {
        "id": "ObjectId",
        "materialId": "ObjectId",
        "title": "진로-배송",
        "instructor": "유한상 강사",
        "quantity": 1
      }
    ]
  }
}
```

### 2. 장바구니 조회
```
GET /api/cart
Authorization: Bearer {token}

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "cartId": "ObjectId",
    "userId": "ObjectId",
    "items": [
      {
        "id": "ObjectId",
        "materialId": "ObjectId",
        "title": "진로-배송",
        "instructor": "유한상 강사",
        "category": "진로",
        "quantity": 1
      }
    ],
    "totalItems": 1
  }
}
```

### 3. 장바구니 항목 제거
```
DELETE /api/cart/{itemId}
Authorization: Bearer {token}

응답 (성공 - 200):
{
  "success": true,
  "message": "장바구니에서 제거되었습니다"
}
```

### 4. 장바구니 비우기
```
DELETE /api/cart
Authorization: Bearer {token}

응답 (성공 - 200):
{
  "success": true,
  "message": "장바구니가 비워졌습니다"
}
```

---

## 📋 교육 도입 신청 API

### 1. 교육 도입 신청 제출
```
POST /api/education-inquiries
Authorization: Bearer {token} (선택사항)
Content-Type: application/json

요청 본문:
{
  "schoolName": "string (필수)",
  "contactPerson": "string (필수)",
  "phone": "string (필수)",
  "email": "string (필수)",
  "studentCount": number (필수),
  "budget": "string (선택사항)",
  "educationRegion": "string (선택사항)",
  "grade": "string (선택사항)",
  "preferredDate": "string (선택사항)",
  "inquiryMessage": "string (선택사항)",
  "consultationType": [
    "교구 구매 문의",
    "학교(기관) 출강 문의",
    "진로 체험 출강 문의",
    "체험 부스 위탁 문의"
  ],
  "selectedMaterials": [
    {
      "id": "ObjectId",
      "title": "진로-배송",
      "instructor": "유한상 강사"
    }
  ],
  "privacyAgreed": true
}

응답 (성공 - 201):
{
  "success": true,
  "message": "교육 도입 신청이 접수되었습니다",
  "data": {
    "inquiryId": "ObjectId",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 2. 교육 도입 신청 조회 (관리자)
```
GET /api/education-inquiries
Authorization: Bearer {admin_token}
GET /api/education-inquiries?status=pending
GET /api/education-inquiries?page=0&size=20

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "ObjectId",
        "schoolName": "학교명",
        "contactPerson": "담당자명",
        "phone": "010-0000-0000",
        "email": "contact@school.edu",
        "studentCount": 30,
        "status": "pending | contacted | completed",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

### 3. 교육 도입 신청 상태 변경 (관리자)
```
PATCH /api/education-inquiries/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "status": "pending | contacted | completed"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "상태가 변경되었습니다"
}
```

---

## 🤝 파트너 모집 API

### 1. 파트너 지원 제출
```
POST /api/partner-applications
Content-Type: application/json

요청 본문:
{
  "name": "string (필수)",
  "email": "string (필수)",
  "phone": "string (필수)",
  "organization": "string (필수)",
  "position": "string (필수)",
  "experience": "string (필수)",
  "motivation": "string (필수)",
  "region": "string (선택사항)",
  "attachments": "string (선택사항, 파일 URL)"
}

응답 (성공 - 201):
{
  "success": true,
  "message": "파트너 지원이 접수되었습니다",
  "data": {
    "applicationId": "ObjectId",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

### 2. 파트너 지원 조회 (관리자)
```
GET /api/partner-applications
Authorization: Bearer {admin_token}
GET /api/partner-applications?status=pending
GET /api/partner-applications?page=0&size=20

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "ObjectId",
        "name": "이름",
        "email": "email@example.com",
        "organization": "기관명",
        "status": "pending | approved | rejected",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalElements": 5,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

### 3. 파트너 지원 상태 변경 (관리자)
```
PATCH /api/partner-applications/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "status": "pending | approved | rejected"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "상태가 변경되었습니다"
}
```

---

## 🏥 시스템 API

### 1. 서버 상태 확인
```
GET /api/health

응답 (성공 - 200):
{
  "status": "UP",
  "message": "서버가 정상 작동 중입니다"
}
```

### 2. 사용자 수 조회
```
GET /api/users/count

응답 (성공 - 200):
{
  "success": true,
  "data": {
    "count": 150
  }
}
```

### 3. 사용자 목록 조회 (관리자)
```
GET /api/users
Authorization: Bearer {admin_token}

응답 (성공 - 200):
{
  "success": true,
  "data": [
    {
      "id": "ObjectId",
      "username": "string",
      "email": "string",
      "organization": "string",
      "role": "USER | INSTRUCTOR | ADMIN",
      "phone": "string",
      "droneExperience": boolean,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "count": 150
}
```

### 4. 사용자 역할 변경 (관리자)
```
PUT /api/users/{id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "role": "USER | INSTRUCTOR | ADMIN"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "역할이 변경되었습니다",
  "data": {
    "id": "ObjectId",
    "username": "string",
    "role": "INSTRUCTOR"
  }
}

응답 (실패 - 400):
{
  "success": false,
  "message": "유효하지 않은 역할입니다",
  "code": "INVALID_ROLE"
}

응답 (실패 - 404):
{
  "success": false,
  "message": "사용자를 찾을 수 없습니다",
  "code": "USER_NOT_FOUND"
}
```

### 5. 계정 활성화/비활성화 (관리자)
```
PATCH /api/users/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "status": "ACTIVE | INACTIVE"
}

응답 (성공 - 200):
{
  "success": true,
  "message": "계정 상태가 변경되었습니다"
}
```

### 6. 계정 잠금/해제 (관리자)
```
PATCH /api/users/{id}/lock
Authorization: Bearer {admin_token}
Content-Type: application/json

요청 본문:
{
  "locked": true | false
}

응답 (성공 - 200):
{
  "success": true,
  "message": "계정 잠금 상태가 변경되었습니다"
}
```

### 7. 사용자 삭제 (관리자)
```
DELETE /api/users/{id}
Authorization: Bearer {admin_token}

응답 (성공 - 200):
{
  "success": true,
  "message": "사용자가 삭제되었습니다"
}

응답 (실패 - 404):
{
  "success": false,
  "message": "사용자를 찾을 수 없습니다",
  "code": "USER_NOT_FOUND"
}
```

---

## 📊 MongoDB 컬렉션 스키마

### User 컬렉션
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  email: String (unique, required),
  organization: String,
  role: String (GENERAL | TEACHER | ADMIN),
  phone: String,
  droneExperience: Boolean,
  termsAgreed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Material 컬렉션
```javascript
{
  _id: ObjectId,
  category: String (required),
  image: String,
  alt: String,
  instructor: String,
  title: String (required),
  subtitle: String,
  description: String,
  price: Number,
  duration: String,
  level: String,
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.materials.createIndex({ category: 1 })
db.materials.createIndex({ title: "text", subtitle: "text" })
```

### Instructor 컬렉션
```javascript
{
  _id: ObjectId,
  name: String (required),
  region: String,
  image: String,
  subtitle: String,
  bio: String,
  experience: String,
  specialties: [String],
  rating: Number,
  reviewCount: Number,
  contact: String,
  email: String,
  curriculum: [
    {
      id: ObjectId,
      title: String,
      description: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.instructors.createIndex({ region: 1 })
```

### Cart 컬렉션
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required),
  items: [
    {
      id: ObjectId,
      materialId: ObjectId,
      title: String,
      instructor: String,
      category: String,
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.carts.createIndex({ userId: 1 }, { unique: true })
```

### EducationInquiry 컬렉션
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  schoolName: String (required),
  contactPerson: String (required),
  phone: String (required),
  email: String (required),
  studentCount: Number (required),
  budget: String,
  educationRegion: String,
  grade: String,
  preferredDate: String,
  inquiryMessage: String,
  consultationType: [String],
  selectedMaterials: [
    {
      id: ObjectId,
      title: String,
      instructor: String
    }
  ],
  status: String (pending | contacted | completed),
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.educationInquiries.createIndex({ status: 1 })
db.educationInquiries.createIndex({ createdAt: -1 })
```

### PartnerApplication 컬렉션
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (required),
  organization: String (required),
  position: String (required),
  experience: String (required),
  motivation: String (required),
  region: String,
  attachments: String,
  status: String (pending | approved | rejected),
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.partnerApplications.createIndex({ status: 1 })
```

### InstructorInvite 컬렉션
```javascript
{
  _id: ObjectId,
  instructorId: ObjectId (required),
  userId: ObjectId,
  schoolName: String (required),
  contactPerson: String (required),
  phone: String (required),
  email: String (required),
  message: String,
  status: String (pending | accepted | rejected),
  createdAt: Date,
  updatedAt: Date
}

// 인덱스
db.instructorInvites.createIndex({ status: 1 })
```

---

## 🔒 인증 방식

모든 보호된 엔드포인트는 다음 헤더가 필요합니다:
```
Authorization: Bearer {JWT_TOKEN}
```

JWT 토큰은 로그인 시 응답으로 받습니다.

---

## ⚠️ 에러 응답 형식

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {}
}
```

### 일반적인 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 찾을 수 없음
- `409`: 충돌 (예: 중복된 사용자명)
- `500`: 서버 오류

---

## 🚀 Spring Boot 개발 팁

### 1. 의존성 (pom.xml)
```xml
<!-- Spring Boot Web -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Data MongoDB -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

<!-- JWT -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.12.3</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.12.3</version>
  <scope>runtime</scope>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-jackson</artifactId>
  <version>0.12.3</version>
  <scope>runtime</scope>
</dependency>

<!-- Spring Security -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>

<!-- Validation -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 2. application.yml 설정
```yaml
spring:
  application:
    name: nalijaku-backend
  
  data:
    mongodb:
      uri: mongodb://localhost:27017/nalijaku
      # 또는
      # host: localhost
      # port: 27017
      # database: nalijaku
  
  jpa:
    show-sql: true

server:
  port: 8080
  servlet:
    context-path: /api

jwt:
  secret: your_jwt_secret_key_here_make_it_long_and_secure
  expiration: 86400000  # 24시간 (밀리초)
  refresh-expiration: 604800000  # 7일 (밀리초)

cors:
  allowed-origins: http://localhost:3000,https://nallijaku.com
  allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

### 3. CORS 설정
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "https://nallijaku.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

---

## 📞 연락처

프론트엔드: [이름] - [연락처]
백엔드: [이름] - [연락처]

마지막 업데이트: 2025-01-19
