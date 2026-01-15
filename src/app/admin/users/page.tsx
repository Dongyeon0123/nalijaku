'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import api from '@/lib/axios';

interface User {
  id: number;
  username: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  droneExperience: boolean;
  createdAt: string;
  status?: string;
  locked?: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('사용자 목록 로드 시작');
        setLoading(true);
        
        // 먼저 사용자 목록 API 시도
        try {
          console.log('사용자 목록 API URL:', '/api/users');
          const response = await api.get('/api/users');
          console.log('사용자 목록 API 응답:', response.data);
          
          const data = response.data;
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
        } catch (listError: any) {
          console.log('사용자 목록 API 실패, 사용자 수 API로 폴백:', listError);
        }
        
        // 사용자 목록 API가 실패하면 사용자 수 API로 폴백
        console.log('사용자 목록 API 실패, 사용자 수 API로 폴백 시도');
        console.log('사용자 수 API URL:', '/api/users/count');
        const countResponse = await api.get('/api/users/count');
        console.log('사용자 수 API 응답:', countResponse.data);
        
        const countData = countResponse.data;
        
        // 사용자 수만 있는 경우, 빈 배열로 설정 (임시 데이터 생성하지 않음)
        console.log(`사용자 수 ${countData.count}명 확인됨, 사용자 목록은 빈 배열로 설정`);
        setUserCount(countData.count || 0);
        setUsers([]);
      } catch (error: any) {
        console.error('사용자 목록 로드 에러:', error);
        const errorMsg = error.response?.data?.message || error.message || '사용자 정보를 불러올 수 없습니다';
        setError(errorMsg);
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
                    <span className={`${styles.role} ${styles[user.role?.toLowerCase() || 'general']}`}>
                      {user.role === 'GENERAL' ? '일반' : user.role === 'TEACHER' ? '강사' : user.role === 'ADMIN' ? '관리자' : user.role || 'GENERAL'}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`${styles.experienceBadge} ${user.droneExperience ? styles.hasExperience : styles.noExperience}`}>
                      {user.droneExperience ? '있음' : '없음'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <button 
                      className={styles.manageButton}
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role || 'GENERAL');
                        setEditingRole(false);
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
                  {editingRole ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select 
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className={styles.roleSelect}
                      >
                        <option value="GENERAL">GENERAL (일반 사용자)</option>
                        <option value="TEACHER">TEACHER (강사)</option>
                        <option value="ADMIN">ADMIN (관리자)</option>
                      </select>
                      <button 
                        className={styles.saveRoleButton}
                        onClick={async () => {
                          try {
                            console.log('=== 역할 변경 요청 시작 ===');
                            console.log('사용자 ID:', selectedUser.id);
                            console.log('현재 역할:', selectedUser.role);
                            console.log('새 역할:', newRole);
                            console.log('요청 URL:', `/api/users/${selectedUser.id}/role`);
                            console.log('요청 데이터:', { role: newRole });
                            
                            const response = await api.put(`/api/users/${selectedUser.id}/role`, { role: newRole });
                            
                            console.log('✅ 역할 변경 성공:', response.data);
                            
                            // 사용자 목록 업데이트
                            setUsers(users.map(u => 
                              u.id === selectedUser.id ? { ...u, role: newRole } : u
                            ));
                            setSelectedUser({ ...selectedUser, role: newRole });
                            setEditingRole(false);
                            alert('역할이 변경되었습니다.');
                          } catch (error: any) {
                            console.error('❌ 역할 변경 실패');
                            console.error('에러 상태:', error.response?.status);
                            console.error('에러 메시지:', error.response?.data);
                            console.error('전체 에러:', error);
                            
                            const errorMessage = error.response?.status === 500 
                              ? `백엔드 서버 오류입니다.\n\n백엔드 개발자에게 다음을 확인하세요:\n1. PUT /api/users/${selectedUser.id}/role 엔드포인트가 구현되어 있는지\n2. 요청 본문 형식: { "role": "GENERAL|TEACHER|ADMIN" }\n3. 서버 로그에서 구체적인 오류 확인`
                              : error.response?.data?.message || '역할 변경에 실패했습니다.';
                            alert(errorMessage);
                          }
                        }}
                      >
                        저장
                      </button>
                      <button 
                        className={styles.cancelRoleButton}
                        onClick={() => {
                          setNewRole(selectedUser.role || 'GENERAL');
                          setEditingRole(false);
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`${styles.roleBadge} ${styles[selectedUser.role?.toLowerCase() || 'general']}`}>
                        {selectedUser.role === 'GENERAL' ? '일반' : selectedUser.role === 'TEACHER' ? '강사' : selectedUser.role === 'ADMIN' ? '관리자' : selectedUser.role || 'GENERAL'}
                      </span>
                      <button 
                        className={styles.editRoleButton}
                        onClick={() => setEditingRole(true)}
                      >
                        변경
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles.detailItem}>
                  <label>드론 경험:</label>
                  <span className={`${styles.experienceBadge} ${selectedUser.droneExperience ? styles.hasExperience : styles.noExperience}`}>
                    {selectedUser.droneExperience ? '있음' : '없음'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>가입일:</label>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.deleteButton} 
                onClick={async () => {
                  if (confirm(`정말 "${selectedUser.username}" 사용자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
                    try {
                      await api.delete(`/api/users/${selectedUser.id}`);
                      // 사용자 목록에서 제거
                      setUsers(users.filter(u => u.id !== selectedUser.id));
                      setUserCount(userCount - 1);
                      setShowModal(false);
                      alert('사용자가 삭제되었습니다.');
                    } catch (error: any) {
                      console.error('사용자 삭제 실패:', error);
                      alert(error.response?.data?.message || '사용자 삭제에 실패했습니다.');
                    }
                  }
                }}
              >
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
