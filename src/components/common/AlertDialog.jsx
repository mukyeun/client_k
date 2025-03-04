import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const AlertDialog = ({
  open,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  severity = 'info' // 'info', 'warning', 'error'
}) => {
  const getColor = () => {
    switch (severity) {
      case 'warning':
        return '#ED6C02';
      case 'error':
        return '#D32F2F';
      default:
        return '#2563EB';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ color: getColor() }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          sx={{ 
            color: 'white',
            backgroundColor: getColor(),
            '&:hover': {
              backgroundColor: severity === 'error' ? '#B22222' : '#1D4ED8'
            }
          }} 
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog; 