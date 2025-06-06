import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1976d2',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Shop Experts
            </Typography>
            <Typography variant="body2">
              Connect with skilled professionals and get expert services at your convenience.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              For Customers
            </Typography>
            <Box>
              <Link color="inherit" href="/search" underline="hover">
                Find Experts
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/how-it-works" underline="hover">
                How It Works
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/safety" underline="hover">
                Safety & Trust
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              For Experts
            </Typography>
            <Box>
              <Link color="inherit" href="/become-expert" underline="hover">
                Become an Expert
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/expert-resources" underline="hover">
                Resources
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/expert-guidelines" underline="hover">
                Guidelines
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box>
              <Link color="inherit" href="/help" underline="hover">
                Help Center
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/contact" underline="hover">
                Contact Us
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/privacy" underline="hover">
                Privacy Policy
              </Link>
            </Box>
            <Box>
              <Link color="inherit" href="/terms" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            mt: 4,
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2">
            © 2024 Shop Experts. All rights reserved.
          </Typography>
          
          <Box>
            <IconButton color="inherit" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
