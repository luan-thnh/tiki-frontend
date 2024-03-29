import { Alert, Snackbar } from '@mui/material';
import React from 'react';

function AlertMessage(props) {
  const { open, message, type = 'success', handleClose } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={700}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      key={'top' + 'right'}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertMessage;
