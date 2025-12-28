import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Link } from '@mui/material';
import { Send as SendIcon, ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { sendMessage } from '../redux/slices/friendSlice';
import { Link as RouterLink } from 'react-router-dom';

interface ChatInterfaceProps {
    friendId: string;
    friendName: string;
    onBack: () => void;
}

const ChatInterface = ({ friendId, friendName, onBack }: ChatInterfaceProps) => {
    const dispatch = useAppDispatch();
    const { messages } = useAppSelector((state) => state.friends);
    const { user } = useAppSelector((state) => state.auth);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        dispatch(sendMessage({ recipientId: friendId, content: inputText }));
        setInputText('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <IconButton onClick={onBack} size="small" sx={{ mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={700}>
                    {friendName}
                </Typography>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((msg) => {
                    const isMe = msg.sender === user?._id;
                    return (
                        <Box key={msg._id} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <Paper sx={{
                                p: 1.5,
                                bgcolor: isMe ? 'primary.main' : 'grey.200',
                                color: isMe ? 'white' : 'text.primary',
                                borderRadius: 2
                            }}>
                                {msg.blog && (
                                    <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                                        <Typography variant="caption" display="block" fontWeight={600}>Shared a Blog:</Typography>
                                        <Link component={RouterLink} to={`/blog/${msg.blog._id}`} color="inherit" underline="hover">
                                            {msg.blog.title}
                                        </Link>
                                    </Box>
                                )}
                                {msg.content && <Typography variant="body2">{msg.content}</Typography>}
                            </Paper>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <IconButton color="primary" onClick={handleSend} disabled={!inputText.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatInterface;
