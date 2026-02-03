'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// PDF.js worker 설정 - 로컬 파일 사용
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface PDFViewerProps {
  pdfUrl: string;
  onLoadComplete?: () => void;
}

export default function PDFViewer({ pdfUrl, onLoadComplete }: PDFViewerProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.5);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      if (!pdfUrl || !canvasContainerRef.current) return;

      try {
        setLoading(true);
        setError('');

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        if (!isMounted) return;
        
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        
        await renderPage(pdf, 1);
        
        setLoading(false);
        onLoadComplete?.();
      } catch (err: any) {
        console.error('PDF 로드 오류:', err);
        if (isMounted) {
          setError('PDF를 불러올 수 없습니다.');
          setLoading(false);
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
      }
    };
  }, [pdfUrl, onLoadComplete]);

  const renderPage = async (pdf: any, pageNumber: number) => {
    if (!canvasContainerRef.current) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      canvasContainerRef.current.innerHTML = '';

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';

      canvasContainerRef.current.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('페이지 렌더링 오류:', err);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!pdfDocRef.current || newPage < 1 || newPage > numPages) return;
    
    setCurrentPage(newPage);
    await renderPage(pdfDocRef.current, newPage);
  };

  const handleZoomIn = async () => {
    const newScale = Math.min(scale + 0.25, 3);
    setScale(newScale);
    if (pdfDocRef.current) {
      await renderPage(pdfDocRef.current, currentPage);
    }
  };

  const handleZoomOut = async () => {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
    if (pdfDocRef.current) {
      await renderPage(pdfDocRef.current, currentPage);
    }
  };

  const handleOpenNewWindow = () => {
    window.open(pdfUrl, '_blank', 'width=1200,height=800');
  };

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#999',
        padding: '40px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px', margin: 0 }}>⚠️ {error}</h3>
        <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>PDF 파일을 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        gap: '16px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage <= 1 ? '#f0f0f0' : '#04AD74',
              color: currentPage <= 1 ? '#999' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            ← 이전
          </button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333', minWidth: '80px', textAlign: 'center' }}>
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= numPages}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage >= numPages ? '#f0f0f0' : '#04AD74',
              color: currentPage >= numPages ? '#999' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: currentPage >= numPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            다음 →
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            style={{
              padding: '6px 12px',
              backgroundColor: scale <= 0.5 ? '#f0f0f0' : '#04AD74',
              color: scale <= 0.5 ? '#999' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            -
          </button>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333', minWidth: '60px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            style={{
              padding: '6px 12px',
              backgroundColor: scale >= 3 ? '#f0f0f0' : '#04AD74',
              color: scale >= 3 ? '#999' : '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: scale >= 3 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            +
          </button>
        </div>

        <button
          onClick={handleOpenNewWindow}
          style={{
            padding: '6px 16px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1976D2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2196F3';
          }}
        >
          새 창으로 열기
        </button>
      </div>

      <div
        ref={canvasContainerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}
      />
    </div>
  );
}
