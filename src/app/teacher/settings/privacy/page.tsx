'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import styles from './page.module.css';

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/teacher?tab=settings')}>
                    <IoChevronBack size={24} />
                </button>
                <h1 className={styles.title}>개인정보 처리방침</h1>
                <div style={{ width: 24 }}></div>
            </header>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. 개인정보의 수집 및 이용 목적</h2>
                    <p className={styles.text}>
                        날리자쿠는 다음의 목적을 위하여 개인정보를 처리합니다:<br/><br/>
                        - 회원 가입 및 관리<br/>
                        - 강사 출퇴근 관리<br/>
                        - 강의 일정 관리<br/>
                        - 정산 업무 처리<br/>
                        - 서비스 개선 및 통계 분석
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. 수집하는 개인정보 항목</h2>
                    <p className={styles.text}>
                        필수 항목:<br/>
                        - 이름, 아이디, 비밀번호<br/>
                        - 연락처(휴대폰 번호)<br/>
                        - 계좌 정보(은행명, 계좌번호)<br/>
                        - 위치 정보(출퇴근 기록용)<br/><br/>
                        선택 항목:<br/>
                        - 프로필 사진
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. 개인정보의 보유 및 이용 기간</h2>
                    <p className={styles.text}>
                        회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
                        동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br/><br/>
                        - 회원 탈퇴 시: 즉시 파기<br/>
                        - 정산 관련 정보: 5년 (전자상거래법)
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. 개인정보의 제3자 제공</h2>
                    <p className={styles.text}>
                        회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 
                        다만, 다음의 경우에는 예외로 합니다:<br/><br/>
                        - 이용자가 사전에 동의한 경우<br/>
                        - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 
                        수사기관의 요구가 있는 경우
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. 개인정보의 파기</h2>
                    <p className={styles.text}>
                        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
                        지체없이 해당 개인정보를 파기합니다.<br/><br/>
                        파기 방법:<br/>
                        - 전자적 파일: 복구 불가능한 방법으로 영구 삭제<br/>
                        - 종이 문서: 분쇄 또는 소각
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. 정보주체의 권리·의무</h2>
                    <p className={styles.text}>
                        이용자는 언제든지 다음의 권리를 행사할 수 있습니다:<br/><br/>
                        - 개인정보 열람 요구<br/>
                        - 개인정보 정정·삭제 요구<br/>
                        - 개인정보 처리정지 요구<br/><br/>
                        권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 가능합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. 개인정보 보호책임자</h2>
                    <p className={styles.text}>
                        회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
                        개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 위하여 
                        아래와 같이 개인정보 보호책임자를 지정하고 있습니다.<br/><br/>
                        개인정보 보호책임자<br/>
                        - 이메일: privacy@nallijaku.com<br/>
                        - 전화: 02-1234-5678
                    </p>
                </div>
            </div>
        </div>
    );
}
