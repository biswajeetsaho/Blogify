import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BlogCard from './BlogCard';
import type { Blog, User } from './types';

interface FeaturedBlogProps {
  blogs: Blog[];
  user: User;
}

const FeaturedBlog = ({ blogs, user }: FeaturedBlogProps) => {
  const navigate = useNavigate();

  // Show only top 3 blogs
  const recentBlogs = blogs.slice(0, 3);

  return (
    <Box sx={{ mb: 8 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Your Recent Stories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quickly access your latest published work.
          </Typography>
        </Box>
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/profile')}
          sx={{ fontWeight: 700, textTransform: 'none' }}
        >
          See all your stories
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          justifyContent: 'center'
        }}
      >
        {recentBlogs.map((blog) => (
          <Box key={blog._id} sx={{ flex: 1 }}>
            <BlogCard
              blog={blog}
              author={user}
            />
          </Box>
        ))}
        {/* Placeholder for empty spots if less than 3 blogs */}
        {recentBlogs.length < 3 && [...Array(3 - recentBlogs.length)].map((_, i) => (
          <Box key={`placeholder-${i}`} sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedBlog;