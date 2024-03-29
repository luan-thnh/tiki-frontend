import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { initialOptions } from './config/payPalConfig';
import AppRouter from './router';
import theme from './theme';

function App() {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </PayPalScriptProvider>
  );
}

export default App;
