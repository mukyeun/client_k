// src/components/common/ErrorMessage.jsx
import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorMessage = ({ message }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        {message || '오류가 발생했습니다. 다시 시도해주세요.'}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;