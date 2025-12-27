import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { fetchBlogs, fetchCategories } from '../redux/slices/blogSlice.ts';
import Navbar from '../components/Navbar';
import CategorySlider from '../components/CategorySlider';
import BlogCard from '../components/BlogCard';
import Footer from '../components/Footer';
import type { Blog, User, Category } from '../components/types';

const Explore = () => {
    const dispatch = useAppDispatch();
    const { blogs, categories, loading, error } = useAppSelector((state) => state.blogs);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBlogs());
        dispatch(fetchCategories());
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

    return (
        <Box>
            <Navbar />
            <Box sx={{ pl: { xs: 2, md: 12 } }}>
                <CategorySlider
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </Box>

            <Container maxWidth={false} sx={{ px: { xs: 2, md: 20 }, py: 6 }}>
                <Typography variant="h3" fontWeight={800} mb={6} textAlign="center">
                    Explore All Stories
                </Typography>

                {filteredBlogs.length === 0 ? (
                    <Typography variant="h6" color="text.secondary" textAlign="center" py={10}>
                        No blogs found in this category.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                        {filteredBlogs.map((blog: Blog) => (
                            <Box key={blog._id}>
                                <BlogCard
                                    blog={blog}
                                    author={blog.author as unknown as User}
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>

            <Footer />
        </Box>
    );
};

export default Explore;
