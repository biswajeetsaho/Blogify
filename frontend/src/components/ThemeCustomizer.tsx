import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Box,
    Typography,
    Stack,
    Chip
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updateUserTheme } from '../redux/slices/authSlice';

interface ThemeCustomizerProps {
    open: boolean;
    onClose: () => void;
}

const FONT_OPTIONS = [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Open Sans',
    'Lato',
    'Playfair Display',
    'Merriweather'
];

const COLOR_PRESETS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f5f5f5' },
    { name: 'Soft Blue', value: '#e3f2fd' },
    { name: 'Soft Green', value: '#e8f5e9' },
    { name: 'Soft Pink', value: '#fce4ec' },
    { name: 'Dark', value: '#1a1a1a' },
    { name: 'Navy', value: '#2c3e50' },
    { name: 'Purple', value: '#4a148c' }
];

const ThemeCustomizer = ({ open, onClose }: ThemeCustomizerProps) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [backgroundColor, setBackgroundColor] = useState(
        user?.themePreferences?.backgroundColor || '#ffffff'
    );
    const [fontFamily, setFontFamily] = useState(
        user?.themePreferences?.fontFamily || 'Inter'
    );

    const handleSave = async () => {
        await dispatch(updateUserTheme({ backgroundColor, fontFamily }));
        onClose();
    };

    const handleReset = () => {
        setBackgroundColor('#ffffff');
        setFontFamily('Inter');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Customize Your Theme</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {/* Background Color Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Background Color
                        </Typography>
                        <TextField
                            fullWidth
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            {COLOR_PRESETS.map((preset) => (
                                <Chip
                                    key={preset.value}
                                    label={preset.name}
                                    onClick={() => setBackgroundColor(preset.value)}
                                    sx={{
                                        bgcolor: preset.value,
                                        color: preset.value === '#ffffff' || preset.value === '#f5f5f5' || preset.value === '#e3f2fd' || preset.value === '#e8f5e9' || preset.value === '#fce4ec' ? '#000' : '#fff',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Font Family Section */}
                    <FormControl fullWidth>
                        <InputLabel>Font Family</InputLabel>
                        <Select
                            value={fontFamily}
                            label="Font Family"
                            onChange={(e) => setFontFamily(e.target.value)}
                        >
                            {FONT_OPTIONS.map((font) => (
                                <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                    {font}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Preview Section */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Preview
                        </Typography>
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: backgroundColor,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: fontFamily,
                                    color: backgroundColor ? getContrastColor(backgroundColor) : '#000'
                                }}
                            >
                                This is how your blog will look
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: fontFamily,
                                    color: backgroundColor ? getContrastColor(backgroundColor) : '#000',
                                    mt: 1
                                }}
                            >
                                Sample paragraph text to preview the font and color combination.
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReset} color="secondary">
                    Reset to Default
                </Button>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Helper function to calculate contrast color
function getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default ThemeCustomizer;
