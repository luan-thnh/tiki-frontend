import React from 'react';
import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import theme from '../../../../../theme';

const { palette } = theme;

function Input(props) {
  const { label, name, value, onChange, helperText, required = false, error, type = 'text', shrink = true } = props;

  return (
    <InputWrapper
      label={label}
      type={type}
      name={name}
      style={{ width: '100%' }}
      InputLabelProps={shrink ? { shrink: true } : {}}
      required={required}
      value={value}
      onChange={onChange}
      helperText={helperText}
      error={error}
    />
  );
}

const InputWrapper = styled(TextField)(({ error }) => ({
  width: '320px',
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: 1,
  color: palette.grey.main,

  '& .MuiInputBase-root': {
    borderRadius: '10px',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.grey.main,
  },

  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? palette.red.main : palette.primary.main,
    borderWidth: '3px',
  },
}));

export default Input;
