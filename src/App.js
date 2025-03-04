import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { dowonTheme } from './theme';

// Components
import Header from './components/Header';  // Header만 import
import PCDataInput from './pages/PCDataInput';
import PCDataView from './pages/PCDataView';
import AppointmentPage from './components/dowon/appointment/AppointmentPage';

// LOCAL_STORAGE_KEY가 export 되어 있어야 합니다
export const LOCAL_STORAGE_KEY = 'your_storage_key';

// 도원한의원 관련 컴포넌트
import DowonHome from './pages/dowon/Home';
import DowonInfo from './pages/dowon/Info';
import DowonMedical from './pages/dowon/Medical';
import Appointment from './pages/dowon/Appointment';

function App() {
  return (
    <ThemeProvider theme={dowonTheme}>
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* PC 관련 라우트 */}
              <Route path="/pc/input" element={<PCDataInput />} />
              <Route path="/pc/view" element={<PCDataView />} />
              <Route path="/appointment/*" element={<AppointmentPage />} />
              
              {/* 도원한의원 관련 라우트 */}
              <Route path="/dowon" element={<DowonHome />} />
              <Route path="/dowon/info" element={<DowonInfo />} />
              <Route path="/dowon/medical" element={<DowonMedical />} />
              <Route path="/dowon/appointment" element={<Appointment />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;