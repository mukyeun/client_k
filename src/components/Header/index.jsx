import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header-wrapper">
      <header className="header">
        <h1>맥파 측정 시스템</h1>
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate('/pc-input')}>PC 데이터 입력</button>
          <button className="nav-button" onClick={() => navigate('/pc-data')}>PC 데이터 조회</button>
        </div>
      </header>
    </div>
  );
};

export default Header;