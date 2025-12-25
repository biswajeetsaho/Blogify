import { useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, Card, CardMedia, CardContent, Avatar, CardActionArea } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Blog, User } from './types';

interface PopularCarouselProps {
  blogs: Blog[];
}

const PopularCarousel = ({ blogs }: PopularCarouselProps) => {
  const navigate = useNavigate();
  // Sort blogs by likesCount descending
  const sorted = [...blogs].sort((a, b) => b.likesCount - a.likesCount);
  return (
    <Box sx={{ px: 2, py: 3, bgcolor: 'background.paper', overflowX: 'auto' }}>
      <Typography variant="h5" fontWeight={600} mb={2} color="primary">
        Popular Blogs
      </Typography>
      <Stack direction="row" spacing={2}>
        {sorted.slice(0, 8).map((blog) => {
          const author = blog.author as unknown as User;
          const image = blog.media.find((m) => m.fileType === 'image');
          return (
            <Card key={blog._id} sx={{ minWidth: 260, maxWidth: 260, transition: '0.3s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardActionArea onClick={() => navigate(`/blog/${blog._id}`)}>
                {image && (
                  <CardMedia
                    component="img"
                    height="120"
                    image={image.filePath}
                    alt={blog.title}
                  />
                )}
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {blog.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {blog.subtitle}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {author?.username || 'Unknown'}
                    </Typography>
                    <Box flexGrow={1} />
                    <FavoriteIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{blog.likesCount}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PopularCarousel;
