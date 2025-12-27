import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Stack, Chip, CardActionArea, IconButton } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Share as ShareIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleLikeBlog } from '../redux/slices/blogSlice';
import type { Blog, User } from './types';

interface BlogCardProps {
  blog: Blog;
  author: User;
}

const BlogCard = ({ blog, author }: BlogCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const image = blog.media.find((m) => m.fileType === 'image');
  const category = blog.categories?.[0] || 'General';

  // Check if current user has liked this blog
  const isLiked = user && blog.likedUsers?.includes(user._id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    if (user) {
      dispatch(toggleLikeBlog(blog._id));
    }
  };

  return (
    <Card sx={{ width: 320, minHeight: 340, display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative' }}>
          {image && (
            <CardMedia
              component="img"
              height="160"
              image={image.filePath.startsWith('/uploads') ? `http://localhost:3000${image.filePath}` : image.filePath}
              alt={blog.title}
            />
          )}
          {/* Category Badge */}
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
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {blog.title}
          </Typography>
          <Typography variant="subtitle2" color="primary" fontWeight={500} mb={1} noWrap>
            {blog.subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.5
          }}>
            {blog.content.replace(/<[^>]+>/g, '')}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} mb={1}>
            {blog.tags.slice(0, 2).map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
      <Box px={2} pb={2} display="flex" alignItems="center">
        <Avatar sx={{ width: 28, height: 28, mr: 1 }}>
          {author.username?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="body2" color="text.secondary">
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
            <Typography variant="body2">{blog.likesCount}</Typography>
          </Stack>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
};

export default BlogCard;
