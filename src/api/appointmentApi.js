import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/appointments';

export const appointmentApi = {
  // 예약 가능 시간 조회
  getAvailableTimes: async (date) => {
    try {
      const response = await axios.get(`${BASE_URL}/available-times/${date}`);
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('예약 가능 시간 조회 실패');
    }
  },

  // 예약 생성
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(BASE_URL, appointmentData);
      return response.data.data;
    } catch (error) {
      throw new Error('예약 생성 실패');
    }
  },

  // 예약 목록 조회
  getAppointments: async (date) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: { date }
      });
      return response.data.data;
    } catch (error) {
      throw new Error('예약 목록 조회 실패');
    }
  },

  // 예약 상태 업데이트
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      throw new Error('예약 상태 업데이트 실패');
    }
  }
}; 