'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Who.module.css';

export default function Who() {
    const [selectedType, setSelectedType] = useState<'child' | 'adult'>('child');
    const [isVisible, setIsVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // 기존 인터벌 정리
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // 새로운 인터벌 설정
        intervalRef.current = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setImageIndex(prev => {
                    if (prev === 3) return 1;
                    return prev + 1;
                });
                setIsTransitioning(false);
            }, 500);
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedType]);

    const handleButtonClick = (type: 'child' | 'adult') => {
        if (type === selectedType) return;
        
        setIsTransitioning(true);
        setImageIndex(1);
        setTimeout(() => {
            setSelectedType(type);
            setIsTransitioning(false);
        }, 200);
    };

    const getImageSrc = () => {
        if (selectedType === 'child') {
            return `/Who/Child${imageIndex}.png`;
        } else {
            return `/Who/Adult${imageIndex}.png`;
        }
    };

    return (
        <section 
            ref={sectionRef} 
            className={`${styles.whoSection} ${isVisible ? styles.animate : ''}`}
        >
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    <div className={styles.ImageSection}>
                        <img 
                            src={getImageSrc()} 
                            alt={`${selectedType === 'child' ? 'Child' : 'Adult'}${imageIndex}`} 
                            className={isTransitioning ? styles.fadeOut : styles.fadeIn}
                        />
                    </div>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>WHO?</h2>
                        <p className={styles.subTitle}>
                            아이부터 성인까지,<br></br>
                            <span style={{fontWeight: '500'}}>다양한 연령의 드론 교육</span>
                        </p>
                        <div className={styles.buttonSection}>
                            <button 
                                className={`${styles.button1} ${selectedType === 'child' ? styles.active : ''}`}
                                onClick={() => handleButtonClick('child')}
                            >
                                Child
                            </button>
                            <button 
                                className={`${styles.button2} ${selectedType === 'adult' ? styles.active : ''}`}
                                onClick={() => handleButtonClick('adult')}
                            >
                                Adult
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}