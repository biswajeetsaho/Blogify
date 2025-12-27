import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginPayload, SignupPayload } from '../../api/auth';
import { login, signup, getProfile } from '../../api/auth';
import axios from 'axios';
import type { User } from '../../components/types';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isInitialized: false,
};

export const getProfileUser = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getProfile();
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || 'Access denied');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await login(credentials);
            return response.data;
        } catch (err: unknown) {
            console.log(err);
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Login failed');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: SignupPayload, { rejectWithValue }) => {
        try {
            const response = await signup(userData);
            return response.data;
        } catch (err: unknown) {
            console.log(err);
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Signup failed');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateUserTheme = createAsyncThunk(
    'auth/updateTheme',
    async (themeData: { backgroundColor: string; fontFamily: string }, { rejectWithValue }) => {
        try {
            const { updateUserTheme: updateThemeAPI } = await import('../../api/user');
            const response = await updateThemeAPI(themeData);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || 'Failed to update theme');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getProfileUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfileUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isInitialized = true;
            })
            .addCase(getProfileUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
            })
            .addCase(updateUserTheme.fulfilled, (state, action) => {
                // Update user with new theme preferences
                if (state.user) {
                    state.user = action.payload;
                }
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
