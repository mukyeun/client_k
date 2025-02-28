import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className="header">
        <div className="logo">UBIO HEALTH SYSTEM</div>
        <nav className="nav-links">
          <button onClick={() => navigate('/kiosk-form')}>키오스크 입력</button>
          <button onClick={() => navigate('/kiosk-data')}>키오스크 데이터 조회</button>
          <button onClick={() => navigate('/pc-input')}>PC 데이터 입력</button>
          <button onClick={() => navigate('/pc-data')}>PC 데이터 조회</button>
        </nav>
      </header>
    </div>
  );
};

export default MainPage;