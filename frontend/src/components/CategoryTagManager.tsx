import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Box,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { updateCategory, deleteCategory, updateTag, deleteTag, createCategory, createTag } from '../redux/slices/blogSlice.ts';
import type { Category, Tag } from './types';

interface CategoryTagManagerProps {
    open: boolean;
    onClose: () => void;
}

const CategoryTagManager: React.FC<CategoryTagManagerProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const { categories, tags } = useAppSelector((state) => state.blogs);
    const { user } = useAppSelector((state) => state.auth);
    const [tabIndex, setTabIndex] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [addValue, setAddValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
        setEditingId(null);
        setAddValue('');
        setError(null);
    };

    const handleAdd = async () => {
        if (!addValue.trim()) return;
        setLoading(true);
        setError(null);
        try {
            if (tabIndex === 0) {
                await dispatch(createCategory(addValue.trim())).unwrap();
            } else {
                await dispatch(createTag(addValue.trim())).unwrap();
            }
            setAddValue('');
        } catch (err: any) {
            setError(err || 'Failed to add');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (item: Category | Tag) => {
        setEditingId(item._id);
        setEditValue(item.name);
        setError(null);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValue('');
        setError(null);
    };

    const handleSave = async (id: string) => {
        if (!editValue.trim()) return;
        setLoading(true);
        setError(null);
        try {
            if (tabIndex === 0) {
                await dispatch(updateCategory({ id, name: editValue })).unwrap();
            } else {
                await dispatch(updateTag({ id, name: editValue })).unwrap();
            }
            setEditingId(null);
        } catch (err: any) {
            setError(err || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        setLoading(true);
        setError(null);
        try {
            if (tabIndex === 0) {
                await dispatch(deleteCategory(id)).unwrap();
            } else {
                await dispatch(deleteTag(id)).unwrap();
            }
        } catch (err: any) {
            // The error from backend: "This category is used in X blog(s) and cannot be deleted."
            setError(err || 'Failed to delete');
        } finally {
            setLoading(false);
        }
    };

    // Filter items to only show those created by the current user
    const items = (tabIndex === 0 ? categories : tags).filter(
        (item) => item.creator === user?._id
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Manage My {tabIndex === 0 ? 'Categories' : 'Tags'}
                {loading && <CircularProgress size={20} />}
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
                    <Tab label="Categories" />
                    <Tab label="Tags" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={`Add new ${tabIndex === 0 ? 'category' : 'tag'}...`}
                        value={addValue}
                        onChange={(e) => setAddValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                        disabled={loading}
                    />
                    <Button variant="contained" onClick={handleAdd} disabled={loading || !addValue.trim()}>
                        Add
                    </Button>
                </Box>

                <List sx={{ maxHeight: 350, overflow: 'auto' }}>
                    {items.map((item) => (
                        <ListItem
                            key={item._id}
                            divider
                            secondaryAction={
                                editingId === item._id ? (
                                    <Box>
                                        <IconButton edge="end" onClick={() => handleSave(item._id)} disabled={loading} color="primary">
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={cancelEditing} disabled={loading}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box>
                                        <IconButton edge="end" onClick={() => startEditing(item)} disabled={loading}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(item._id)} disabled={loading} color="error" title="Delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )
                            }
                        >
                            {editingId === item._id ? (
                                <TextField
                                    fullWidth
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    size="small"
                                    autoFocus
                                    disabled={loading}
                                />
                            ) : (
                                <ListItemText primary={item.name} />
                            )}
                        </ListItem>
                    ))}
                    {items.length === 0 && (
                        <Typography variant="body2" color="text.secondary" align="center" py={4}>
                            No {tabIndex === 0 ? 'categories' : 'tags'} created by you.
                        </Typography>
                    )}
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryTagManager;
