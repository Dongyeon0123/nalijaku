'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import { 
  requestNotificationPermission, 
  subscribeToPushNotifications,
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings 
} from '@/lib/notification';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function NotificationSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const handlePermissionRequest = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setPermissionStatus('granted');
            alert('알림 권한이 허용되었습니다.');
            
            // Push 구독
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                const user = userData.user || userData;
                const subscription = await subscribeToPushNotifications(user.id);
                
                if (subscription) {
                    // 백엔드에 구독 정보 저장
                    try {
                        await api.post('/api/push-subscriptions', {
                            userId: user.id,
                            subscription: subscription
                        });
                        console.log('✅ Push 구독 정보 저장 완료');
                    } catch (error) {
                        console.error('Push 구독 정보 저장 실패:', error);
                    }
                }
            }
        } else {
            alert('알림 권한이 거부되었습니다. 브라우저 설정에서 변경할 수 있습니다.');
        }
    };

    const handleToggle = (key: keyof NotificationSettings) => {
        const newSettings = {
            ...settings,
            [key]: !settings[key]
        };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleTimeChange = (minutes: number) => {
        const newSettings = {
            ...settings,
            lectureReminderTime: minutes
        };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            const user = userData.user || userData;

            // 백엔드에 알림 설정 저장
            await api.put(`/api/users/${user.id}/notification-settings`, settings);

            alert('알림 설정이 저장되었습니다.');
            router.back();
        } catch (error) {
            console.error('알림 설정 저장 실패:', error);
            alert('알림 설정 저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>알림 설정</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                {/* 알림 권한 */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>알림 권한</h3>
                    <div className={styles.permissionCard}>
                        <div className={styles.permissionInfo}>
                            <span className={styles.permissionLabel}>현재 상태</span>
                            <span className={`${styles.permissionStatus} ${
                                permissionStatus === 'granted' ? styles.granted :
                                permissionStatus === 'denied' ? styles.denied :
                                styles.default
                            }`}>
                                {permissionStatus === 'granted' ? '허용됨' :
                                 permissionStatus === 'denied' ? '거부됨' :
                                 '미설정'}
                            </span>
                        </div>
                        {permissionStatus !== 'granted' && (
                            <button 
                                className={styles.permissionButton}
                                onClick={handlePermissionRequest}
                            >
                                알림 권한 요청
                            </button>
                        )}
                    </div>
                </div>

                {/* 알림 설정 */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>알림 종류</h3>
                    
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>수업 알림</span>
                            <span className={styles.settingDesc}>수업 시작 전 알림을 받습니다</span>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox" 
                                checked={settings.lectureReminder}
                                onChange={() => handleToggle('lectureReminder')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {settings.lectureReminder && (
                        <div className={styles.subSetting}>
                            <label className={styles.subLabel}>알림 시간</label>
                            <select 
                                className={styles.select}
                                value={settings.lectureReminderTime}
                                onChange={(e) => handleTimeChange(Number(e.target.value))}
                            >
                                <option value={5}>5분 전</option>
                                <option value={10}>10분 전</option>
                                <option value={15}>15분 전</option>
                                <option value={30}>30분 전</option>
                                <option value={60}>1시간 전</option>
                            </select>
                        </div>
                    )}

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>정산 알림</span>
                            <span className={styles.settingDesc}>정산 완료 시 알림을 받습니다</span>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox" 
                                checked={settings.settlementNotification}
                                onChange={() => handleToggle('settlementNotification')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingLabel}>공지사항 알림</span>
                            <span className={styles.settingDesc}>새 공지사항이 등록되면 알림을 받습니다</span>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox" 
                                checked={settings.noticeNotification}
                                onChange={() => handleToggle('noticeNotification')}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>

                <button 
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? '저장 중...' : '설정 저장'}
                </button>
            </div>
        </div>
    );
}
