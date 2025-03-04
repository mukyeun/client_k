export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

export const validateAppointmentData = (appointmentData) => {
  const errors = {};

  if (!appointmentData.date) {
    errors.date = '날짜를 선택해주세요.';
  }

  if (!appointmentData.time) {
    errors.time = '시간을 선택해주세요.';
  }

  if (!appointmentData.patientInfo.name) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!appointmentData.patientInfo.phone) {
    errors.phone = '전화번호를 입력해주세요.';
  } else if (!validatePhoneNumber(appointmentData.patientInfo.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다.';
  }

  if (!appointmentData.patientInfo.birthDate) {
    errors.birthDate = '생년월일을 선택해주세요.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 