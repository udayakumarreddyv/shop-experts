import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Rating,
  Chip,
  Paper
} from '@mui/material';
import {
  Search,
  Schedule,
  Payment,
  Star,
  People,
  CheckCircle,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Find Experts',
      description: 'Search and discover skilled professionals in your area'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Book Instantly',
      description: 'Schedule appointments at your convenience'
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing'
    },
    {
      icon: <Star sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Quality Assured',
      description: 'Verified experts with ratings and reviews'
    }
  ];

  const popularCategories = [
    { name: 'Hair & Beauty', count: 125, image: '/images/hair-styling.jpg' },
    { name: 'Home Services', count: 89, image: '/images/personal-training.jpg' },
    { name: 'Fitness & Wellness', count: 76, image: '/images/massage.jpg' },
    { name: 'Tutoring', count: 64, image: '/images/photography.jpg' },
    { name: 'Automotive', count: 112, image: '/images/cleaning.jpg' },
    { name: 'Technology', count: 95, image: '/images/tutoring.jpg' }
  ];

  const featuredExperts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      expertise: 'Professional Hair Stylist',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 50,
      image: '/images/expert1.jpg',
      verified: true,
      specialties: ['Haircuts', 'Coloring'],
      availability: 'Available now'
    },
    {
      id: 2,
      name: 'Mike Chen',
      expertise: 'Certified Personal Trainer',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 45,
      image: '/images/expert2.jpg',
      verified: true,
      specialties: ['Weight Training', 'Nutrition'],
      availability: 'Available today'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      expertise: 'Math Tutor',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 35,
      image: '/images/expert3.jpg',
      verified: true,
      specialties: ['Algebra', 'Calculus'],
      availability: 'Available now'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Verified Experts' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '4.9', label: 'Average Rating' },
    { number: '100,000+', label: 'Services Completed' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Find Skilled Professionals
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Connect with trusted experts for all your needs
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/search')}
            sx={{
              backgroundColor: 'white',
              color: '#1976d2',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              mr: 2,
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: '#f5f5f5',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Become an Expert
          </Button>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box textAlign="center">
                <Typography variant="h3" component="div" fontWeight="bold" color="primary">
                  {stat.number}
                </Typography>
                <Typography variant="h6" component="div" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why Choose Shop Experts
          </Typography>
          <Typography variant="h6" component="h3" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Simple steps to get started
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box textAlign="center">
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Popular Categories
          </Typography>
          <Typography variant="h6" component="h3" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Explore our most requested services
          </Typography>
        
        <Grid container spacing={3}>
          {popularCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => navigate(`/search?category=${category.name}`)}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 160,
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h4" component="span" color="primary">
                    {category.name.charAt(0)}
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} experts available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Experts */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Featured Experts
          </Typography>
          <Typography variant="h6" component="h3" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Top-rated professionals ready to help
          </Typography>
          
          <Grid container spacing={4}>
            {featuredExperts.map((expert) => (
              <Grid item xs={12} md={4} key={expert.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(`/experts/${expert.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={expert.image}
                        alt={`${expert.name} profile photo`}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      >
                        {expert.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {expert.name}
                          </Typography>
                          {expert.verified && (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {expert.expertise}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={expert.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {expert.rating} ({expert.reviews} reviews)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {expert.specialties.map((specialty, index) => (
                        <Chip 
                          key={index}
                          label={specialty}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                      {expert.availability}
                    </Typography>
                    
                    <Typography variant="h6" color="primary">
                      ${expert.hourlyRate}/hour
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of satisfied customers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/search')}
            sx={{ px: 4, py: 1.5 }}
          >
            Find an Expert
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Become an Expert
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
