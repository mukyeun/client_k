import React, { useState, useRef, useEffect } from 'react';
import { saveUserInfo } from '../../api/userInfo';  // 경로 수정
import { LOCAL_STORAGE_KEY, USER_DATA_KEY } from '../../constants';
import ExcelJS from 'exceljs';
import { 증상카테고리 } from '../../data/symptoms';
import { 약물카테고리 } from '../../data/medications';
import { 기호식품카테고리 } from '../../data/preferences';
import '../../styles/UserInfoForm.css';
import { read, utils } from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { 스트레스카테고리, evaluateStressLevel } from '../../data/stressEvents.js';
import { FaUser } from 'react-icons/fa';
import './PCDataInput.css';  // PCDataTable.css를 PCDataInput.css로 수정
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Box, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';

// Excel 날짜를 JavaScript Date로 변환하는 함수
const excelDateToJSDate = (excelDate) => {
  try {
    if (!excelDate) return null;
    const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
    const msPerDay = 24 * 60 * 60 * 1000;
    const date = new Date(EXCEL_EPOCH.getTime() + (excelDate - 1) * msPerDay);
    
    // 유효성 검사
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 Excel 날짜:', excelDate);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Excel 날짜 변환 오류:', { excelDate, error });
    return null;
  }
};

// 날짜 문이터 처리 함수
const processDateValue = (rawDate) => {
  try {
    if (!rawDate) return null;
    // 숫자형 Excel 날짜
    if (typeof rawDate === 'number') {
      const date = excelDateToJSDate(rawDate);
      console.log('Excel 날짜 변환:', {
        원본: rawDate,
        변환결과: date?.toLocaleString()
      });
      return date;
    }
    // 문자열 날짜
    const dateStr = rawDate.toString().trim();
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 날짜 문자열:', dateStr);
      return null;
    }
    console.log('문자열 날짜 변환:', {
      원본: dateStr,
      변환결과: date.toLocaleString()
    });
    return date;
  } catch (error) {
    console.error('날짜 처리 오류:', { rawDate, error });
    return null;
  }
};

// 초기 상태를 컴포넌트 외부에 정의
const initialFormState = {
  name: '',
  residentNumber: '',
  phone: '',
  gender: '',
  height: '',
  weight: '',
  bmi: '',
  personality: '',
  stress: '',
  workIntensity: '',
  pulse: '',
  systolicBP: '',
  diastolicBP: '',
  ab_ms: '',
  ac_ms: '',
  ad_ms: '',
  ae_ms: '',
  ba_ratio: '',
  ca_ratio: '',
  da_ratio: '',
  ea_ratio: '',
  selectedCategory: '',
  selectedSubCategory: '',
  selectedSymptom: '',
  selectedSymptoms: [],
  medication: '',
  preference: '',
  memo: '',
  pvc: '',
  bv: '',
  sv: '',
  heartRate: '',
  selectedStressEvents: [],
  stressScore: 0,
  stressLevel: '',
  stressDescription: ''
};

// 데이터 로딩 체크 함수
const checkDataLoaded = () => {
  const isLoaded = !!증상카테고리 && !!약물카테고리 && !!기호식품카테고리;
  if (!isLoaded) {
    console.error('필요한 데이터가 로드되지 않았습니다:', {
      증상카테고리: !!증상카테고리,
      약물카테고리: !!약물카테고리,
      기호식품카테고리: !!기호식품카테고리
    });
  }
  return isLoaded;
};

// 로컬 스토리지 저장 함수
const saveToLocalStorage = (data) => {
  try {
    const existingData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '[]');
    const newData = {
      ...data,
      timestamp: new Date().toISOString() // 저장 시점 기록
    };
    
    // 기존 데이터에 추가
    existingData.push(newData);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(existingData));
    
    console.log('데이터 저장 완료:', newData);
    return true;
  } catch (error) {
    console.error('로컬 저장소 저장 실패:', error);
    return false;
  }
};

// 로컬 스토리지에서 데이터 불러오기 함수
const loadFromLocalStorage = (userName) => {
  try {
    const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '[]');
    
    // 해당 사용자의 데이터만 필터링
    const userData = allData
      .filter(data => data.name === userName)
      // 날짜순 정렬 (최신순)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return userData[0] || null; // 가장 최신 데이터 반환
  } catch (error) {
    console.error('로컬 저장소 불러오기 실패:', error);
    return null;
  }
};

// UserInfoForm 컴포넌트 정의
const UserInfoForm = ({ onSubmit, initialValues = {}, mode = 'create' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ...initialFormState,
    ...initialValues
  });
  const fileInputRef = useRef(null);
  const [dataAvailable, setDataAvailable] = useState(checkDataLoaded());
  const [selectedStressCategory, setSelectedStressCategory] = useState('');
  const [selectedStressItems, setSelectedStressItems] = useState([]);
  const [stressLevel, setStressLevel] = useState('');
  const [data, setData] = useState([]);  // 데이터 배열
  const [selectedItems, setSelectedItems] = useState([]);  // 선택된 항목들
  const [tableData, setTableData] = useState([]);  // 테이블 데이터
  const [selectedIds, setSelectedIds] = useState([]);  // 선택된 행의 ID들
  const [stressEvents, setStressEvents] = useState([]);  // 스트레스 평가 항목들
  const [stressScore, setStressScore] = useState(0);    // 스트레스 총점
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // initialValues가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialValues,
        selectedSymptoms: initialValues.selectedSymptoms || [],
        // 다른 필드들은 그대로 유지
      }));
    }
  }, [initialValues]);

  // useEffect를 조건부 렌더링 이전으로 이동
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(USER_DATA_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('로드된 데이터:', parsedData);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    loadSavedData();
  }, []);

  // useEffect에서 초기화 확인 메시지 제거
  useEffect(() => {
    // 컴포넌트 마운트 시 필요한 초기화 작업만 수행
    const loadInitialData = () => {
      try {
        // 필요한 초기화 작업이 있다면 여기서 수행
        console.log('폼 초기화 완료');
      } catch (error) {
        console.error('초기화 중 오류:', error);
      }
    };
    loadInitialData();
  }, []);

  // 스트레스 항목이 변경될 때마다 스트레스 레벨을 업데이트하는 useEffect 추가
  useEffect(() => {
    console.log('선택된 스트레스 항목들:', selectedStressItems);
    
    if (selectedStressItems.length > 0) {
      // 총점 계산
      const totalScore = selectedStressItems.reduce((sum, item) => sum + item.score, 0);
      console.log('계산된 총점:', totalScore);
      
      // 스트레스 수준 평가
      const evaluation = evaluateStressLevel(totalScore);
      console.log('평가된 스트레스 수준:', evaluation.level);

      // formData 상태 업데이트 전 로그
      console.log('이전 formData:', formData);

      setFormData(prev => {
        const updated = {
          ...prev,
          stress: evaluation.level,
          stressScore: totalScore,
          stressLevel: evaluation.level,
          stressDescription: evaluation.description
        };
        console.log('업데이트될 formData:', updated);
        return updated;
      });
    } else {
      setFormData(prev => {
        const updated = {
          ...prev,
          stress: '',
          stressScore: 0,
          stressLevel: '',
          stressDescription: ''
        };
        console.log('초기화된 formData:', updated);
        return updated;
      });
    }
  }, [selectedStressItems]);

  // 데이터가 로드되지 않았을 때의 렌더링
  if (!dataAvailable) {
    return <div>데이터 로딩 중...</div>;
  }

  // BMI 자동 계산 함수
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return '';
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // 전화번호 포맷팅 함수 추가
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // handleInputChange 함수 수정
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 전화번호 입력 처리
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      if (formattedPhone.replace(/-/g, '').length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: formattedPhone
        }));
      }
      return;
    }
    // 신장이나 체중이 변경될 때 BMI 재계산
    if (name === 'height' || name === 'weight') {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;
      calculateBMI(height, weight);
    }
    // 기본 입력 처리
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: e.target.value,
      selectedSubCategory: '',
      selectedSymptom: ''
    }));
  };

  const handleSubCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      selectedSubCategory: e.target.value,
      selectedSymptom: ''
    }));
  };

  const handleSymptomChange = (e) => {
    const symptom = e.target.value;
    if (symptom && !formData.selectedSymptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        selectedSymptoms: [...prev.selectedSymptoms, symptom],
        selectedSymptom: ''
      }));
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };

  // 주민등록번호로 성별 판단하는 함수
  const determineGender = (residentNumber) => {
    // 하이픈 제거 후 7번째 숫자 추출
    const genderDigit = residentNumber.replace('-', '').charAt(6);
    
    // 1,3,5: 남성 / 2,4,6: 여성
    if (['1', '3', '5'].includes(genderDigit)) {
      return '남성';
    } else if (['2', '4', '6'].includes(genderDigit)) {
      return '여성';
    }
    return ''; // 성별 판단 불가 시 빈 값 반환
  };

  // 주민등록번호 입력 핸들러
  const handleResidentNumberChange = (e) => {
    let value = e.target.value;
    
    // 숫자만 추출
    value = value.replace(/[^0-9]/g, '');
    
    // 13자리로 제한
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    
    // 하이픈 추가 (6자리 입력 후)
    if (value.length > 6) {
      value = value.slice(0, 6) + '-' + value.slice(6);
    }

    // formData 업데이트 (주민번호와 성별 동시 업데이트)
    setFormData(prev => {
      const updatedData = {
        ...prev,
        residentNumber: value
      };

      // 7번째 숫자가 입력되면 성별 자동 설정
      if (value.length >= 7) {
        updatedData.gender = determineGender(value);
        console.log('성별 자동 설정:', updatedData.gender);
      }

      return updatedData;
    });
  };

  // handleSubmit 함수 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // 맥파 데이터 계산 업데이트
      const dataToSave = {
        ...formData,
        createdAt: new Date().toISOString(),
        _id: formData._id || Date.now().toString()
      };

      // 직접 saveUserInfo 호출
      const savedData = await saveUserInfo(dataToSave);
      console.log('저장된 데이터:', savedData);
      
      // 폼 초기화
      setFormData(initialFormState);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert('데이터가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  // Excel 날짜 변환 함수
  const parseExcelDate = (dateValue) => {
    try {
      if (typeof dateValue === 'number') {
        const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
        const msPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(EXCEL_EPOCH.getTime() + (dateValue - 1) * msPerDay);
        
        console.log('Excel 날짜 변환:', {
          입력값: dateValue,
          변환결과: date.toLocaleString()
        });
        
        return date;
      }
      
      const dateStr = String(dateValue).trim();
      const date = new Date(dateStr);
      
      console.log('문자열 날짜 변환:', {
        입력값: dateStr,
        변환결과: date.toLocaleString()
      });
      
      return date;
    } catch (error) {
      console.error('날짜 변환 실패:', { dateValue, error });
      return null;
    }
  };

  // 파일 입력 초기화
  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 데이터 초기화
  const clearFormData = () => {
    setFormData(prev => ({
      ...prev,
      ab_ms: '',
      ac_ms: '',
      ad_ms: '',
      ae_ms: '',
      ba_ratio: '',
      ca_ratio: '',
      da_ratio: '',
      ea_ratio: ''
    }));
  };

  const getLatestData = (rows, userName) => {
    try {
      console.log('전체 데이터:', rows); // 디버깅
      if (!Array.isArray(rows) || rows.length < 2) {
        throw new Error('데이터가 없거나 형식이 잘못되었습니다.');
      }
      // 헤더를 제외한 실제 데이터 행들
      const dataRows = rows.slice(1);
      
      // 해당 사용자의 데이터만 필터링
      const userRows = dataRows.filter(row => {
        const rowName = row[0]?.toString().trim();
        const matches = rowName === userName;
        console.log('행 검사:', { 행이름: rowName, 검색이름: userName, 일치: matches });
        return matches;
      });
      console.log('사용자 데이터:', userRows); // 디버깅
      if (userRows.length === 0) {
        throw new Error(`${userName}님의 데이터를 찾을 수 없습니다.`);
      }
      // 가장 최근 데이터 반환
      return userRows[0];
    } catch (error) {
      console.error('데이터 처리 오류:', error);
      throw error;
    }
  };

  // JSON 데이터 다운로드 함수
  const downloadJSON = (data, filename = 'excel-data.json') => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('JSON 데이터 다운로드 완료');
    } catch (error) {
      console.error('JSON 다운로드 실패:', error);
    }
  };

  // 데이터 검증 함수
  const validateExcelData = (rows) => {
    if (!Array.isArray(rows) || rows.length < 2) {
      console.error('유효하지 않은 데이터 구조:', rows);
      return false;
    }
    // 헤더 검증
    const headers = rows[0];
    if (!Array.isArray(headers) || headers.length < 17) {
      console.error('유효하지 않은 헤더:', headers);
      return false;
    }
    // 데이터 행 검증
    const dataRows = rows.slice(1);
    const validRows = dataRows.filter(row => {
      if (!Array.isArray(row)) return false;
      
      const hasName = row[0]?.toString().trim();
      const hasDate = row[5] != null;
      const hasValues = row.slice(9, 17).some(val => 
        val != null && val.toString().trim() !== ''
      );
      return hasName && hasDate && hasValues;
    });
    console.log('데이터 검증 결과:', {
      전체행수: rows.length,
      유효행수: validRows.length,
      헤더: headers
    });
    return validRows.length > 0;
  };

  // 데이터 필드 검증
  const validateField = (value) => {
    if (value == null || value === undefined) return '';
    return value.toString().trim();
  };

  // 데이터 매핑 함수
  const mapExcelData = (data) => {
    try {
      // 데이터 검증
      if (!Array.isArray(data) || data.length < 17) {
        throw new Error('유효하지 않은 데이터 형식입니다.');
      }
      const mappedData = {
        ab_ms: data[9]?.toString() || '',
        ac_ms: data[10]?.toString() || '',
        ad_ms: data[11]?.toString() || '',
        ae_ms: data[12]?.toString() || '',
        ba_ratio: data[13]?.toString() || '',
        ca_ratio: data[14]?.toString() || '',
        da_ratio: data[15]?.toString() || '',
        ea_ratio: data[16]?.toString() || ''
      };
      // 데이터 유효성 검사
      const hasValidData = Object.values(mappedData).some(value => 
        value !== '' && !isNaN(parseFloat(value))
      );
      if (!hasValidData) {
        throw new Error('유효한 맥파 데이터가 없습니다.');
      }
      return mappedData;
    } catch (error) {
      console.error('데이터 매핑 오류:', error);
      throw error;
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    if (!formData.name?.trim()) {
      alert('먼저 이름을 입력해주세요.');
      return;
    }
    fileInputRef.current?.click();
  };

  // 맥파 데이터만 리셋하는 함수
  const resetPulseData = () => {
    setFormData(prev => ({
      ...prev,
      ab_ms: '',
      ac_ms: '',
      ad_ms: '',
      ae_ms: '',
      ba_ratio: '',
      ca_ratio: '',
      da_ratio: '',
      ea_ratio: ''
    }));
  };

  // 맥파 데이터 검증 함수 수정
  const validatePulseData = (data) => {
    try {
      const requiredFields = ['ab_ms', 'ac_ms', 'ad_ms', 'ae_ms', 'ba_ratio', 'ca_ratio', 'da_ratio', 'ea_ratio'];
      
      // 모든 필수 필드가 존재하고 유효한 값인지 확인
      const isValid = requiredFields.every(field => {
        const value = data[field];
        const parsedValue = parseFloat(value);
        return value && !isNaN(parsedValue) && parsedValue !== 0;
      });

      console.log('맥파 데이터 검증 결과:', isValid);
      return isValid;
    } catch (error) {
      console.error('맥파 데이터 검증 오류:', error);
      return false;
    }
  };

  // 유비오 맥파 데이터 컬럼 매핑
  const UBIO_COLUMNS = {
    NAME: 'A',           // 이름 컬럼
    DATE: 'F',          // 측정일시 컬럼
    WAVE_DATA: {
      'J': 'ab_ms',     // a-b
      'K': 'ac_ms',     // a-c
      'L': 'ad_ms',     // a-d
      'M': 'ae_ms',     // a-e
      'N': 'ba_ratio',  // b/a
      'O': 'ca_ratio',  // c/a
      'P': 'da_ratio',  // d/a
      'Q': 'ea_ratio'   // e/a
    }
  };

  // 파일 선택 핸들러 수정
  const handleFileSelect = async (event) => {
    try {
      if (!formData.name) {
        throw new Error('먼저 이름을 입력해주세요.');
      }

      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = utils.sheet_to_json(firstSheet, { header: 1 });

          // 데이터 검증
          if (!validateExcelData(rows)) {
            throw new Error('유효하지 않은 데이터 형식입니다.');
          }

          // 사용자 이름으로 데이터 필터링
          const userName = formData.name.trim();
          const userRows = rows.slice(1).filter(row => {
            const rowName = String(row[0] || '').trim();
            return rowName === userName;
          });

          if (userRows.length === 0) {
            throw new Error(`${userName}님의 데이터를 찾을 수 없습니다.`);
          }

          // 날짜순 정렬 및 최신 데이터 선택
          const latestRow = userRows.sort((a, b) => {
            const dateA = new Date(a[5] || '');
            const dateB = new Date(b[5] || '');
            return dateB - dateA;
          })[0];

          // 맥파 데이터 매핑
          const waveData = {
            ab_ms: String(latestRow[9] || ''),
            ac_ms: String(latestRow[10] || ''),
            ad_ms: String(latestRow[11] || ''),
            ae_ms: String(latestRow[12] || ''),
            ba_ratio: String(latestRow[13] || ''),
            ca_ratio: String(latestRow[14] || ''),
            da_ratio: String(latestRow[15] || ''),
            ea_ratio: String(latestRow[16] || '')
          };

          // 데이터 유효성 검사
          if (!validatePulseData(waveData)) {
            throw new Error('유효한 맥파 데이터가 없습니다.');
          }

          // 폼 데이터 업데이트 - 기존 값 유지
          setFormData(prev => {
            const updatedData = {
              ...prev,
              ...waveData,
              measurementDate: new Date(latestRow[5] || '').toLocaleString()
            };

            // 기존 값 유지 (undefined나 빈 문자열이 아닐 경우에만)
            if (prev.pulse && prev.pulse !== 'undefined') updatedData.pulse = prev.pulse;
            if (prev.systolicBP && prev.systolicBP !== 'undefined') updatedData.systolicBP = prev.systolicBP;
            if (prev.diastolicBP && prev.diastolicBP !== 'undefined') updatedData.diastolicBP = prev.diastolicBP;

            console.log('업데이트된 폼 데이터:', updatedData);
            return updatedData;
          });

          alert(`${userName}님의 최신 맥파 데이터가 로드되었습니다.\n측정일시: ${new Date(latestRow[5] || '').toLocaleString()}`);

        } catch (error) {
          console.error('데이터 처리 오류:', error);
          alert(error.message);
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      console.error('파일 처리 오류:', error);
      alert(error.message);
    } finally {
      clearFileInput();
    }
  };

  // 날짜 파싱 캐시 추가
  const dateCache = new Map();
  function getParsedDate(dateStr) {
    if (!dateCache.has(dateStr)) {
      const [date, time] = dateStr.split(' ');
      const [month, day, year] = date.split('/');
      const [hours, minutes] = time.split(':');
      
      dateCache.set(dateStr, {
        month: parseInt(month),
        day: parseInt(day),
        year: parseInt(year),
        hours: parseInt(hours),
        minutes: parseInt(minutes)
      });
    }
    
    return dateCache.get(dateStr);
  }

  const validateFormData = () => {
    if (!formData.name?.trim()) {
      throw new Error('이름을 입력해주세요.');
    }
    const requiredFields = ['ab_ms', 'ac_ms', 'ad_ms', 'ae_ms', 'ba_ratio', 'ca_ratio', 'da_ratio', 'ea_ratio'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      throw new Error('맥파 데이터 먼 가져오세요.');
    }
    return true;
  };

  // 날짜 문자열을 Date 객체로 변환하는 함수
  const parseCustomDate = (dateStr) => {
    try {
      if (!dateStr) return null;
      
      // 문자열로 변환 및 공백 제거
      const str = dateStr.toString().trim();
      const [datePart, timePart = '00:00'] = str.split(' ');
      
      if (!datePart) return null;
      // YY-MM-DD 형식 처리
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      if (!year || !month || !day) {
        console.warn('잘못된 날짜 형식:', dateStr);
        return null;
      }
      // 2000년대로 변환
      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(fullYear, month - 1, day, hour || 0, minute || 0);
      return date;
    } catch (error) {
      console.error('날짜 파싱 오류:', { dateStr, error });
      return null;
    }
  };

  // 맥파 데이터 계산 함수들 수정
  const calculatePVC = (data) => {
    const ab = parseFloat(data.ab_ms);
    const ae = parseFloat(data.ae_ms);
    const b_a = parseFloat(data.ba_ratio);
    const c_a = parseFloat(data.ca_ratio);
    const d_a = parseFloat(data.da_ratio);

    if ([ab, ae, b_a, c_a, d_a].some(isNaN)) return 'NaN';

    return (0.2 * Math.abs(b_a) + 0.15 * Math.abs(d_a) + 
            0.1 * ae + 0.05 * Math.abs(c_a)).toFixed(2);
  };

  const calculateBV = (data) => {
    const ab = parseFloat(data.ab_ms);
    const ac = parseFloat(data.ac_ms);
    const ad = parseFloat(data.ad_ms);
    const ae = parseFloat(data.ae_ms);
    const c_a = parseFloat(data.ca_ratio);

    if ([ab, ac, ad, ae, c_a].some(isNaN)) return 'NaN';

    return (0.15 * Math.abs(c_a) + 0.1 * (ad - ac) + 
            0.1 * (ae / ab) + 0.05 * ab).toFixed(2);
  };

  const calculateSV = (data) => {
    const ab = parseFloat(data.ab_ms);
    const ae = parseFloat(data.ae_ms);
    const b_a = parseFloat(data.ba_ratio);
    const d_a = parseFloat(data.da_ratio);

    if ([ab, ae, b_a, d_a].some(isNaN)) return 'NaN';

    return (0.05 * Math.abs(d_a) + 0.03 * ae + 
            0.02 * Math.abs(b_a)).toFixed(2);
  };

  // 맥파 데이터가 변경될 때 호출되는 함수
  const updatePulseCalculations = () => {
    if (formData.ab_ms && formData.ac_ms && formData.ad_ms && formData.ae_ms) {
      const a = parseFloat(formData.ab_ms);
      const b = parseFloat(formData.ba_ratio);
      const c = parseFloat(formData.ca_ratio);
      const d = parseFloat(formData.da_ratio);
      const e = parseFloat(formData.ea_ratio);
      if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d) && !isNaN(e)) {
        setFormData(prev => ({
          ...prev,
          pvc: calculatePVC(formData),
          bv: calculateBV(formData),
          sv: calculateSV(formData)
        }));
      }
    }
  };

  // useEffect를 사용하여 맥파 데이터가 변경될 때마다 계산 실행
  useEffect(() => {
    updatePulseCalculations();
  }, [formData.ab_ms, formData.ba_ratio, formData.ca_ratio, formData.da_ratio, formData.ea_ratio]);

  // resetForm 함수 추가
  const resetForm = () => {
    setFormData({
      name: '',
      residentNumber: '',
      gender: '',
      height: '',
      weight: '',
      bmi: '',
      personality: '',
      stress: '',
      workIntensity: '',
      pulse: '',
      systolicBP: '',
      diastolicBP: '',
      ab_ms: '',
      ac_ms: '',
      ad_ms: '',
      ae_ms: '',
      ba_ratio: '',
      ca_ratio: '',
      da_ratio: '',
      ea_ratio: '',
      selectedCategory: '',
      selectedSubCategory: '',
      selectedSymptom: '',
      selectedSymptoms: [],
      medication: '',
      preference: '',
      memo: '',
      pvc: '',
      bv: '',
      sv: '',
      heartRate: '',
      selectedStressEvents: [],
      stressScore: 0,
      stressLevel: '',
      stressDescription: ''
    });
  };

  // validateForm 함수 수정
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    // 필수 필드 검사
    if (!formData.name?.trim()) {
      newErrors.name = '이름을 입력해주세요';
      isValid = false;
    }
    if (!formData.residentNumber?.trim()) {
      newErrors.residentNumber = '주민번호를 입력해주세요';
      isValid = false;
    }
    if (!formData.height?.toString().trim()) {
      newErrors.height = '신장을 입력해주세요';
      isValid = false;
    }
    if (!formData.weight?.toString().trim()) {
      newErrors.weight = '체중을 입력해주세요';
      isValid = false;
    }
    setValidationErrors(newErrors);
    return isValid;
  };

  // 입력 필드에 에러 메시지 표시를 위한 스타일 추가
  const getInputStyle = (fieldName) => {
    if (validationErrors[fieldName]) {
      return { borderColor: 'red' };
    }
    return {};
  };

  // formatDate 함수 추가
  const formatDate = (date) => {
    if (!date) return '';
    
    try {
      if (typeof date === 'number') {
        // Excel 날짜 처리
        const EXCEL_EPOCH = new Date(Date.UTC(1899, 11, 30));
        const dateObj = new Date(EXCEL_EPOCH.getTime() + (date - 1) * 86400000);
        return dateObj.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('날짜 형 변환 오류:', error);
      return '';
    }
  };

  // DataTable 컴포넌트
  const DataTable = ({ data }) => {
    if (!data) return null;
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>측정일시</th>
              <th>이름</th>
              <th>주민등록번호</th>
              <th>성별</th>
              <th>성격</th>
              <th>스트레스</th>
              <th>노동강도</th>
              <th>신장</th>
              <th>체중</th>
              <th>BMI지수</th>
              <th>맥박</th>
              <th>수축기혈압</th>
              <th>이완기혈압</th>
              <th>a-b</th>
              <th>a-c</th>
              <th>a-d</th>
              <th>a-e</th>
              <th>b/a</th>
              <th>c/a</th>
              <th>d/a</th>
              <th>e/a</th>
              <th>pvc</th>
              <th>bv</th>
              <th>sv</th>
              <th>hr</th>
              <th>증상</th>
              <th>복용약물</th>
              <th>기호식품</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" name="name" /></td>
              <td><input type="text" name="residentNumber" /></td>
              <td>
                <select name="gender">
                  <option value="">선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </td>
              <td><input type="text" name="personality" /></td>
              <td>
                <select 
                  className="form-select"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="약함">약함</option>
                  <option value="중간">중간</option>
                  <option value="위험">위험</option>
                </select>
              </td>
              <td>
                <select name="workIntensity">
                  <option value="">선택하세요</option>
                  <option value="매우심함">매우 심함</option>
                  <option value="심함">심함</option>
                  <option value="보통">보통</option>
                  <option value="적음">적음</option>
                  <option value="매우적음">매우 적음</option>
                </select>
              </td>
              <td><input type="number" name="height" /></td>
              <td><input type="number" name="weight" /></td>
              <td><input type="text" name="bmi" /></td>
              <td><input type="text" name="pulse" /></td>
              <td><input type="text" name="systolicBP" /></td>
              <td><input type="text" name="diastolicBP" /></td>
              <td><input type="text" name="ab_ms" /></td>
              <td><input type="text" name="ac_ms" /></td>
              <td><input type="text" name="ad_ms" /></td>
              <td><input type="text" name="ae_ms" /></td>
              <td><input type="text" name="ba_ratio" /></td>
              <td><input type="text" name="ca_ratio" /></td>
              <td><input type="text" name="da_ratio" /></td>
              <td><input type="text" name="ea_ratio" /></td>
              <td><input type="text" name="pvc" /></td>
              <td><input type="text" name="bv" /></td>
              <td><input type="text" name="sv" /></td>
              <td><input type="text" name="hr" /></td>
              <td><input type="text" name="symptoms" /></td>
              <td>
                <select name="medication">
                  <option value="">선택</option>
                  {약물카테고리.map((약물, index) => (
                    <option key={`medication-${index}-${약물}`} value={약물}>
                      {약물}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select name="preference">
                  <option value="">선택</option>
                  {기호식품카테고리.map((기호품, index) => (
                  <option key={`preference-${index}`} value={기호품}>{기호품}</option>
                ))}
                </select>
              </td>
              <td><textarea name="memo" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // UserInfoForm 컴포넌트 내부에 스트레스 관련 핸들러 추가
  const handleStressCategoryChange = (e) => {
    setSelectedStressCategory(e.target.value);
  };

  const handleStressItemSelect = (e) => {
    const selectedItem = JSON.parse(e.target.value);
    if (!selectedStressItems.some(item => item.name === selectedItem.name)) {
      setSelectedStressItems([...selectedStressItems, selectedItem]);
    }
  };

  const removeStressItem = (itemToRemove) => {
    const newItems = selectedStressItems.filter(item => item.name !== itemToRemove.name);
    setSelectedStressItems(newItems);
    
    // 총점 재계산
    const totalScore = newItems.reduce((sum, item) => sum + item.score, 0);
    const evaluation = evaluateStressLevel(totalScore);
    
    // 스트레스 수준을 기존 입력필드 형식으로 변환
    let stressLevel = '';
    if (evaluation.level === '위험') {
      stressLevel = '매우 위험';
    } else if (evaluation.level === '중간') {
      stressLevel = '보통';
    } else {
      stressLevel = '약함';
    }
    
    setFormData(prev => ({
      ...prev,
      stress: stressLevel, // 기존 스트레스 입력필드에 자동 입력
      stressScore: totalScore,
      stressLevel: evaluation.level,
      stressDescription: evaluation.description
    }));
  };

  // 체크박스 선택 처리
  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 전체 선택 처리
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = tableData.map(item => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 선택된 항목 삭제
  const handleDelete = () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm('선택한 항목을 삭제하시겠습니까?')) {
      // 선택되지 않은 항목만 필터링하여 새로운 배열 생성
      const newData = tableData.filter(item => !selectedIds.includes(item.id));
      setTableData(newData);
      setSelectedIds([]); // 선택 초기화
    }
  };

  const goToKioskMode = () => {
    navigate('/');
  };

  // Electron 환경 체크 함수 수정
  const checkElectronEnvironment = () => {
    const isElectron = window?.electron !== undefined || 
                       window?.process?.type === 'renderer' || 
                       navigator.userAgent.toLowerCase().includes('electron');
    
    console.log('환경 체크 결과:');
    console.log('Is Electron?:', isElectron);
    console.log('Electron API:', !!window.electronAPI);
    
    return isElectron;
  };

  // 프로그램 실행 함수 개선
  const launchUbioMacpa = async () => {
    console.log('Launch button clicked');
    
    if (!checkElectronEnvironment()) {
      console.log('Electron 환경이 아닙니다');
      alert('이 기능은 데스크톱 앱에서만 사용 가능합니다.');
      return;
    }

    try {
      if (!window.electronAPI?.launchUbioMacpa) {
        throw new Error('Electron API를 찾을 수 없습니다.');
      }
      
      const result = await window.electronAPI.launchUbioMacpa();
      console.log('Launch result:', result);
    } catch (error) {
      console.error('Error launching uBioMacpa:', error);
      alert('프로그램 실행 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 스트레스 이벤트 체크박스 변경 핸들러
  const handleStressItemChange = (event, score) => {
    const { checked, value } = event.target;
    console.log('스트레스 항목 변경:', value, '점수:', score, '선택됨:', checked);
    
    setSelectedStressItems(prev => {
      const updated = checked
        ? [...prev, { value, score }]
        : prev.filter(item => item.value !== value);
      
      console.log('선택된 항목 업데이트:', updated);
      console.log('예상 총점:', updated.reduce((sum, item) => sum + item.score, 0));
      return updated;
    });
  };

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1"
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: 'text.primary',
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}
      >
        PC 데이터 입력
      </Typography>

      <form className="user-info-form">
        {/* 기본 정보 섹션 */}
        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>기본 정보</h3>
          </div>
          
          <div className="input-row">
            <div className="input-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름"
                style={getInputStyle('name')}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="input-group">
              <label className="form-label">주민등록번호</label>
              <input
                type="text"
                name="residentNumber"
                value={formData.residentNumber}
                onChange={handleResidentNumberChange}
                maxLength="14" // 하이픈 포함 14자리
                placeholder="000000-0000000"
                className="form-control"
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="input-group">
              <label className="form-label">성별</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                readOnly
                className="form-control"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="form-label">신장 (cm)</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="신장 (cm)"
                style={getInputStyle('height')}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="input-group">
              <label className="form-label">체중 (kg)</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="체중 (kg)"
                style={getInputStyle('weight')}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="input-group">
              <label className="form-label">BMI</label>
              <input
                type="text"
                value={calculateBMI(formData.height, formData.weight)}
                readOnly
                className="calculated-field"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="form-label">성격</label>
              <select
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                style={getInputStyle('personality')}
              >
                <option value="">선택하세요</option>
                <option value="매우급함">매우 급함</option>
                <option value="급함">급함</option>
                <option value="보통">보통</option>
                <option value="느긋">느긋</option>
                <option value="매우느긋">매우 느긋</option>
              </select>
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="input-group">
              <label className="form-label">스트레스</label>
              <input
                type="text"
                name="stress"
                value={formData.stress}
                readOnly
                className="form-control"
              />
              {formData.stressDescription && (
                <small className="text-muted">{formData.stressDescription}</small>
              )}
            </div>

            <div className="input-group">
              <label className="form-label">노동강도</label>
              <select
                name="workIntensity"
                value={formData.workIntensity}
                onChange={handleInputChange}
                style={getInputStyle('workIntensity')}
              >
                <option value="">선택하세요</option>
                <option value="매우심함">매우 심함</option>
                <option value="심함">심함</option>
                <option value="보통">보통</option>
                <option value="적음">적음</option>
                <option value="매우적음">매우 적음</option>
              </select>
              {error && <span className="error-message">{error}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>스트레스 평가</h3>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="form-label">스트레스 대분류</label>
              <select
                className="form-select"
                value={selectedStressCategory}
                onChange={handleStressCategoryChange}
              >
                <option value="">선택하세요</option>
                {스트레스카테고리.map((category, index) => (
                  <option key={index} value={category.대분류}>
                    {category.대분류}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="form-label">스트레스 항목</label>
              <select
                className="form-select"
                onChange={handleStressItemSelect}
                disabled={!selectedStressCategory}
              >
                <option value="">선택하세요</option>
                {selectedStressCategory && 스트레스카테고리
                  .find(category => category.대분류 === selectedStressCategory)
                  ?.중분류.map((item, index) => (
                    <option key={index} value={JSON.stringify(item)}>
                      {item.name} ({item.score}점)
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {selectedStressItems.length > 0 && (
            <div className="selected-items">
              <div className="selected-items-list">
                {selectedStressItems.map((item, index) => (
                  <div key={index} className="selected-item">
                    <span>{item.name} ({item.score}점)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStressItems(
                          selectedStressItems.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="stress-evaluation">
                {(() => {
                  const totalScore = selectedStressItems.reduce((sum, item) => sum + item.score, 0);
                  const evaluation = evaluateStressLevel(totalScore);
                  return (
                    <>
                      <div className="stress-total">총점: {totalScore}점</div>
                      <div className="stress-level">
                        스트레스 수준: <span className={`level-${evaluation.level}`}>{evaluation.level}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>혈압 및 맥박수</h3>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label className="form-label">이완기 혈압</label>
              <input
                type="number"
                name="diastolicBP"
                value={formData.diastolicBP || ''}
                onChange={handleInputChange}
                className="form-control"
                placeholder="이완기 혈압"
              />
            </div>

            <div className="input-group">
              <label className="form-label">수축기 혈압</label>
              <input
                type="number"
                name="systolicBP"
                value={formData.systolicBP || ''}
                onChange={handleInputChange}
                className="form-control"
                placeholder="수축기 혈압"
              />
            </div>

            <div className="input-group">
              <label className="form-label">맥박수</label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate || ''}
                onChange={handleInputChange}
                className="form-control"
                placeholder="맥박수"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>증상 선택</h3>
          </div>
          <div className="form-row symptoms-category-row">
            <div className="form-group category">
              <label className="form-label">대분류</label>
              <select value={formData.selectedCategory} onChange={handleCategoryChange} style={getInputStyle('selectedCategory')}>
                <option value="">선택하세요</option>
                {Object.keys(증상카테고리).map(category => (
                  <option key={`cat-${category}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {error && <span className="error-message">{error}</span>}
            </div>
            <div className="form-group subcategory">
              <label className="form-label">중분류</label>
              <select value={formData.selectedSubCategory} onChange={handleSubCategoryChange} style={getInputStyle('selectedSubCategory')}>
                <option value="">선택하세요</option>
                {formData.selectedCategory && 
                  Object.keys(증상카테고리[formData.selectedCategory]).map(subCategory => (
                    <option key={`subcat-${formData.selectedCategory}-${subCategory}`} value={subCategory}>
                      {subCategory}
                    </option>
                  ))
                }
              </select>
              {error && <span className="error-message">{error}</span>}
            </div>
            <div className="form-group symptom">
              <label className="form-label">소분류</label>
              <select value={formData.selectedSymptom} onChange={handleSymptomChange} style={getInputStyle('selectedSymptom')}>
                <option value="">선택하세요</option>
                {formData.selectedSubCategory && 
                  증상카테고리[formData.selectedCategory][formData.selectedSubCategory].map(symptom => (
                    <option 
                      key={`sym-${formData.selectedCategory}-${formData.selectedSubCategory}-${symptom.name}`} 
                      value={symptom.name}
                    >
                      {symptom.name}
                    </option>
                  ))
                }
              </select>
              {error && <span className="error-message">{error}</span>}
            </div>
          </div>
          <div className="selected-symptoms">
            {formData.selectedSymptoms.map((symptom, index) => (
              <span key={`selected-${index}-${symptom.replace(/\s+/g, '-')}`} className="symptom-tag">
                {symptom}
                <button type="button" onClick={() => removeSymptom(symptom)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>복용약물</h3>
          </div>
          
          {/* 복용중인 약물 선택 */}
          <div className="input-group">
            <label className="form-label">복용중인 약물</label>
            <select
              className="form-select"
              value={formData.selectedMedication || ''}
              onChange={(e) => {
                const medication = e.target.value;
                if (medication && !formData.selectedMedications?.includes(medication)) {
                  setFormData(prev => ({
                    ...prev,
                    selectedMedications: [...(prev.selectedMedications || []), medication],
                    selectedMedication: ''
                  }));
                }
              }}
            >
              <option value="">선택하세요</option>
              {약물카테고리.map((medication, index) => (
                <option key={index} value={medication}>
                  {medication}
                </option>
              ))}
            </select>
          </div>

          {/* 선택된 약물 표시 */}
          {formData.selectedMedications && formData.selectedMedications.length > 0 && (
            <div className="selected-items">
              <div className="selected-items-list">
                {formData.selectedMedications.map((medication, index) => (
                  <div key={index} className="selected-item">
                    {medication}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          selectedMedications: prev.selectedMedications.filter(
                            (_, i) => i !== index
                          )
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 기호식품 선택 */}
          <div className="input-group">
            <label className="form-label">기호식품</label>
            <select
              className="form-select"
              value={formData.selectedPreference || ''}
              onChange={(e) => {
                const preference = e.target.value;
                if (preference && !formData.selectedPreferences?.includes(preference)) {
                  setFormData(prev => ({
                    ...prev,
                    selectedPreferences: [...(prev.selectedPreferences || []), preference],
                    selectedPreference: ''
                  }));
                }
              }}
            >
              <option value="">선택하세요</option>
              {기호식품카테고리.map((preference, index) => (
                <option key={index} value={preference}>
                  {preference}
                </option>
              ))}
            </select>
          </div>

          {/* 선택된 기호식품 표시 */}
          {formData.selectedPreferences && formData.selectedPreferences.length > 0 && (
            <div className="selected-items">
              <div className="selected-items-list">
                {formData.selectedPreferences.map((preference, index) => (
                  <div key={index} className="selected-item">
                    {preference}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          selectedPreferences: prev.selectedPreferences.filter(
                            (_, i) => i !== index
                          )
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-section pulse-section">
          <h2 className="section-title">맥파분석</h2>
          
          {/* 유비오맥파 프로그램 실행 버튼 추가 */}
          <div className="form-row file-control-row">
            <div className="form-group">
              <button 
                type="button"
                className="button primary"
                onClick={launchUbioMacpa}
                disabled={!checkElectronEnvironment()}
              >
                유비오맥파 프로그램 실행
              </button>
              {!checkElectronEnvironment() && (
                <span className="error-message">
                  이 기능은 데스크톱 앱에서만 사용 가능합니다
                </span>
              )}
            </div>
          </div>

          {/* 기존 파일 업로드 버튼 */}
          <div className="form-row file-control-row">
            <div className="form-group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
              <button 
                type="button"
                className="button secondary"
                onClick={handleFileButtonClick}
                disabled={isLoading}
              >
                유비오 맥파 데이터 가져오기
              </button>
              {error && <span className="error-message">{error}</span>}
            </div>
          </div>
          <div className="form-row pulse-wave-row">
            <div className="form-group">
              <label className="form-label">a-b</label>
              <input
                type="text"
                name="ab_ms"
                value={formData.ab_ms}
                onChange={handleInputChange}
                style={getInputStyle('ab_ms')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">a-c</label>
              <input
                type="text"
                name="ac_ms"
                value={formData.ac_ms}
                onChange={handleInputChange}
                style={getInputStyle('ac_ms')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">a-d</label>
              <input
                type="text"
                name="ad_ms"
                value={formData.ad_ms}
                onChange={handleInputChange}
                style={getInputStyle('ad_ms')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">a-e</label>
              <input
                type="text"
                name="ae_ms"
                value={formData.ae_ms}
                onChange={handleInputChange}
                style={getInputStyle('ae_ms')}
              />
            </div>
          </div>
          <div className="form-row pulse-ratio-row">
            <div className="form-group">
              <label className="form-label">b/a</label>
              <input
                type="text"
                name="ba_ratio"
                value={formData.ba_ratio}
                onChange={handleInputChange}
                style={getInputStyle('ba_ratio')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">c/a</label>
              <input
                type="text"
                name="ca_ratio"
                value={formData.ca_ratio}
                onChange={handleInputChange}
                style={getInputStyle('ca_ratio')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">d/a</label>
              <input
                type="text"
                name="da_ratio"
                value={formData.da_ratio}
                onChange={handleInputChange}
                style={getInputStyle('da_ratio')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">e/a</label>
              <input
                type="text"
                name="ea_ratio"
                value={formData.ea_ratio}
                onChange={handleInputChange}
                style={getInputStyle('ea_ratio')}
              />
            </div>
          </div>
          <div className="form-row pulse-analysis-results">
            <div className="form-group">
              <label className="form-label">말초혈관 수축도 (PVC)</label>
              <input
                type="text"
                name="pvc"
                value={calculatePVC(formData)}
                readOnly
                className="analysis-result"
                style={getInputStyle('pvc')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">혈액 점도 (BV)</label>
              <input
                type="text"
                name="bv"
                value={calculateBV(formData)}
                readOnly
                className="analysis-result"
                style={getInputStyle('bv')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">일회박출량 (SV)</label>
              <input
                type="text"
                name="sv"
                value={calculateSV(formData)}
                readOnly
                className="analysis-result"
                style={getInputStyle('sv')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">심박수 (HR)</label>
              <input
                type="text"
                name="hr"
                value={formData.pulse}
                readOnly
                className="analysis-result"
                style={getInputStyle('hr')}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h3>메모</h3>
          </div>
          <textarea
            name="memo"
            className="memo-input"
            value={formData.memo}
            onChange={handleInputChange}
            placeholder="메모를 입력하세요"
            rows={4}
          />
        </div>
      </form>

      {/* 하단 버튼 컨테이너 */}
      <div className="bottom-buttons-container">
        <div className="bottom-buttons">
          <button 
            className="save-button"
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </Box>
  );
};

// 컴포넌트 내보내기
export default UserInfoForm;
