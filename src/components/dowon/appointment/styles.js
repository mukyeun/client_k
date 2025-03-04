import { keyframes } from '@emotion/react';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const commonStyles = {
  pageContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
  },

  title: {
    textAlign: 'center',
    color: '#1E293B',
    fontWeight: 600,
    marginBottom: '32px',
  },

  paper: {
    padding: '24px',
    marginBottom: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
  },

  button: {
    primary: {
      backgroundColor: '#2563EB',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1D4ED8',
      },
      padding: '8px 24px',
      borderRadius: '8px',
    },
    secondary: {
      color: '#475569',
      borderColor: '#CBD5E1',
      '&:hover': {
        backgroundColor: '#F1F5F9',
        borderColor: '#94A3B8',
      },
      padding: '8px 24px',
      borderRadius: '8px',
    }
  },

  inputField: {
    '& .MuiOutlinedInput-root': {
      height: '48px',
      '& fieldset': {
        borderColor: '#E2E8F0',
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4299E1',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#4A5568',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4299E1',
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#666',
      opacity: 1,
    },
  },

  select: {
    '& .MuiOutlinedInput-root': {
      height: '48px',
      '& fieldset': {
        borderColor: '#E2E8F0',
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4299E1',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#4A5568',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4299E1',
    },
  },

  datePicker: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    }
  },

  timePicker: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
    marginTop: '16px',
  },

  timeButton: {
    normal: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #CBD5E1',
      color: '#475569',
      '&:hover': {
        backgroundColor: '#F1F5F9',
        borderColor: '#94A3B8',
      }
    },
    selected: {
      backgroundColor: '#2563EB',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1D4ED8',
      }
    },
    disabled: {
      backgroundColor: '#F1F5F9',
      color: '#94A3B8',
      cursor: 'not-allowed',
    }
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 3,
  },

  '.form-input': {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: '#4299E1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
    '&::placeholder': {
      color: '#666',
    },
  },

  '.form-select': {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:focus': {
      borderColor: '#4299E1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
    '& option': {
      padding: '8px',
    },
  },
}; 