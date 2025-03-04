import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Healing as HealingIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const treatments = [
  {
    title: '침 치료',
    description: '전통적인 침술을 통한 통증 완화 및 질병 치료',
    details: '정확한 경혈 자극을 통해 기혈순환을 촉진하고 자연치유력을 높입니다.',
    image: '/images/acupuncture.jpg'
  },
  {
    title: '한약 치료',
    description: '개인 맞춤형 한약 처방을 통한 건강 관리',
    details: '체질과 증상에 맞는 맞춤형 한약을 처방하여 근본적인 치료를 도모합니다.',
    image: '/images/herbal.jpg'
  },
  {
    title: '부항 치료',
    description: '혈액순환 개선과 통증 완화를 위한 부항 요법',
    details: '음압을 이용하여 근육의 긴장을 풀고 혈액순환을 촉진합니다.',
    image: '/images/cupping.jpg'
  },
  {
    title: '추나 요법',
    description: '근골격계 질환 치료를 위한 수기 치료',
    details: '전문적인 수기요법으로 척추와 관절의 균형을 바로잡습니다.',
    image: '/images/chuna.jpg'
  }
];

const conditions = [
  { category: '근골격계', items: ['목 통증', '허리 통증', '관절통', '척추 질환'] },
  { category: '내과', items: ['소화불량', '위장질환', '변비', '설사'] },
  { category: '신경계', items: ['두통', '어지럼증', '불면증', '안면마비'] },
  { category: '기타', items: ['피로', '스트레스', '비만', '면역력 저하'] }
];

const steps = [
  {
    label: '예약',
    description: '온라인 또는 전화로 편리하게 예약하실 수 있습니다.',
  },
  {
    label: '초진 문진',
    description: '상세한 문진을 통해 정확한 진단을 준비합니다.',
  },
  {
    label: '진찰',
    description: '한의사의 전문적인 상담과 진찰이 진행됩니다.',
  },
  {
    label: '치료 계획',
    description: '증상과 체질에 맞는 맞춤형 치료 계획을 수립합니다.',
  },
  {
    label: '치료',
    description: '전문적인 한방 치료가 진행됩니다.',
  },
];

const Medical = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 700,
            color: '#1E293B',
            mb: 6
          }}
        >
          진료 안내
        </Typography>

        {/* 주요 치료법 */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 4
          }}>
            <HealingIcon sx={{ fontSize: 32, color: '#2563EB', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B' }}>
              주요 치료법
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {treatments.map((treatment, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={treatment.image}
                    alt={treatment.title}
                    sx={{ backgroundColor: '#EFF6FF' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {treatment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {treatment.description}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {treatment.details}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 주요 치료 질환 */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 4
          }}>
            <TimelineIcon sx={{ fontSize: 32, color: '#2563EB', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B' }}>
              주요 치료 질환
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {conditions.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        color: '#2563EB'
                      }}
                    >
                      {category.category}
                    </Typography>
                    {category.items.map((item, idx) => (
                      <Typography 
                        key={idx} 
                        sx={{ 
                          mb: 1,
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          '&:before': {
                            content: '""',
                            width: '4px',
                            height: '4px',
                            backgroundColor: '#2563EB',
                            borderRadius: '50%',
                            marginRight: '8px'
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 진료 절차 */}
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 4
          }}>
            <TimelineIcon sx={{ fontSize: 32, color: '#2563EB', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B' }}>
              진료 절차
            </Typography>
          </Box>
          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="h6" sx={{ color: '#1E293B' }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography sx={{ color: '#475569' }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Container>
    </Box>
  );
};

export default Medical; 