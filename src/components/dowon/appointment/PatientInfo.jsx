import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { commonStyles } from './styles';

const PatientInfo = ({ onBack, onNext, patientData, onPatientDataChange }) => {
  return (
    <Box sx={commonStyles.pageContainer}>
      <Typography variant="h6" sx={commonStyles.title}>
        환자 정보 입력
      </Typography>

      <Paper sx={commonStyles.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <input
              type="text"
              name="name"
              value={patientData.name}
              onChange={onPatientDataChange}
              placeholder="이름 *"
              required
              className="form-input"
            />
          </Grid>

          <Grid item xs={12}>
            <input
              type="tel"
              name="phone"
              value={patientData.phone}
              onChange={onPatientDataChange}
              placeholder="연락처 *"
              required
              className="form-input"
            />
          </Grid>

          <Grid item xs={12}>
            <input
              type="text"
              name="birthDate"
              value={patientData.birthDate}
              onChange={onPatientDataChange}
              placeholder="생년월일 *"
              required
              className="form-input"
            />
          </Grid>

          <Grid item xs={6}>
            <select
              name="gender"
              value={patientData.gender}
              onChange={onPatientDataChange}
              required
              className="form-select"
            >
              <option value="" disabled selected>성별 *</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </Grid>

          <Grid item xs={6}>
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={onPatientDataChange}
              placeholder="나이 *"
              required
              className="form-input"
            />
          </Grid>

          <Grid item xs={12}>
            <select
              name="isFirstVisit"
              value={patientData.isFirstVisit}
              onChange={onPatientDataChange}
              className="form-select"
            >
              <option value="" disabled selected>첫 방문이신가요?</option>
              <option value={true}>예</option>
              <option value={false}>아니오</option>
            </select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="기존 질환"
              name="existingConditions"
              value={patientData.existingConditions}
              onChange={onPatientDataChange}
              placeholder="기존에 앓고 계신 질환이 있다면 입력해 주세요"
              sx={commonStyles.inputField}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="복용 중인 약"
              name="currentMedications"
              value={patientData.currentMedications}
              onChange={onPatientDataChange}
              placeholder="현재 복용 중인 약이 있다면 입력해 주세요"
              sx={commonStyles.inputField}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="특이사항"
              name="notes"
              value={patientData.notes}
              onChange={onPatientDataChange}
              placeholder="기타 특이사항이 있다면 입력해 주세요"
              sx={commonStyles.inputField}
            />
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          sx={{ 
            color: '#64748B',
            fontSize: '0.8rem',
            textAlign: 'center',
            mt: 3
          }}
        >
          * 표시된 항목은 필수 입력사항입니다
        </Typography>
      </Paper>

      <Box sx={commonStyles.buttonContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onBack}
        >
          이전
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
        >
          다음
        </Button>
      </Box>
    </Box>
  );
};

export default PatientInfo; 