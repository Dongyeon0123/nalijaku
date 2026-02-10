'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function NoticePage() {
    const router = useRouter();
    
    const [notices] = useState([
        {
            id: 1,
            title: '강사 출근부 앱 정식 오픈',
            date: '2026.02.10',
            content: '강사님들의 편리한 출퇴근 관리를 위한 출근부 앱이 정식으로 오픈되었습니다. 많은 이용 부탁드립니다.'
        },
        {
            id: 2,
            title: '2월 정산 일정 안내',
            date: '2026.02.05',
            content: '2월 정산은 3월 5일에 진행될 예정입니다. 계좌 정보를 미리 확인해주세요.'
        },
        {
            id: 3,
            title: '위치 권한 설정 안내',
            date: '2026.02.01',
            content: '정확한 출퇴근 기록을 위해 위치 권한을 허용해주세요. 설정 > 위치 권한에서 변경 가능합니다.'
        }
    ]);

    const [selectedNotice, setSelectedNotice] = useState<number | null>(null);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>공지사항</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                {notices.map((notice) => (
                    <div key={notice.id} className={styles.noticeItem}>
                        <div 
                            className={styles.noticeHeader}
                            onClick={() => setSelectedNotice(
                                selectedNotice === notice.id ? null : notice.id
                            )}
                        >
                            <div className={styles.noticeInfo}>
                                <h3 className={styles.noticeTitle}>{notice.title}</h3>
                                <span className={styles.noticeDate}>{notice.date}</span>
                            </div>
                            <span className={styles.arrow}>
                                {selectedNotice === notice.id ? '▲' : '▼'}
                            </span>
                        </div>
                        
                        {selectedNotice === notice.id && (
                            <div className={styles.noticeContent}>
                                {notice.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
