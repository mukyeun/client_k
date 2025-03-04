import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditModal from './EditModal';
import { getAllUserInfo, deleteUserInfo, saveUserInfo, initializeLocalStorage } from '../../api/userInfo';
import './UserDataTable.css';
import ErrorMessage from '../../components/common/ErrorMessage';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';
import { read, utils } from 'xlsx';
import * as ExcelJS from 'exceljs';
import { FaSearch, FaFilter, FaFileExcel, FaEdit, FaTrash } from 'react-icons/fa';
import './PCDataView.css';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

// localStorage 키 상수 정의
const LOCAL_STORAGE_KEY = 'pcData';

const UserDataTable = () => {
  // Ref 추가
  const headerCheckboxRef = useRef(null);

  // 상태 관리
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const navigate = useNavigate();
  
  // 정렬, 필터링, 페이지네이션 상태
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    residentNumberPrefix: '',
    name: ''
  });
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: itemsPerPage
  });
  // loadUserData 함수 선언
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // localStorage에서 데이터 가져오기
      const localData = JSON.parse(localStorage.getItem('userData') || '[]');
      console.log('Local Storage 데이터:', localData);
      
      // MongoDB에서 데이터 가져오기 시도
      let mongoData = [];
      try {
        const response = await getAllUserInfo();
        mongoData = response;
        console.log('MongoDB 데이터:', mongoData);
      } catch (error) {
        console.error('MongoDB 데이터 로드 실패:', error);
      }

      // 두 데이터 소스 병합
      const combinedData = [...localData, ...mongoData];
      console.log('병합된 데이터:', combinedData);

      // 중복 제거 (같은 _id를 가진 항목)
      const uniqueData = Array.from(new Map(
        combinedData.map(item => [item._id, item])
      ).values());

      // 데이터 정제
      const cleanData = uniqueData
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          ...item,
          personality: String(item.personality || ''),
          stress: String(item.stress || ''),
          workIntensity: String(item.workIntensity || '')
        }));

      console.log('최종 처리된 데이터:', cleanData);
      setUserData(cleanData);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setUserData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // handleEditComplete 함수 선언
  const handleEditComplete = useCallback(async () => {
    await loadUserData();
    setIsEditModalOpen(false);
    setEditingUser(null);
  }, [loadUserData]);
  // 컴포넌트 마운트 시 로컬 데이터 로드
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  // 페이지 변경 시 visibleRange 업데이트
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleRange({ start, end });
  }, [currentPage, itemsPerPage]);
  // 정렬 핸들러
  const handleSort = useCallback((key) => {
    setSortConfig(prevSort => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  // 필터 핸들러
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // 터 변경 시 첫 페이지로 이동
  }, []);
  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = useCallback((e) => {
    const newSize = parseInt(e.target.value, 10);
    setItemsPerPage(newSize);
    // 현재 페이지를 첫 페이지로 리셋
    setCurrentPage(1);
    // visibleRange 재계산
    const start = 0;
    const end = Math.min(newSize, userData.length);
    setVisibleRange({ start, end });
  }, [userData.length]);
  // useEffect 추가로 페이지 크기 변경 시 데이터 유지
  useEffect(() => {
    if (userData.length > 0) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = Math.min(start + itemsPerPage, userData.length);
      setVisibleRange({ start, end });
    }
  }, [currentPage, itemsPerPage, userData.length]);
  // EditModal 컴포넌트
  const renderEditModal = () => {
    if (!isEditModalOpen) return null;
    return (
      <EditModal
        user={editingUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
      />
    );
  };
  // 1. 기본 유틸리티 함수들
  const formatDate = (date) => {
    if (!date) {
      const now = new Date();
      // 밀리초 단까지 포함하여 더 정확한 시간 표시
      return now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      });
    }
    const d = new Date(date);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };
  // 2. 데이터 처리 기본 함수들
  const getSortedData = useCallback((data) => {
    if (!data || !Array.isArray(data)) {
      console.warn('정렬할 데이터가 없거나 배열이 아닙니다:', data);
      return [];
    }
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // null/undefined 처리
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      // 짜 형식 처리
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // 자 형식 처리
      if (['height', 'weight', 'bmi', 'pulse', 'systolicBP', 'diastolicBP'].includes(sortConfig.key)) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig]);
  // 3. 필터링 함수
  const getFilteredData = useCallback(() => {
    console.log('getFilteredData 호출됨, userData:', userData);
    
    if (!Array.isArray(userData)) {
      return [];
    }

    // 각 데이터 항목의 구조를 명시적으로 확인
    const filteredData = userData.map(user => ({
      ...user,
      personality: user.personality || '',
      stress: user.stress || '',
      workIntensity: user.workIntensity || ''
    }));

    console.log('필터링된 데이터 상세:', filteredData.map(item => ({
      id: item._id,
      personality: item.personality,
      stress: item.stress,
      workIntensity: item.workIntensity
    })));

    return filteredData;
  }, [userData]);
  // 4. 메모이제이션된 데이터
  const sortedData = useMemo(() => {
    const filteredData = getFilteredData();
    return getSortedData(filteredData);
  }, [getFilteredData, getSortedData]);
  // 5. 이벤트 핸들러들
  const handleCheckboxChange = useCallback((id) => {
    setCheckedIds(prev => {
      const isChecked = prev.includes(id);
      if (isChecked) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);
  const toggleAllCheckboxes = useCallback(() => {
    const filteredData = getFilteredData();
    const filteredIds = filteredData.map(item => item._id);
    
    setCheckedIds(prev => {
      // 현재 필터링된 항목들이 모두 체크되어 있는지 확인
      const allFilteredChecked = filteredIds.every(id => prev.includes(id));
      
      if (allFilteredChecked) {
        // 필터링된 항목들만 체크 해제
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        // 필터링된 항목들 추가 (기존 체크된 항목 유지)
        return [...new Set([...prev, ...filteredIds])];
      }
    });
  }, [getFilteredData]);
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('데이터');

    // 헤더 설정
    worksheet.columns = [
      { header: '측정일시', key: 'createdAt', width: 20 },
      { header: '이름', key: 'name', width: 15 },
      { header: '주민번호', key: 'residentNumber', width: 15 },
      { header: '성별', key: 'gender', width: 10 },
      { header: '성격', key: 'personality', width: 15 },
      { header: '스트레스', key: 'stress', width: 15 },
      { header: '노동강도', key: 'workIntensity', width: 15 },
      { header: '신장(cm)', key: 'height', width: 12 },
      { header: '체중(kg)', key: 'weight', width: 12 },
      { header: 'BMI', key: 'bmi', width: 10 },
      { header: '맥박', key: 'pulse', width: 10 },
      { header: '수축기혈압', key: 'systolicBP', width: 12 },
      { header: '이완기혈압', key: 'diastolicBP', width: 12 },
      { header: 'a-b(ms)', key: 'ab_ms', width: 12 },
      { header: 'a-c(ms)', key: 'ac_ms', width: 12 },
      { header: 'a-d(ms)', key: 'ad_ms', width: 12 },
      { header: 'a-e(ms)', key: 'ae_ms', width: 12 },
      { header: 'b/a', key: 'ba_ratio', width: 10 },
      { header: 'c/a', key: 'ca_ratio', width: 10 },
      { header: 'd/a', key: 'da_ratio', width: 10 },
      { header: 'e/a', key: 'ea_ratio', width: 10 },
      { header: 'PVC', key: 'pvc', width: 10 },
      { header: 'BV', key: 'bv', width: 10 },
      { header: 'SV', key: 'sv', width: 10 },
      { header: 'HR', key: 'pulse', width: 10 }, // HR 항목 추가 (pulse 값 사용)
      { header: '증상', key: 'selectedSymptoms', width: 30 },
      { header: '복용약물', key: 'selectedMedications', width: 30 },
      { header: '기호식품', key: 'selectedPreferences', width: 30 },
      { header: '메모', key: 'memo', width: 30 }
    ];

    // 데이터 추가
    const rows = currentPageData.map(user => ({
      createdAt: formatDate(user.createdAt),
      name: user.name,
      residentNumber: user.residentNumber,
      gender: user.gender,
      personality: user.personality,
      stress: user.stress,
      workIntensity: user.workIntensity,
      height: user.height,
      weight: user.weight,
      bmi: calculateBMI(user.height, user.weight),
      pulse: user.pulse,
      systolicBP: user.systolicBP,
      diastolicBP: user.diastolicBP,
      ab_ms: user.ab_ms,
      ac_ms: user.ac_ms,
      ad_ms: user.ad_ms,
      ae_ms: user.ae_ms,
      ba_ratio: user.ba_ratio,
      ca_ratio: user.ca_ratio,
      da_ratio: user.da_ratio,
      ea_ratio: user.ea_ratio,
      pvc: user.pvc,
      bv: user.bv,
      sv: user.sv,
      pulse: user.pulse, // HR 값으로 pulse 사용
      selectedSymptoms: Array.isArray(user.selectedSymptoms) ? user.selectedSymptoms.join(', ') : user.selectedSymptoms,
      selectedMedications: Array.isArray(user.selectedMedications) ? user.selectedMedications.join(', ') : user.selectedMedications,
      selectedPreferences: Array.isArray(user.selectedPreferences) ? user.selectedPreferences.join(', ') : user.selectedPreferences,
      memo: user.memo
    }));

    worksheet.addRows(rows);

    // 스타일 적용
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // 엑셀 파일 다운로드
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `데이터_${formatDate(new Date())}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const handleBackup = () => {
    const dataToBackup = {
      timestamp: new Date().toISOString(),
      data: userData
    };
    const blob = new Blob([JSON.stringify(dataToBackup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          if (backup.data && Array.isArray(backup.data)) {
            setUserData(backup.data);
            alert('데이터 복원되었습니다.');
          } else {
            throw new Error('Invalid backup format');
          }
        } catch (error) {
          alert('백업 파일을 읽는 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(file);
    }
  };
  const visibleData = useMemo(() => {
    return sortedData.slice(visibleRange.start, visibleRange.end);
  }, [sortedData, visibleRange]);
  const handleTableScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setVisibleRange(prev => ({
        start: 0,
        end: Math.min(prev.end + 50, sortedData.length)
      }));
    }
  }, [sortedData.length]);
  const handleView = useCallback((user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  }, []);
  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  }, []);
  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      residentNumberPrefix: '',
      name: ''
    });
  };
  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteUserInfo(id);  // 이미 수정된 deleteUserInfo 사용
        await loadUserData();  // 데이터 다시 로드
      } catch (error) {
        console.error('삭제 실패:', error);
        setError('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };
  const renderRow = useCallback((user, index) => (
    <tr key={user._id}>
      <td className="checkbox-cell">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={checkedIds.includes(user._id)}
          onChange={(e) => handleCheckboxChange(user._id)}
          id={`checkbox-${user._id}`}
        />
        <label htmlFor={`checkbox-${user._id}`} className="checkbox-cell"></label>
      </td>
      <td>{user.createdAt}</td>
      <td>{user.name}</td>
      <td>{user.residentNumber}</td>
      <td>{user.gender}</td>
      <td>{user.personality}</td>
      <td>{user.stress}</td>
      <td>{user.workIntensity}</td>
      <td>{user.height}</td>
      <td>{user.weight}</td>
      <td>{user.bmi}</td>
      <td>{user.pulse}</td>
      <td>{user.systolicBP}</td>
      <td>{user.diastolicBP}</td>
      <td>{user.ab_ms}</td>
      <td>{user.ac_ms}</td>
      <td>{user.ad_ms}</td>
      <td>{user.ae_ms}</td>
      <td>{user.ba_ratio}</td>
      <td>{user.ca_ratio}</td>
      <td>{user.da_ratio}</td>
      <td>{user.ea_ratio}</td>
      <td>{user.pvc}</td>
      <td>{user.bv}</td>
      <td>{user.sv}</td>
      <td>{user.hr}</td>
      <td>{Array.isArray(user.selectedSymptoms) ? user.selectedSymptoms.join(', ') : user.selectedSymptoms}</td>
      <td>{Array.isArray(user.selectedMedications) ? user.selectedMedications.join(', ') : user.selectedMedications}</td>
      <td>{Array.isArray(user.selectedPreferences) ? user.selectedPreferences.join(', ') : user.selectedPreferences}</td>
      <td>{user.memo}</td>
      <td className="action-cell">
        <button 
          onClick={() => handleEdit(user)}
          className="edit-button"
        >
          수정
        </button>
      </td>
    </tr>
  ), [checkedIds, handleCheckboxChange]);
  // 1. 정렬 아이콘 렌더링 함수
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon">↑</span>
      : <span className="sort-icon">↓</span>;
  }, [sortConfig]);
  // 체크박스 상태 계산을 위한 메모이제이션
  const { isAllChecked, isIndeterminate } = useMemo(() => {
    const filteredData = getFilteredData();
    if (!filteredData.length) {
      return { isAllChecked: false, isIndeterminate: false };
    }
    const filteredIds = filteredData.map(item => item._id);
    const checkedFilteredCount = filteredIds.filter(id => checkedIds.includes(id)).length;
    return {
      isAllChecked: checkedFilteredCount === filteredData.length && checkedFilteredCount > 0,
      isIndeterminate: checkedFilteredCount > 0 && checkedFilteredCount < filteredData.length
    };
  }, [getFilteredData, checkedIds]);
  // 데이터가 변경될 때 체크박스 상태 초기화
  useEffect(() => {
    setCheckedIds([]);
  }, [userData]);
  // EditModal 저장 로직 수정
  const handleSave = async (userData) => {
    try {
      await saveUserInfo(userData);  // 이미 수정된 saveUserInfo 사용
      await loadUserData();  // 데이터 다시 로드
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('저장 실패:', error);
      setError('데이터 저장 중 오류가 발생했습니다.');
    }
  };
  // 데이터 변경 감지를 위한 useEffect 추가
  useEffect(() => {
    console.log('userData updated:', userData);
  }, [userData]);
  // 엑셀 데이터 처리 함수 수정
  const processExcelData = useCallback((excelData) => {
    if (!excelData || !Array.isArray(excelData)) {
      console.error('Invalid excel data format:', excelData);
      return null;
    }
    try {
      const mappedData = excelData.map(row => ({
        name: row['이름'] || '',
        residentNumber: row['주민번호'] || '',
        gender: row['성별'] || '',
        personality: row['성격'] || '',
        stress: row['스트레스'] || '',
        workIntensity: row['노동강도'] || '',
        height: row['신장'] || '',
        weight: row['체중'] || '',
        bmi: row['BMI'] || '',
        pulse: row['맥박'] || '',
        systolicBP: row['수축기혈압'] || '',
        diastolicBP: row['이완기혈압'] || '',
        ab_ms: row['a-b'] || '',
        ac_ms: row['a-c'] || '',
        ad_ms: row['a-d'] || '',
        ae_ms: row['a-e'] || '',
        ba_ratio: row['b/a'] || '',
        ca_ratio: row['c/a'] || '',
        da_ratio: row['d/a'] || '',
        ea_ratio: row['e/a'] || '',
        pvc: row['맥파전달속도'] || '',
        bv: row['혈액용적'] || '',
        sv: row['1회박출량'] || '',
        hr: row['심박수'] || '',
        symptoms: row['증상'] || '',
        medication: row['복용약물'] || '',
        preference: row['기호식'] || '',
        memo: row['메모'] || ''
      }));
      return mappedData;
    } catch (error) {
      console.error('Excel data processing error:', error);
      return null;
    }
  }, []);
  // readExcelFile 함수 정의 추가
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: 'array' });
          resolve(workbook);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };
  // 엑셀 파일 처리 핸들러
  const handleExcelUpload = useCallback(async (file) => {
    try {
      const workbook = await readExcelFile(file);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = utils.sheet_to_json(worksheet);
      console.log('Raw excel data:', rawData);
      const processedData = processExcelData(rawData);
      if (!processedData) {
        throw new Error('데이터 처리 실패');
      }
      // 각 데이터 항목에 대해 저장 실행
      for (const data of processedData) {
        await saveUserInfo(data);
      }
      
      await loadUserData();
      alert('엑셀 데이터가 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error('Excel upload error:', error);
      alert('엑셀 파일 처리 중 오류가 발생했습니다.');
    }
  }, [processExcelData, loadUserData]);
  // 파일 입력 핸들러
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      handleExcelUpload(file);
    }
  }, [handleExcelUpload]);
  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    const filteredDataLength = getFilteredData().length;
    return Math.ceil(filteredDataLength / itemsPerPage);
  }, [getFilteredData, itemsPerPage]);

  // 현재 페이지 데이터
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, sortedData]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  // 표시할 페이지 번호 계산
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  // 선택 삭제 버튼 표시 여부
  const showDeleteButton = useMemo(() => checkedIds.length > 0, [checkedIds]);

  // 선택된 항목 삭제 핸들러
  const handleDeleteSelected = useCallback(async () => {
    if (!checkedIds.length) return;

    if (window.confirm(`선택한 ${checkedIds.length}개의 항목을 삭제하시겠습니까?`)) {
      try {
        // localStorage에서 데이터 가져오기
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let allData = savedData ? JSON.parse(savedData) : [];

        // 선택된 항목 제외한 데이터만 필터링
        const filteredData = allData.filter(item => !checkedIds.includes(item._id));

        // localStorage 업데이트
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredData));

        // 상태 업데이트
        setUserData(filteredData);
        setCheckedIds([]); // 체크박스 초기화

        alert('선택한 항목이 삭제되었습니다.');
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  }, [checkedIds]);

  // BMI 계산 함수 추가
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return '';
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // 데이터 로딩 상태 표시
  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }
  // 에러 태 표시
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="user-data-table">
      <div className="table-controls">
        <div className="filter-section">
          {/* 필터 컨트롤 */}
        </div>
        <div className="action-buttons">
          <button onClick={handleExport}>엑셀 다운로드</button>
          <button onClick={handleBackup}>백업</button>
          <input
            type="file"
            accept=".json"
            onChange={handleRestore}
            style={{ display: 'none' }}
            id="restore-input"
          />
          <label htmlFor="restore-input">
            <button onClick={() => document.getElementById('restore-input').click()}>
              복원
            </button>
          </label>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  ref={headerCheckboxRef}
                  onChange={toggleAllCheckboxes}
                  className="custom-checkbox"
                  id="header-checkbox"
                />
                <label htmlFor="header-checkbox"></label>
              </th>
              <th onClick={() => handleSort('createdAt')}>
                측정일시 {renderSortIcon('createdAt')}
              </th>
              <th onClick={() => handleSort('name')}>
                이름 {renderSortIcon('name')}
              </th>
              <th>주민번호</th>
              <th>성별</th>
              <th>성격</th>
              <th>스트레스</th>
              <th>노동강도</th>
              <th>신장(cm)</th>
              <th>체중(kg)</th>
              <th>BMI</th>
              <th>맥박</th>
              <th>수축기혈압</th>
              <th>이완기혈압</th>
              <th>a-b(ms)</th>
              <th>a-c(ms)</th>
              <th>a-d(ms)</th>
              <th>a-e(ms)</th>
              <th>b/a</th>
              <th>c/a</th>
              <th>d/a</th>
              <th>e/a</th>
              <th>PVC</th>
              <th>BV</th>
              <th>SV</th>
              <th>HR</th>
              <th>증상</th>
              <th>복용약물</th>
              <th>기호식품</th>
              <th>메모</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((user, index) => renderRow(user, index))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
        >
          {'<<'}
        </button>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
};
export default UserDataTable;
