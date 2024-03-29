import { green, grey, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';

const shadows = createShadows();
const typography = createTypography();

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a68ff',
    },
    red: {
      main: red[400],
    },
    white: {
      main: grey[100],
    },
    gray: {
      main: grey[500],
    },
    grey: {
      main: grey[300],
    },
    green: {
      main: green[500],
    },
    black: {
      main: grey[800],
    },
  },
  shadows,
  typography,
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          cursor: 'pointer',
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained', color: 'black' },
          style: {
            boxShadow: 'none',
            backgroundColor: 'transparent',

            '&:hover': {
              boxShadow: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'red' },
          style: {
            color: 'white',

            '&:hover': {
              backgroundColor: red[700],
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '9px 18px',
          textTransform: 'capitalize',
        },
      },
    },
  },
});

export default theme;
