import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { commonStyles } from './styles';

const AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

const TimeSelection = ({ onBack, onNext, selectedTime, onTimeSelect }) => {
  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h6" sx={commonStyles.title}>
        진료 시간 선택
      </Typography>

      <Paper sx={commonStyles.paper}>
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
          원하시는 진료 시간을 선택해주세요
        </Typography>

        <Grid container spacing={2}>
          {AVAILABLE_TIMES.map((time) => (
            <Grid item xs={6} sm={4} key={time}>
              <Button
                fullWidth
                variant={selectedTime === time ? "contained" : "outlined"}
                onClick={() => onTimeSelect(time)}
                sx={{
                  height: '48px',
                  ...commonStyles.button.timeSelect,
                  ...(selectedTime === time && commonStyles.button.timeSelectActive)
                }}
              >
                {time}
              </Button>
            </Grid>
          ))}
        </Grid>

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
            <span>* 점심시간: 12:00 ~ 14:00</span>
            <span>* 마지막 접수: 17:00</span>
          </Typography>
        </Box>
      </Paper>

      <Box sx={commonStyles.buttonContainer}>
        <Button
          onClick={onBack}
          sx={commonStyles.button.secondary}
        >
          이전
        </Button>
        <Button
          variant="contained"
          onClick={() => onNext(selectedTime)}
          disabled={!selectedTime}
          sx={commonStyles.button.primary}
        >
          다음
        </Button>
      </Box>
    </Box>
  );
};

export default TimeSelection; 