import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  CalendarToday,
  AttachMoney,
  Star,
  TrendingUp,
  People,
  Notifications,
  MoreVert,
  Visibility,
  Edit,
  Cancel
} from '@mui/icons-material';
import { useAuth, AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBookings: [],
    notifications: [],
    earnings: {},
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard data based on user role
      const [bookingsResponse, notificationsResponse] = await Promise.all([
        ApiService.get('/bookings/my-bookings?size=5'),
        ApiService.get('/notifications/user/' + (user?.id || '') + '?size=5')
      ]);

      setDashboardData({
        stats: {
          totalBookings: 15,
          completedBookings: 12,
          earnings: user?.role === 'ROLE_EXPERT' ? 2450 : 0,
          rating: user?.role === 'ROLE_EXPERT' ? 4.8 : 0,
          totalCustomers: user?.role === 'ROLE_EXPERT' ? 24 : 0,
          pendingBookings: 3
        },
        recentBookings: bookingsResponse.data.content || [],
        notifications: notificationsResponse.data.content || [],
        earnings: {
          thisMonth: 650,
          lastMonth: 820,
          growth: -20.7
        },
        reviews: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h3" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user.role === 'ROLE_EXPERT' 
            ? 'Manage your services and track your earnings' 
            : 'Book services and manage your appointments'
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={dashboardData.stats.totalBookings}
            icon={<CalendarToday sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={dashboardData.stats.pendingBookings}
            icon={<Notifications sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        {user.role === 'ROLE_EXPERT' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Earnings"
                value={`$${dashboardData.stats.earnings}`}
                icon={<AttachMoney sx={{ fontSize: 40 }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Rating"
                value={dashboardData.stats.rating}
                icon={<Star sx={{ fontSize: 40 }} />}
                subtitle={`${dashboardData.stats.totalCustomers} customers`}
              />
            </Grid>
          </>
        )}
        {user.role === 'ROLE_USER' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={dashboardData.stats.completedBookings}
                icon={<People sx={{ fontSize: 40 }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Find Experts"
                value="Browse"
                icon={<TrendingUp sx={{ fontSize: 40 }} />}
                color="info"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Bookings
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/bookings')}
                >
                  View All
                </Button>
              </Box>
              
              {dashboardData.recentBookings.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{user.role === 'ROLE_EXPERT' ? 'Customer' : 'Expert'}</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ mr: 2, width: 32, height: 32 }}
                                alt={user.role === 'ROLE_EXPERT' ? `${booking.customerName} avatar` : `${booking.expertName} avatar`}
                              >
                                {user.role === 'ROLE_EXPERT' 
                                  ? booking.customerName?.charAt(0) 
                                  : booking.expertName?.charAt(0)
                                }
                              </Avatar>
                              {user.role === 'ROLE_EXPERT' ? booking.customerName : booking.expertName}
                            </Box>
                          </TableCell>
                          <TableCell>{booking.serviceType}</TableCell>
                          <TableCell>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={booking.status} 
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>${booking.totalAmount}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small"
                              onClick={(e) => handleMenuOpen(e, booking)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No bookings yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/search')}
                  >
                    {user.role === 'ROLE_EXPERT' ? 'Complete Your Profile' : 'Find an Expert'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications & Quick Actions */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Notifications */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Notifications
                  </Typography>
                  {dashboardData.notifications.length > 0 ? (
                    <Box>
                      {dashboardData.notifications.slice(0, 3).map((notification) => (
                        <Box key={notification.id} sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ))}
                      <Button size="small" onClick={() => navigate('/notifications')}>
                        View All Notifications
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No new notifications
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {user.role === 'ROLE_EXPERT' ? (
                      <>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          onClick={() => navigate('/profile/edit')}
                        >
                          Update Profile
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          onClick={() => navigate('/earnings')}
                        >
                          View Earnings
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          onClick={() => navigate('/schedule')}
                        >
                          Manage Schedule
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => navigate('/search')}
                        >
                          Find Experts
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          onClick={() => navigate('/bookings')}
                        >
                          My Bookings
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          onClick={() => navigate('/favorites')}
                        >
                          Favorites
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Booking Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/booking/${selectedBooking?.id}`); handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedBooking?.status === 'PENDING' && (
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1 }} />
            Modify Booking
          </MenuItem>
        )}
        {['PENDING', 'CONFIRMED'].includes(selectedBooking?.status) && (
          <MenuItem onClick={handleMenuClose}>
            <Cancel sx={{ mr: 1 }} />
            Cancel Booking
          </MenuItem>
        )}
      </Menu>
    </Container>
  );
};

export default Dashboard;
