'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function PasswordChangePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (formData.newPassword.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
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
            
            await api.put(`/api/users/${userData.id}/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            alert('비밀번호가 변경되었습니다.');
            router.back();
        } catch (error: any) {
            setError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
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
                <h1 className={styles.title}>비밀번호 변경</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>현재 비밀번호</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="현재 비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>새 비밀번호</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="새 비밀번호를 다시 입력하세요"
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
}
