// Mock Service Worker handlers for API testing
import { rest } from 'msw';

const API_BASE_URL = 'http://localhost:8080/api';

export const handlers = [
  // Auth endpoints
  rest.post(`${API_BASE_URL}/auth/signin`, (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          accessToken: 'mock-access-token',
          user: {
            id: 1,
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            role: 'USER'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/signup`, (req, res, ctx) => {
    const { email } = req.body;
    
    if (email === 'existing@example.com') {
      return res(
        ctx.status(400),
        ctx.json({ message: 'Email already exists' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({ message: 'Registration successful' })
    );
  }),

  rest.get(`${API_BASE_URL}/auth/me`, (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'USER'
      })
    );
  }),

  // Experts endpoints
  rest.get(`${API_BASE_URL}/experts`, (req, res, ctx) => {
    const expertise = req.url.searchParams.get('expertise');
    const location = req.url.searchParams.get('location');
    
    const experts = [
      {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        expertise: 'Hair Styling',
        location: 'New York',
        rating: 4.8,
        reviewCount: 127,
        hourlyRate: 50
      },
      {
        id: 2,
        firstName: 'Bob',
        lastName: 'Wilson',
        expertise: 'Personal Training',
        location: 'Los Angeles',
        rating: 4.9,
        reviewCount: 89,
        hourlyRate: 45
      }
    ];
    
    let filteredExperts = experts;
    
    if (expertise) {
      filteredExperts = filteredExperts.filter(expert => 
        expert.expertise.toLowerCase().includes(expertise.toLowerCase())
      );
    }
    
    if (location) {
      filteredExperts = filteredExperts.filter(expert => 
        expert.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return res(ctx.status(200), ctx.json(filteredExperts));
  }),

  rest.get(`${API_BASE_URL}/experts/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    const expert = {
      id: parseInt(id),
      firstName: 'Jane',
      lastName: 'Smith',
      expertise: 'Hair Styling',
      location: 'New York',
      rating: 4.8,
      reviewCount: 127,
      hourlyRate: 50,
      bio: 'Professional hair stylist with 10 years of experience',
      services: [
        {
          id: 1,
          title: 'Hair Cut & Style',
          description: 'Professional haircut and styling',
          price: 75,
          duration: 90
        }
      ]
    };
    
    return res(ctx.status(200), ctx.json(expert));
  }),

  // Bookings endpoints
  rest.post(`${API_BASE_URL}/bookings`, (req, res, ctx) => {
    const bookingData = req.body;
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 1,
        ...bookingData,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.get(`${API_BASE_URL}/bookings/user`, (req, res, ctx) => {
    const bookings = [
      {
        id: 1,
        customerName: 'Test User',
        expertName: 'Jane Smith',
        serviceTitle: 'Hair Styling',
        scheduledDate: '2024-12-30T10:00:00',
        status: 'PENDING',
        price: 100
      },
      {
        id: 2,
        customerName: 'Test User',
        expertName: 'Bob Wilson',
        serviceTitle: 'Personal Training',
        scheduledDate: '2024-12-31T14:00:00',
        status: 'CONFIRMED',
        price: 80
      }
    ];
    
    return res(ctx.status(200), ctx.json(bookings));
  }),

  rest.get(`${API_BASE_URL}/bookings/expert`, (req, res, ctx) => {
    const bookings = [
      {
        id: 1,
        customerName: 'John Doe',
        expertName: 'Test Expert',
        serviceTitle: 'Hair Styling',
        scheduledDate: '2024-12-30T10:00:00',
        status: 'PENDING',
        price: 100
      }
    ];
    
    return res(ctx.status(200), ctx.json(bookings));
  }),

  rest.put(`${API_BASE_URL}/bookings/:id/status`, (req, res, ctx) => {
    const { id } = req.params;
    const { status } = req.body;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        status,
        updatedAt: new Date().toISOString()
      })
    );
  }),

  // Reviews endpoints
  rest.post(`${API_BASE_URL}/reviews`, (req, res, ctx) => {
    const reviewData = req.body;
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 1,
        ...reviewData,
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.get(`${API_BASE_URL}/reviews/expert/:expertId`, (req, res, ctx) => {
    const { expertId } = req.params;
    
    const reviews = [
      {
        id: 1,
        rating: 5,
        comment: 'Excellent service!',
        customerName: 'John Doe',
        createdAt: '2024-12-25T12:00:00'
      },
      {
        id: 2,
        rating: 4,
        comment: 'Very professional',
        customerName: 'Jane Smith',
        createdAt: '2024-12-20T15:30:00'
      }
    ];
    
    return res(ctx.status(200), ctx.json(reviews));
  }),

  // File upload endpoint
  rest.post(`${API_BASE_URL}/files/upload`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url: 'https://example.com/uploaded-file.jpg',
        filename: 'uploaded-file.jpg'
      })
    );
  }),

  // Notifications endpoints
  rest.get(`${API_BASE_URL}/notifications`, (req, res, ctx) => {
    const notifications = [
      {
        id: 1,
        title: 'New Booking',
        message: 'You have a new booking request',
        type: 'BOOKING',
        read: false,
        createdAt: '2024-12-28T10:00:00'
      },
      {
        id: 2,
        title: 'Payment Received',
        message: 'Payment has been processed',
        type: 'PAYMENT',
        read: true,
        createdAt: '2024-12-27T15:30:00'
      }
    ];
    
    return res(ctx.status(200), ctx.json(notifications));
  }),

  rest.put(`${API_BASE_URL}/notifications/:id/read`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        read: true,
        updatedAt: new Date().toISOString()
      })
    );
  }),

  // Dashboard endpoints
  rest.get(`${API_BASE_URL}/dashboard/stats`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalBookings: 25,
        pendingBookings: 5,
        completedBookings: 20,
        totalEarnings: 2500
      })
    );
  }),

  rest.get(`${API_BASE_URL}/dashboard/earnings`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        thisMonth: 1200,
        lastMonth: 1100,
        growth: 9.1
      })
    );
  }),

  rest.get(`${API_BASE_URL}/dashboard/recent-reviews`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          rating: 5,
          comment: 'Excellent service!',
          customerName: 'John Doe',
          createdAt: '2024-12-25T12:00:00'
        }
      ])
    );
  }),

  // Error handlers for testing error scenarios
  rest.get(`${API_BASE_URL}/error/500`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
  }),

  rest.get(`${API_BASE_URL}/error/404`, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
  }),

  rest.get(`${API_BASE_URL}/error/network`, (req, res, ctx) => {
    return res.networkError('Network connection failed');
  }),

  // Catch-all handler for unhandled requests
  rest.all('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json({ message: `Endpoint not found: ${req.method} ${req.url}` })
    );
  }),
];

export default handlers;
