const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script starting...');

// Electron API를 window 객체에 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 기존 uBioMacpa 관련 기능
  isElectron: true,
  launchUbioMacpa: () => {
    console.log('Calling launchUbioMacpa via IPC');
    return ipcRenderer.invoke('launch-ubio-macpa');
  },

  // 도원한의원 예약 관련 기능
  appointment: {
    // 예약 저장
    save: async (appointmentData) => {
      console.log('Saving appointment data:', appointmentData);
      return ipcRenderer.invoke('save-appointment', appointmentData);
    },

    // 예약 목록 조회
    getAll: async () => {
      console.log('Fetching all appointments');
      return ipcRenderer.invoke('get-appointments');
    },

    // 특정 날짜의 예약 조회
    getByDate: async (date) => {
      console.log('Fetching appointments for date:', date);
      return ipcRenderer.invoke('get-appointments-by-date', date);
    }
  },

  // 환자 정보 관련 기능
  patient: {
    // 환자 정보 저장
    save: async (patientData) => {
      console.log('Saving patient data:', patientData);
      return ipcRenderer.invoke('save-patient', patientData);
    },

    // 환자 정보 조회
    get: async (patientId) => {
      console.log('Fetching patient data:', patientId);
      return ipcRenderer.invoke('get-patient', patientId);
    },

    // 환자 목록 조회
    getAll: async () => {
      console.log('Fetching all patients');
      return ipcRenderer.invoke('get-patients');
    }
  },

  // 백업 관련 기능
  backup: {
    // 백업 생성
    create: async () => {
      console.log('Creating backup');
      return ipcRenderer.invoke('create-backup');
    },

    // 백업 복원
    restore: async (backupFile) => {
      console.log('Restoring from backup:', backupFile);
      return ipcRenderer.invoke('restore-backup', backupFile);
    }
  },

  // 시스템 알림
  notification: {
    show: (options) => {
      console.log('Showing notification:', options);
      return ipcRenderer.invoke('show-notification', options);
    }
  }
});

// Electron 환경 체크 이벤트 리스너
ipcRenderer.on('electron-check', (event, value) => {
  console.log('Received electron-check event:', value);
});

// 에러 처리를 위한 이벤트 리스너
ipcRenderer.on('error', (event, error) => {
  console.error('Electron error:', error);
});

// 디버깅을 위한 로그
console.log('Preload script loaded');
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in preload');
  console.log('electronAPI available:', !!window.electronAPI);
});

console.log('Preload script finished, exposed electronAPI:', !!contextBridge);