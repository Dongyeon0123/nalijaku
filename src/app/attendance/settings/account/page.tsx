'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function AccountChangePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCurrentAccount();
    }, []);

    const loadCurrentAccount = async () => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/attendance/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            
            try {
                const response = await api.get(`/api/instructors/by-user/${userData.id}`);
                if (response.data.success && response.data.data) {
                    setFormData({
                        bankName: response.data.data.bankName || '',
                        accountNumber: response.data.data.accountNumber || ''
                    });
                }
            } catch (error) {
                console.log('강사 정보 조회 실패');
            }
        } catch (error) {
            console.error('계좌 정보 로드 실패:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.bankName || !formData.accountNumber) {
            setError('은행명과 계좌번호를 모두 입력하세요.');
            return;
        }

        setIsLoading(true);

        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) {
                router.push('/attendance/login');
                return;
            }

            const userData = JSON.parse(savedUser);
            
            // 강사 정보 업데이트
            const instructorResponse = await api.get(`/api/instructors/by-user/${userData.id}`);
            if (instructorResponse.data.success && instructorResponse.data.data) {
                const instructorId = instructorResponse.data.data.id;
                
                await api.put(`/api/instructors/${instructorId}`, {
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber
                });

                alert('계좌 정보가 변경되었습니다.');
                router.back();
            } else {
                setError('강사 정보를 찾을 수 없습니다.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || '계좌 정보 변경에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>계좌 정보 변경</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>은행명</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="예: 국민은행"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>계좌번호</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="'-' 없이 숫자만 입력"
                            required
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '변경 중...' : '계좌 정보 변경'}
                    </button>
                </form>
            </div>
        </div>
    );
}
