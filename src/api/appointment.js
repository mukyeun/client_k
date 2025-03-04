import axios from 'axios';
import api from './axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const appointmentApi = {
  // 예약 생성
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/appointments`, {
        date: appointmentData.date,
        time: appointmentData.time,
        patientInfo: {
          name: appointmentData.patientInfo.name,
          phone: appointmentData.patientInfo.phone,
          birthDate: appointmentData.patientInfo.birthDate,
          isFirstVisit: appointmentData.patientInfo.isFirstVisit,
          existingConditions: appointmentData.patientInfo.existingConditions,
          currentMedications: appointmentData.patientInfo.currentMedications
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error(error.response?.data?.message || '예약 생성 중 오류가 발생했습니다.');
    }
  },

  // 예약 가능한 시간 조회
  getAvailableTimeSlots: async (date) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/available-times`, {
        params: { date: date.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw new Error(error.response?.data?.message || '시간 조회 중 오류가 발생했습니다.');
    }
  },

  // 예약 확인
  verifyAppointment: async (appointmentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying appointment:', error);
      throw new Error(error.response?.data?.message || '예약 확인 중 오류가 발생했습니다.');
    }
  },

  // 예약 취소
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw new Error(error.response?.data?.message || '예약 취소 중 오류가 발생했습니다.');
    }
  }
};

// 예약 관련 API 함수 추가
export const appointmentAPI = {
  // 예약 가능한 시간대 조회
  getAvailableTimeSlots: async (date) => {
    return await axios.get(`${BASE_URL}/appointments/available-times?date=${date}`);
  },

  // 예약 생성
  createAppointment: async (appointmentData) => {
    return await axios.post(`${BASE_URL}/appointments`, appointmentData);
  }
}; 