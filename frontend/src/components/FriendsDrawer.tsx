import { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import { Close as CloseIcon, Message as MessageIcon, Send as SendIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchFriends, fetchMessages, sendMessage, setSharingBlogId, clearMessages } from '../redux/slices/friendSlice';
import ChatInterface from './ChatInterface';

interface FriendsDrawerProps {
    open: boolean;
    onClose: () => void;
}

const FriendsDrawer = ({ open, onClose }: FriendsDrawerProps) => {
    const dispatch = useAppDispatch();
    const { friends, loading, sharingBlogId } = useAppSelector((state) => state.friends);
    const { user } = useAppSelector((state) => state.auth);

    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

    // Fetch friends when drawer opens
    useEffect(() => {
        if (open && user) {
            dispatch(fetchFriends());
        }
    }, [open, dispatch, user]);

    // Cleanup when drawer closes
    useEffect(() => {
        if (!open) {
            setSelectedFriendId(null);
            dispatch(clearMessages());
            // Only clear sharing ID if we are actually closing.
            // We rely on the fact that this runs when 'open' changes to false.
            if (sharingBlogId) dispatch(setSharingBlogId(null));
        }
    }, [open, dispatch]); // Removed sharingBlogId from deps to avoid race condition

    const handleFriendClick = (friendId: string) => {
        if (sharingBlogId) {
            // Share Mode: Send blog
            dispatch(sendMessage({ recipientId: friendId, blogId: sharingBlogId }));
            alert("Blog shared successfully!"); // Simple feedback
            dispatch(setSharingBlogId(null)); // Clear sharing state
            onClose(); // Close drawer
        } else {
            // Chat Mode: Open Chat
            dispatch(fetchMessages(friendId));
            setSelectedFriendId(friendId);
        }
    };

    const selectedFriend = friends.find(f => f._id === selectedFriendId);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 340 }
            }}
        >
            {selectedFriendId && selectedFriend ? (
                <ChatInterface
                    friendId={selectedFriendId}
                    friendName={selectedFriend.username}
                    onBack={() => {
                        setSelectedFriendId(null);
                        dispatch(clearMessages());
                    }}
                />
            ) : (
                <Box sx={{ p: 2, height: '100%' }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={700}>
                            {sharingBlogId ? 'Select to Share' : `My Friends (${friends.length})`}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                        {friends.map((friend) => (
                            <ListItem
                                key={friend._id}
                                disablePadding
                                sx={{ mb: 2 }}
                                secondaryAction={
                                    !sharingBlogId && (
                                        <IconButton edge="end" color="primary" onClick={() => handleFriendClick(friend._id)}>
                                            <MessageIcon />
                                        </IconButton>
                                    )
                                }
                            >
                                {/* If sharing, the whole item is clickable */}
                                <ListItemButton
                                    onClick={() => handleFriendClick(friend._id)}
                                    disabled={false} // maybe disable if already shared?
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                            {friend.username?.[0]?.toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={friend.username}
                                        secondary={sharingBlogId ? "Click to send" : friend.email}
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    />
                                    {sharingBlogId && <SendIcon color="action" fontSize="small" />}
                                </ListItemButton>
                            </ListItem>
                        ))}
                        {friends.length === 0 && !loading && (
                            <Box textAlign="center" mt={4} color="text.secondary">
                                <Typography>No friends yet.</Typography>
                                <Typography variant="caption">Find people on the home page!</Typography>
                            </Box>
                        )}
                    </List>
                </Box>
            )}
        </Drawer>
    );
};

export default FriendsDrawer;
