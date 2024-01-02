import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Stack } from '@mui/material';

export default function Loading(props) {
  const { toggleBgColor } = props;
  return (
    <Stack
      bgcolor={toggleBgColor ? '#fff' : 'rgba(0,0,0,0.5)'}
      maxHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'fixed',
        inset: '0',
        zIndex: '9999',
      }}
    >
      <CircularProgress />
    </Stack>
  );
}
