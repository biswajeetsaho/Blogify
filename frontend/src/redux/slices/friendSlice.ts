import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    _id: string;
    username: string;
    email: string;
}

export interface Message {
    _id: string;
    sender: string;
    recipient: string;
    content: string;
    blog?: { _id: string; title: string };
    createdAt: string;
}

interface FriendState {
    friends: User[];
    recommendations: User[];
    sentRequests: User[];
    receivedRequests: User[];
    messages: Message[];
    sharingBlogId: string | null; // ID of blog being shared (if any)
    loading: boolean;
    error: string | null;
}

const initialState: FriendState = {
    friends: [],
    recommendations: [],
    sentRequests: [],
    receivedRequests: [],
    messages: [],
    sharingBlogId: null,
    loading: false,
    error: null,
};

const API_URL = 'http://localhost:3000/api/v1/friends';
const MESSAGE_URL = 'http://localhost:3000/api/v1/messages';

// Get token from auth state helper (if needed) or just trust axios interceptor if available.
// Assuming we pass token in headers manually or via interceptor. 
// For this project, usually we get token from store or localStorage.
const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const fetchRecommendations = createAsyncThunk(
    'friends/fetchRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/recommendations`, getConfig());
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch recommendations');
        }
    }
);

export const fetchFriends = createAsyncThunk(
    'friends/fetchFriends',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/list`, getConfig());
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch friends');
        }
    }
);

export const fetchRequests = createAsyncThunk(
    'friends/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/requests`, getConfig());
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch requests');
        }
    }
);

export const sendFriendRequest = createAsyncThunk(
    'friends/sendRequest',
    async (recipientId: string, { rejectWithValue }) => {
        try {
            await axios.post(`${API_URL}/request/${recipientId}`, {}, getConfig());
            return recipientId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to send request');
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    'friends/acceptRequest',
    async (requesterId: string, { rejectWithValue }) => {
        try {
            await axios.post(`${API_URL}/accept/${requesterId}`, {}, getConfig());
            return requesterId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to accept request');
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    'friends/rejectRequest',
    async (targetId: string, { rejectWithValue }) => {
        try {
            await axios.post(`${API_URL}/reject/${targetId}`, {}, getConfig());
            return targetId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to reject request');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'messages/fetch',
    async (friendId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${MESSAGE_URL}/${friendId}`, getConfig());
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch messages');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/send',
    async (payload: { recipientId: string; blogId?: string; content?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${MESSAGE_URL}/send`, payload, getConfig());
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to send message');
        }
    }
);

const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setSharingBlogId: (state, action) => {
            state.sharingBlogId = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Recommendations
            .addCase(fetchRecommendations.pending, (state) => { state.loading = true; })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                state.recommendations = action.payload;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Friends List
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.friends = action.payload;
            })
            // Requests
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.sentRequests = action.payload.sent;
                state.receivedRequests = action.payload.received;
            })
            // Send Request
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                const recipientId = action.payload;
                // Find user in recommendations
                const user = state.recommendations.find(u => u._id === recipientId);

                if (user) {
                    // Optimistically add to sentRequests so it shows as 'Cancel Request'
                    state.sentRequests.push(user);
                    // Remove from recommendations
                    state.recommendations = state.recommendations.filter(u => u._id !== recipientId);
                }
            })
            // Accept Request
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                const requesterId = action.payload;
                // Find in received requests
                const requester = state.receivedRequests.find(u => u._id === requesterId);
                if (requester) {
                    state.friends.push(requester);
                    state.receivedRequests = state.receivedRequests.filter(u => u._id !== requesterId);
                }
            })
            // Reject Request or Cancel Request or Unfriend
            .addCase(rejectFriendRequest.fulfilled, (state, action) => {
                const targetId = action.payload;

                // Try to find the user in sentRequests (Cancel)
                let user = state.sentRequests.find(u => u._id === targetId);

                // If not found, try receivedRequests (Reject) - though usually we don't recommend immediately after rejecting?
                // But generally if relationship is gone, they are a candidate for recommendation.
                if (!user) user = state.receivedRequests.find(u => u._id === targetId);

                // If not found, try friends (Unfriend)
                if (!user) user = state.friends.find(u => u._id === targetId);

                // Remove from all lists
                state.sentRequests = state.sentRequests.filter(u => u._id !== targetId);
                state.receivedRequests = state.receivedRequests.filter(u => u._id !== targetId);
                state.friends = state.friends.filter(u => u._id !== targetId);

                // Add back to recommendations if we found the user object
                if (user) {
                    // Avoid duplicates just in case
                    if (!state.recommendations.find(r => r._id === user?._id)) {
                        // If it was a sent request (cancel), maybe add back to recommendations? 
                        // Hard to know without fetching.
                        state.recommendations.push(user);
                    }
                }
            })
            // Message Thunks
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload);
            });
    },
});

export const { setSharingBlogId, clearMessages } = friendSlice.actions;

export default friendSlice.reducer;
