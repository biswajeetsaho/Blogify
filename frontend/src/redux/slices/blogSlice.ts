import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Blog, Category, Tag, User, Comment } from '../../components/types';
import { getAllBlogs, getAllCategories, getAllTags, getCommentsByPost, addComment as addCommentApi } from '../../api/blog';
import axios from 'axios';

interface BlogState {
    blogs: Blog[];
    categories: Category[];
    tags: Tag[];
    comments: Comment[];
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: BlogState = {
    blogs: [],
    categories: [],
    tags: [],
    comments: [],
    users: [],
    loading: false,
    error: null,
};

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllBlogs();
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to fetch blogs');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'blogs/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllCategories();
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to fetch categories');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchTags = createAsyncThunk(
    'blogs/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllTags();
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to fetch tags');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchComments = createAsyncThunk(
    'blogs/fetchComments',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await getCommentsByPost(postId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to fetch comments');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const addComment = createAsyncThunk(
    'blogs/addComment',
    async (data: { postId: string; content: string; parentCommentId?: string }, { rejectWithValue }) => {
        try {
            const response = await addCommentApi(data);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to add comment');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Blogs
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Tags
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            // Comments
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            });
    },
});

export default blogSlice.reducer;
