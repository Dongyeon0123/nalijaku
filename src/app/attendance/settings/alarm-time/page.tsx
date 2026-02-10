'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function AlarmTimePage() {
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState('10');

    const timeOptions = [
        { value: '5', label: '수업 5분 전' },
        { value: '10', label: '수업 10분 전' },
        { value: '15', label: '수업 15분 전' },
        { value: '30', label: '수업 30분 전' },
        { value: '60', label: '수업 1시간 전' }
    ];

    const handleSave = () => {
        // TODO: 서버에 저장
        localStorage.setItem('alarmTime', selectedTime);
        alert('출근 알림 시간이 설정되었습니다.');
        router.push('/attendance?tab=settings');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>출근 알림 시간</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.optionList}>
                    {timeOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.optionItem} ${selectedTime === option.value ? styles.selected : ''}`}
                            onClick={() => setSelectedTime(option.value)}
                        >
                            <span className={styles.optionLabel}>{option.label}</span>
                            {selectedTime === option.value && (
                                <span className={styles.checkmark}>✓</span>
                            )}
                        </button>
                    ))}
                </div>

                <button className={styles.saveButton} onClick={handleSave}>
                    저장
                </button>
            </div>
        </div>
    );
}
