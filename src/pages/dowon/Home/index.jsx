import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Grid,
  Card,
  CardContent 
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import './Home.css';

const DowonHome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CalendarIcon sx={{ fontSize: 48, color: '#2563EB' }} />,
      title: '간편한 예약',
      description: '원하는 날짜를 선택하여 쉽게 예약하세요'
    },
    {
      icon: <TimeIcon sx={{ fontSize: 48, color: '#2563EB' }} />,
      title: '실시간 시간 확인',
      description: '실시간으로 예약 가능한 시간을 확인하세요'
    },
    {
      icon: <PersonIcon sx={{ fontSize: 48, color: '#2563EB' }} />,
      title: '맞춤 진료',
      description: '환자 맞춤형 진료 서비스를 제공합니다'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: '#1E293B',
              mb: 2
            }}
          >
            도원한의원 예약 시스템
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            편리하고 신속한 온라인 예약 서비스를 이용해보세요
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4
                }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: '#1E293B'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dowon/appointment')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: '#2563EB',
              '&:hover': {
                backgroundColor: '#1D4ED8',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s'
            }}
          >
            지금 예약하기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DowonHome; 