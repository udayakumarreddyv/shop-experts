import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Search,
  Dashboard,
  ExitToApp
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleDashboard = () => {
    handleProfileMenuClose();
    navigate('/dashboard');
  };

  const handleProfile = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Shop Experts
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            startIcon={<Search />}
            component={Link}
            to="/search"
          >
            Find Experts
          </Button>

          {user ? (
            <>
              <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  src={user.profileImageUrl}
                  alt={user.fullName}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>

              {/* Profile Menu */}
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleDashboard}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                {user.role === 'ROLE_ADMIN' && (
                  <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin'); }}>
                    <Dashboard sx={{ mr: 1 }} />
                    Admin Panel
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>

              {/* Notifications Menu */}
              <Menu
                id="notification-menu"
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: { width: 320, maxHeight: 400 }
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="h6">Notifications</Typography>
                </Box>
                <Divider />
                <MenuItem>
                  <Box>
                    <Typography variant="body2">
                      New booking request from John Doe
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box>
                    <Typography variant="body2">
                      Payment received for consultation
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1 day ago
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem>
                  <Box>
                    <Typography variant="body2">
                      New review posted
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 days ago
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
