import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { fetchBlogs, fetchCategories, fetchTags, fetchUserBlogs } from '../redux/slices/blogSlice.ts';
import Navbar from '../components/Navbar';
import CategorySlider from '../components/CategorySlider';
import PopularCarousel from '../components/PopularCarousel';
import FeaturedBlog from '../components/FeaturedBlog';
import BlogCard from '../components/BlogCard';
import PeopleCarousel from '../components/PeopleCarousel';
import Footer from '../components/Footer';
import type { Blog, User, Category } from '../components/types';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { blogs, userBlogs, categories, loading, error } = useAppSelector((state) => state.blogs);
  const { user, token } = useAppSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchCategories());
    dispatch(fetchTags());
    if (token) {
      dispatch(fetchUserBlogs());
    }
  }, [dispatch, token]);

  const filteredBlogs = selectedCategory
    ? blogs.filter((b: Blog) => b.categories.includes(
      categories.find((c: Category) => c._id === selectedCategory)?.name || ''
    ))
    : blogs;

  // Filter user's published blogs
  const publishedUserBlogs = userBlogs.filter(b => b.status === 'published');

  if (loading && blogs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error loading blogs: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <CategorySlider
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <PopularCarousel blogs={filteredBlogs} />
      {/* Respect user's preferred margin: px-20 on md */}
      <Container maxWidth={false} sx={{ mt: 4, px: { xs: 2, md: 20 } }}>
        {publishedUserBlogs.length > 0 && user && (
          <FeaturedBlog blogs={publishedUserBlogs} user={user as unknown as User} />
        )}

        {/* Section A: 2 Large Featured BlogCards */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0, mt: 6, mb: 6 }}>
          {filteredBlogs.slice(0, 2).map((blog: Blog) => (
            <Box key={blog._id} sx={{
              '& .MuiCard-root': {
                width: '100%',
                minHeight: 420,
                maxWidth: 520
              },
              '& .MuiCardMedia-root': {
                height: 220
              },
              flex: '0 0 50%',
              maxWidth: 580
            }}>
              <BlogCard
                blog={blog}
                author={blog.author as unknown as User}
              />
            </Box>
          ))}
        </Box>
        {/* Section B: 2 rows, 3 BlogCards each */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {filteredBlogs.slice(2, 5).map((blog: Blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                author={blog.author as unknown as User}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {filteredBlogs.slice(5, 8).map((blog: Blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                author={blog.author as unknown as User}
              />
            ))}
          </Box>
        </Box>
        {/* Explore More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 10, px: 6, textTransform: 'none', fontWeight: 700 }}
            onClick={() => navigate('/explore')}
          >
            Explore More
          </Button>
        </Box>
        {/* People You May Know Carousel */}
        <PeopleCarousel />
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
