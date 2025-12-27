import { useParams, useNavigate } from 'react-router-dom';
import { trackBlogView } from '../api/analytics';
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Divider, Button, CardMedia, CircularProgress, Stack, Chip, TextField, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import {
    ArrowBack as BackIcon,
    AccessTime as TimeIcon,
    ThumbUpOutlined as UpvoteIcon,
    ThumbUp as UpvoteFilledIcon,
    ThumbDownOutlined as DownvoteIcon,
    ThumbDown as DownvoteFilledIcon,
    DeleteOutline as DeleteIcon,
    FlagOutlined as ReportIcon,
    CheckCircleOutline as ApproveIcon,
    MoreVert as MoreIcon,
    ModeCommentOutlined as ModeCommentOutlinedIcon
} from '@mui/icons-material';
import {
    fetchComments, addComment, upvoteComment, downvoteComment,
    deleteComment, approveComment, reportComment
} from '../redux/slices/blogSlice.ts';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal.tsx';
import type { User, Comment, Blog } from '../components/types';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { blogs, comments, loading } = useAppSelector((state) => state.blogs);
    const { user, token } = useAppSelector((state) => state.auth);
    const isLoggedIn = !!token && !!user;

    const [newComment, setNewComment] = useState('');
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchComments(id));
            trackBlogView(id).catch(console.error);
        }
    }, [dispatch, id]);

    const handleMainCommentSubmit = () => {
        if (!isLoggedIn) {
            setAuthModalOpen(true);
            return;
        }
        if (!newComment.trim() || !id) return;
        dispatch(addComment({ postId: id, content: newComment }));
        setNewComment('');
    };

    const blog = blogs.find((b) => b._id === id) as Blog | undefined;
    const author = (typeof blog?.author === 'string' ? { username: 'Unknown Author' } : (blog?.author as unknown as User)) || { username: 'Unknown Author' };
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
                    <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>
                        {author?.username?.[0]?.toUpperCase()}
                    </Avatar>
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
                        image={image.filePath.startsWith('/uploads') ? `http://localhost:3000${image.filePath}` : image.filePath}
                        alt={blog.title}
                        sx={{ borderRadius: 4, width: '100%', maxHeight: 500, objectFit: 'cover', mb: 6 }}
                    />
                )}

                <Box sx={{ lineBreak: 'anywhere', '& p': { mb: 2, fontSize: '1.2rem', lineHeight: 1.8 } }}>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </Box>

                <Box sx={{ mt: 6, mb: 4 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {blog.tags.map((tag) => (
                            <Chip key={tag} label={`#${tag}`} variant="outlined" sx={{ mb: 1 }} />
                        ))}
                    </Stack>
                </Box>

                <Divider sx={{ my: 6 }} />

                {/* Comments Section */}
                <Typography variant="h5" fontWeight={700} mb={4}>
                    Comments ({blog.commentsCount || 0})
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
                        onClick={() => { if (!isLoggedIn) setAuthModalOpen(true); }}
                        sx={{ mb: 2, bgcolor: 'background.paper' }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleMainCommentSubmit}
                        disabled={!newComment.trim() && isLoggedIn}
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
                                blogAuthorId={(blog.author as unknown as User)?._id || (blog.author as string)}
                                onAuthRequired={() => setAuthModalOpen(true)}
                            />
                        ))
                    )}
                </Stack>
            </Container>

            <AuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode="signin"
            />
            <Footer />
        </Box>
    );
};

// --- Comment Thread Component ---

interface CommentThreadProps {
    comment: Comment;
    replies: Comment[];
    isRoot?: boolean;
    blogAuthorId: string;
    onAuthRequired: () => void;
}

const CommentThread = ({ comment, replies, isRoot = false, blogAuthorId, onAuthRequired }: CommentThreadProps) => {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector((state) => state.auth);
    const isLoggedIn = !!token && !!user;

    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const commenter = (typeof comment.author === 'string' ? { username: 'Unknown User' } : (comment.author || { username: 'Unknown User' })) as User;
    const isBlogOwner = isLoggedIn && user?._id === blogAuthorId;
    const isCommentAuthor = isLoggedIn && user?._id === (typeof comment.author === 'string' ? comment.author : comment.author?._id);

    const handleReplySubmit = () => {
        if (!replyText.trim()) return;
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

    const handleUpvote = () => {
        if (!isLoggedIn) return onAuthRequired();
        if (isCommentAuthor) return;
        dispatch(upvoteComment(comment._id));
    };

    const handleDownvote = () => {
        if (!isLoggedIn) return onAuthRequired();
        if (isCommentAuthor) return;
        dispatch(downvoteComment(comment._id));
    };

    const handleDelete = () => {
        dispatch(deleteComment(comment._id));
        setAnchorEl(null);
    };

    const handleReport = () => {
        dispatch(reportComment(comment._id));
        setAnchorEl(null);
    };

    const handleApprove = () => {
        dispatch(approveComment(comment._id));
        setAnchorEl(null);
    };

    const hasUpvoted = isLoggedIn && comment.likes?.includes(user?._id || '');
    const hasDownvoted = isLoggedIn && comment.dislikes?.includes(user?._id || '');

    return (
        <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {commenter.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box flexGrow={1}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" fontWeight={700}>
                                {commenter.username || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </Typography>
                            {isBlogOwner && <Chip label="Author" size="small" color="primary" variant="outlined" sx={{ height: 16, fontSize: '0.65rem' }} />}
                        </Stack>

                        <Box>
                            {(isBlogOwner || isCommentAuthor) && (
                                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                                    <MoreIcon fontSize="small" />
                                </IconButton>
                            )}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                {(isBlogOwner || isCommentAuthor) && (
                                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                                    </MenuItem>
                                )}
                                {!comment.isApproved && isBlogOwner && (
                                    <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
                                        <ApproveIcon fontSize="small" sx={{ mr: 1 }} /> Approve
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleReport}>
                                    <ReportIcon fontSize="small" sx={{ mr: 1 }} /> Report
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Stack>

                    <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {comment.content}
                    </Typography>

                    {/* Actions Row */}
                    <Stack direction="row" spacing={3} mt={1} alignItems="center">
                        {/* Voting */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {/* Upvote */}
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Tooltip title={isCommentAuthor ? "You cannot vote on your own comment" : "Upvote"}>
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={handleUpvote}
                                            disabled={isCommentAuthor}
                                            color={hasUpvoted ? "primary" : "default"}
                                        >
                                            {hasUpvoted ? <UpvoteFilledIcon fontSize="small" /> : <UpvoteIcon fontSize="small" />}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Typography variant="caption" fontWeight={700}>
                                    {comment.likes?.length || 0}
                                </Typography>
                            </Stack>

                            {/* Downvote */}
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Tooltip title={isCommentAuthor ? "You cannot vote on your own comment" : "Downvote"}>
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={handleDownvote}
                                            disabled={isCommentAuthor}
                                            color={hasDownvoted ? "error" : "default"}
                                        >
                                            {hasDownvoted ? <DownvoteFilledIcon fontSize="small" /> : <DownvoteIcon fontSize="small" />}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Typography variant="caption" fontWeight={700}>
                                    {comment.dislikes?.length || 0}
                                </Typography>
                            </Stack>
                        </Stack>

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
                            onClick={() => {
                                if (!isLoggedIn) return onAuthRequired();
                                setIsReplying(!isReplying);
                            }}
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
                            blogAuthorId={blogAuthorId}
                            onAuthRequired={onAuthRequired}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default BlogDetails;
