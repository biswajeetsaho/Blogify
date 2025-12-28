
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Stack, Chip, CardActionArea, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Send as ShareIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { toggleLikeBlog, deleteBlog } from '../redux/slices/blogSlice.ts';
import { setSharingBlogId } from '../redux/slices/friendSlice.ts';
import type { Blog, User } from './types.ts';

interface BlogCardProps {
  blog: Blog;
  author: User;
}

const BlogCard = ({ blog, author }: BlogCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const image = blog.media.find((m) => m.fileType === 'image');
  const category = blog.categories?.[0] || 'General';

  // Check if current user has liked this blog
  const isLiked = user && blog.likedUsers?.includes(user._id);
  const isOwner = user && user._id === author._id;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    if (user) {
      dispatch(toggleLikeBlog(blog._id));
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    navigate('/write', { state: { editBlog: blog } });
  };

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    if (window.confirm('Are you sure you want to delete this blog?')) {
      await dispatch(deleteBlog(blog._id));
    }
  };

  const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(setSharingBlogId(blog._id));
  };

  // Helper to strip HTML and decode entities
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <Card sx={{ width: 320, minHeight: 400, display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <Box sx={{ position: 'relative' }}>
        {image && (
          <CardActionArea onClick={() => navigate(`/ blog / ${ blog._id } `)}>
            <CardMedia
              component="img"
              height="180"
              image={image.filePath.startsWith('/uploads') ? `http://localhost:3000${image.filePath}` : image.filePath}
alt = { blog.title }
  />
          </CardActionArea >
        )}
{/* Category Badge */ }
<Chip
  label={category}
  size="small"
  sx={{
    position: 'absolute',
    bottom: 12,
    left: 12,
    bgcolor: 'rgba(255, 255, 255, 0.95)',
    fontWeight: 700,
    backdropFilter: 'blur(4px)',
    color: 'primary.main',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    px: 1
  }}
/>
{
  isOwner && (
    <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: '50%' }}>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)} // Click away closes menu
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 2,
          sx: { minWidth: 120 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
      </Box >
  <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom noWrap title={blog.title}>
        {blog.title}
      </Typography>
      <Typography variant="subtitle2" color="primary" fontWeight={500} mb={1} noWrap>
        {blog.subtitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 1.6
      }}>
        {stripHtml(blog.content)}
      </Typography>
      <Stack direction="row" spacing={1} mt={2} mb={1}>
        {blog.tags.slice(0, 2).map((tag) => (
          <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
        ))}
      </Stack>
    </CardContent>
  </CardActionArea>

{/* Footer Area */ }
<Box px={2} pb={2} display="flex" alignItems="center">
  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.light' }}>
    {author.username?.[0]?.toUpperCase()}
  </Avatar>
  <Typography variant="body2" color="text.secondary" fontWeight={500}>
    {author.username}
  </Typography>
  <Box flexGrow={1} />
  <Stack direction="row" spacing={1} alignItems="center">
    <Stack direction="row" spacing={0.5} alignItems="center">
      <IconButton
        size="small"
        onClick={handleLikeClick}
        disabled={!user}
        sx={{
          color: isLiked ? 'error.main' : 'text.secondary',
          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' }
        }}
      >
        {isLiked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
      <Typography variant="caption" color="text.secondary">{blog.likesCount}</Typography>
    </Stack>
    <IconButton size="small" color="primary" onClick={handleShare} title="Share">
      <ShareIcon fontSize="small" />
    </IconButton>
  </Stack>
</Box>
    </Card >
  );
};

export default BlogCard;
