import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField
} from '@mui/material';
import { commonStyles } from './styles';

const COMMON_SYMPTOMS = [
  '두통',
  '소화불량',
  '허리통증',
  '어깨통증',
  '불면증',
  '피로',
  '스트레스',
  '체중관리'
];

const SymptomSelection = ({ onBack, onNext, selectedSymptoms, onSymptomsChange }) => {
  const [customSymptom, setCustomSymptom] = useState('');

  const handleSymptomToggle = (symptom) => {
    const newSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    onSymptomsChange(newSymptoms);
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      onSymptomsChange([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h6" sx={commonStyles.title}>
        증상 선택
      </Typography>

      <Paper sx={commonStyles.paper}>
        <Typography variant="subtitle1" gutterBottom>
          해당하는 증상을 모두 선택해주세요
        </Typography>

        <FormGroup>
          {COMMON_SYMPTOMS.map((symptom) => (
            <FormControlLabel
              key={symptom}
              control={
                <Checkbox
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                />
              }
              label={symptom}
            />
          ))}
        </FormGroup>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            기타 증상
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="기타 증상을 입력해주세요"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
            />
            <Button
              variant="contained"
              onClick={handleAddCustomSymptom}
              disabled={!customSymptom.trim()}
            >
              추가
            </Button>
          </Box>
        </Box>

        <Box sx={commonStyles.buttonContainer}>
          <Button onClick={onBack} sx={commonStyles.button.secondary}>
            이전
          </Button>
          <Button
            variant="contained"
            onClick={() => onNext(selectedSymptoms)}
            disabled={selectedSymptoms.length === 0}
            sx={commonStyles.button.primary}
          >
            다음
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SymptomSelection; 