import axios from 'axios';

const USER_DATA_KEY = 'userData';
const API_BASE_URL = 'http://localhost:8080/api';

export const initializeLocalStorage = () => {
  localStorage.removeItem(USER_DATA_KEY);
};

export const saveUserInfo = async (userData) => {
  try {
    const existingData = localStorage.getItem(USER_DATA_KEY);
    console.log('기존 데이터:', existingData);

    let dataArray = [];
    if (existingData) {
      dataArray = JSON.parse(existingData);
      if (!Array.isArray(dataArray)) {
        dataArray = [dataArray];
      }
    }

    const existingUser = dataArray.find(item => item._id === userData._id);

    const newData = {
      ...(existingUser || {}),
      ...userData,
      _id: userData._id || Date.now().toString(),
      createdAt: userData.createdAt || new Date().toISOString(),
      personality: userData.personality || existingUser?.personality || '',
      stress: userData.stress || existingUser?.stress || '',
      workIntensity: userData.workIntensity || existingUser?.workIntensity || ''
    };

    console.log('저장할 새 데이터:', newData);

    const index = dataArray.findIndex(item => item._id === newData._id);
    if (index !== -1) {
      dataArray[index] = newData;
    } else {
      dataArray.push(newData);
    }

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataArray));
    console.log('최종 저장된 데이터:', JSON.stringify(dataArray));
    return newData;
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
};

export const getAllUserInfo = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return [];
    
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Failed to get user info from localStorage:', error);
    return [];
  }
};

export const deleteUserInfo = (id) => {
  try {
    const existingData = getAllUserInfo();
    const filteredData = existingData.filter(item => item._id !== id);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(filteredData));
    return true;
  } catch (error) {
    console.error('Failed to delete user info from localStorage:', error);
    throw error;
  }
};

export const updateUserInfo = (id, updatedData) => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    const parsedData = data ? JSON.parse(data) : [];
    
    const updatedArray = parsedData.map(item => 
      item._id === id ? { ...item, ...updatedData } : item
    );
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedArray));
    
    return {
      success: true,
      data: updatedArray.find(item => item._id === id)
    };
  } catch (error) {
    console.error('데이터 수정 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const fetchUserData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);
    if (!response.ok) {
      throw new Error('데이터 조회 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
}; 