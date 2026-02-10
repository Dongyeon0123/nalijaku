const CACHE_NAME = 'nallijaku-attendance-v2'; // 버전 업데이트 시 이 숫자만 올리면 됨
const urlsToCache = [
  '/teacher',
  '/teacher/login',
  '/nallijaku.png',
  '/transparentLogo.png'
];

// 설치 이벤트 - 새 버전 설치
self.addEventListener('install', (event) => {
  console.log('[SW] 새 버전 설치 중...', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 캐시 생성 완료');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 즉시 활성화 (사용자가 앱을 닫았다 열 필요 없음)
        return self.skipWaiting();
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  console.log('[SW] 새 버전 활성화 중...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // 모든 클라이언트에 즉시 적용
      return self.clients.claim();
    })
  );
});

// Fetch 이벤트 - 네트워크 우선 전략 (항상 최신 데이터)
self.addEventListener('fetch', (event) => {
  // API 요청은 항상 네트워크 사용 (캐시 안 함)
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML 페이지는 네트워크 우선, 실패 시 캐시
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 성공하면 캐시 업데이트
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시 캐시 사용
          return caches.match(event.request);
        })
    );
    return;
  }

  // 정적 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          // 성공하면 캐시에 저장
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// 메시지 이벤트 - 수동 업데이트 트리거
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
