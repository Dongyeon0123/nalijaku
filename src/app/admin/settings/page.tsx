'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessNumber: string;
  ceoName: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface NotificationSettings {
  newApplicationEmail: boolean;
  newApplicationSms: boolean;
  statusChangeEmail: boolean;
  statusChangeSms: boolean;
  weeklyReportEmail: boolean;
  monthlyReportEmail: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'notifications' | 'security'>('system');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: '날리자쿠',
    siteDescription: '드론 교육 플랫폼',
    contactEmail: 'contact@nallijaku.com',
    contactPhone: '010-5029-6452',
    address: '충청북도 청주시 서원구 서원서로 30-23 SK 하이닉스 창업관',
    businessNumber: '215-65-00727',
    ceoName: '이민상',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    smsNotifications: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newApplicationEmail: true,
    newApplicationSms: false,
    statusChangeEmail: true,
    statusChangeSms: false,
    weeklyReportEmail: true,
    monthlyReportEmail: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireTwoFactor: false,
    ipWhitelist: '',
    allowedDomains: ''
  });

  const handleSystemSettingChange = (key: keyof SystemSettings, value: boolean | string) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecuritySettingChange = (key: string, value: string | number | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // 실제로는 API 호출로 설정 저장
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('설정이 성공적으로 저장되었습니다.');
    } catch {
      setSaveMessage('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      // 기본값으로 초기화
      setSystemSettings({
        siteName: '날리자쿠',
        siteDescription: '드론 교육 플랫폼',
        contactEmail: 'contact@nallijaku.com',
        contactPhone: '010-5029-6452',
        address: '충청북도 청주시 서원구 서원서로 30-23 SK 하이닉스 창업관',
        businessNumber: '215-65-00727',
        ceoName: '이민상',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        smsNotifications: true
      });
      
      setNotificationSettings({
        newApplicationEmail: true,
        newApplicationSms: false,
        statusChangeEmail: true,
        statusChangeSms: false,
        weeklyReportEmail: true,
        monthlyReportEmail: true
      });
      
      setSecuritySettings({
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireTwoFactor: false,
        ipWhitelist: '',
        allowedDomains: ''
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>시스템 설정</h1>
        <p>시스템 전반의 설정을 관리합니다.</p>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'system' ? styles.active : ''}`}
          onClick={() => setActiveTab('system')}
        >
          시스템 설정
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          알림 설정
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
          onClick={() => setActiveTab('security')}
        >
          보안 설정
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'system' && (
          <div className={styles.settingsSection}>
            <h2>기본 정보</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label htmlFor="siteName">사이트명</label>
                <input
                  type="text"
                  id="siteName"
                  value={systemSettings.siteName}
                  onChange={(e) => handleSystemSettingChange('siteName', e.target.value)}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="siteDescription">사이트 설명</label>
                <input
                  type="text"
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => handleSystemSettingChange('siteDescription', e.target.value)}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="contactEmail">연락 이메일</label>
                <input
                  type="email"
                  id="contactEmail"
                  value={systemSettings.contactEmail}
                  onChange={(e) => handleSystemSettingChange('contactEmail', e.target.value)}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="contactPhone">연락처</label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={systemSettings.contactPhone}
                  onChange={(e) => handleSystemSettingChange('contactPhone', e.target.value)}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="address">주소</label>
                <textarea
                  id="address"
                  value={systemSettings.address}
                  onChange={(e) => handleSystemSettingChange('address', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="businessNumber">사업자 등록번호</label>
                <input
                  type="text"
                  id="businessNumber"
                  value={systemSettings.businessNumber}
                  onChange={(e) => handleSystemSettingChange('businessNumber', e.target.value)}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="ceoName">대표자명</label>
                <input
                  type="text"
                  id="ceoName"
                  value={systemSettings.ceoName}
                  onChange={(e) => handleSystemSettingChange('ceoName', e.target.value)}
                />
              </div>
            </div>

            <h2>시스템 옵션</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                  />
                  <span>유지보수 모드</span>
                </label>
                <p className={styles.settingDescription}>
                  유지보수 모드 활성화 시 일반 사용자의 사이트 접근이 제한됩니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={systemSettings.allowRegistration}
                    onChange={(e) => handleSystemSettingChange('allowRegistration', e.target.checked)}
                  />
                  <span>회원가입 허용</span>
                </label>
                <p className={styles.settingDescription}>
                  새로운 사용자의 회원가입을 허용합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className={styles.settingsSection}>
            <h2>알림 설정</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newApplicationEmail}
                    onChange={(e) => handleNotificationSettingChange('newApplicationEmail', e.target.checked)}
                  />
                  <span>새 신청 이메일 알림</span>
                </label>
                <p className={styles.settingDescription}>
                  새로운 교육 도입 또는 파트너 모집 신청 시 이메일로 알림을 받습니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newApplicationSms}
                    onChange={(e) => handleNotificationSettingChange('newApplicationSms', e.target.checked)}
                  />
                  <span>새 신청 SMS 알림</span>
                </label>
                <p className={styles.settingDescription}>
                  새로운 신청 시 SMS로 알림을 받습니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.statusChangeEmail}
                    onChange={(e) => handleNotificationSettingChange('statusChangeEmail', e.target.checked)}
                  />
                  <span>상태 변경 이메일 알림</span>
                </label>
                <p className={styles.settingDescription}>
                  신청 상태가 변경될 때 이메일로 알림을 받습니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReportEmail}
                    onChange={(e) => handleNotificationSettingChange('weeklyReportEmail', e.target.checked)}
                  />
                  <span>주간 리포트 이메일</span>
                </label>
                <p className={styles.settingDescription}>
                  매주 시스템 현황 리포트를 이메일로 받습니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.monthlyReportEmail}
                    onChange={(e) => handleNotificationSettingChange('monthlyReportEmail', e.target.checked)}
                  />
                  <span>월간 리포트 이메일</span>
                </label>
                <p className={styles.settingDescription}>
                  매월 시스템 현황 리포트를 이메일로 받습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className={styles.settingsSection}>
            <h2>보안 설정</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label htmlFor="sessionTimeout">세션 타임아웃 (분)</label>
                <input
                  type="number"
                  id="sessionTimeout"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="480"
                />
                <p className={styles.settingDescription}>
                  사용자 세션이 자동으로 만료되는 시간입니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="maxLoginAttempts">최대 로그인 시도 횟수</label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => handleSecuritySettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  min="3"
                  max="10"
                />
                <p className={styles.settingDescription}>
                  로그인 실패 시 계정이 잠기는 횟수입니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="passwordMinLength">최소 비밀번호 길이</label>
                <input
                  type="number"
                  id="passwordMinLength"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => handleSecuritySettingChange('passwordMinLength', parseInt(e.target.value))}
                  min="6"
                  max="20"
                />
                <p className={styles.settingDescription}>
                  사용자 비밀번호의 최소 길이입니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={securitySettings.requireTwoFactor}
                    onChange={(e) => handleSecuritySettingChange('requireTwoFactor', e.target.checked)}
                  />
                  <span>2단계 인증 필수</span>
                </label>
                <p className={styles.settingDescription}>
                  관리자 로그인 시 2단계 인증을 필수로 합니다.
                </p>
              </div>
              
              <div className={styles.settingItem}>
                <label htmlFor="ipWhitelist">IP 화이트리스트</label>
                <textarea
                  id="ipWhitelist"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSecuritySettingChange('ipWhitelist', e.target.value)}
                  rows={3}
                  placeholder="허용할 IP 주소를 한 줄에 하나씩 입력하세요"
                />
                <p className={styles.settingDescription}>
                  관리자 페이지 접근을 허용할 IP 주소 목록입니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {saveMessage && (
          <div className={`${styles.message} ${saveMessage.includes('성공') ? styles.success : styles.error}`}>
            {saveMessage}
          </div>
        )}
        
        <div className={styles.buttonGroup}>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            disabled={isSaving}
          >
            초기화
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
