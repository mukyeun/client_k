import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { commonStyles } from './styles';
import { useNavigate, useLocation } from 'react-router-dom';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <Typography sx={{ ml: 2, color: '#475569', fontSize: '14px' }}>
      {label}:
    </Typography>
    <Typography sx={{ ml: 1, color: '#1E293B', fontSize: '14px', fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
);

const AppointmentComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentData = location.state?.appointmentData;

  console.log('완료 페이지 데이터:', appointmentData); // 데이터 확인용

  const handleHome = () => {
    navigate('/');  // 메인 홈으로 이동 경로 수정
  };

  const formatDate = (date) => {
    if (!date) return '날짜 정보 없음';
    try {
      const dateObj = new Date(date);
      return format(dateObj, 'PPP', { locale: ko });
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  return (
    <Box sx={{
      ...commonStyles.pageContainer,
      textAlign: 'center',
      maxWidth: 600,
      mx: 'auto'
    }}>
      <CheckCircleOutlineIcon 
        sx={{ 
          fontSize: 80, 
          color: '#2563EB',
          mb: 3,
          animation: `${commonStyles.fadeIn} 0.5s ease-out`
        }} 
      />

      <Typography variant="h5" sx={{ 
        color: '#1E293B', 
        fontWeight: 600,
        mb: 2
      }}>
        예약이 완료되었습니다
      </Typography>

      <Typography sx={{ 
        color: '#475569',
        mb: 4
      }}>
        예약하신 내용을 확인해 주세요
      </Typography>

      <Paper sx={{
        ...commonStyles.paper,
        mb: 4,
        textAlign: 'left'
      }}>
        <InfoRow
          icon={<CalendarTodayIcon sx={{ color: '#2563EB' }} />}
          label="예약 날짜"
          value={formatDate(appointmentData.date)}
        />

        <InfoRow
          icon={<AccessTimeIcon sx={{ color: '#2563EB' }} />}
          label="예약 시간"
          value={appointmentData.time}
        />

        <Box sx={{ my: 3, borderTop: '1px solid #E2E8F0' }} />

        <InfoRow
          icon={<PersonIcon sx={{ color: '#2563EB' }} />}
          label="이름"
          value={appointmentData.patientInfo.name}
        />

        <InfoRow
          icon={<PhoneIcon sx={{ color: '#2563EB' }} />}
          label="연락처"
          value={appointmentData.patientInfo.phone}
        />
      </Paper>

      <Box sx={{ 
        backgroundColor: '#F1F5F9', 
        p: 3, 
        borderRadius: 2,
        mb: 4,
        textAlign: 'left'
      }}>
        <Typography sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}>
          안내사항
        </Typography>
        <Typography component="div" sx={{ color: '#475569', fontSize: '14px' }}>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <li>예약 내용이 SMS로 발송되었습니다.</li>
            <li>예약 시간 10분 전까지 내원해 주시기 바랍니다.</li>
            <li>예약 변경이나 취소는 진료 하루 전까지 연락 부탁드립니다.</li>
          </Box>
        </Typography>
      </Box>

      <Button
        onClick={handleHome}
        variant="contained"
        sx={{
          ...commonStyles.button.primary,
          minWidth: 200
        }}
      >
        확인
      </Button>
    </Box>
  );
};

export default AppointmentComplete; 