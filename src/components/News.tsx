'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import styles from '@/styles/News.module.css';

export default function News() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const newsRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const currentRef = newsRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const newsData = [
        {
            id: 1,
            title: "건국대 글로컬캠 드론 원데이 클래스 개최",
            content: "건국대 글로컬캠은 직원 노동조합이 주최하고 날리자KU(창업문화활성화센터 드론 창업동아리)가 주관해 뉴라이프(중앙동아리) 드론봉사단이 함께한 드론 원데이 클래스가 18일 성공적으로 개최됐다고 23일 밝혔다.",
            source: "베리타스알파",
            date: "2024.05.23",
            url: "https://www.veritas-a.com/news/articleView.html?idxno=505587",
            image: "/News/veritas.png"
        },
        {
            id: 2,
            title: "날리자쿠, 드론 교육으로 미래 인재 양성",
            content: "창업동아리 날리자 KU는 드론 비행 및 무인 멀티콥터를 전문으로 교육하는 창업 동아리로 드론의 진입장벽을 낮추고, 독자적인 드론 교육시스템을 연구하고자 2024년에 신설됐다.",
            source: "한국경제",
            date: "2025.07.16",
            url: "https://www.hankyung.com/article/202507162520i",
            image: "/News/hankyung.png"
        },
        {
            id: 3,
            title: "충주지역 드론 교육의 새로운 패러다임",
            content: "날리자쿠는 충주와 충청북도의 교육생들에게 드론 교육의 기회를 제공하고자 하며, 추후에는 드론 플랫폼을 설립해 더 많은 교육생들에게 높은 수준의 교육을 제공하기 위해서 노력할 것이라고 전했다.",
            source: "SNA코리아",
            date: "2024.06.15",
            url: "http://www.snakorea.com/news/articleView.html?idxno=944383",
            image: "/News/snakorea.png"
        },
        {
            id: 4,
            title: "드론 축구 체험으로 아이들의 꿈 키워",
            content: "드론 비행 실습에서는 뉴라이프의 드론 봉사단 학생이 아동 2명당 1명의 교관으로 함께해 아동들이 직접 드론 볼을 날리며 골대에 넣어보는 드론 축구와 드론 기초 비행을 체험하는 등 안전한 환경 속에서 교육을 진행했다.",
            source: "굿모닝충청",
            date: "2024.08.20",
            url: "https://www.goodmorningcc.com/news/articleView.html?idxno=418984",
            image: "/News/goodmorningcc.png"
        },
        {
            id: 5,
            title: "4차 산업혁명 시대의 드론 교육",
            content: "드론이 단순한 취미를 넘어 활용 범위가 점점 확대되고 4차 산업시대에 핵심 분야로 주목받음에 따라 아동들의 드론에 대한 관심도가 높아지는 것을 반영해 마련된 교육 프로그램이다.",
            source: "NBN뉴스",
            date: "2024.09.10",
            url: "https://www.nbnnews.co.kr/news/articleView.html?idxno=866342",
            image: "/News/nbnnews.png"
        }
    ];

    const totalItems = newsData.length;
    const currentNews = [
        newsData[currentPage % totalItems],
        newsData[(currentPage + 1) % totalItems],
        newsData[(currentPage + 2) % totalItems]
    ];

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalItems);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalItems) % totalItems);
    };

    return (
        <section ref={newsRef} className={`${styles.newsSection} ${isVisible ? styles.animate : ''}`}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>외부소식</h2>
                    <p className={styles.subtitle}>날리자쿠의 다양한 활동과 성과를<br></br>언론을 통해 확인해보세요</p>
                </div>
                
                <div className={styles.newsSliderContainer}>
                    <button 
                        className={styles.sliderButton} 
                        onClick={prevPage}
                        aria-label="이전 기사"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>
                    
                    <div className={styles.newsGrid}>
                        {currentNews.map((news, index) => (
                            <div key={news.id} className={styles.newsCard}>
                                <div className={styles.newsImage}>
                                    <Image 
                                        src={news.image} 
                                        alt={news.title}
                                        width={400}
                                        height={250}
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                                    />
                                </div>
                                <div className={styles.newsContent}>
                                    <div className={styles.newsHeader}>
                                        <span className={styles.newsSource}>{news.source}</span>
                                        <span className={styles.newsDate}>{news.date}</span>
                                    </div>
                                    <h3 className={styles.newsTitle}>
                                        <a 
                                            href={news.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.newsLink}
                                        >
                                            {news.title}
                                        </a>
                                    </h3>
                                    <p className={styles.newsSummary}>{news.content}</p>
                                    <div className={styles.readMore}>
                                        <a 
                                            href={news.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.readMoreLink}
                                        >
                                            기사 읽기 →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={styles.sliderButton} 
                        onClick={nextPage}
                        aria-label="다음 기사"
                    >
                        <IoChevronForwardOutline size={24} />
                    </button>
                </div>

                <div className={styles.pagination}>
                    {Array.from({ length: totalItems }, (_, i) => (
                        <button
                            key={i}
                            className={`${styles.pageDot} ${currentPage === i ? styles.activeDot : ''}`}
                            onClick={() => setCurrentPage(i)}
                            aria-label={`${i + 1}번째 기사로 이동`}
                        />
                    ))}
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        날리자쿠는 지속적으로 드론 교육의 새로운 가치를 만들어가고 있습니다.<br></br>
                        더 많은 소식과 업데이트는 언론 매체를 통해 확인하실 수 있습니다.
                    </p>
                </div>
            </div>
        </section>
    );
}
