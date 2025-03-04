import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DirectionsSubway as SubwayIcon,
  DirectionsBus as BusIcon
} from '@mui/icons-material';

const InfoSection = ({ icon, title, children }) => (
  <Card sx={{ 
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3
    }
  }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {React.cloneElement(icon, { 
          sx: { 
            fontSize: 32,
            color: '#2563EB',
            mr: 2
          }
        })}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: '#1E293B'
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const Info = () => {
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
          도원한의원 안내
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <InfoSection icon={<TimeIcon />} title="진료시간">
              <Box sx={{ color: '#475569' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>평일</Typography>
                  <Typography>09:00 - 18:00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>토요일</Typography>
                  <Typography>09:00 - 13:00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>일요일/공휴일</Typography>
                  <Typography sx={{ color: '#EF4444' }}>휴진</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  * 점심시간: 13:00 - 14:00
                </Typography>
              </Box>
            </InfoSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoSection icon={<LocationIcon />} title="위치">
              <Box sx={{ color: '#475569' }}>
                <Typography sx={{ mb: 2 }}>
                  서울특별시 강남구 테헤란로 123
                  <br />
                  도원빌딩 3층
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#1E293B', fontWeight: 600 }}>
                  교통편
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SubwayIcon sx={{ mr: 1, color: '#2563EB' }} />
                  <Typography>2호선 강남역 3번 출구에서 도보 5분</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusIcon sx={{ mr: 1, color: '#2563EB' }} />
                  <Typography>간선버스 146, 341, 360 도원빌딩 정류장 하차</Typography>
                </Box>
              </Box>
            </InfoSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoSection icon={<PhoneIcon />} title="연락처">
              <Box sx={{ color: '#475569' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#2563EB', fontWeight: 600 }}>
                  02-123-4567
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  * 예약 및 상담은 진료시간 내에만 가능합니다
                </Typography>
              </Box>
            </InfoSection>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoSection icon={<EmailIcon />} title="온라인 문의">
              <Box sx={{ color: '#475569' }}>
                <Typography sx={{ mb: 2 }}>
                  이메일: info@dowon.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  * 이메일 문의는 24시간 가능하며, 
                  <br />
                  다음 진료일에 순차적으로 답변드립니다
                </Typography>
              </Box>
            </InfoSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Info; 