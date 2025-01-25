import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container
} from '@mui/material';
import BasicInfoForm from './BasicInfoForm';
import SurveyQuestion from './SurveyQuestion';
import { surveyQuestions } from '../../data/surveyQuestions';

const steps = ['기초 정보', '체형(形) 설문', '기질(氣) 설문'];

function ConstitutionSurvey({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({});
  const [bodyAnswers, setBodyAnswers] = useState({});
  const [temperamentAnswers, setTemperamentAnswers] = useState({});

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBodyAnswerChange = (questionId, value) => {
    setBodyAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleTemperamentAnswerChange = (questionId, value) => {
    setTemperamentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return basicInfo.gender && basicInfo.age && basicInfo.height && basicInfo.weight;
      case 1:
        return Object.keys(bodyAnswers).length === surveyQuestions.body.length;
      case 2:
        return Object.keys(temperamentAnswers).length === surveyQuestions.temperament.length;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // 설문 완료
      onComplete({
        basicInfo,
        bodyAnswers,
        temperamentAnswers
      });
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            values={basicInfo}
            onChange={handleBasicInfoChange}
          />
        );
      case 1:
        return surveyQuestions.body.map(question => (
          <SurveyQuestion
            key={question.id}
            question={question}
            value={bodyAnswers[question.id]}
            onChange={handleBodyAnswerChange}
          />
        ));
      case 2:
        return surveyQuestions.temperament.map(question => (
          <SurveyQuestion
            key={question.id}
            question={question}
            value={temperamentAnswers[question.id]}
            onChange={handleTemperamentAnswerChange}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            이전
          </Button>
          <Button
            variant="contained"
            disabled={!isStepComplete(activeStep)}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? '완료' : '다음'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ConstitutionSurvey; 