import React from 'react';
import styles from './page.module.css';

const mockUsers = [
  { id: 'user-001', name: '홍길동', email: 'gildong@example.com', role: 'Admin', signupDate: '2024-01-15' },
  { id: 'user-002', name: '이순신', email: 'sunsin@example.com', role: 'Editor', signupDate: '2024-02-20' },
  { id: 'user-003', name: '유관순', email: 'gwansun@example.com', role: 'User', signupDate: '2024-03-01' },
  { id: 'user-004', name: '세종대왕', email: 'sejong@example.com', role: 'User', signupDate: '2024-04-10' },
  { id: 'user-005', name: '신사임당', email: 'saimdang@example.com', role: 'User', signupDate: '2024-05-25' },
];

const UsersPage = () => {
  return (
    <div>
      <header className={styles.pageHeader}>
        <h1>사용자 관리</h1>
        <p>총 {mockUsers.length}명의 사용자가 있습니다.</p>
      </header>
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>가입일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`${styles.role} ${styles[user.role.toLowerCase()]}`}>{user.role}</span></td>
                <td>{user.signupDate}</td>
                <td>
                  <button className={styles.manageButton}>관리</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
