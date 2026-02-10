'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function LanguagePage() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('ko');

    const languageOptions = [
        { value: 'ko', label: '한국어', nativeName: '한국어' },
        { value: 'en', label: 'English', nativeName: 'English' },
        { value: 'ja', label: '日本語', nativeName: '일본어' },
        { value: 'zh', label: '中文', nativeName: '중국어' }
    ];

    const handleSave = () => {
        // TODO: 서버에 저장 및 언어 적용
        localStorage.setItem('language', selectedLanguage);
        alert('언어가 설정되었습니다.');
        router.push('/teacher?tab=settings');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/teacher?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>언어 설정</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.optionList}>
                    {languageOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.optionItem} ${selectedLanguage === option.value ? styles.selected : ''}`}
                            onClick={() => setSelectedLanguage(option.value)}
                        >
                            <div className={styles.optionInfo}>
                                <span className={styles.optionLabel}>{option.label}</span>
                                <span className={styles.optionDescription}>{option.nativeName}</span>
                            </div>
                            {selectedLanguage === option.value && (
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
