import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#223354', // Slate/Navy
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#223354',
        },
      },
    },
  },
});

export default theme;
