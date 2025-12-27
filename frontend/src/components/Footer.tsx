import { Box, Typography, Divider} from '@mui/material';


const Footer = () => (
  <Box sx={{ mt: 8, py: 2, bgcolor: 'grey.100' }}>
    <Divider sx={{ mb: 2 }} />
    <Typography variant="h6" fontWeight={700} color="primary" ml={4}>
          Blogify
        </Typography>
    <Typography variant="caption" color="text.secondary" display="block" align="center" mt={0}>
      © {new Date().getFullYear()} Blogify. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
