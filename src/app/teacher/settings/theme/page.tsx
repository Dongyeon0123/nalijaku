'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function ThemePage() {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState('light');

    const themeOptions = [
        { value: 'light', label: '라이트', description: '밝은 테마' },
        { value: 'dark', label: '다크', description: '어두운 테마' },
        { value: 'auto', label: '자동', description: '시스템 설정 따르기' }
    ];

    const handleSave = () => {
        // TODO: 서버에 저장 및 테마 적용
        localStorage.setItem('theme', selectedTheme);
        alert('테마가 설정되었습니다.');
        router.push('/teacher?tab=settings');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/teacher?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>테마 설정</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.optionList}>
                    {themeOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.optionItem} ${selectedTheme === option.value ? styles.selected : ''}`}
                            onClick={() => setSelectedTheme(option.value)}
                        >
                            <div className={styles.optionInfo}>
                                <span className={styles.optionLabel}>{option.label}</span>
                                <span className={styles.optionDescription}>{option.description}</span>
                            </div>
                            {selectedTheme === option.value && (
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
