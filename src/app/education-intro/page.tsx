'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { IoLogoInstagram, IoLogoYoutube, IoBusiness } from 'react-icons/io5';
import styles from './page.module.css';
import { BiMessageDetail } from "react-icons/bi";

export default function EducationIntroPage() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  const [formData, setFormData] = React.useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    email: '',
    studentCount: '',
    grade: '',
    preferredDate: '',
    message: '',
    purchaseInquiry: false,
    schoolVisit: false,
    careerExperience: false,
    boothEntrustment: false,
    other: false,
    otherText: '',
    privacyAgreement: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가할 수 있습니다
    console.log('교육 도입 신청:', formData);
    alert('교육 도입 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <div className={styles.container}>
      <Header forceLightMode={true} />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>CONTACT</h1>
          <p className={styles.subtitle}>
            단체 강연, 행사 및 협업 문의
          </p>
          <p className={styles.subtitle2}>
            &quot;드론으로 여는 미래 교육, 날리자쿠가 첫걸음을 함께합니다.&quot;
          </p>
          
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formText}>
                    <span style={{fontWeight: 'bold', color: '#04AD74', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>교육 도입하기</span>
                    <span style={{fontSize: '24px', fontWeight: 'bold', color: '#383838', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}}>어디든지 날라갑니다.</span>
                    <span style={{fontSize: '14px', fontWeight: '500', color: '#606060', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>개인/단체/내부자교육</span>
                    <p style={{marginTop: '15px', marginBottom: '120px', fontWeight: '500', color: '#383838', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>Please fill out and submit to<br></br>receive a call from us.</p>

                    <a href="http://pf.kakao.com/_Wxmdxen" target="_blank" rel="noopener noreferrer" className={styles.kakaoButton}>
                       <span style={{marginTop: '8px'}}><BiMessageDetail size={20} /></span> 1:1 카카오톡 채널 문의
                     </a>
                </div>
                <div className={styles.formFields}>
                    <div className={styles.formGroup}>
                        <label htmlFor="schoolName">기관명 <span style={{color: 'red'}}>*</span></label>
                        <input
                        type="text"
                        id="schoolName"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        required
                        placeholder="기관명을 입력해주세요"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contactPerson">담당자명 <span style={{color: 'red'}}>*</span></label>
                        <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        placeholder="담당자 성함을 입력해주세요"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">연락처 <span style={{color: 'red'}}>*</span></label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="010-0000-0000"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">제안서 받으실 이메일 주소 (상담 후) <span style={{color: 'red'}}>*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="example@school.edu"
                        />
                    </div>
                </div>

              </div>
            </form>
            <div className={styles.checkContainer}>
             <div className={styles.checkRow}>
               <div className={styles.checkLeft}>
                 <h3>상담내용</h3>
               </div>
               <div className={styles.checkRight}>
                 <div className={styles.checkboxGroup}>
                   <label className={styles.checkboxLabel}>
                     <input
                       type="checkbox"
                       name="purchaseInquiry"
                       checked={formData.purchaseInquiry}
                       onChange={handleCheckboxChange}
                     />
                     <span>교구 구매 문의 (단체, 개인 구매)</span>
                   </label>
                   
                   <label className={styles.checkboxLabel}>
                     <input
                       type="checkbox"
                       name="schoolVisit"
                       checked={formData.schoolVisit}
                       onChange={handleCheckboxChange}
                     />
                     <span>학교(기관) 출강 문의</span>
                   </label>
                   
                   <label className={styles.checkboxLabel}>
                     <input
                       type="checkbox"
                       name="careerExperience"
                       checked={formData.careerExperience}
                       onChange={handleCheckboxChange}
                     />
                     <span>진로 체험 출강 문의</span>
                   </label>
                   
                   <label className={styles.checkboxLabel}>
                     <input
                       type="checkbox"
                       name="boothEntrustment"
                       checked={formData.boothEntrustment}
                       onChange={handleCheckboxChange}
                     />
                     <span>체험 부스 위탁 문의</span>
                   </label>
                   
                   <label className={styles.checkboxLabel}>
                     <input
                       type="checkbox"
                       name="other"
                       checked={formData.other}
                       onChange={handleCheckboxChange}
                     />
                     <span>기타: 직접 입력</span>
                   </label>
                   
                   {formData.other && (
                     <div className={styles.otherInput}>
                       <input
                         type="text"
                         name="otherText"
                         value={formData.otherText}
                         onChange={handleInputChange}
                         placeholder="기타 문의사항을 입력해주세요"
                         className={styles.otherTextField}
                       />
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
                {/* 개인정보 수집 및 이용 동의 */}
            <div className={styles.privacyContainer}>
                <div className={styles.privacyRow}>
                    <div className={styles.privacyLeft}>
                        <h3>개인정보 수집 및 이용 동의 <span style={{color: 'red'}}>*</span></h3>
                    </div>
                    <div className={styles.privacyRight}>
                        <div className={styles.privacyText}>
                            <p>날리자쿠(&apos;nallijaku.com&apos; 이하 &apos;날리자쿠&apos;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. 이 개인정보처리방침은 2025년 9월 1일부터 적용됩니다.</p>
                            
                            <h5>제1조(개인정보의 처리 목적)</h5>
                            <p>&apos;날리자쿠&apos;는 다음의 목적을 위하여 개인정보를 처리합니다. 처리 중인 개인정보는 아래 목적 외의 용도로 이용되지 않으며, 목적 변경 시 「개인정보 보호법」 제18조에 따라 별도 동의를 받는 등 필요한 조치를 이행합니다.</p>
                            <ul>
                            <li>홈페이지 회원가입 및 관리: 회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 만 14세 미만 법정대리인 동의 확인, 고지·통지, 고충처리.</li>
                            <li>클래스 기능 운영: 선생님 계정이 학생 계정을 생성할 수 있으며, 만 14세 미만 학생에 대해서는 &quot;만 14세 미만 학생 개인정보 수집 및 제3자 제공 동의서&quot;에 따른 법정대리인 동의를 얻습니다.</li>
                            <li>민원사무 처리: 신원 확인, 민원사항 확인, 연락·통지, 처리결과 통보.</li>
                            <li>재화 또는 서비스 제공: 드론 교육 서비스·콘텐츠 제공, 모듈형 드론 키트 등 재화 배송, 계약서·청구서 발송, 본인인증, 요금결제·정산.</li>
                            <li>마케팅 및 광고: 신규 서비스 개발·맞춤형 제공, 이벤트·광고성 정보 제공 및 참여기회 제공, 접속빈도 파악, 서비스 이용 통계.</li>
                            </ul>
                            
                            <h5>제2조(개인정보의 처리 및 보유 기간)</h5>
                            <p>① &apos;날리자쿠&apos;는 법령에 따른 보유·이용기간 또는 수집 시 동의받은 기간 내에서 개인정보를 처리·보유합니다.</p>
                            <p>② 각각의 처리·보유 기간은 다음과 같습니다.</p>
                            <ul>
                            <li>홈페이지 회원가입 및 관리: 회원 탈퇴 시까지. 단, 법령 위반 조사·분쟁·채권채무 존속 시 해당 사유 종료 시까지.</li>
                            <li>전자상거래 관련 기록: 계약·청약철회·대금결제·재화공급 5년, 소비자 불만·분쟁처리 3년.</li>
                            <li>클래스 이용 기록·학생 계정: 클래스 종료 후 1년 또는 관련 법정 기간. 만 14세 미만 법정대리인 동의 증빙은 법정 보존기간 동안 보관.</li>
                            </ul>
                            
                            <h5>제3조(개인정보의 제3자 제공)</h5>
                            <p>① &apos;날리자쿠&apos;는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조·제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                            <p>② 제공 현황: 제공받는 자(구글 애널리틱스, 믹스패널), 목적(서비스 이용 통계·분석 및 학술연구), 제공 항목(지역, 접속 이력, 쿠키, 서비스 이용 내역, IP 등), 보유·이용 기간(통상 18개월).</p>
                            
                            <h5>제4조(정보주체와 법정대리인의 권리·의무 및 행사방법)</h5>
                            <p>① 정보주체는 언제든지 열람·정정·삭제·처리정지 등을 요구할 수 있습니다.</p>
                            <p>② 행사방법: 서면, 전자우편, 모사전송(FAX) 등. &apos;날리자쿠&apos;는 지체 없이 조치합니다.</p>
                            <p>③ 대리인 행사 시 &quot;개인정보 처리 방법에 관한 고시&quot; 별지 제11호 위임장 제출.</p>
                            <p>④ 열람·처리정지 요구는 법 제35조 제4항, 제37조 제2항에 따라 제한될 수 있습니다.</p>
                            
                            <h5>제5조(처리하는 개인정보의 항목)</h5>
                            <p>&apos;날리자쿠&apos;는 다음의 개인정보 항목을 처리합니다.</p>
                            <ul>
                            <li>선생님 회원: 필수(로그인 ID, 비밀번호, 이름/닉네임, 이메일, 접속 로그, 쿠키, 접속 IP), 선택([추가 수집항목 기재]).</li>
                            <li>학생 회원: 필수(로그인 ID, 비밀번호, 이름/닉네임, 소속 클래스, 접속 로그, 쿠키, 접속 IP), 선택(없음).</li>
                            <li>재화 구매 시: 필수(구매자: 성명·연락처·이메일, 수령인: 성명·주소·연락처, 결제정보).</li>
                            </ul>
                            
                            <h5>제6조(개인정보의 파기)</h5>
                            <p>① &apos;날리자쿠&apos;는 보유기간 경과, 처리목적 달성 등 불필요해진 경우 지체 없이 파기합니다.</p>
                            <p>② 파기절차·방법: 파기 사유 발생 시 대상 선정 후 보호책임자 승인 하에 파기. 전자파일은 복구 불가능한 방식으로, 출력물은 분쇄·소각으로 파기합니다. 오탈자 &apos;날리자GKU&apos; 표기는 &apos;날리자쿠&apos;로 정정합니다.</p>
                            
                            <h5>제7조(개인정보의 안전성 확보 조치)</h5>
                            <p>&apos;날리자쿠&apos;는 다음과 같은 조치를 취합니다.</p>
                            <ul>
                            <li>관리적: 내부관리계획 수립·시행, 정기 교육, 자체 점검.</li>
                            <li>기술적: 접근권한 관리, 접근통제, 암호화, 악성코드 방지, 전송구간 보호, 접속기록 보관.</li>
                            <li>물리적: 전산실·자료보관실 출입통제.</li>
                            </ul>
                            
                            <h5>제8조(개인정보 자동 수집 장치의 설치·운영 및 거부)</h5>
                            <p>① &apos;날리자쿠&apos;는 맞춤형 서비스 제공을 위해 쿠키를 사용합니다.</p>
                            <p>② 거부 방법: 브라우저 설정(도구&gt;인터넷 옵션&gt;개인정보)에서 쿠키 저장을 거부할 수 있습니다. 거부 시 맞춤형 서비스 이용에 제한이 있을 수 있습니다.</p>
                            
                            <h5>제9조(개인정보 보호책임자)</h5>
                            <p>① &apos;날리자쿠&apos;는 개인정보 보호책임자 및 담당부서를 다음과 같이 지정합니다.</p>
                            <p>부서명: [개발팀] / 성명: [이민상] / 직급: [대표] / 연락처: [01050296452]</p>
                            <p>② 정보주체는 개인정보 보호 관련 문의·불만·피해구제를 위 연락처로 요청할 수 있습니다.</p>
                            
                            <h5>제10조(가명정보의 처리)</h5>
                            <p>&apos;날리자쿠&apos;는 다음 목적 등으로 가명정보를 처리할 수 있습니다. 처리 목적·보유기간·안전조치는 다음과 같습니다.</p>
                            <p>가명정보 처리 목적, 기간, 처리, 제3자에 관한 사항, 위탁에 관한 사항, 개인정보 항목 모두 직접작성 가능합니다.</p>
                            
                            <h5>제11조(개인정보 열람청구)</h5>
                            <p>다음 부서에서 개인정보 열람청구를 접수·처리합니다. &apos;날리자쿠&apos;는 신속히 처리하겠습니다.</p>
                            <p>접수·처리 부서:[개발팀] / 성명: [이민상] / 직급: [대표] / 연락처: [01050296452]</p>
                            
                            <h5>제12조(권익침해 구제방법)</h5>
                            <p>정보주체는 다음 기관에 분쟁해결이나 상담을 신청할 수 있습니다.</p>
                            <ul>
                            <li>개인정보분쟁조정위원회: 1833-6972, www.kopico.go.kr</li>
                            <li>개인정보침해신고센터: 118, privacy.kisa.or.kr</li>
                            <li>대검찰청: 1301, www.spo.go.kr</li>
                            <li>경찰청: 182, cyberbureau.police.go.kr</li>
                            </ul>
                            
                            <h5>제13조(개인정보 처리업무의 위탁)</h5>
                            <p>&apos;날리자쿠&apos;는 결제대행, 발송, 클라우드, 고객상담, 물류 등 업무를 수탁사에 위탁할 수 있으며, 위탁사·업무·보유기간을 홈페이지에 상시 공개하고 재위탁 금지·보호조치 의무를 계약에 반영하여 관리·감독합니다. 변경 시 본 방침 또는 공지사항에 즉시 반영합니다.</p>
                            
                            <h5>제14조(개인정보의 국외이전)</h5>
                            <p>&apos;날리자쿠&apos;는 분석 도구 등 이용 과정에서 개인정보를 국외로 이전할 수 있습니다. 국외이전 시 다음 사항을 고지하고 동의를 받습니다.</p>
                            <ul>
                            <li>이전되는 항목: 접속 로그, 쿠키, 이용내역, IP 등</li>
                            <li>국가·시기·방법: 미국 등, 서비스 이용 시 네트워크 전송</li>
                            <li>이전받는 자: Google LLC(연락처 포함), Mixpanel Inc. 등</li>
                            <li>목적·보유기간: 통계·성능 분석, 통상 18개월</li>
                            <li>이전 거부 방법·효과: 동의 거부 시 맞춤형·분석 기반 기능 일부 제한 가능</li>
                            </ul>
                            
                            <h5>제15조(자동화된 의사결정에 관한 사항)</h5>
                            <p>맞춤형 학습 추천·난이도 조정·진도관리 등 자동화 의사결정을 운영할 수 있으며, 중대한 영향이 있는 경우 관련 로직의 주요 기준·의미·예상 결과를 안내하고, 거부권·사람에 의한 재평가 요구권을 보장합니다.</p>
                            
                            <h5>제16조(개인정보 처리방침 변경)</h5>
                            <p>본 방침은 법령·서비스 변경에 따라 개정될 수 있으며, 중요 변경은 시행 7일 전(정보주체에게 불리한 경우 30일 전) 홈페이지 공지 및 이메일 등으로 고지합니다. 개정 사유·주요 변경사항·시행일을 함께 게시하고 변경 이력을 보관합니다.</p>
                            
                            <h5>부칙</h5>
                            <p>시행일: 2025년 9월 1일</p>
                        </div>
                    
                        <div className={styles.privacyAgreement}>
                            <label className={styles.privacyCheckbox}>
                            <input
                                type="checkbox"
                                name="privacyAgreement"
                                checked={formData.privacyAgreement}
                                onChange={handleCheckboxChange}
                                required
                            />
                            <span>개인정보 수집 및 이용에 동의합니다.</span>
                            </label>
                        </div>
                    </div>
                 </div>
                 </div>
                 {/* 제출 버튼 */}
                <div className={styles.submitContainer}>
                <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
                    협업&상담 요청서 제출하기
                </button>
                </div>
            </div>
            
            
           </div>
         </main>
       
       {/* Footer */}
       <footer className={styles.footer}>
         <div className={styles.footerContent}>
           {/* 왼쪽: 로고 */}
           <div className={styles.logoSection}>
             <Image 
               src="/transparentLogo.png" 
               alt="날리자쿠 로고" 
               width={120} 
               height={60}
             />
           </div>
           
           {/* 중앙: 회사 정보 */}
           <div className={styles.companyInfo}>
             <h3 className={styles.companyName}>날리자쿠</h3>
             <div className={styles.infoList}>
               <p><span>대표</span>|<span></span>이민상</p>
               <p><span>사업자 등록번호</span>|<span></span>215-65-00727</p>
               <p><span>연락처</span>|<span></span>010.5029.6452</p>
               <p><span>주소</span>|<span></span>충청북도 청주시 서원구 서원서로 30-23</p>
               <p>SK 하이닉스 창업관</p>
             </div>
             <div className={styles.legalLinks}>
               <a href="#" className={styles.legalLink}>서비스 이용약관</a>
               <a href="#" className={styles.legalLink}>개인정보처리방침</a>
             </div>
           </div>
           
           {/* 오른쪽: 메뉴 */}
           <div className={styles.menuSection}>
             <h4 className={styles.menuTitle}>메뉴</h4>
             <div className={styles.menuList}>
               <a href="#" className={styles.menuLink}>학습자료</a>
               <a href="#" className={styles.menuLink}>커뮤니티</a>
               <a href="#" className={styles.menuLink}>날리자쿠 소개</a>
               <a href="#" className={styles.menuLink}>사용 가이드</a>
             </div>
           </div>
           
           {/* SNS 섹션 */}
           <div className={styles.snsSection}>
             <h4 className={styles.snsTitle}>날리자쿠 SNS</h4>
             <div className={styles.snsIcons}>
               <a href="#" className={styles.snsIcon}>
                 <IoLogoInstagram size={24} />
               </a>
               <a href="#" className={styles.snsIcon}>
                 <IoLogoYoutube size={24} />
               </a>
               <a href="#" className={styles.snsIcon}>
                 <IoBusiness size={24} />
               </a>
             </div>
           </div>
         </div>
       </footer>
     </div>
   );
 }
