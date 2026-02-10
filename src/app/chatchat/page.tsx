'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function ChatChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 초기 메시지는 클라이언트에서만 설정 (Hydration 에러 방지)
    useEffect(() => {
        setMessages([
            {
                id: 1,
                text: '안녕하세요! 날리자쿠 AI 챗봇입니다. 무엇을 도와드릴까요?',
                isUser: false,
                timestamp: new Date()
            }
        ]);
    }, []);

    // 메시지 추가 시 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        // TODO: 실제 API 연동
        // 임시 응답 (1초 후)
        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now() + 1,
                text: '죄송합니다. 현재 챗봇 기능을 개발 중입니다. 곧 더 나은 서비스로 찾아뵙겠습니다!',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoArrowBack size={24} />
                </button>
                <div className={styles.headerCenter}>
                    <Image 
                        src="/nallijaku.png" 
                        alt="날리자쿠" 
                        width={100} 
                        height={32}
                        priority
                    />
                    <span className={styles.headerSubtitle}>AI 챗봇</span>
                </div>
                <div className={styles.headerSpacer}></div>
            </header>

            {/* 채팅 영역 */}
            <div className={styles.chatArea}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.messageWrapper} ${
                            message.isUser ? styles.userWrapper : styles.botWrapper
                        }`}
                    >
                        <div
                            className={`${styles.message} ${
                                message.isUser ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            <div className={styles.messageText}>{message.text}</div>
                            <div className={styles.messageTime}>
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={styles.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <textarea
                        className={styles.input}
                        placeholder="메시지를 입력하세요..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={handleSend}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <IoSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
