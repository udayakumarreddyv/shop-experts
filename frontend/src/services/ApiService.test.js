import ApiService from './ApiService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Create a mock axios instance
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn()
    },
    response: {
      use: jest.fn()
    }
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

// Mock axios.create to return our mock instance
mockedAxios.create = jest.fn(() => mockAxiosInstance);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.location
const mockLocation = {
  href: ''
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('ApiService', () => {
  let apiService;
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock axios instance
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Create new instance for each test
    apiService = new ApiService();
  });

  test('creates axios instance with correct base configuration', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('sets up request interceptor', () => {
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  test('sets up response interceptor', () => {
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  test('login calls correct endpoint with credentials', async () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { data: { accessToken: 'token', user: {} } };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiService.login(credentials);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/signin', credentials);
    expect(result).toEqual(mockResponse);
  });

  test('register calls correct endpoint with user data', async () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      userType: 'USER'
    };
    const mockResponse = { data: { message: 'Registration successful' } };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiService.register(userData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/signup', userData);
    expect(result).toEqual(mockResponse);
  });

  test('getCurrentUser calls correct endpoint', async () => {
    const mockResponse = { data: { id: 1, email: 'test@example.com' } };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getCurrentUser();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(mockResponse);
  });

  test('getExperts calls correct endpoint with params', async () => {
    const params = { expertise: 'Hair Styling', location: 'New York' };
    const mockResponse = { data: [{ id: 1, name: 'Expert 1' }] };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getExperts(params);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/experts', { params });
    expect(result).toEqual(mockResponse);
  });

  test('getExpertById calls correct endpoint', async () => {
    const expertId = 1;
    const mockResponse = { data: { id: 1, name: 'Expert 1' } };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getExpertById(expertId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/experts/${expertId}`);
    expect(result).toEqual(mockResponse);
  });

  test('createBooking calls correct endpoint with booking data', async () => {
    const bookingData = {
      expertId: 1,
      serviceId: 1,
      scheduledDate: '2024-12-30T10:00:00'
    };
    const mockResponse = { data: { id: 1, status: 'PENDING' } };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiService.createBooking(bookingData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/bookings', bookingData);
    expect(result).toEqual(mockResponse);
  });

  test('getUserBookings calls correct endpoint', async () => {
    const mockResponse = { data: [{ id: 1, status: 'PENDING' }] };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getUserBookings();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bookings/user');
    expect(result).toEqual(mockResponse);
  });

  test('getExpertBookings calls correct endpoint', async () => {
    const mockResponse = { data: [{ id: 1, status: 'PENDING' }] };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getExpertBookings();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bookings/expert');
    expect(result).toEqual(mockResponse);
  });

  test('updateBookingStatus calls correct endpoint', async () => {
    const bookingId = 1;
    const status = 'CONFIRMED';
    const mockResponse = { data: { id: 1, status: 'CONFIRMED' } };
    
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const result = await apiService.updateBookingStatus(bookingId, status);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(
      `/bookings/${bookingId}/status`,
      { status }
    );
    expect(result).toEqual(mockResponse);
  });

  test('createReview calls correct endpoint with review data', async () => {
    const reviewData = {
      bookingId: 1,
      rating: 5,
      comment: 'Excellent service!'
    };
    const mockResponse = { data: { id: 1, rating: 5 } };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiService.createReview(reviewData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/reviews', reviewData);
    expect(result).toEqual(mockResponse);
  });

  test('getExpertReviews calls correct endpoint', async () => {
    const expertId = 1;
    const mockResponse = { data: [{ id: 1, rating: 5 }] };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getExpertReviews(expertId);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/reviews/expert/${expertId}`);
    expect(result).toEqual(mockResponse);
  });

  test('uploadFile calls correct endpoint with form data', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = { data: { url: 'https://example.com/file.jpg' } };
    
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    const result = await apiService.uploadFile(file);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/files/upload',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  test('getNotifications calls correct endpoint', async () => {
    const mockResponse = { data: [{ id: 1, message: 'Test notification' }] };
    
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    const result = await apiService.getNotifications();

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/notifications');
    expect(result).toEqual(mockResponse);
  });

  test('markNotificationAsRead calls correct endpoint', async () => {
    const notificationId = 1;
    const mockResponse = { data: { id: 1, read: true } };
    
    mockAxiosInstance.put.mockResolvedValue(mockResponse);

    const result = await apiService.markNotificationAsRead(notificationId);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/notifications/${notificationId}/read`);
    expect(result).toEqual(mockResponse);
  });

  test('request interceptor adds authorization header when token exists', () => {
    const mockToken = 'test-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    // Get the request interceptor function
    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    
    const config = { headers: {} };
    const result = requestInterceptor(config);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  test('request interceptor does not add header when no token exists', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    
    const config = { headers: {} };
    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test('response interceptor handles 401 errors by clearing storage and redirecting', () => {
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    
    const error = {
      response: {
        status: 401
      }
    };

    expect(() => responseInterceptor(error)).rejects.toEqual(error);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(window.location.href).toBe('/login');
  });

  test('response interceptor passes through non-401 errors', () => {
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    
    const error = {
      response: {
        status: 500
      }
    };

    expect(() => responseInterceptor(error)).rejects.toEqual(error);
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
  });

  test('response interceptor passes through successful responses', () => {
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
    
    const response = { data: { success: true } };
    const result = responseInterceptor(response);

    expect(result).toEqual(response);
  });

  test('handles network errors gracefully', async () => {
    const networkError = new Error('Network Error');
    mockAxiosInstance.post.mockRejectedValue(networkError);

    await expect(apiService.login({})).rejects.toThrow('Network Error');
  });

  test('API methods handle server errors gracefully', async () => {
    const serverError = {
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    };
    mockAxiosInstance.get.mockRejectedValue(serverError);

    await expect(apiService.getCurrentUser()).rejects.toEqual(serverError);
  });
});
