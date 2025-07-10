import React from 'react';
import { Alert, Box } from '@mui/material';

const ErrorAlert = ({ message }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error" variant="filled">
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorAlert; 