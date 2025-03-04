import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './features/appointment/appointmentSlice';

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // dayjs 객체를 위한 설정
        ignoredActions: ['appointment/setSelectedDate'],
        ignoredPaths: ['appointment.selectedDate']
      }
    })
});

// TypeScript 타입 정의 제거
export const getState = store.getState;
export const dispatch = store.dispatch; 