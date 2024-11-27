import React from 'react';
import { FormControl, Typography, Input, FormHelperText } from '@mui/material';

function FileInput({ label, type, error, onChange }) {
  return (
    <FormControl fullWidth error={!!error} sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Input
        type="file"
        inputProps={{ accept: `.${type}` }}
        onChange={onChange}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}

export default FileInput;