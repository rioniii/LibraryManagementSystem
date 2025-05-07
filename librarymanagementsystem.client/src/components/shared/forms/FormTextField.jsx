import React from 'react';
import { TextField } from '@mui/material';

const FormTextField = ({ 
  name, 
  label, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  fullWidth = true,
  multiline = false,
  rows = 1,
  autoComplete,
  sx = {},
  ...props 
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      multiline={multiline}
      rows={rows}
      autoComplete={autoComplete}
      sx={{ 
        mb: 2,
        ...sx
      }}
      {...props}
    />
  );
};

export default FormTextField; 