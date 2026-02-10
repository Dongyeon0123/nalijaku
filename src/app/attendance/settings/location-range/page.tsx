'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function LocationRangePage() {
    const router = useRouter();
    const [selectedRange, setSelectedRange] = useState('100');

    const rangeOptions = [
        { value: '50', label: '50m' },
        { value: '100', label: '100m' },
        { value: '200', label: '200m' },
        { value: '500', label: '500m' },
        { value: '1000', label: '1km' }
    ];

    const handleSave = () => {
        // TODO: 서버에 저장
        localStorage.setItem('locationRange', selectedRange);
        alert('위치 허용 범위가 설정되었습니다.');
        router.push('/attendance?tab=settings');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>위치 허용 범위</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <p className={styles.description}>
                    학교 위치로부터 설정한 범위 내에서만 출근 체크가 가능합니다.
                </p>

                <div className={styles.optionList}>
                    {rangeOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.optionItem} ${selectedRange === option.value ? styles.selected : ''}`}
                            onClick={() => setSelectedRange(option.value)}
                        >
                            <span className={styles.optionLabel}>{option.label}</span>
                            {selectedRange === option.value && (
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
