import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PCDataInput from './pages/PCDataInput/index.jsx';
import PCDataView from './pages/PCDataView/index.jsx';
import Header from './components/Header';

// 로컬 스토리지 키 상수 추가
export const LOCAL_STORAGE_KEY = 'ubioUserData';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="content">
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<PCDataInput />} />
            
            {/* PC 모드 라우트 */}
            <Route path="/pc-input" element={<PCDataInput />} />
            <Route path="/pc-data" element={<PCDataView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;