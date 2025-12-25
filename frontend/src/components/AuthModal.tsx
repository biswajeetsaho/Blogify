import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Alert,
    CircularProgress,
    Backdrop,
    Link,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { loginUser, signupUser } from '../redux/slices/authSlice.ts';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    initialMode?: 'signin' | 'signup';
}

const AuthModal = ({ open, onClose, initialMode = 'signin' }: AuthModalProps) => {
    const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // Validation State
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        setMode(initialMode);
        // Reset form when opening or switching mode
        setFormData({ username: '', email: '', password: '' });
        setErrors({ username: '', email: '', password: '' });
    }, [initialMode, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for the field being edited
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = { username: '', email: '', password: '' };
        let isValid = true;

        if (mode === 'signup' && !formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Mapping fields exactly to the requested JSON body structure
        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        if (mode === 'signin') {
            // Removing username from payload for signin
            const { email, password } = payload;
            const resultAction = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(resultAction)) {
                onClose();
            }
        } else {
            const resultAction = await dispatch(signupUser(payload));
            if (signupUser.fulfilled.match(resultAction)) {
                onClose();
            }
        }
    };

    const toggleMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setErrors({ username: '', email: '', password: '' });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            fullScreen={isMobile}
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 3,
                    p: 2,
                },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 1 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {mode === 'signup' && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            error={Boolean(errors.username)}
                            helperText={errors.username}
                            disabled={loading}
                            sx={{ mb: 1 }}
                        />
                    )}

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus={mode === 'signin'}
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        disabled={loading}
                        sx={{ mb: 1 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 4,
                            mb: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={toggleMode}
                                sx={{ fontWeight: 'bold', ml: 0.5 }}
                                type="button"
                            >
                                {mode === 'signin' ? 'Create Account' : 'Sign In'}
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
