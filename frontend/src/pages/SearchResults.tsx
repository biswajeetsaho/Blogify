import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    IconButton
} from '@mui/material';
import { History as HistoryIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../redux/hooks.ts';
import { fetchBlogs } from '../redux/slices/blogSlice.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import type { User } from '../components/types';

const SearchResults = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { blogs } = useAppSelector((state) => state.blogs);
    const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Parse query params
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (blogs.length === 0) {
            dispatch(fetchBlogs());
        }
        // Load recent searches
        const history = JSON.parse(localStorage.getItem('SearchHistory') || '[]');
        setRecentSearches(history);
    }, [dispatch, blogs.length]);

    // Update Recent Searches when valid query changes
    useEffect(() => {
        if (query.trim()) {
            const history = JSON.parse(localStorage.getItem('SearchHistory') || '[]');
            if (!history.includes(query)) {
                const newHistory = [query, ...history].slice(0, 10); // Keep last 10
                localStorage.setItem('SearchHistory', JSON.stringify(newHistory));
                setRecentSearches(newHistory);
            }
        }
    }, [query]);

    const handleClearHistory = () => {
        localStorage.removeItem('SearchHistory');
        setRecentSearches([]);
    };

    const handleHistoryClick = (q: string) => {
        navigate(`/search?q=${encodeURIComponent(q)}`);
    };

    // Filter and Sort Logic
    const filteredBlogs = useMemo(() => {
        if (!query) return [];

        const lowerQ = query.toLowerCase();

        let results = blogs.filter((blog) => {
            const titleMatch = blog.title.toLowerCase().includes(lowerQ);
            const contentMatch = blog.content.replace(/<[^>]+>/g, '').toLowerCase().includes(lowerQ);
            // safe check for arrays
            const categoryMatch = blog.categories?.some(c => c.toLowerCase().includes(lowerQ));
            const tagMatch = blog.tags?.some(t => t.toLowerCase().includes(lowerQ));

            return titleMatch || contentMatch || categoryMatch || tagMatch;
        });

        // Sorting
        if (sortBy === 'latest') {
            results.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
        } else {
            results.sort((a, b) => b.likesCount - a.likesCount);
        }

        return results;
    }, [blogs, query, sortBy]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
                <Grid container spacing={4}>
                    {/* Left Sidebar: Filters & History */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Search Filters
                            </Typography>

                            <FormControl fullWidth size="small" sx={{ mt: 2, mb: 4 }}>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
                                >
                                    <MenuItem value="latest">Latest</MenuItem>
                                    <MenuItem value="popular">Most Popular</MenuItem>
                                </Select>
                            </FormControl>

                            <Divider sx={{ my: 2 }} />

                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                                    Recent Searches
                                </Typography>
                                {recentSearches.length > 0 && (
                                    <IconButton size="small" onClick={handleClearHistory} title="Clear History">
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <List dense>
                                {recentSearches.map((term, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemButton onClick={() => handleHistoryClick(term)} sx={{ borderRadius: 1 }}>
                                            <HistoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', opacity: 0.7 }} />
                                            <ListItemText primary={term} primaryTypographyProps={{ noWrap: true }} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                {recentSearches.length === 0 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', pl: 1 }}>
                                        No recent searches
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Right Content: Results */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Box mb={4}>
                            <Typography variant="h4" fontWeight={800} gutterBottom>
                                {query ? `Results for "${query}"` : 'Search Blogs'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Found {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {filteredBlogs.map((blog) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={blog._id}>
                                    {/* Reuse BlogCard, ensuring Author type match */}
                                    <BlogCard blog={blog} author={blog.author as unknown as User} />
                                </Grid>
                            ))}
                        </Grid>

                        {filteredBlogs.length === 0 && query && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No matches found. Try different keywords.
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default SearchResults;
