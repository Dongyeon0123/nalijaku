'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function PhoneChangePage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCurrentPhone();
    }, []);

    const loadCurrentPhone = async () => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            const response = await api.get(`/api/users/${userData.id}`);
            
            if (response.data.success) {
                setPhone(response.data.data.phone || response.data.data.phoneNumber || '');
            }
        } catch (error) {
            console.error('연락처 로드 실패:', error);
        }
    };

    const formatPhone = (value: string) => {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const numbers = phone.replace(/[^\d]/g, '');
        if (numbers.length !== 11) {
            setError('올바른 휴대폰 번호를 입력하세요.');
            return;
        }

        setIsLoading(true);

        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/teacher/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            
            await api.put(`/api/users/${userData.id}`, {
                phone: numbers
            });

            alert('연락처가 변경되었습니다.');
            router.back();
        } catch (error: any) {
            setError(error.response?.data?.message || '연락처 변경에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/teacher?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>연락처 변경</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>휴대폰 번호</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="010-0000-0000"
                            maxLength={13}
                            required
                        />
                        <p className={styles.hint}>'-' 없이 숫자만 입력하세요</p>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '변경 중...' : '연락처 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
}
