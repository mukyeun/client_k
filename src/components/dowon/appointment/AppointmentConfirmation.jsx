import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import InfoIcon from '@mui/icons-material/Info';
import { commonStyles } from './styles';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    {icon}
    <Typography sx={{ ml: 2, color: '#475569', width: '100px' }}>{label}</Typography>
    <Typography sx={{ color: '#1E293B', flex: 1 }}>{value}</Typography>
  </Box>
);

const formatDate = (date) => {
  if (!date) return '날짜 정보 없음';
  
  try {
    let dateObj;
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '날짜 정보 없음';
    }

    if (isNaN(dateObj.getTime())) {
      return '날짜 정보 없음';
    }

    return format(dateObj, 'PPP', { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '날짜 정보 없음';
  }
};

const AppointmentConfirmation = ({ onBack, onConfirm, appointmentData }) => {
  if (!appointmentData) {
    return (
      <Box sx={commonStyles.pageContainer}>
        <Typography>예약 정보를 불러올 수 없습니다.</Typography>
      </Box>
    );
  }

  const { date, time, patientInfo } = appointmentData;

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h6" sx={commonStyles.title}>
        진료 예약 확인
      </Typography>

      <Paper sx={commonStyles.paper}>
        <Typography sx={{ mb: 3, fontWeight: 600, color: '#1E293B', fontSize: '18px' }}>
          예약 정보
        </Typography>

        <InfoRow
          icon={<CalendarTodayIcon sx={{ color: '#2563EB' }} />}
          label="예약 날짜"
          value={formatDate(date)}
        />

        <InfoRow
          icon={<AccessTimeIcon sx={{ color: '#2563EB' }} />}
          label="예약 시간"
          value={time || '시간 정보 없음'}
        />

        {patientInfo && (
          <>
            <Box sx={{ my: 3, borderTop: '1px solid #E2E8F0' }} />

            <Typography sx={{ mb: 3, fontWeight: 600, color: '#1E293B', fontSize: '18px' }}>
              환자 정보
            </Typography>

            <InfoRow
              icon={<PersonIcon sx={{ color: '#2563EB' }} />}
              label="이름"
              value={patientInfo.name || '정보 없음'}
            />

            <InfoRow
              icon={<PhoneIcon sx={{ color: '#2563EB' }} />}
              label="연락처"
              value={patientInfo.phone || '정보 없음'}
            />

            <InfoRow
              icon={<CakeIcon sx={{ color: '#2563EB' }} />}
              label="생년월일"
              value={formatDate(patientInfo.birthDate)}
            />

            <InfoRow
              icon={<InfoIcon sx={{ color: '#2563EB' }} />}
              label="첫 방문 여부"
              value={patientInfo.isFirstVisit ? '예' : '아니오'}
            />

            {patientInfo.existingConditions && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ mb: 1, color: '#475569', fontSize: '14px' }}>
                  기존 질환:
                </Typography>
                <Typography sx={{ color: '#1E293B', fontSize: '14px' }}>
                  {patientInfo.existingConditions}
                </Typography>
              </Box>
            )}

            {patientInfo.currentMedications && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ mb: 1, color: '#475569', fontSize: '14px' }}>
                  복용 중인 약:
                </Typography>
                <Typography sx={{ color: '#1E293B', fontSize: '14px' }}>
                  {patientInfo.currentMedications}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      <Paper sx={{
        ...commonStyles.paper,
        backgroundColor: '#F8FAFC'
      }}>
        <Typography sx={{ mb: 2, fontWeight: 600, color: '#1E293B' }}>
          진료 안내
        </Typography>
        <Box sx={{ color: '#475569' }}>
          <Typography component="li" sx={{ mb: 1 }}>
            예약 시간 10분 전까지 내원해 주시기 바랍니다.
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            진료 순서는 예약 시간 순으로 진행됩니다.
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            첫 방문이신 경우, 보험증을 지참해 주시기 바랍니다.
          </Typography>
          <Typography component="li">
            예약 변경이나 취소는 진료 하루 전까지 연락 부탁드립니다.
          </Typography>
        </Box>
      </Paper>

      <Box sx={commonStyles.navigationButtons}>
        <Button
          onClick={onBack}
          sx={commonStyles.button.secondary}
        >
          이전
        </Button>
        <Button
          onClick={onConfirm}
          sx={commonStyles.button.primary}
        >
          예약 확정
        </Button>
      </Box>
    </Box>
  );
};

export default AppointmentConfirmation; 