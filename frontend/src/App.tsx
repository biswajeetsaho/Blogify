import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress, createTheme } from '@mui/material';
import { Home, BlogDetails, Profile, Write, SearchResults, Explore, Analytics } from './pages';
import { useAppDispatch, useAppSelector } from './redux/hooks.ts';
import { getProfileUser } from './redux/slices/authSlice.ts';

function App() {
  const dispatch = useAppDispatch();
  const { token, isInitialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfileUser());
    }
  }, [dispatch, token]);

  // Create dynamic theme based on user preferences
  const theme = useMemo(() => {
    const backgroundColor = user?.themePreferences?.backgroundColor || '#ffffff';
    const fontFamily = user?.themePreferences?.fontFamily || 'Inter';
    const textColor = user?.themePreferences?.textColor || '#000000';

    return createTheme({
      palette: {
        primary: {
          main: '#223354',
        },
        secondary: {
          main: '#1976d2',
        },
        background: {
          default: backgroundColor,
          paper: backgroundColor,
        },
        text: {
          primary: textColor,
          secondary: textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
      },
      typography: {
        fontFamily: `${fontFamily}, Roboto, Arial, sans-serif`,
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
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: backgroundColor,
              color: textColor,
            },
          },
        },
      },
    });
  }, [user?.themePreferences]);

  // Wait for initialization if there's a token
  if (token && !isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/write" element={<Write />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

