import { useNavigate } from 'react-router-dom';
import { Box, Typography, CardMedia, Avatar, ButtonBase } from '@mui/material';
import type { Blog, User } from './types';

interface FeaturedBlogProps {
  blog: Blog;
  author: User;
}

const FeaturedBlog = ({ blog, author }: FeaturedBlogProps) => {
  const navigate = useNavigate();
  const image = blog.media.find((m) => m.fileType === 'image');
  return (
    <ButtonBase
      onClick={() => navigate(`/blog/${blog._id}`)}
      sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 3, overflow: 'hidden' }}
    >
      <Box sx={{ my: 4, p: 3, bgcolor: 'grey.100', borderRadius: 3, transition: '0.3s', '&:hover': { bgcolor: 'grey.200' } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {blog.title}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight={600} mb={1}>
              {blog.subtitle}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
              {blog.content.slice(0, 150)}...
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                {author.username}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            {image && (
              <CardMedia
                component="img"
                image={image.filePath}
                alt={blog.title}
                sx={{ borderRadius: 2, width: '100%', maxHeight: 320, objectFit: 'cover' }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default FeaturedBlog;