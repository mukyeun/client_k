import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // CORS 관련 설정 추가
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    // 요청 보내기 전 수행할 작업
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 처리
    return response;
  },
  (error) => {
    // 응답 에러 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('Request Error:', error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 