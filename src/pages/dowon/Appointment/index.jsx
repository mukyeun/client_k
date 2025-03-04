import React from 'react';
import { AppointmentPage } from '../../../components/dowon/appointment';
import { Box } from '@mui/material';

const Appointment = () => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        py: 4
      }}
    >
      <AppointmentPage />
    </Box>
  );
};

export default Appointment; 