import { Box, Typography, Divider, Stack, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => (
  <Box sx={{ mt: 8, py: 4, bgcolor: 'grey.100' }}>
    <Divider sx={{ mb: 3 }} />
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h6" fontWeight={700} color="primary">
          Blogify
        </Typography>
        <Typography variant="body2" color="text.secondary" maxWidth={320}>
          Blogify is a professional, office-grade blogging platform for teams and enterprises.
        </Typography>
      </Box>
      <Stack direction="row" spacing={3} alignItems="center">
        <Link href="#" underline="hover" color="inherit">Home</Link>
        <Link href="#" underline="hover" color="inherit">Write</Link>
        <Link href="#" underline="hover" color="inherit">Categories</Link>
      </Stack>
      <Stack direction="row" spacing={1}>
        <IconButton><FacebookIcon fontSize="small" /></IconButton>
        <IconButton><TwitterIcon fontSize="small" /></IconButton>
        <IconButton><LinkedInIcon fontSize="small" /></IconButton>
      </Stack>
    </Stack>
    <Typography variant="caption" color="text.secondary" display="block" align="center" mt={3}>
      © {new Date().getFullYear()} Blogify. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
