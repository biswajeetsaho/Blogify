import React from 'react';
import { Container, Typography, Box, Paper, Avatar, Stack, Divider, Button } from '@mui/material';
import { useAppSelector } from '../redux/hooks.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
    const { user } = useAppSelector((state) => state.auth);

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

                    <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            About
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Software developer and tech enthusiast. Sharing insights on modern engineering practices.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default Profile;
