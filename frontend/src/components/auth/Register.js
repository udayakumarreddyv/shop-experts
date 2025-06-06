import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Link,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem
} from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth, AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'USER',
    expertise: '',
    experienceYears: '',
    hourlyRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Register with ${provider}`);
  };

  const expertiseOptions = [
    'Hair Styling',
    'Makeup Artist',
    'Personal Trainer',
    'Massage Therapy',
    'Nutrition Counseling',
    'Life Coaching',
    'Photography',
    'Graphic Design',
    'Web Development',
    'Music Lessons',
    'Language Tutoring',
    'Home Cleaning',
    'Handyman Services',
    'Pet Care',
    'Other'
  ];

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Join Shop Experts
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Create your account and start connecting
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Box>

            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel id="user-type-label" component="legend">I want to:</FormLabel>
              <RadioGroup
                row
                aria-labelledby="user-type-label"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <FormControlLabel value="USER" control={<Radio />} label="Hire Experts" />
                <FormControlLabel value="EXPERT" control={<Radio />} label="Offer Services" />
              </RadioGroup>
            </FormControl>

            {formData.userType === 'EXPERT' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField
                  select
                  fullWidth
                  id="expertise"
                  label="Expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  aria-describedby="expertise-description"
                  InputProps={{
                    inputProps: {
                      'aria-required': true
                    }
                  }}
                >
                  {expertiseOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography id="expertise-description" variant="caption" sx={{display: 'none'}}>
                  Select your primary area of expertise
                </Typography>
                <TextField
                  type="number"
                  fullWidth
                  id="experienceYears"
                  label="Years of Experience"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
                <TextField
                  type="number"
                  fullWidth
                  id="hourlyRate"
                  label="Hourly Rate ($)"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div aria-live="assertive" className="visually-hidden">
              {loading ? 'Creating your account, please wait' : ''}
            </div>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('google')}
              sx={{ mb: 1 }}
            >
              Continue with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('facebook')}
              sx={{ mb: 2 }}
            >
              Continue with Facebook
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
