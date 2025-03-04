const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');
const { exec } = require('child_process');

let mainWindow;

// 경로 설정
const UBIO_INSTALL_PATH = 'C:\\Program Files (x86)\\uBioMacpa Pro';
const UBIO_DATA_PATH = 'D:\\uBioMacpaData';
const UBIO_EXE_PATH = path.join(UBIO_INSTALL_PATH, 'bin', 'uBioMacpaPro.exe');
const DOWON_DATA_PATH = path.join(app.getPath('userData'), 'DowonData');

// 도원한의원 데이터 디렉토리 생성 함수
function createDowonDirectory() {
  try {
    const dirs = [
      DOWON_DATA_PATH,
      path.join(DOWON_DATA_PATH, 'appointments'),
      path.join(DOWON_DATA_PATH, 'patients'),
      path.join(DOWON_DATA_PATH, 'backups')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created Dowon directory: ${dir}`);
      }
    });

    return true;
  } catch (error) {
    console.error('Error creating Dowon directories:', error);
    return false;
  }
}

// uBioMacpa 디렉토리 생성 함수
function createDataDirectory() {
  try {
    // 메인 디렉토리 생성
    if (!fs.existsSync(UBIO_DATA_PATH)) {
      fs.mkdirSync(UBIO_DATA_PATH, { recursive: true });
      console.log(`Created main directory: ${UBIO_DATA_PATH}`);
    }
    
    // 필요한 모든 하위 디렉토리 생성
    const subDirs = [
      'Data',
      'Report',
      'Config',
      'Backup',
      path.join('Data', 'PWV'),
      path.join('Data', 'ECG'),
      path.join('Report', 'PWV'),
      path.join('Report', 'ECG')
    ];

    subDirs.forEach(dir => {
      const fullPath = path.join(UBIO_DATA_PATH, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created subdirectory: ${fullPath}`);
      }
    });

    // 설정 파일 생성
    const configPath = path.join(UBIO_DATA_PATH, 'Config', 'config.ini');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, 'DataPath=D:\\uBioMacpaData\\Data\nReportPath=D:\\uBioMacpaData\\Report\n');
      console.log(`Created config file: ${configPath}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating directories:', error);
    return false;
  }
}

function createWindow() {
  console.log('Creating window with preload script at:', path.join(__dirname, 'preload.js'));
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    }
  });

  const startUrl = isDev 
    ? 'http://127.0.0.1:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded successfully');
    mainWindow.webContents.send('electron-check', true);
  });
}

app.whenReady().then(() => {
  console.log('App is ready, creating directories and window...');
  createDowonDirectory();
  createWindow();
});

// 도원한의원 예약 데이터 처리
ipcMain.handle('save-appointment', async (event, appointmentData) => {
  try {
    const appointmentsPath = path.join(DOWON_DATA_PATH, 'appointments');
    const fileName = `appointment_${Date.now()}.json`;
    const filePath = path.join(appointmentsPath, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(appointmentData, null, 2));
    return { success: true, fileName };
  } catch (error) {
    console.error('Save appointment failed:', error);
    throw error;
  }
});

// uBioMacpa 실행 핸들러
ipcMain.handle('launch-ubio-macpa', async () => {
  console.log('Received launch request for uBioMacpa');
  try {
    // 데이터 디렉토리 생성
    if (!createDataDirectory()) {
      throw new Error('Failed to create data directories');
    }

    // 실행 파일 존재 확인
    if (!fs.existsSync(UBIO_EXE_PATH)) {
      throw new Error(`uBioMacpa executable not found at: ${UBIO_EXE_PATH}`);
    }

    console.log('Launching:', UBIO_EXE_PATH);
    
    // 관리자 권한으로 프로그램 실행
    const command = `powershell.exe -Command "Start-Process '${UBIO_EXE_PATH}' -WorkingDirectory '${UBIO_INSTALL_PATH}\\bin' -Verb RunAs"`;
    
    exec(command, {
      windowsHide: false,
      env: {
        ...process.env,
        UBIO_DATA_PATH: UBIO_DATA_PATH
      }
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stdout) console.log(`stdout: ${stdout}`);
      if (stderr) console.error(`stderr: ${stderr}`);
    });

    return { success: true };
  } catch (error) {
    console.error('Launch failed:', error);
    throw error;
  }
});

// 백업 처리
ipcMain.handle('create-backup', async () => {
  try {
    const backupPath = path.join(DOWON_DATA_PATH, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${timestamp}.zip`;
    
    // TODO: 백업 로직 구현
    
    return { success: true, backupFile: backupFileName };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 