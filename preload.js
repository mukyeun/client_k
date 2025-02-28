const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script starting...');

// Electron API를 window 객체에 노출
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  launchUbioMacpa: () => {
    console.log('Calling launchUbioMacpa via IPC');
    return ipcRenderer.invoke('launch-ubio-macpa');
  }
});

// Electron 환경 체크 이벤트 리스너
ipcRenderer.on('electron-check', (event, value) => {
  console.log('Received electron-check event:', value);
});

// 디버깅을 위한 로그
console.log('Preload script loaded');
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded in preload');
  console.log('electronAPI available:', !!window.electronAPI);
});

console.log('Preload script finished, exposed electronAPI:', !!contextBridge);