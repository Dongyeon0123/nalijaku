'use client';

import React, { useState } from 'react';
import styles from './education-intro.module.css';

export default function EducationIntroPage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    email: '',
    phone: '',
    studentCount: '',
    grade: '',
    preferredDate: '',
    budget: '',
    additionalInfo: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 실제로는 API 호출을 하여 데이터를 서버로 전송
      const response = await fetch('/api/education-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (response.ok) {
        console.log('교육 도입 신청 데이터:', formData);
        setIsSubmitted(true);
      } else {
        throw new Error('신청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>✅</div>
          <h1>신청이 완료되었습니다!</h1>
          <p>교육 도입 신청이 성공적으로 접수되었습니다.</p>
          <p>담당자가 검토 후 3일 이내에 연락드리겠습니다.</p>
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => window.location.href = '/'}
              className={styles.primaryButton}
            >
              홈으로 돌아가기
            </button>
            <button 
              onClick={() => setIsSubmitted(false)}
              className={styles.secondaryButton}
            >
              추가 신청하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>교육 도입하기</h1>
        <p>날리자쿠의 드론 교육 프로그램을 학교에 도입해보세요</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="schoolName">학교명 *</label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              required
              placeholder="학교명을 입력해주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contactPerson">담당자명 *</label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
              placeholder="담당자명을 입력해주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="이메일을 입력해주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">연락처 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="연락처를 입력해주세요 (예: 010-1234-5678)"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="studentCount">예상 참여 학생 수 *</label>
              <input
                type="number"
                id="studentCount"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="학생 수"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="grade">대상 학년</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              >
                <option value="">학년을 선택해주세요</option>
                <option value="초등학교">초등학교</option>
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="대학교">대학교</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="preferredDate">희망 교육 일정</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="budget">예상 예산</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
              >
                <option value="">예산 범위를 선택해주세요</option>
                <option value="100만원 이하">100만원 이하</option>
                <option value="100-300만원">100-300만원</option>
                <option value="300-500만원">300-500만원</option>
                <option value="500-1000만원">500-1000만원</option>
                <option value="1000만원 이상">1000만원 이상</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="additionalInfo">추가 요청사항</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              placeholder="특별한 요청사항이나 문의사항이 있으시면 입력해주세요"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton}>
              신청하기
            </button>
            <button 
              type="button" 
              onClick={() => window.location.href = '/'}
              className={styles.secondaryButton}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}