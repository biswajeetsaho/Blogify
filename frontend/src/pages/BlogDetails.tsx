import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Divider, Button, CardMedia, CircularProgress, Stack, Chip, TextField } from '@mui/material';
import { ArrowBack as BackIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { fetchComments, addComment } from '../redux/slices/blogSlice.ts';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { User, Comment } from '../components/types';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { blogs, comments, loading } = useAppSelector((state) => state.blogs);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchComments(id));
        }
    }, [dispatch, id]);

    const handleMainCommentSubmit = () => {
        if (!newComment.trim() || !id) return;
        dispatch(addComment({ postId: id, content: newComment }));
        setNewComment('');
    };

    const blog = blogs.find((b) => b._id === id);
    const author = (blog?.author as unknown as User) || { username: 'Unknown Author' };
    const image = blog?.media.find((m) => m.fileType === 'image');

    if (loading && !blog) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!blog) {
        return (
            <Container sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h4">Blog Not Found</Typography>
                <Button onClick={() => navigate('/')} startIcon={<BackIcon />} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Box>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Button
                    onClick={() => navigate('/')}
                    startIcon={<BackIcon />}
                    sx={{ mb: 4, textTransform: 'none', color: 'text.secondary' }}
                >
                    Back to Feed
                </Button>

                <Typography variant="h3" fontWeight={800} gutterBottom>
                    {blog.title}
                </Typography>

                <Typography variant="h5" color="primary" fontWeight={600} mb={3}>
                    {blog.subtitle}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                    <Avatar src="" sx={{ width: 48, height: 48 }} />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                            {author?.username}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                            <TimeIcon fontSize="inherit" />
                            <Typography variant="caption">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                {image && (
                    <CardMedia
                        component="img"
                        image={image.filePath}
                        alt={blog.title}
                        sx={{ borderRadius: 4, width: '100%', maxHeight: 500, objectFit: 'cover', mb: 6 }}
                    />
                )}

                <Box sx={{ lineBreak: 'anywhere', '& p': { mb: 2, fontSize: '1.2rem', lineHeight: 1.8 } }}>
                    <Typography variant="body1" component="div">
                        {blog.content}
                    </Typography>
                </Box>

                <Box sx={{ mt: 6, mb: 4 }}>
                    <Stack direction="row" spacing={1}>
                        {blog.tags.map((tag) => (
                            <Chip key={tag} label={`#${tag}`} variant="outlined" />
                        ))}
                    </Stack>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* Comments Section */}
                <Typography variant="h5" fontWeight={700} mb={4}>
                    Comments ({comments.length})
                </Typography>

                {/* Root Comment Input */}
                <Box sx={{ mb: 6 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        sx={{ mb: 2, bgcolor: 'background.paper' }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleMainCommentSubmit}
                        disabled={!newComment.trim()}
                        sx={{ borderRadius: 10, px: 4, textTransform: 'none' }}
                    >
                        Respond
                    </Button>
                </Box>

                <Stack spacing={4}>
                    {comments.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No comments yet. Be the first to comment!
                        </Typography>
                    ) : (
                        comments.filter(c => !c.parentCommentId).map((comment: Comment) => (
                            <CommentThread
                                key={comment._id}
                                comment={comment}
                                replies={comments.filter(r => r.parentCommentId === comment._id)}
                                isRoot={true}
                            />
                        ))
                    )}
                </Stack>
            </Container>
            <Footer />
        </Box>
    );
};

// --- Comment Thread Component ---
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

const CommentThread = ({ comment, replies, isRoot = false }: { comment: Comment; replies: Comment[]; isRoot?: boolean }) => {
    const dispatch = useAppDispatch();
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const commenter = comment.userId as unknown as User;

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;

        // Flattening logic: 
        // If this is a root comment, use its ID.
        // If this is a reply, use its parentCommentId (which points to the root).
        const parentIdToUse = isRoot ? comment._id : comment.parentCommentId;

        dispatch(addComment({
            postId: comment.postId,
            content: replyText,
            parentCommentId: parentIdToUse || undefined
        }));

        setReplyText('');
        setIsReplying(false);
        setShowReplies(true);
    };

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {commenter.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box flexGrow={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" fontWeight={700}>
                            {commenter.username || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {comment.content}
                    </Typography>

                    {/* Actions Row */}
                    <Stack direction="row" spacing={3} mt={1} alignItems="center">
                        <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            <ModeCommentOutlinedIcon sx={{ fontSize: 18 }} />
                            {replies.length > 0 && (
                                <Typography variant="caption" fontWeight={500}>
                                    {showReplies ? 'Hide replies' : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
                                </Typography>
                            )}
                        </Stack>

                        <Typography
                            variant="caption"
                            fontWeight={500}
                            sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            Reply
                        </Typography>
                    </Stack>

                    {/* Reply Input */}
                    {isReplying && (
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <TextField
                                fullWidth
                                multiline
                                size="small"
                                placeholder={`Reply to ${commenter.username}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                sx={{ bgcolor: 'white' }}
                                autoFocus
                            />
                            <Stack direction="row" spacing={1} mt={1} justifyContent="flex-end">
                                <Button size="small" color="inherit" onClick={() => setIsReplying(false)}>Cancel</Button>
                                <Button size="small" variant="contained" onClick={handleReplySubmit} disabled={!replyText.trim()}>Reply</Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Stack>

            {/* Render Replies (Flattened under Root) */}
            {isRoot && showReplies && replies.length > 0 && (
                <Stack spacing={3} sx={{ mt: 2, ml: 6, pl: 2, borderLeft: '1px solid', borderColor: 'grey.200' }}>
                    {replies.map((reply) => (
                        <CommentThread
                            key={reply._id}
                            comment={reply}
                            replies={[]}
                            isRoot={false}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default BlogDetails;
