import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme/theme';
import { Home, BlogDetails, Profile } from './pages';
import { useAppDispatch, useAppSelector } from './redux/hooks.ts';
import { getProfileUser } from './redux/slices/authSlice.ts';

function App() {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getProfileUser());
    }
  }, [dispatch, token]);

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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
