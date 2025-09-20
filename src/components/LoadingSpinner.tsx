import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  text = "로딩 중...", 
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div className={`global-loading-container ${className}`}>
      <div className="global-loading-spinner">
        <div className="dot"></div>
      </div>
      <div className="global-loading-text">{text}</div>
      <div className="global-loading-progress"></div>
    </div>
  );
}
