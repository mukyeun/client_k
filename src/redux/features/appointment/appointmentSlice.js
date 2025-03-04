import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDate: null,
  selectedTime: null,
  patientInfo: {
    name: '',
    phone: '',
    gender: '',
    age: '',
    isFirstVisit: true,
    existingConditions: '',
    currentMedications: '',
    notes: ''
  },
  selectedSymptoms: [],
  availableTimes: [],
  loading: false,
  error: null
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setPatientInfo: (state, action) => {
      state.patientInfo = {
        ...state.patientInfo,
        ...action.payload
      };
    },
    updatePatientInfo: (state, action) => {
      const { name, value } = action.payload;
      state.patientInfo[name] = value;
    },
    setSelectedSymptoms: (state, action) => {
      state.selectedSymptoms = action.payload;
    },
    toggleSymptom: (state, action) => {
      const symptomId = action.payload;
      const index = state.selectedSymptoms.indexOf(symptomId);
      if (index === -1) {
        state.selectedSymptoms.push(symptomId);
      } else {
        state.selectedSymptoms.splice(index, 1);
      }
    },
    setAvailableTimes: (state, action) => {
      state.availableTimes = action.payload;
    },
    resetAppointment: (state) => {
      return initialState;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setSelectedDate,
  setSelectedTime,
  setPatientInfo,
  updatePatientInfo,
  setSelectedSymptoms,
  toggleSymptom,
  setAvailableTimes,
  resetAppointment,
  setLoading,
  setError
} = appointmentSlice.actions;

export default appointmentSlice.reducer; 