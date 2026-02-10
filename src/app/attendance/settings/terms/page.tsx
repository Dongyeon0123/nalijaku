'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/attendance?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>이용약관</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제1조 (목적)</h2>
                    <p className={styles.text}>
                        본 약관은 날리자쿠(이하 "회사")가 제공하는 강사 출근부 서비스(이하 "서비스")의 이용과 관련하여 
                        회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제2조 (정의)</h2>
                    <p className={styles.text}>
                        1. "서비스"란 회사가 제공하는 강사 출퇴근 관리, 강의 일정 관리, 정산 관리 등의 서비스를 의미합니다.<br/>
                        2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 강사를 의미합니다.<br/>
                        3. "계정"이란 서비스 이용을 위해 이용자가 설정한 아이디와 비밀번호의 조합을 의미합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제3조 (약관의 효력 및 변경)</h2>
                    <p className={styles.text}>
                        1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.<br/>
                        2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.<br/>
                        3. 약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제4조 (서비스의 제공)</h2>
                    <p className={styles.text}>
                        1. 회사는 다음과 같은 서비스를 제공합니다:<br/>
                        - 강사 출퇴근 관리<br/>
                        - 강의 일정 조회 및 관리<br/>
                        - 강의 완료 기록<br/>
                        - 정산 내역 조회<br/>
                        2. 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제5조 (이용자의 의무)</h2>
                    <p className={styles.text}>
                        1. 이용자는 본 약관 및 관련 법령을 준수해야 합니다.<br/>
                        2. 이용자는 자신의 계정 정보를 제3자에게 제공하거나 공유해서는 안 됩니다.<br/>
                        3. 이용자는 정확한 출퇴근 기록을 위해 위치 정보 제공에 동의해야 합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>제6조 (개인정보 보호)</h2>
                    <p className={styles.text}>
                        회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
