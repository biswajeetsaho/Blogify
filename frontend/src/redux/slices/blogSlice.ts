import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Blog, Category, Tag, User, Comment } from '../../components/types';
import {
    getAllBlogs, getAllCategories, getAllTags, getCommentsByPost,
    addComment as addCommentApi, createBlog as createBlogApi, getUserBlogs,
    createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi,
    createTag as createTagApi, updateTag as updateTagApi, deleteTag as deleteTagApi,
    upvoteComment as upvoteCommentApi, downvoteComment as downvoteCommentApi,
    deleteComment as deleteCommentApi, approveComment as approveCommentApi,
    reportComment as reportCommentApi, replyToComment as replyToCommentApi,
    likeBlog as likeBlogApi,
    updateBlog as updateBlogApi,
    deleteBlog as deleteBlogApi
} from '../../api/blog';
import axios from 'axios';

interface BlogState {
    blogs: Blog[];
    userBlogs: Blog[];
    categories: Category[];
    tags: Tag[];
    comments: Comment[];
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: BlogState = {
    blogs: [],
    userBlogs: [],
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
            const response = data.parentCommentId
                ? await replyToCommentApi({ postId: data.postId, content: data.content, parentCommentId: data.parentCommentId })
                : await addCommentApi(data);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || err.message || 'Failed to add comment');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const upvoteComment = createAsyncThunk(
    'blogs/upvoteComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await upvoteCommentApi(commentId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const downvoteComment = createAsyncThunk(
    'blogs/downvoteComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await downvoteCommentApi(commentId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'blogs/deleteComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            await deleteCommentApi(commentId);
            return commentId;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const approveComment = createAsyncThunk(
    'blogs/approveComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await approveCommentApi(commentId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const reportComment = createAsyncThunk(
    'blogs/reportComment',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await reportCommentApi(commentId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);


export const createBlog = createAsyncThunk(
    'blogs/create',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await createBlogApi(formData);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || err.message || 'Failed to create blog');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchUserBlogs = createAsyncThunk(
    'blogs/fetchUserBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserBlogs();
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.message || 'Failed to fetch user blogs');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const toggleLikeBlog = createAsyncThunk(
    'blogs/toggleLike',
    async (blogId: string, { rejectWithValue }) => {
        try {
            const response = await likeBlogApi(blogId);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || err.message || 'Failed to toggle like');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/update',
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const response = await updateBlogApi(id, formData);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || err.message || 'Failed to update blog');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'blogs/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteBlogApi(id);
            return id;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                return rejectWithValue(err.response?.data?.error || err.message || 'Failed to delete blog');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);




export const createCategory = createAsyncThunk(
    'blogs/createCategory',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await createCategoryApi(name);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'blogs/updateCategory',
    async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await updateCategoryApi(id, name);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'blogs/deleteCategory',
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteCategoryApi(id);
            return id;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createTag = createAsyncThunk(
    'blogs/createTag',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await createTagApi(name);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const updateTag = createAsyncThunk(
    'blogs/updateTag',
    async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
        try {
            const response = await updateTagApi(id, name);
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const deleteTag = createAsyncThunk(
    'blogs/deleteTag',
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteTagApi(id);
            return id;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.error || err.message);
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
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c._id !== action.payload);
            })
            // Tags
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.tags.push(action.payload);
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                const index = state.tags.findIndex(t => t._id === action.payload._id);
                if (index !== -1) state.tags[index] = action.payload;
            })
            .addCase(deleteTag.fulfilled, (state, action) => {
                state.tags = state.tags.filter(t => t._id !== action.payload);
            })
            // Comments
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
                // If it's a top-level comment, increment commentsCount on the blog in state
                if (!action.payload.parentCommentId) {
                    const blogIndex = state.blogs.findIndex(b => b._id === action.payload.postId);
                    if (blogIndex !== -1) state.blogs[blogIndex].commentsCount += 1;
                }
            })
            .addCase(upvoteComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.comments[index] = action.payload;
            })
            .addCase(downvoteComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.comments[index] = action.payload;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const commentToDelete = state.comments.find(c => c._id === action.payload);
                state.comments = state.comments.filter(c => c._id !== action.payload);
                // If it was a top-level comment, decrement commentsCount
                if (commentToDelete && !commentToDelete.parentCommentId) {
                    const blogIndex = state.blogs.findIndex(b => b._id === commentToDelete.postId);
                    if (blogIndex !== -1) state.blogs[blogIndex].commentsCount -= 1;
                }
            })
            .addCase(approveComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.comments[index] = action.payload;
            })
            .addCase(reportComment.fulfilled, (state, action) => {
                const index = state.comments.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.comments[index] = action.payload;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.blogs.unshift(action.payload);
                state.userBlogs.unshift(action.payload); // Also add to userBlogs
            })
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.userBlogs = action.payload;
            })
            .addCase(toggleLikeBlog.fulfilled, (state, action) => {
                // Update the blog in both blogs and userBlogs arrays
                const blogIndex = state.blogs.findIndex(b => b._id === action.payload._id);
                if (blogIndex !== -1) {
                    state.blogs[blogIndex] = action.payload;
                }
                const userBlogIndex = state.userBlogs.findIndex(b => b._id === action.payload._id);
                if (userBlogIndex !== -1) {
                    state.userBlogs[userBlogIndex] = action.payload;
                }
                if (userBlogIndex !== -1) {
                    state.userBlogs[userBlogIndex] = action.payload;
                }
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                const index = state.blogs.findIndex(b => b._id === action.payload._id);
                if (index !== -1) state.blogs[index] = action.payload;
                const userIndex = state.userBlogs.findIndex(b => b._id === action.payload._id);
                if (userIndex !== -1) state.userBlogs[userIndex] = action.payload;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter(b => b._id !== action.payload);
                state.userBlogs = state.userBlogs.filter(b => b._id !== action.payload);
            });
    },
});

export default blogSlice.reducer;
