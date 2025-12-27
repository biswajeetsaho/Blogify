import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Stack,
    useTheme,
} from '@mui/material';
import {
    TrendingUp,
    Visibility,
    Favorite,
    Comment,
    BarChart,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart as ReBarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { useAppSelector } from '../redux/hooks.ts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAnalyticsOverview, getBlogAnalytics, getTrendsData } from '../api/analytics';
import type { AnalyticsOverview, BlogMetric, TrendsData } from '../components/types';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
    const muiTheme = useTheme();
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [blogMetrics, setBlogMetrics] = useState<BlogMetric[]>([]);
    const { token } = useAppSelector((state) => state.auth);
    const [trends, setTrends] = useState<TrendsData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [overviewRes, metricsRes, trendsRes] = await Promise.all([
                    getAnalyticsOverview(),
                    getBlogAnalytics(),
                    getTrendsData(),
                ]);
                setOverview(overviewRes.data);
                setBlogMetrics(metricsRes.data || []);
                setTrends(trendsRes.data);
            } catch (err: any) {
                console.error('Error fetching analytics:', err);
                setError(err.response?.data?.error || 'Failed to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, navigate]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 10, flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Please try again later or contact support.
                    </Typography>
                </Container>
                <Footer />
            </Box>
        );
    }


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const overviewItems = [
        { label: 'Total Views', value: overview?.totalViews, icon: <Visibility color="primary" />, color: '#e3f2fd' },
        { label: 'Total Likes', value: overview?.totalLikes, icon: <Favorite color="error" />, color: '#ffebee' },
        { label: 'Total Comments', value: overview?.totalComments, icon: <Comment color="info" />, color: '#e0f2f1' },
        { label: 'Engagement Rate', value: `${overview?.engagementRate}%`, icon: <TrendingUp color="success" />, color: '#f1f8e9' },
    ];

    const pieData = [
        { name: 'Likes', value: trends?.engagement?.likes || 0 },
        { name: 'Comments', value: trends?.engagement?.comments || 0 },
    ];


    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 4 }}>
                    Blog Analytics 📊
                </Typography>

                {/* Overview Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                        gap: 3,
                        mb: 4
                    }}
                >
                    {overviewItems.map((item, index) => (
                        <Card key={index} sx={{ height: '100%', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: item.color, display: 'flex' }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {item.value || 0}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                    {/* Views Over Time */}
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Views Trend (Last 30 Days)
                            </Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <AreaChart data={trends?.viewsOverTime || []}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={muiTheme.palette.primary.main} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={muiTheme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke={muiTheme.palette.primary.main} fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Box>

                    {/* Engagement Breakdown */}
                    <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Engagement Mix
                            </Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Box>

                    {/* Category Performance */}
                    <Box sx={{ gridColumn: 'span 12' }}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Category Performance
                            </Typography>
                            <ResponsiveContainer width="100%" height="90%">
                                <ReBarChart data={trends?.categoryPerformance || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill={muiTheme.palette.primary.main} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="likes" fill={muiTheme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                                </ReBarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Box>

                    {/* Blog Table */}
                    <Box sx={{ gridColumn: 'span 12' }}>
                        <Paper sx={{ p: 3, borderRadius: 3, overflow: 'hidden' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Individual Blog Performance
                            </Typography>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Views</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Likes</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Comments</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Engagement</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Created</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {blogMetrics.map((blog) => (
                                            <TableRow key={blog.id} hover>
                                                <TableCell component="th" scope="row">
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 300 }}>
                                                        {blog.title}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">{blog.views}</TableCell>
                                                <TableCell align="right">{blog.likes}</TableCell>
                                                <TableCell align="right">{blog.comments}</TableCell>
                                                <TableCell align="right">{blog.engagementRate}%</TableCell>
                                                <TableCell align="right">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default AnalyticsPage;
