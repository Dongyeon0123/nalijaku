const CACHE_NAME = 'nallijaku-attendance-v11'; // 🔥 배포할 때마다 이 숫자를 올리세요!
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
  // POST, PUT, DELETE 요청은 캐시하지 않음 (GET만 캐시)
  if (event.request.method !== 'GET') {
    return; // Service Worker가 개입하지 않음
  }

  // API 요청은 Service Worker가 개입하지 않음 (브라우저가 직접 처리)
  if (event.request.url.includes('/api/') || event.request.url.includes('api.nallijaku.com')) {
    return; // Service Worker가 개입하지 않음
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

// Push 이벤트 - 백엔드에서 보낸 알림 수신
self.addEventListener('push', (event) => {
  console.log('[SW] Push 알림 수신:', event);

  let data = {
    title: '날리자쿠',
    body: '새로운 알림이 있습니다.',
    icon: '/nallijaku.png',
    badge: '/nallijaku.png',
    data: {}
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/nallijaku.png',
    badge: data.badge || '/nallijaku.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭:', event);

  event.notification.close();

  // 알림 데이터에 따라 다른 페이지로 이동
  const urlToOpen = event.notification.data?.url || '/teacher';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열린 창이 있으면 포커스
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 없으면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
