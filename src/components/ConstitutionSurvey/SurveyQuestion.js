import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';

function SurveyQuestion({ question, value, onChange }) {
  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="body1" gutterBottom>
        {question.question}
      </Typography>
      
      <RadioGroup
        row
        value={value || ''}
        onChange={(e) => onChange(question.id, parseInt(e.target.value, 10))}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2
        }}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            sx={{
              flex: 1,
              margin: 0,
              justifyContent: 'center'
            }}
          />
        ))}
      </RadioGroup>
    </Paper>
  );
}

export default SurveyQuestion; 