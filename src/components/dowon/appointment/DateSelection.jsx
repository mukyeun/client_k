import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';  // 한국어 로케일
import { commonStyles } from './styles';

const DateSelection = ({ onNext, selectedDate, onDateSelect }) => {
  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h6" sx={commonStyles.title}>
        진료 날짜 선택
      </Typography>

      <Paper sx={commonStyles.paper}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#1E293B', fontWeight: 600 }}>
            원하시는 진료 날짜를 선택해주세요
          </Typography>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            value={selectedDate}
            onChange={onDateSelect}
            minDate={dayjs()}
            maxDate={dayjs().add(14, 'day')}
            disablePast
            sx={{
              width: '100%',
              ...commonStyles.datePicker,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563EB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2563EB',
                  borderWidth: 2,
                },
              },
              '& .MuiPickersDay-root': {
                '&.Mui-selected': {
                  backgroundColor: '#2563EB',
                  '&:hover': {
                    backgroundColor: '#1D4ED8',
                  },
                },
                '&:hover': {
                  backgroundColor: '#EFF6FF',
                },
              },
            }}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#64748B',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <span>* 오늘부터 2주 이내의 날짜만 선택 가능합니다</span>
            <span>* 빨간색으로 표시된 날짜는 예약이 불가능합니다</span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DateSelection; 