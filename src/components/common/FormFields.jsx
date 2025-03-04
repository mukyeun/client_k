import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  styled,
} from '@mui/material';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

export const InputField = ({
  label,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  required = false,
  fullWidth = true,
  ...props
}) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    type={type}
    required={required}
    fullWidth={fullWidth}
    variant="outlined"
    sx={{
      mb: 2,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.paper',
      },
    }}
    {...props}
  />
);

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required = false,
  ...props
}) => (
  <StyledFormControl error={error} required={required}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={onChange}
      label={label}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </StyledFormControl>
);

export const FormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
})); 