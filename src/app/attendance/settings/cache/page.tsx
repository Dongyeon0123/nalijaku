'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function CachePage() {
    const router = useRouter();
    const [isClearing, setIsClearing] = useState(false);

    const handleClearCache = async () => {
        if (!confirm('캐시를 삭제하시겠습니까?\n앱이 재시작될 수 있습니다.')) {
            return;
        }

        setIsClearing(true);

        try {
            // localStorage에서 user 정보를 제외한 나머지 삭제
            const user = localStorage.getItem('user');
            localStorage.clear();
            if (user) {
                localStorage.setItem('user', user);
            }

            // Service Worker 캐시 삭제
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }

            alert('캐시가 삭제되었습니다.');
            router.push('/attendance?tab=settings');
        } catch (error) {
            console.error('캐시 삭제 실패:', error);
            alert('캐시 삭제에 실패했습니다.');
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>캐시 삭제</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.infoBox}>
                    <h3 className={styles.infoTitle}>캐시 삭제란?</h3>
                    <p className={styles.infoText}>
                        앱에 저장된 임시 데이터를 삭제합니다.<br/>
                        앱이 느려지거나 오류가 발생할 때 시도해보세요.
                    </p>
                </div>

                <div className={styles.warningBox}>
                    <p className={styles.warningText}>
                        ⚠️ 캐시 삭제 시 다음 항목이 제거됩니다:
                    </p>
                    <ul className={styles.warningList}>
                        <li>임시 저장된 이미지 및 파일</li>
                        <li>앱 설정 (로그인 정보는 유지)</li>
                        <li>오프라인 데이터</li>
                    </ul>
                </div>

                <button 
                    className={styles.deleteButton} 
                    onClick={handleClearCache}
                    disabled={isClearing}
                >
                    {isClearing ? '삭제 중...' : '캐시 삭제'}
                </button>
            </div>
        </div>
    );
}
