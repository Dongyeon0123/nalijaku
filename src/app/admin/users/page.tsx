'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

interface User {
  id: number;
  username: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  droneExperience: boolean;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('사용자 목록 로드 시작');
        setLoading(true);
        
        // 먼저 사용자 목록 API 시도
        try {
          const usersUrl = `${API_BASE_URL}${API_ENDPOINTS.SYSTEM.USERS}`.replace(/\/+/g, '/');
          console.log('사용자 목록 API URL:', usersUrl);
          const response = await fetch(usersUrl);
          console.log('사용자 목록 API 응답 상태:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('사용자 목록 API 응답 데이터:', data);
            
            if (data.success && data.data) {
              setUsers(data.data);
              setUserCount(data.count || data.data.length);
            } else if (Array.isArray(data)) {
              setUsers(data);
              setUserCount(data.length);
            } else {
              setUsers([]);
              setUserCount(0);
            }
            return;
          }
        } catch (listError) {
          console.log('사용자 목록 API 실패, 사용자 수 API로 폴백:', listError);
        }
        
        // 사용자 목록 API가 실패하면 사용자 수 API로 폴백
        console.log('사용자 목록 API 실패, 사용자 수 API로 폴백 시도');
        const countUrl = `${API_BASE_URL}${API_ENDPOINTS.SYSTEM.USER_COUNT}`.replace(/\/+/g, '/');
        console.log('사용자 수 API URL:', countUrl);
        const countResponse = await fetch(countUrl);
        console.log('사용자 수 API 응답 상태:', countResponse.status);
        
        if (!countResponse.ok) {
          throw new Error(`사용자 정보를 불러올 수 없습니다: ${countResponse.status}`);
        }
        
        const countData = await countResponse.json();
        console.log('사용자 수 API 응답 데이터:', countData);
        
        // 사용자 수만 있는 경우, 빈 배열로 설정 (임시 데이터 생성하지 않음)
        console.log(`사용자 수 ${countData.count}명 확인됨, 사용자 목록은 빈 배열로 설정`);
        setUserCount(countData.count || 0);
        setUsers([]);
      } catch (error) {
        console.error('사용자 목록 로드 에러:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div>
        <header className={styles.pageHeader}>
          <h1>사용자 관리</h1>
          <p>사용자 목록을 불러오는 중...</p>
        </header>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <header className={styles.pageHeader}>
          <h1>사용자 관리</h1>
          <p style={{ color: 'red' }}>오류: {error}</p>
        </header>
      </div>
    );
  }
  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>사용자 관리</h1>
        <p>총 {userCount}명의 사용자가 있습니다.</p>
      </header>
      <div className={styles.tableContainer}>
        {users.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
              사용자 목록을 불러올 수 없습니다.
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>
              사용자 목록 API가 준비되지 않았거나 오류가 발생했습니다.
            </p>
          </div>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>사용자명</th>
                <th>이메일</th>
                <th>조직</th>
                <th>역할</th>
                <th>전화번호</th>
                <th>드론경험</th>
                <th>가입일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.organization}</td>
                  <td>
                    <span className={`${styles.role} ${styles[user.role?.toLowerCase() || 'user']}`}>
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.droneExperience ? '있음' : '없음'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <button className={styles.manageButton}>관리</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
