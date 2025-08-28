'use client';

import React from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { IoLogoInstagram, IoLogoYoutube, IoBusiness } from 'react-icons/io5';
import styles from './page.module.css';

export default function PartnerRecruitmentPage() {
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    education: '',
    location: '',
    motivation: '',
    availableTime: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 폼 제출 로직을 추가할 수 있습니다
    console.log('파트너 신청:', formData);
    alert('파트너 신청이 접수되었습니다. 검토 후 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <div className={styles.container}>
      <Header forceLightMode={true} />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>교육 파트너 모집</h1>
          <p className={styles.subtitle}>
            날리자쿠와 함께 아이들에게 드론의 꿈을 심어주는 교육 파트너가 되어보세요
          </p>
          
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="이름을 입력해주세요"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">연락처 *</label>
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
                  <label htmlFor="email">이메일 *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="experience">드론 관련 경험 *</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">경험을 선택해주세요</option>
                    <option value="초보자">초보자 (경험 없음)</option>
                    <option value="취미">취미로 드론 조종</option>
                    <option value="교육">드론 교육 경험</option>
                    <option value="전문가">드론 전문가</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="education">교육 관련 경험</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                  >
                    <option value="">교육 경험을 선택해주세요</option>
                    <option value="없음">교육 경험 없음</option>
                    <option value="학원강사">학원 강사</option>
                    <option value="학교교사">학교 교사</option>
                    <option value="방과후">방과후 강사</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">활동 가능 지역 *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="활동 가능한 지역을 입력해주세요 (예: 충주시, 서울시 강남구)"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="motivation">지원 동기 *</label>
                <textarea
                  id="motivation"
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="날리자쿠 교육 파트너가 되고 싶은 이유와 동기를 작성해주세요"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="availableTime">가능한 활동 시간</label>
                <select
                  id="availableTime"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleInputChange}
                >
                  <option value="">활동 가능 시간을 선택해주세요</option>
                  <option value="평일오전">평일 오전</option>
                  <option value="평일오후">평일 오후</option>
                  <option value="평일저녁">평일 저녁</option>
                  <option value="주말">주말</option>
                  <option value="시간협의">시간 협의 가능</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">추가 문의사항</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="추가로 궁금한 점이나 특별한 요청사항이 있으시면 작성해주세요"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                파트너 신청하기
              </button>
            </form>
          </div>

          <div className={styles.infoSection}>
            <h2>파트너 혜택</h2>
            <div className={styles.benefits}>
              <div className={styles.benefit}>
                <h3>전문 교육 지원</h3>
                <p>드론 교육 전문가가 되기 위한 체계적인 교육과 자격증 과정을 지원합니다.</p>
              </div>
              <div className={styles.benefit}>
                <h3>안정적인 수입</h3>
                <p>정기적인 교육 프로그램을 통해 안정적이고 지속 가능한 수입을 창출할 수 있습니다.</p>
              </div>
              <div className={styles.benefit}>
                <h3>성장 기회</h3>
                <p>날리자쿠의 다양한 교육 프로그램과 네트워크를 통해 지속적인 성장 기회를 제공합니다.</p>
              </div>
            </div>
          </div>

          <div className={styles.requirementsSection}>
            <h2>파트너 지원 자격</h2>
            <div className={styles.requirements}>
              <div className={styles.requirement}>
                <h3>기본 요건</h3>
                <ul>
                  <li>만 20세 이상</li>
                  <li>고등학교 졸업 이상</li>
                  <li>아이들과의 소통에 관심이 있는 분</li>
                  <li>새로운 기술 학습에 열정이 있는 분</li>
                </ul>
              </div>
              <div className={styles.requirement}>
                <h3>우대 사항</h3>
                <ul>
                  <li>드론 조종 경험</li>
                  <li>교육 관련 경험</li>
                  <li>컴퓨터 활용 능력</li>
                  <li>창의적 사고 능력</li>
                </ul>
              </div>
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
