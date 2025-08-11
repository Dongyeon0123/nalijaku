## 개발 이슈 & 해결 과정

### 1. Why 섹션 이미지 애니메이션 미작동
- **문제**: 페이지 로딩 후 스크롤 시 Why 섹션 이미지가 아래에서 위로 올라오는 애니메이션이 작동하지 않음  
- **원인**  
  - CSS에 애니메이션 스타일만 있고, JavaScript로 요소 가시성 감지 로직 없음  
  - CSS 중복 스타일 충돌 발생  
- **해결**  
  - Intersection Observer 추가  
  - CSS 중복 스타일 정리 및 animateUp 클래스 추가  
  - 각 이미지 카드에 animateUp과 delay 클래스 적용  

---

### 2. Hover 애니메이션에 딜레이 발생
- **문제**: 이미지 등장 순차 효과(delay1, delay2, delay3)가 hover 애니메이션에도 적용되어 느린 반응 발생  
- **원인**: 등장 애니메이션과 hover 효과가 동일한 transition을 공유  
- **해결**  
  - 등장 애니메이션과 hover 효과를 완전히 분리  
  - animationComplete 상태 추가 후, 애니메이션 완료 시에만 hover 활성화  
  - CSS에서 :hover 상태에만 별도 transition 적용  

---

### 3. Hover 해제 시 느린 반응
- **문제**: 마우스를 뗄 때도 transition이 적용되어 원래 상태로 늦게 복귀  
- **원인**: :not(:hover) 상태에서도 transition이 적용됨  
- **해결**  
  - :not(:hover) 상태에서는 transition: transform 0s ease 적용  
  - Hover 시에만 transition: transform 0.3s ease 적용  

---

### 4. Customer → Why 전환 시 사이드바 색상 깜빡임
- **문제**: 섹션 전환 시 Sidebar 색상이 잠깐 잘못 표시됨  
- **원인**: 스크롤 감지 로직이 전환 지점에서 잘못된 섹션을 활성화  
- **해결**  
  - 거리 기반 감지 로직으로 개선  
  - 이전 섹션과 다를 때만 상태 업데이트  
  - requestAnimationFrame 기반 throttle 적용  

---

### 5. ESLint 컴파일 오류
- **문제**: npm run build 시 ESLint 오류 발생  
- **원인**  
  - HTML에서 작은따옴표 사용  
  - 사용되지 않는 변수 존재  
- **해결**  
  - 특허명: '드론 조작 연습 및 테스트 시스템' → 특허명: &apos;드론 조작 연습 및 테스트 시스템&apos;  
  - 사용되지 않는 sectionBottom 변수 제거  

---

### 6. 애니메이션이 너무 빨리 활성화됨
- **문제**: 스크롤을 조금만 내려도 애니메이션이 시작됨  
- **원인**: threshold: 0.1, rootMargin: '-50px 0px' 설정으로 너무 민감함  
- **해결**  
  - threshold: 0.5로 조정 (50% 보여야 시작)  
  - rootMargin: '-130px 0px'로 조정 (130px 더 스크롤해야 시작)  

---

### 7. 모바일에서 Why 컴포넌트 미표시
- **문제**: 모바일 환경에서 Why 컴포넌트가 보이지 않음  
- **원인**: 데스크톱 기준 threshold와 rootMargin 값이 모바일에서는 너무 엄격함  
- **해결**  
  - 모바일: threshold: 0.1, rootMargin: '-50px 0px'  
  - 데스크톱: threshold: 0.5, rootMargin: '-130px 0px'  

---

### 8. 협력업체/고객사 이미지 로딩 지연
- **문제**: 협력업체와 고객사 이미지 로딩이 너무 늦음  
- **원인**  
  - threshold: 0.5, rootMargin: '-130px 0px'로 늦게 시작  
  - 애니메이션 delay 시간이 길음  
- **해결**  
  - threshold: 0.3, rootMargin: '-80px 0px'로 조정  
  - delay1: 0.2s → 0.1s  
  - delay2: 0.4s → 0.2s  
  - delay3: 0.6s → 0.3s  

---

### 최종 개선 결과
- 모든 애니메이션이 부드럽게 작동
- Hover 효과 즉시 반응 및 자연스러운 해제
- 사이드바 색상 전환 시 깜빡임 제거
- 모바일/데스크톱 모두 최적화된 애니메이션
- 이미지 로딩 속도 개선
- ESLint 오류 해결 및 빌드 성공
