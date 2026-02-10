'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';
import styles from './page.module.css';

export default function AttendanceLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                username,
                password
            });

            console.log('📥 로그인 응답:', response.data);

            if (response.data.success && response.data.data) {
                // 로그인 성공
                console.log('✅ 로그인 성공:', response.data.data);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                
                // 페이지 이동
                window.location.href = '/attendance';
            } else {
                console.error('❌ 로그인 실패:', response.data);
                setError(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (err: any) {
            console.error('❌ 로그인 에러:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('서버 연결에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.logoSection}>
                    <Image 
                        src="/nallijaku.png" 
                        alt="날리자쿠" 
                        width={180} 
                        height={60}
                        style={{ width: 'auto', height: '60px' }}
                    />
                    <h1 className={styles.title}>강사 출근부</h1>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>아이디</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        강사 전용 출근 관리 시스템입니다
                    </p>
                </div>
            </div>
        </div>
    );
}
