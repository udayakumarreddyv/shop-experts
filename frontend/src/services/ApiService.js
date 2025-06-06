import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  login(credentials) {
    return this.api.post('/auth/signin', credentials);
  }

  register(userData) {
    return this.api.post('/auth/signup', userData);
  }

  getCurrentUser() {
    return this.api.get('/auth/me');
  }

  // Search APIs
  searchTalents(params) {
    return this.api.get('/search/talents', { params });
  }

  findNearbyTalents(latitude, longitude, radius = 10) {
    return this.api.get('/search/talents/nearby', {
      params: { latitude, longitude, radius }
    });
  }

  getAllTalents() {
    return this.api.get('/search/talents/all');
  }

  // Booking APIs
  createBooking(bookingData) {
    return this.api.post('/bookings', bookingData);
  }

  confirmBooking(bookingId, paymentData) {
    return this.api.post(`/bookings/${bookingId}/confirm`, paymentData);
  }

  getMyBookings() {
    return this.api.get('/bookings/my-bookings');
  }

  getTalentBookings() {
    return this.api.get('/bookings/talent-bookings');
  }

  getBooking(bookingId) {
    return this.api.get(`/bookings/${bookingId}`);
  }

  updateBookingStatus(bookingId, status) {
    return this.api.put(`/bookings/${bookingId}/status`, { status });
  }

  cancelBooking(bookingId) {
    return this.api.delete(`/bookings/${bookingId}`);
  }

  // User APIs
  updateProfile(userId, profileData) {
    return this.api.put(`/users/${userId}`, profileData);
  }

  getUserProfile(userId) {
    return this.api.get(`/users/${userId}`);
  }

  // Reviews APIs
  createReview(reviewData) {
    return this.api.post('/reviews', reviewData);
  }

  getTalentReviews(talentId) {
    return this.api.get(`/reviews/talent/${talentId}`);
  }

  // Notifications APIs
  getNotifications() {
    return this.api.get('/notifications');
  }

  markNotificationAsRead(notificationId) {
    return this.api.put(`/notifications/${notificationId}/read`);
  }

  markAllNotificationsAsRead() {
    return this.api.put('/notifications/mark-all-read');
  }

  // Rewards APIs
  getRewardAccount() {
    return this.api.get('/rewards/account');
  }

  redeemPoints(points, description) {
    return this.api.post('/rewards/redeem', { points, description });
  }
}

export default new ApiService();
