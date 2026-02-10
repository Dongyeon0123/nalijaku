// Push Notification 유틸리티

/**
 * 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('이 브라우저는 알림을 지원하지 않습니다.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * 로컬 알림 표시 (테스트용)
 */
export const showLocalNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/nallijaku.png',
      badge: '/nallijaku.png',
      vibrate: [200, 100, 200],
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
};

/**
 * Service Worker를 통한 Push 알림 구독
 */
export const subscribeToPushNotifications = async (userId: number): Promise<string | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;

    // VAPID 공개 키 (백엔드에서 생성 필요)
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
    
    if (!vapidPublicKey) {
      console.error('VAPID 공개 키가 설정되지 않았습니다.');
      return null;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // 구독 정보를 백엔드로 전송
    const subscriptionData = JSON.stringify(subscription);
    console.log('📱 Push 구독 정보:', subscriptionData);

    return subscriptionData;
  } catch (error) {
    console.error('Push 구독 실패:', error);
    return null;
  }
};

/**
 * Push 알림 구독 해제
 */
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('✅ Push 구독 해제 완료');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Push 구독 해제 실패:', error);
    return false;
  }
};

/**
 * VAPID 키 변환 유틸리티
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * 알림 설정 저장
 */
export interface NotificationSettings {
  enabled: boolean;
  lectureReminder: boolean; // 수업 알림
  lectureReminderTime: number; // 수업 몇 분 전 (기본 10분)
  settlementNotification: boolean; // 정산 알림
  noticeNotification: boolean; // 공지사항 알림
}

export const getNotificationSettings = (): NotificationSettings => {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }

  const saved = localStorage.getItem('notificationSettings');
  if (saved) {
    return JSON.parse(saved);
  }
  return getDefaultSettings();
};

export const saveNotificationSettings = (settings: NotificationSettings) => {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
};

const getDefaultSettings = (): NotificationSettings => ({
  enabled: true,
  lectureReminder: true,
  lectureReminderTime: 10,
  settlementNotification: true,
  noticeNotification: true,
});
