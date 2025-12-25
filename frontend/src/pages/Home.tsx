import { useState, useEffect } from 'react';
import { Box, Container, Button, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { fetchBlogs, fetchCategories, fetchTags } from '../redux/slices/blogSlice.ts';
import Navbar from '../components/Navbar';
import CategorySlider from '../components/CategorySlider';
import PopularCarousel from '../components/PopularCarousel';
import FeaturedBlog from '../components/FeaturedBlog';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import type { Blog, User, Category } from '../components/types';

const Home = () => {
  const dispatch = useAppDispatch();
  const { blogs, categories, loading, error } = useAppSelector((state) => state.blogs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchCategories());
    dispatch(fetchTags());
  }, [dispatch]);

  const filteredBlogs = selectedCategory
    ? blogs.filter((b: Blog) => b.categories.includes(
      categories.find((c: Category) => c._id === selectedCategory)?.name || ''
    ))
    : blogs;

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

  const featuredBlog = filteredBlogs[0];
  // Since backend populates author, we cast it to User. 
  // If it was a string (ID), this would be incorrect, but we updated the model to populate.
  const featuredAuthor = (featuredBlog?.author as unknown as User) || { username: 'Unknown' };

  return (
    <Box>
      <Navbar />
      <CategorySlider
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <PopularCarousel blogs={filteredBlogs} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {featuredBlog && (
          <FeaturedBlog blog={featuredBlog} author={featuredAuthor} />
        )}
        {/* Section A: 2 BlogCards */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          {filteredBlogs.slice(1, 3).map((blog: Blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              author={blog.author as unknown as User}
            />
          ))}
        </Box>
        {/* Section B: 2 rows, 3 BlogCards each */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {filteredBlogs.slice(3, 6).map((blog: Blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                author={blog.author as unknown as User}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {filteredBlogs.slice(6, 9).map((blog: Blog) => (
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
          <Button variant="contained" color="primary" size="large">
            Explore More
          </Button>
        </Box>
        {/* Section C: 4 BlogCards */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          {filteredBlogs.slice(9, 13).map((blog: Blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              author={blog.author as unknown as User}
            />
          ))}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
