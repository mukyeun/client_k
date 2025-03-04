import React, { createContext, useContext, useState } from 'react';

const AppointmentContext = createContext();

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointmentData, setAppointmentData] = useState({
    date: null,
    time: null,
    patientInfo: null,
    symptoms: []
  });

  const updateAppointment = (data) => {
    setAppointmentData(prev => ({
      ...prev,
      ...data
    }));
  };

  const resetAppointment = () => {
    setAppointmentData({
      date: null,
      time: null,
      patientInfo: null,
      symptoms: []
    });
  };

  const value = {
    appointmentData,
    updateAppointment,
    resetAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}; 