'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import styles from './page.module.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: Date;
}

export default function ChatChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const studentId = 'student123';

    // Firestore에서 채팅 내역 실시간 구독 (서브컬렉션)
    useEffect(() => {
        console.log('🔥 Firestore 구독 시작, studentId:', studentId);
        const messagesRef = collection(db, 'users', studentId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));
        console.log('📄 서브컬렉션 경로:', `users/${studentId}/messages`);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('📨 Firestore 스냅샷 수신, 문서 수:', snapshot.docs.length);
            
            const chatItems: Message[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    role: data.role as 'user' | 'assistant',
                    content: data.content,
                    createdAt: data.createdAt?.toDate(),
                };
            });
            
            console.log('✅ 포맷된 메시지:', chatItems);
            setMessages(chatItems);
            setPendingMessage(null);
        }, (error) => {
            console.error('❌ Firestore 구독 에러:', error);
        });

        return () => {
            console.log('🔌 Firestore 구독 해제');
            unsubscribe();
        };
    }, [studentId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, pendingMessage]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage = inputText.trim();
        console.log('📤 메시지 전송 시작:', userMessage);
        
        setPendingMessage(userMessage);
        setInputText('');
        setIsLoading(true);

        try {
            console.log('🤖 Cloud Function 호출 중...');
            const response = await fetch('https://asia-northeast3-nalizaku.cloudfunctions.net/otherchat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: studentId,
                    message: userMessage
                })
            });

            console.log('📡 Cloud Function 응답 상태:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Cloud Function 에러:', errorText);
                setPendingMessage(null);
                throw new Error('AI 응답 실패');
            }

            const result = await response.json();
            console.log('✅ Cloud Function 응답:', result);
            
        } catch (error) {
            console.error('❌ 메시지 전송 실패:', error);
            setPendingMessage(null);
            alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
            console.log('🏁 메시지 전송 완료');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
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

            <div className={styles.chatArea}>
                {messages.length === 0 && !pendingMessage && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <p className={styles.emptyText}>대화를 시작해보세요!</p>
                    </div>
                )}
                
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.messageWrapper} ${
                            message.role === 'user' ? styles.userWrapper : styles.botWrapper
                        }`}
                    >
                        <div
                            className={`${styles.message} ${
                                message.role === 'user' ? styles.userMessage : styles.botMessage
                            }`}
                        >
                            {message.role === 'user' ? (
                                <div className={styles.messageText}>{message.content}</div>
                            ) : (
                                <div className={styles.messageText}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({node, ...props}) => <p className={styles.markdownP} {...props} />,
                                            ul: ({node, ...props}) => <ul className={styles.markdownUl} {...props} />,
                                            ol: ({node, ...props}) => <ol className={styles.markdownOl} {...props} />,
                                            li: ({node, ...props}) => <li className={styles.markdownLi} {...props} />,
                                            code: ({node, inline, className, children, ...props}: any) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const language = match ? match[1] : '';
                                                
                                                return !inline && language ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={language}
                                                        PreTag="div"
                                                        className={styles.markdownCodeBlock}
                                                        customStyle={{
                                                            margin: 0,
                                                            padding: '12px 16px',
                                                            background: 'rgba(0, 0, 0, 0.2)',
                                                            borderRadius: '8px',
                                                            fontSize: '0.9em',
                                                        }}
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={styles.markdownInlineCode} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            pre: ({node, children, ...props}) => <pre {...props}>{children}</pre>,
                                            strong: ({node, ...props}) => <strong className={styles.markdownStrong} {...props} />,
                                            em: ({node, ...props}) => <em className={styles.markdownEm} {...props} />,
                                            h1: ({node, ...props}) => <h1 className={styles.markdownH1} {...props} />,
                                            h2: ({node, ...props}) => <h2 className={styles.markdownH2} {...props} />,
                                            h3: ({node, ...props}) => <h3 className={styles.markdownH3} {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote className={styles.markdownBlockquote} {...props} />,
                                            a: ({node, ...props}) => <a className={styles.markdownLink} target="_blank" rel="noopener noreferrer" {...props} />,
                                            hr: ({node, ...props}) => <hr className={styles.markdownHr} {...props} />,
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {pendingMessage && (
                    <div className={`${styles.messageWrapper} ${styles.userWrapper}`}>
                        <div className={`${styles.message} ${styles.userMessage}`} style={{opacity: 0.7}}>
                            <div className={styles.messageText}>{pendingMessage}</div>
                        </div>
                    </div>
                )}
                
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

            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <textarea
                        className={styles.input}
                        placeholder="메시지를 입력하세요..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
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
