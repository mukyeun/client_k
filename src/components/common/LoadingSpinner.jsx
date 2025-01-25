// src/components/common/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  overlay = false, 
  message = '체질을 분석하고 있습니다...' 
}) => (
  <>
    {overlay && <div className="loading-spinner-overlay" />}
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  </>
);

export default LoadingSpinner;