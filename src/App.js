import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import AppRouter from './router';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
