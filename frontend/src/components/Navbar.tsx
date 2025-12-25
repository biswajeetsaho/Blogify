import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Create as PenSquareIcon,
  Person as UserIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Close as XIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { logout } from '../redux/slices/authSlice.ts';
import AuthModal from './AuthModal.tsx';

type SearchType = 'blog' | 'friend';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, token } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!token && !!user;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('blog');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  const handleOpenSearchMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSearchMenu = (type?: SearchType) => {
    if (type) setSearchType(type);
    setAnchorEl(null);
  };

  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseAccountMenu();
    navigate('/');
  };

  const handleViewProfile = () => {
    handleCloseAccountMenu();
    navigate('/profile');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const searchOptions: { value: SearchType; label: string }[] = [
    { value: 'blog', label: 'Blog' },
    { value: 'friend', label: 'Friend' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
              B
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            Blogify
          </Typography>
        </Box>

        {/* Search Bar - Desktop */}
        {!isMobile && (
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: 400,
              bgcolor: 'grey.100',
              borderRadius: 10,
            }}
            elevation={0}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder={searchType === 'blog' ? 'Search blogs...' : 'Search friends...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Button
              onClick={handleOpenSearchMenu}
              endIcon={<ChevronDownIcon sx={{ transform: anchorEl ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />}
              sx={{ px: 2, textTransform: 'none', color: 'text.primary' }}
            >
              {searchType === 'blog' ? 'Blog' : 'Friend'}
            </Button>
            <IconButton type="button" sx={{ p: '10px', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }} size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleCloseSearchMenu()}>
              {searchOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleCloseSearchMenu(option.value)}
                  selected={searchType === option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Paper>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" startIcon={<PenSquareIcon />} sx={{ borderRadius: 10, textTransform: 'none' }}>
              Write
            </Button>
            {isLoggedIn ? (
              <>
                <IconButton size="small" onClick={handleOpenAccountMenu}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.contrastText', fontSize: '0.875rem' }}>
                    {user?.username?.[0]?.toUpperCase() || <UserIcon fontSize="small" />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={accountAnchorEl}
                  open={Boolean(accountAnchorEl)}
                  onClose={handleCloseAccountMenu}
                  onClick={handleCloseAccountMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem onClick={handleViewProfile}>
                    <ListItemIcon>
                      <UserIcon fontSize="small" />
                    </ListItemIcon>
                    View Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <XIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" sx={{ textTransform: 'none' }} onClick={() => openAuthModal('signin')}>
                  Login
                </Button>
                <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: 10 }} onClick={() => openAuthModal('signup')}>
                  Sign up
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Toggle */}
        {isMobile && (
          <IconButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu Drawer */}
      <Drawer anchor="top" open={isMobileMenuOpen} onClose={toggleMobileMenu} sx={{ '& .MuiDrawer-paper': { top: 64, p: 2 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Mobile Search */}
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              bgcolor: 'grey.100',
              borderRadius: 10,
            }}
            elevation={0}
          >
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={searchType}
              onChange={(e: any) => setSearchType(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '0 8px',
                outline: 'none',
                fontSize: '0.875rem',
                color: 'inherit',
                cursor: 'pointer',
              }}
            >
              <option value="blog">Blog</option>
              <option value="friend">Friend</option>
            </select>
            <IconButton type="button" sx={{ p: '10px', bgcolor: 'primary.main', color: 'white' }} size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          </Paper>

          <List>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton sx={{ borderRadius: 1, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <PenSquareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Write" />
              </ListItemButton>
            </ListItem>
            {isLoggedIn ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton sx={{ borderRadius: 1 }} onClick={handleViewProfile}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <UserIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mt: 1 }}>
                  <ListItemButton sx={{ borderRadius: 1, color: 'error.main' }} onClick={handleLogout}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <XIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton sx={{ borderRadius: 1 }} onClick={() => openAuthModal('signin')}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ mt: 1 }}>
                  <ListItemButton sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }} onClick={() => openAuthModal('signup')}>
                    <ListItemText primary="Sign up" sx={{ textAlign: 'center' }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
    </AppBar>
  );
};

export default Navbar;
