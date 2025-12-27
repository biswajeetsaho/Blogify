import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Avatar, Stack, Divider, Button, Tabs, Tab } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/hooks.ts';
import { fetchUserBlogs } from '../redux/slices/blogSlice.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import type { Blog, User } from '../components/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Profile = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { userBlogs } = useAppSelector((state) => state.blogs);
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserBlogs());
        }
    }, [dispatch, user]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (!user) {
        return (
            <Box>
                <Navbar />
                <Container sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h4">Please login to view your profile</Typography>
                </Container>
                <Footer />
            </Box>
        );
    }

    const publishedBlogs = userBlogs.filter(b => b.status === 'published');
    const draftBlogs = userBlogs.filter(b => b.status === 'draft');
    const scheduledBlogs = userBlogs.filter(b => b.status === 'scheduled');

    const renderBlogList = (blogs: Blog[]) => {
        if (blogs.length === 0) {
            return <Typography color="text.secondary">No blogs found in this section.</Typography>;
        }
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} author={user as unknown as User} />
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: 'primary.main',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                            }}
                        >
                            {user.username[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h4" fontWeight={800} gutterBottom>
                                {user.username}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {user.email}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" sx={{ borderRadius: 10, textTransform: 'none' }}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 6 }} />

                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                                <Tab label={`Published (${publishedBlogs.length})`} />
                                <Tab label={`Drafts (${draftBlogs.length})`} />
                                <Tab label={`Scheduled (${scheduledBlogs.length})`} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            {renderBlogList(publishedBlogs)}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {renderBlogList(draftBlogs)}
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            {renderBlogList(scheduledBlogs)}
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default Profile;
