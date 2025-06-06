// Test utilities for frontend components
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock BrowserRouter to prevent Router nesting
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => <>{children}</>,
  };
});

// Custom render function with Router
export const renderWithRouter = (ui, { route = '/', ...renderOptions } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>,
    renderOptions
  );
};

// Custom render function with Router and AuthProvider
export const renderWithProviders = (ui, { 
  route = '/', 
  authContextValue = {}, 
  ...renderOptions 
} = {}) => {
  const defaultAuthContext = {
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    ...authContextValue
  };

  // Always wrap components in a Router context to avoid 'useNavigate() may be used only in the context of a <Router> component' error
  const wrappedUi = (
    <AuthProvider value={defaultAuthContext}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  return render(wrappedUi, renderOptions);
};

// Mock user data
export const mockUser = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  profileImageUrl: null,
  roles: ['user']
};

export const mockExpert = {
  id: 2,
  firstName: 'Test',
  lastName: 'Expert',
  email: 'expert@example.com',
  profileImageUrl: null,
  roles: ['expert']
};

export const mockBooking = {
  id: 1,
  customerId: 1,
  customerName: 'Test User',
  expertId: 2,
  expertName: 'Test Expert',
  serviceTitle: 'Hair Styling',
  serviceDescription: 'Professional hair cut and styling',
  price: 100,
  scheduledDate: '2024-12-30T10:00:00',
  status: 'PENDING',
  location: 'Downtown Salon',
  notes: 'Test notes',
  createdAt: '2024-12-28T10:00:00',
  updatedAt: '2024-12-28T10:00:00'
};

export const mockReview = {
  id: 1,
  bookingId: 1,
  userId: 1,
  expertId: 2,
  rating: 5,
  comment: 'Excellent service!',
  createdAt: '2024-12-28T10:00:00'
};

export const mockNotification = {
  id: 1,
  title: 'Booking Confirmed',
  message: 'Your booking has been confirmed',
  type: 'BOOKING_CONFIRMED',
  isRead: false,
  createdAt: '2024-12-28T10:00:00'
};

// The comprehensive render utility is already defined above
// This duplicate was causing errors in tests

// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  profileImageUrl: null,
  roles: ['user'],
  createdAt: '2024-01-01T00:00:00',
  ...overrides
});

export const generateMockExpert = (overrides = {}) => ({
  id: 2,
  firstName: 'Expert',
  lastName: 'User',
  email: 'expert@example.com',
  profileImageUrl: null,
  roles: ['expert'],
  expertise: 'Hair Styling',
  experienceYears: 5,
  hourlyRate: 50,
  rating: 4.8,
  reviewCount: 127,
  createdAt: '2024-01-01T00:00:00',
  ...overrides
});

export const generateMockBooking = (overrides = {}) => ({
  id: 1,
  customerId: 1,
  customerName: 'Test User',
  expertId: 2,
  expertName: 'Test Expert',
  serviceTitle: 'Hair Styling',
  serviceDescription: 'Professional hair cut and styling',
  price: 100,
  scheduledDate: '2024-12-30T10:00:00',
  status: 'PENDING',
  location: 'Downtown Salon',
  notes: 'Test notes',
  createdAt: '2024-12-28T10:00:00',
  updatedAt: '2024-12-28T10:00:00',
  ...overrides
});

export const generateMockReview = (overrides = {}) => ({
  id: 1,
  bookingId: 1,
  userId: 1,
  expertId: 2,
  rating: 5,
  comment: 'Excellent service!',
  customerName: 'Test User',
  createdAt: '2024-12-28T10:00:00',
  ...overrides
});

export const generateMockNotification = (overrides = {}) => ({
  id: 1,
  userId: 1,
  title: 'New Booking',
  message: 'You have a new booking request',
  type: 'BOOKING',
  read: false,
  createdAt: '2024-12-28T10:00:00',
  ...overrides
});

export const generateMockService = (overrides = {}) => ({
  id: 1,
  expertId: 2,
  title: 'Professional Hair Styling',
  description: 'Complete hair styling service including cut, wash, and style',
  category: 'Hair & Beauty',
  price: 75,
  duration: 90,
  location: 'Downtown Salon',
  availableSlots: ['09:00', '11:00', '14:00', '16:00'],
  images: [],
  createdAt: '2024-12-28T10:00:00',
  ...overrides
});

// API Response Mocks
export const mockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {}
});

export const mockApiError = (message = 'API Error', status = 500) => ({
  response: {
    data: { message },
    status,
    statusText: 'Internal Server Error'
  },
  message
});

// Form Testing Utilities
export const fillForm = async (user, formFields) => {
  for (const [fieldName, value] of Object.entries(formFields)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
    await user.clear(field);
    await user.type(field, value);
  }
};

export const submitForm = async (user, buttonText = 'submit') => {
  const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
  await user.click(submitButton);
};

// Date Testing Utilities
export const formatTestDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTestTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Wait Utilities
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
};

export const waitForElementToDisappear = async (element) => {
  await waitFor(() => {
    expect(element).not.toBeInTheDocument();
  });
};

// Mock Functions
export const createMockNavigate = () => jest.fn();

export const createMockApiService = () => ({
  login: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
  getExperts: jest.fn(),
  getExpertById: jest.fn(),
  createBooking: jest.fn(),
  getUserBookings: jest.fn(),
  getExpertBookings: jest.fn(),
  updateBookingStatus: jest.fn(),
  createReview: jest.fn(),
  getExpertReviews: jest.fn(),
  uploadFile: jest.fn(),
  getNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
  getDashboardStats: jest.fn(),
  getEarnings: jest.fn(),
  getRecentReviews: jest.fn()
});

// Custom matchers
export const customMatchers = {
  toBeInTheDocument: expect.any(Function),
  toHaveTextContent: expect.any(Function),
  toHaveAttribute: expect.any(Function),
  toBeDisabled: expect.any(Function),
  toBeEnabled: expect.any(Function),
  toBeVisible: expect.any(Function),
  toHaveClass: expect.any(Function)
};

// Test data sets
export const testDataSets = {
  validLoginCredentials: {
    email: 'test@example.com',
    password: 'password123'
  },
  
  validRegistrationData: {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '1234567890',
    userType: 'USER'
  },
  
  validExpertRegistrationData: {
    fullName: 'Test Expert',
    email: 'expert@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '1234567890',
    userType: 'EXPERT',
    expertise: 'Hair Styling',
    experienceYears: '5',
    hourlyRate: '50'
  },
  
  invalidEmails: [
    'invalid-email',
    '@example.com',
    'test@',
    'test.com',
    ''
  ],
  
  weakPasswords: [
    '123',
    'abc',
    'password',
    '12345'
  ]
};

export default {
  renderWithProviders,
  renderWithRouter,
  generateMockUser,
  generateMockExpert,
  generateMockBooking,
  generateMockReview,
  generateMockNotification,
  generateMockService,
  mockApiResponse,
  mockApiError,
  fillForm,
  submitForm,
  formatTestDate,
  formatTestTime,
  waitForLoadingToFinish,
  waitForElementToDisappear,
  createMockNavigate,
  createMockApiService,
  testDataSets
};
