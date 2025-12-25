import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice.ts';
import authReducer from './slices/authSlice.ts';

export const store = configureStore({
    reducer: {
        blogs: blogReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
