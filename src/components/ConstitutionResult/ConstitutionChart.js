import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

function ConstitutionChart({ bodyScore, temperamentScore }) {
  const data = [
    { subject: '체형(形)', score: bodyScore },
    { subject: '기질(氣)', score: temperamentScore },
    { subject: '소화력', score: bodyScore * 0.8 + temperamentScore * 0.2 },
    { subject: '면역력', score: bodyScore * 0.3 + temperamentScore * 0.7 },
    { subject: '활동성', score: bodyScore * 0.4 + temperamentScore * 0.6 },
    { subject: '스트레스 저항', score: bodyScore * 0.5 + temperamentScore * 0.5 }
  ];

  return (
    <Box sx={{ width: '100%', height: 400, mt: 4, mb: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        체질 분석 차트
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 50]} />
          <Radar
            name="체질 점수"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ConstitutionChart; 