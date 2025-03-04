import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import dayjs from 'dayjs';

const AppointmentConfirm = ({ date, time, patientInfo, symptoms }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      <Typography 
        variant="h6" 
        component="h2"
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          textAlign: 'center',
          mb: 3
        }}
      >
        예약 정보 확인
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              예약 일시
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {dayjs(date).format('YYYY년 MM월 DD일')} {time}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              환자 정보
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body1">
                이름: {patientInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                전화번호: {patientInfo.phone}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                성별: {patientInfo.gender === 'male' ? '남성' : '여성'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                나이: {patientInfo.age}세
              </Typography>
              {patientInfo.notes && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  특이사항: {patientInfo.notes}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              선택한 증상
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mt: 1 
              }}
            >
              {symptoms.map((symptom) => (
                <Typography
                  key={symptom}
                  variant="body1"
                  sx={{
                    bgcolor: 'primary.lighter',
                    color: 'primary.dark',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.9rem'
                  }}
                >
                  {symptom}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          mt: 2,
          textAlign: 'center',
          fontSize: '0.875rem'
        }}
      >
        * 예약 정보를 확인하신 후 예약 완료를 눌러주세요
      </Typography>
    </Box>
  );
};

export default AppointmentConfirm; 