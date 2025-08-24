'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/Review.module.css';

export default function Review() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { 
                threshold: 0,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section 
            ref={sectionRef} 
            className={`${styles.reviewSection} ${isVisible ? styles.animate : ''}`}
        >
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>교육후기</h2>
                        <p className={styles.subTitle}>
                            높은 만족감! <span style={{fontWeight: '500'}}>다시 찾는 교육!</span>
                        </p>
                    </div>
                    <div className={styles.cardSection}>
                        <div className={styles.cardContainer}>
                            {[
                                {
                                    review: "여학생들이 직접 드론을 만져볼 수 있도록 안전한 교구 활용이 정말 만족스러웠습니다.",
                                    name: "이O정",
                                    job: "여성 방과후 교사"
                                },
                                {
                                    review: "쉽고 체계적인 드론 실습 콘텐츠 덕분에 과학 수업이 훨씬 풍부해졌습니다. 학생 참여도가 확실히 높아졌어요.",
                                    name: "김O훈",
                                    job: "OO중학교 과학 교사"
                                },
                                {
                                    review: "게임처럼 팀원들과 함께 경쟁하며 배우니까 시간 가는 줄 몰랐어요.",
                                    name: "정O우",
                                    job: "초등4, OO시 소년센터 이용생"
                                },
                                {
                                    review: "작동이 쉬워서 드론에 대한 두려움 없이 배울 수 있었어요.",
                                    name: "김O서",
                                    job: "대학교 1학년(여), 초보"
                                },
                                {
                                    review: "최신 산업 트렌드가 반영된 모듈형 교육 자료 덕분에 직업훈련 효과가 크게 향상됐습니다.",
                                    name: "최O환",
                                    job: "OO직업훈련센터 교사"
                                },
                                {
                                    review: "드론 활용 진로 정보까지 알 수 있어 전공 고민에 큰 도움을 받았습니다.",
                                    name: "이O용",
                                    job: "고2, 진로고민 많은 이과생"
                                },
                                {
                                    review: "예산 대비 효과적인 운영, 다양한 학생 포용이 가능해 정책 보고에 강점이 있습니다.",
                                    name: "조O정",
                                    job: "OO시 STEM사업담당"
                                },
                                {
                                    review: "학생 안전사고 관리와 성과 측정이 손쉬워져서 프로그램 운영 부담이 줄었습니다.",
                                    name: "오O현",
                                    job: "OO시 청소년수련관 운영팀장"
                                },
                                {
                                    review: "실습 중심 수업 구성이라서 복잡한 준비 없이도 멘토링이 수월하게 진행됐어요.",
                                    name: "박O수",
                                    job: "OO대학생 튜터/멘토"
                                },
                                {
                                    review: "자격증 연계 커리큘럼으로 취업 준비에 실질적 도움이 됐습니다.",
                                    name: "안O현",
                                    job: "고3, 취업 준비생"
                                },
                                {
                                    review: "전문 실습 장비 체험이 가능해 진짜 산업 현장감을 느꼈어요.",
                                    name: "한O혁",
                                    job: "특성화고 재학생"
                                }
                            ].map((item, index) => (
                                <div key={index} className={styles.card}>
                                    <div className={styles.cardContent}>
                                        <p>&quot;{item.review}&quot;</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.avatar}>
                                            <img 
                                                src={`/Review/person${(index % 4) + 1}.png`} 
                                                alt={`Person ${(index % 4) + 1}`}
                                            />
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h4>{item.name}</h4>
                                            <p>{item.job}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* 카드를 복제해서 무한 스크롤 효과 */}
                            {[
                                {
                                    review: "여학생들이 직접 드론을 만져볼 수 있도록 안전한 교구 활용이 정말 만족스러웠습니다.",
                                    name: "이O정",
                                    job: "여성 방과후 교사"
                                },
                                {
                                    review: "쉽고 체계적인 드론 실습 콘텐츠 덕분에 과학 수업이 훨씬 풍부해졌습니다. 학생 참여도가 확실히 높아졌어요.",
                                    name: "김O훈",
                                    job: "OO중학교 과학 교사"
                                },
                                {
                                    review: "게임처럼 팀원들과 함께 경쟁하며 배우니까 시간 가는 줄 몰랐어요.",
                                    name: "정O우",
                                    job: "초등4, OO시 소년센터 이용생"
                                },
                                {
                                    review: "작동이 쉬워서 드론에 대한 두려움 없이 배울 수 있었어요.",
                                    name: "김O서",
                                    job: "대학교 1학년(여), 초보"
                                },
                                {
                                    review: "최신 산업 트렌드가 반영된 모듈형 교육 자료 덕분에 직업훈련 효과가 크게 향상됐습니다.",
                                    name: "최O환",
                                    job: "OO직업훈련센터 교사"
                                },
                                {
                                    review: "드론 활용 진로 정보까지 알 수 있어 전공 고민에 큰 도움을 받았습니다.",
                                    name: "이O용",
                                    job: "고2, 진로고민 많은 이과생"
                                },
                                {
                                    review: "예산 대비 효과적인 운영, 다양한 학생 포용이 가능해 정책 보고에 강점이 있습니다.",
                                    name: "조O정",
                                    job: "OO시 STEM사업담당"
                                },
                                {
                                    review: "학생 안전사고 관리와 성과 측정이 손쉬워져서 프로그램 운영 부담이 줄었습니다.",
                                    name: "오O현",
                                    job: "OO시 청소년수련관 운영팀장"
                                },
                                {
                                    review: "실습 중심 수업 구성이라서 복잡한 준비 없이도 멘토링이 수월하게 진행됐어요.",
                                    name: "박O수",
                                    job: "OO대학생 튜터/멘토"
                                },
                                {
                                    review: "자격증 연계 커리큘럼으로 취업 준비에 실질적 도움이 됐습니다.",
                                    name: "안O현",
                                    job: "고3, 취업 준비생"
                                },
                                {
                                    review: "전문 실습 장비 체험이 가능해 진짜 산업 현장감을 느꼈어요.",
                                    name: "한O혁",
                                    job: "특성화고 재학생"
                                }
                            ].map((item, index) => (
                                <div key={`duplicate-${index}`} className={styles.card}>
                                    <div className={styles.cardContent}>
                                        <p>&quot;{item.review}&quot;</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.avatar}>
                                            <img 
                                                src={`/Review/person${(index % 4) + 1}.png`} 
                                                alt={`Person ${(index % 4) + 1}`}
                                            />
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h4>{item.name}</h4>
                                            <p>{item.job}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* 추가 복제본 1 */}
                            {[
                                {
                                    review: "여학생들이 직접 드론을 만져볼 수 있도록 안전한 교구 활용이 정말 만족스러웠습니다.",
                                    name: "이O정",
                                    job: "여성 방과후 교사"
                                },
                                {
                                    review: "쉽고 체계적인 드론 실습 콘텐츠 덕분에 과학 수업이 훨씬 풍부해졌습니다. 학생 참여도가 확실히 높아졌어요.",
                                    name: "김O훈",
                                    job: "OO중학교 과학 교사"
                                },
                                {
                                    review: "게임처럼 팀원들과 함께 경쟁하며 배우니까 시간 가는 줄 몰랐어요.",
                                    name: "정O우",
                                    job: "초등4, OO시 소년센터 이용생"
                                },
                                {
                                    review: "작동이 쉬워서 드론에 대한 두려움 없이 배울 수 있었어요.",
                                    name: "김O서",
                                    job: "대학교 1학년(여), 초보"
                                },
                                {
                                    review: "최신 산업 트렌드가 반영된 모듈형 교육 자료 덕분에 직업훈련 효과가 크게 향상됐습니다.",
                                    name: "최O환",
                                    job: "OO직업훈련센터 교사"
                                },
                                {
                                    review: "드론 활용 진로 정보까지 알 수 있어 전공 고민에 큰 도움을 받았습니다.",
                                    name: "이O용",
                                    job: "고2, 진로고민 많은 이과생"
                                },
                                {
                                    review: "예산 대비 효과적인 운영, 다양한 학생 포용이 가능해 정책 보고에 강점이 있습니다.",
                                    name: "조O정",
                                    job: "OO시 STEM사업담당"
                                },
                                {
                                    review: "학생 안전사고 관리와 성과 측정이 손쉬워져서 프로그램 운영 부담이 줄었습니다.",
                                    name: "오O현",
                                    job: "OO시 청소년수련관 운영팀장"
                                },
                                {
                                    review: "실습 중심 수업 구성이라서 복잡한 준비 없이도 멘토링이 수월하게 진행됐어요.",
                                    name: "박O수",
                                    job: "OO대학생 튜터/멘토"
                                },
                                {
                                    review: "자격증 연계 커리큘럼으로 취업 준비에 실질적 도움이 됐습니다.",
                                    name: "안O현",
                                    job: "고3, 취업 준비생"
                                },
                                {
                                    review: "전문 실습 장비 체험이 가능해 진짜 산업 현장감을 느꼈어요.",
                                    name: "한O혁",
                                    job: "특성화고 재학생"
                                }
                            ].map((item, index) => (
                                <div key={`duplicate2-${index}`} className={styles.card}>
                                    <div className={styles.cardContent}>
                                        <p>&quot;{item.review}&quot;</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.avatar}>
                                            <img 
                                                src={`/Review/person${(index % 4) + 1}.png`} 
                                                alt={`Person ${(index % 4) + 1}`}
                                            />
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h4>{item.name}</h4>
                                            <p>{item.job}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* 추가 복제본 2 */}
                            {[
                                {
                                    review: "여학생들이 직접 드론을 만져볼 수 있도록 안전한 교구 활용이 정말 만족스러웠습니다.",
                                    name: "이O정",
                                    job: "여성 방과후 교사"
                                },
                                {
                                    review: "쉽고 체계적인 드론 실습 콘텐츠 덕분에 과학 수업이 훨씬 풍부해졌습니다. 학생 참여도가 확실히 높아졌어요.",
                                    name: "김O훈",
                                    job: "OO중학교 과학 교사"
                                },
                                {
                                    review: "게임처럼 팀원들과 함께 경쟁하며 배우니까 시간 가는 줄 몰랐어요.",
                                    name: "정O우",
                                    job: "초등4, OO시 소년센터 이용생"
                                },
                                {
                                    review: "작동이 쉬워서 드론에 대한 두려움 없이 배울 수 있었어요.",
                                    name: "김O서",
                                    job: "대학교 1학년(여), 초보"
                                },
                                {
                                    review: "최신 산업 트렌드가 반영된 모듈형 교육 자료 덕분에 직업훈련 효과가 크게 향상됐습니다.",
                                    name: "최O환",
                                    job: "OO직업훈련센터 교사"
                                },
                                {
                                    review: "드론 활용 진로 정보까지 알 수 있어 전공 고민에 큰 도움을 받았습니다.",
                                    name: "이O용",
                                    job: "고2, 진로고민 많은 이과생"
                                },
                                {
                                    review: "예산 대비 효과적인 운영, 다양한 학생 포용이 가능해 정책 보고에 강점이 있습니다.",
                                    name: "조O정",
                                    job: "OO시 STEM사업담당"
                                },
                                {
                                    review: "학생 안전사고 관리와 성과 측정이 손쉬워져서 프로그램 운영 부담이 줄었습니다.",
                                    name: "오O현",
                                    job: "OO시 청소년수련관 운영팀장"
                                },
                                {
                                    review: "실습 중심 수업 구성이라서 복잡한 준비 없이도 멘토링이 수월하게 진행됐어요.",
                                    name: "박O수",
                                    job: "OO대학생 튜터/멘토"
                                },
                                {
                                    review: "자격증 연계 커리큘럼으로 취업 준비에 실질적 도움이 됐습니다.",
                                    name: "안O현",
                                    job: "고3, 취업 준비생"
                                },
                                {
                                    review: "전문 실습 장비 체험이 가능해 진짜 산업 현장감을 느꼈어요.",
                                    name: "한O혁",
                                    job: "특성화고 재학생"
                                }
                            ].map((item, index) => (
                                <div key={`duplicate3-${index}`} className={styles.card}>
                                    <div className={styles.cardContent}>
                                        <p>&quot;{item.review}&quot;</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.avatar}>
                                            <img 
                                                src={`/Review/person${(index % 4) + 1}.png`} 
                                                alt={`Person ${(index % 4) + 1}`}
                                            />
                                        </div>
                                        <div className={styles.userInfo}>
                                            <h4>{item.name}</h4>
                                            <p>{item.job}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
