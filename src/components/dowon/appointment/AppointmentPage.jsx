import React, { useState } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import {
  DateSelection,
  TimeSelection,
  PatientInfo,
  SymptomSelection,
  AppointmentConfirmation
} from './index';
import './AppointmentPage.css';

const STEPS = {
  DATE: 'date',
  TIME: 'time',
  PATIENT: 'patient',
  SYMPTOMS: 'symptoms',
  CONFIRM: 'confirm',
  COMPLETE: 'complete'
};

const INITIAL_PATIENT_INFO = {
  name: '',
  phone: '',
  birthDate: '',
  isFirstVisit: '',
  existingConditions: '',
  currentMedications: '',
  notes: ''
};

const AppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.DATE);
  const [appointmentData, setAppointmentData] = useState({
    date: null,
    time: '',
    patientInfo: INITIAL_PATIENT_INFO,
    symptoms: []
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleNext = (data) => {
    setAppointmentData(prev => ({ ...prev, ...data }));
    switch (currentStep) {
      case STEPS.DATE:
        setCurrentStep(STEPS.TIME);
        break;
      case STEPS.TIME:
        setCurrentStep(STEPS.PATIENT);
        break;
      case STEPS.PATIENT:
        setCurrentStep(STEPS.SYMPTOMS);
        break;
      case STEPS.SYMPTOMS:
        setCurrentStep(STEPS.CONFIRM);
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case STEPS.TIME:
        setCurrentStep(STEPS.DATE);
        break;
      case STEPS.PATIENT:
        setCurrentStep(STEPS.TIME);
        break;
      case STEPS.SYMPTOMS:
        setCurrentStep(STEPS.PATIENT);
        break;
      case STEPS.CONFIRM:
        setCurrentStep(STEPS.SYMPTOMS);
        break;
      default:
        break;
    }
  };

  const handleConfirmAppointment = async () => {
    try {
      const formattedData = {
        ...appointmentData,
        date: dayjs(appointmentData.date).format('YYYY-MM-DD'),
        createdAt: new Date().toISOString(),
        status: 'pending',
        id: Date.now()
      };

      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      existingAppointments.push(formattedData);
      localStorage.setItem('appointments', JSON.stringify(existingAppointments));

      setNotification({
        open: true,
        message: '예약이 완료되었습니다.',
        severity: 'success'
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      console.error('예약 처리 중 오류:', error);
      setNotification({
        open: true,
        message: '예약 처리 중 오류가 발생했습니다.',
        severity: 'error'
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.DATE:
        return (
          <DateSelection
            selectedDate={appointmentData.date}
            onDateSelect={(date) => handleNext({ date })}
          />
        );
      case STEPS.TIME:
        return (
          <TimeSelection
            selectedTime={appointmentData.time}
            onTimeSelect={(time) => handleNext({ time })}
            onBack={handleBack}
          />
        );
      case STEPS.PATIENT:
        return (
          <PatientInfo
            patientData={appointmentData.patientInfo}
            onPatientDataChange={(e) => {
              const { name, value } = e.target;
              setAppointmentData(prev => ({
                ...prev,
                patientInfo: {
                  ...prev.patientInfo,
                  [name]: value
                }
              }));
            }}
            onNext={() => setCurrentStep(STEPS.SYMPTOMS)}
            onBack={handleBack}
          />
        );
      case STEPS.SYMPTOMS:
        return (
          <SymptomSelection
            selectedSymptoms={appointmentData.symptoms}
            onSymptomsChange={(symptoms) => handleNext({ symptoms })}
            onBack={handleBack}
          />
        );
      case STEPS.CONFIRM:
        return (
          <AppointmentConfirmation
            appointmentData={appointmentData}
            onBack={handleBack}
            onConfirm={handleConfirmAppointment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {renderStep()}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={notification.severity}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentPage; 