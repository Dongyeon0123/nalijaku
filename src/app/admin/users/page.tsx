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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('사용자 목록 로드 시작');
        setLoading(true);
        
        // 먼저 사용자 목록 API 시도
        try {
          const usersUrl = API_BASE_URL ? `${API_BASE_URL}${API_ENDPOINTS.SYSTEM.USERS}` : API_ENDPOINTS.SYSTEM.USERS;
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
        const countUrl = API_BASE_URL ? `${API_BASE_URL}${API_ENDPOINTS.SYSTEM.USER_COUNT}` : API_ENDPOINTS.SYSTEM.USER_COUNT;
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
                    <button 
                      className={styles.manageButton}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      관리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 사용자 관리 모달 */}
      {showModal && selectedUser && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>사용자 정보</h2>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>사용자명:</label>
                  <span>{selectedUser.username}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>이메일:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>조직:</label>
                  <span>{selectedUser.organization || '-'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>전화번호:</label>
                  <span>{selectedUser.phone || '-'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>역할:</label>
                  <span className={`${styles.roleBadge} ${styles[selectedUser.role?.toLowerCase() || 'general']}`}>
                    {selectedUser.role || 'GENERAL'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>드론 경험:</label>
                  <span>{selectedUser.droneExperience ? '있음' : '없음'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>가입일:</label>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.deleteButton} onClick={() => {
                if (confirm('정말 이 사용자를 삭제하시겠습니까?')) {
                  // TODO: 삭제 API 호출
                  alert('삭제 기능은 백엔드 API 구현 후 사용 가능합니다.');
                  setShowModal(false);
                }
              }}>
                삭제
              </button>
              <button className={styles.closeModalButton} onClick={() => setShowModal(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
