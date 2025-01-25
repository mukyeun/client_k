import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import { basicInfo } from '../../data/surveyQuestions';

function BasicInfoForm({ values, onChange }) {
  const calculateBMI = () => {
    if (values.height && values.weight) {
      const heightInMeters = values.height / 100;
      const bmi = (values.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return '';
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return '매우 여윔';
    if (bmi < 23) return '정상';
    if (bmi < 25) return '과체중';
    if (bmi < 30) return '비만';
    return '고도비만';
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        기초 정보
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>성별</FormLabel>
        <RadioGroup
          row
          name="gender"
          value={values.gender || ''}
          onChange={(e) => onChange('gender', e.target.value)}
        >
          <FormControlLabel value="male" control={<Radio />} label="남성" />
          <FormControlLabel value="female" control={<Radio />} label="여성" />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <TextField
          label="나이"
          type="number"
          name="age"
          value={values.age || ''}
          onChange={(e) => onChange('age', e.target.value)}
          inputProps={{ min: 0, max: 150 }}
          fullWidth
        />
        
        <TextField
          label="키 (cm)"
          type="number"
          name="height"
          value={values.height || ''}
          onChange={(e) => onChange('height', e.target.value)}
          inputProps={{ min: 0, max: 300 }}
          fullWidth
        />
        
        <TextField
          label="체중 (kg)"
          type="number"
          name="weight"
          value={values.weight || ''}
          onChange={(e) => onChange('weight', e.target.value)}
          inputProps={{ min: 0, max: 300 }}
          fullWidth
        />
        
        <TextField
          label="BMI"
          value={`${calculateBMI()} (${getBMIStatus(calculateBMI())})`}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Box>
    </Box>
  );
}

export default BasicInfoForm; 