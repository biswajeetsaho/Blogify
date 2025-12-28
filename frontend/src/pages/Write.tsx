import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    IconButton,
    Card,
    CardMedia,
    Divider,
    FormControl,
    InputLabel,
    Alert,
    Paper,
    Tabs,
    Tab,
    Autocomplete,
    createFilterOptions,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    AddPhotoAlternate as AddMediaIcon,
    Send as PublishIcon,
    Save as DraftIcon,
    Schedule as ScheduleIcon,
    RemoveCircleOutline as RemoveIcon,
    Visibility as PreviewIcon,
    Edit as EditIcon,
    Settings as ManageIcon,
} from '@mui/icons-material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { createBlog, updateBlog, fetchCategories, fetchTags, createCategory, createTag } from '../redux/slices/blogSlice.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CategoryTagManager from '../components/CategoryTagManager';

const Write = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { categories: allCategories, tags: allTags } = useAppSelector((state) => state.blogs);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
    const [scheduledDate, setScheduledDate] = useState('');
    const [existingBlogId, setExistingBlogId] = useState<string | null>(null);
    const [existingMedia, setExistingMedia] = useState<any[]>([]); // To store existing media objects

    const location = useLocation();

    const [tabIndex, setTabIndex] = useState(0); // 0 for Edit, 1 for Preview
    const [managerOpen, setManagerOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (allCategories.length === 0) dispatch(fetchCategories());
        if (allTags.length === 0) dispatch(fetchTags());

        if (location.state?.editBlog) {
            const blog = location.state.editBlog;
            setExistingBlogId(blog._id);
            setTitle(blog.title);
            setSubtitle(blog.subtitle || '');
            setContent(blog.content);
            setStatus(blog.status);
            if (blog.categories) setSelectedCategories(blog.categories.map((c: any) => c.name));
            if (blog.tags) setSelectedTags(blog.tags.map((t: any) => t.name || t)); // Handle populated or string tags
            // Note: Media files cannot be easily pre-filled into File[], so we rely on existing previews or logic.
            // For simplicity in this demo, we might not show existing media in the file input, but we could show them in previews.
            if (blog.media && blog.media.length > 0) {
                setExistingMedia(blog.media);
                const existingPreviews = blog.media.map((m: any) =>
                    m.filePath.startsWith('/uploads') ? `http://localhost:3000${m.filePath}` : m.filePath
                );
                setPreviews(existingPreviews);
            }
        }
    }, [dispatch, allCategories.length, allTags.length, location.state]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setMediaFiles((prev) => [...prev, ...files]);

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeMedia = (index: number) => {
        if (index < existingMedia.length) {
            setExistingMedia((prev) => prev.filter((_, i) => i !== index));
        } else {
            const fileIndex = index - existingMedia.length;
            setMediaFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }

        if (previews[index] && previews[index].startsWith('blob:')) {
            URL.revokeObjectURL(previews[index]);
        }
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCategoryChange = async (event: any, newValue: string[]) => {
        const lastValue = newValue[newValue.length - 1];
        if (lastValue && !allCategories.some(c => c.name === lastValue)) {
            try {
                const resultAction = await dispatch(createCategory(lastValue));
                if (createCategory.fulfilled.match(resultAction)) {
                    // Success
                } else {
                    // If error (e.g. duplicate caught by backend), don't include it
                    // But Autocomplete updates state immediately? No, controlled component.
                    // If we strictly rely on Redux update, we might need to wait?
                    // Actually, if we just call setSelectedCategories(newValue), it will show the string.
                    // But if creation failed, we probably shoudn't show it.
                    // For 'freeSolo' + Redux Sync, it's safer to attempt creation, and ON SUCCESS allow it.
                    // The backend returns the new category object.
                    // Our Redux slice ADDS it to `allCategories`.
                    // So `allCategories.some(...)` will become true in next render.
                }
            } catch (err) {
                console.error(err);
            }
        }
        setSelectedCategories(newValue);
    };

    const handleTagChange = async (event: any, newValue: string[]) => {
        const lastValue = newValue[newValue.length - 1];
        if (lastValue && !allTags.some(t => t.name === lastValue)) {
            try {
                await dispatch(createTag(lastValue));
            } catch (err) {
                console.error(err);
            }
        }
        setSelectedTags(newValue);
    };

    const handlePublish = async () => {
        if (!title || !content) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('content', content);
        formData.append('status', status);

        selectedCategories.forEach(cat => formData.append('categories', cat));
        selectedTags.forEach(tag => formData.append('tags', tag));

        if (status === 'scheduled' && scheduledDate) {
            formData.append('publishedAt', scheduledDate);
        }

        mediaFiles.forEach((file) => {
            formData.append('media', file);
        });

        try {
            if (existingBlogId) {
                // Update
                // Send existing media as JSON
                formData.append('existingMedia', JSON.stringify(existingMedia));

                if (mediaFiles.length > 0) {
                    mediaFiles.forEach((file) => {
                        formData.append('media', file);
                    });
                }
                await dispatch(updateBlog({ id: existingBlogId, formData })).unwrap();
            } else {
                // Create
                mediaFiles.forEach((file) => {
                    formData.append('media', file);
                });
                await dispatch(createBlog(formData)).unwrap();
            }
            navigate('/');
        } catch (err: any) {
            setError(err || 'Failed to save blog');
        } finally {
            setLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'blockquote', 'code-block'],
            ['clean'],
        ],
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography variant="h4" fontWeight={800}>
                            {tabIndex === 0 ? 'Write Story' : 'Preview'}
                        </Typography>
                        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
                            <Tab icon={<EditIcon />} iconPosition="start" label="Edit" sx={{ textTransform: 'none' }} />
                            <Tab icon={<PreviewIcon />} iconPosition="start" label="Preview" sx={{ textTransform: 'none' }} />
                        </Tabs>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

                    {tabIndex === 0 ? (
                        <Stack spacing={4}>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                InputProps={{
                                    sx: { fontSize: '2.5rem', fontWeight: 800, '&:before, &:after': { display: 'none' } },
                                }}
                            />

                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Subtitle (Optional)"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                InputProps={{
                                    sx: { fontSize: '1.2rem', color: 'text.secondary', '&:before, &:after': { display: 'none' } },
                                }}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
                                <Box sx={{ flex: 1, width: '100%' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                        <InputLabel>Categories</InputLabel>
                                        <Button size="small" startIcon={<ManageIcon />} onClick={() => setManagerOpen(true)}>
                                            Manage
                                        </Button>
                                    </Stack>
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={allCategories.map((option) => option.name)}
                                        value={selectedCategories}
                                        onChange={handleCategoryChange}
                                        renderTags={(value: readonly string[], getTagProps) =>
                                            value.map((option: string, index: number) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Select or create..."
                                            />
                                        )}
                                    />
                                </Box>

                                <Box sx={{ flex: 1, width: '100%' }}>
                                    <InputLabel sx={{ mb: 1 }}>Tags</InputLabel>
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={allTags.map((option) => option.name)}
                                        value={selectedTags}
                                        onChange={handleTagChange}
                                        renderTags={(value: readonly string[], getTagProps) =>
                                            value.map((option: string, index: number) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Select or create..."
                                            />
                                        )}
                                    />
                                </Box>
                            </Stack>

                            <CategoryTagManager open={managerOpen} onClose={() => setManagerOpen(false)} />

                            <Box sx={{ minHeight: 400 }}>
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={quillModules}
                                    style={{ height: '350px' }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="h6" gutterBottom>Cover Media</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Upload up to 5 images or videos.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleMediaChange}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddMediaIcon />}
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{ height: 100, width: 100 }}
                                    >
                                        Add
                                    </Button>
                                    {previews.map((url, index) => {
                                        let isVideo = false;
                                        if (index < existingMedia.length) {
                                            isVideo = existingMedia[index].fileType === 'video';
                                        } else {
                                            const fileIndex = index - existingMedia.length;
                                            if (mediaFiles[fileIndex]) {
                                                isVideo = mediaFiles[fileIndex].type.startsWith('video');
                                            }
                                        }

                                        return (
                                            <Box key={index} position="relative">
                                                <Card sx={{ width: 100, height: 100 }}>
                                                    <CardMedia
                                                        component={isVideo ? 'video' : 'img'}
                                                        src={url}
                                                        sx={{ height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Card>
                                                <IconButton
                                                    size="small"
                                                    sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'background.paper' }}
                                                    onClick={() => removeMedia(index)}
                                                >
                                                    <RemoveIcon color="error" />
                                                </IconButton>
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Box>

                            <Divider />

                            <Stack direction="row" spacing={3} alignItems="center">
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Autocomplete
                                        options={['published', 'draft', 'scheduled']}
                                        value={status}
                                        onChange={(_, newValue) => setStatus((newValue as any) || 'published')}
                                        renderInput={(params) => <TextField {...params} label="Status" />}
                                        disableClearable
                                    />
                                </FormControl>

                                {status === 'scheduled' && (
                                    <TextField
                                        type="datetime-local"
                                        label="Publish Date"
                                        size="small"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}

                                <Box sx={{ flexGrow: 1 }} />

                                <Button startIcon={<DraftIcon />} color="inherit">
                                    Save Draft
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={status === 'scheduled' ? <ScheduleIcon /> : <PublishIcon />}
                                    onClick={handlePublish}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : (
                                        existingBlogId ? 'Update' : (status === 'scheduled' ? 'Schedule' : 'Publish')
                                    )}
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Box>
                            <Typography variant="h3" gutterBottom dangerouslySetInnerHTML={{ __html: title }} />
                            <Typography variant="h5" color="text.secondary" gutterBottom dangerouslySetInnerHTML={{ __html: subtitle }} />
                            <Box sx={{ my: 2 }}>
                                {selectedCategories.map(c => <Chip key={c} label={c} sx={{ mr: 1 }} />)}
                                {selectedTags.map(t => <Chip key={t} label={`#${t}`} variant="outlined" sx={{ mr: 1 }} />)}
                            </Box>
                            {previews.length > 0 && (
                                <CardMedia
                                    component="img"
                                    src={previews[0]}
                                    sx={{ maxHeight: 400, borderRadius: 2, my: 4 }}
                                />
                            )}
                            <Box sx={{
                                '& img': { maxWidth: '100%', height: 'auto' },
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                '& pre': { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default Write;
