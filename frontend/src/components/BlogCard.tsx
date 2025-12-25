import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Stack, Chip, CardActionArea } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Blog, User } from './types';

interface BlogCardProps {
  blog: Blog;
  author: User;
}

const BlogCard = ({ blog, author }: BlogCardProps) => {
  const navigate = useNavigate();
  const image = blog.media.find((m) => m.fileType === 'image');

  return (
    <Card sx={{ width: 320, minHeight: 340, display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {image && (
          <CardMedia
            component="img"
            height="160"
            image={image.filePath}
            alt={blog.title}
          />
        )}
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
            {blog.content}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} mb={1}>
            {blog.tags.slice(0, 2).map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
      <Box px={2} pb={2} display="flex" alignItems="center">
        <Avatar sx={{ width: 28, height: 28, mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {author.username}
        </Typography>
        <Box flexGrow={1} />
        <FavoriteIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
        <Typography variant="body2">{blog.likesCount}</Typography>
      </Box>
    </Card>
  );
};

export default BlogCard;
