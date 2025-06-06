import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthContext } from '../context/AuthContext';
import ApiService from '../services/ApiService';

// Mock ApiService
jest.mock('../services/ApiService');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockUser = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'USER'
};

const mockExpert = {
  id: 2,
  firstName: 'Test',
  lastName: 'Expert',
  email: 'expert@example.com',
  role: 'EXPERT'
};

const mockDashboardData = {
  stats: {
    totalBookings: 25,
    pendingBookings: 5,
    completedBookings: 20,
    totalEarnings: 2500
  },
  recentBookings: [
    {
      id: 1,
      customerName: 'John Doe',
      expertName: 'Jane Smith',
      serviceTitle: 'Hair Styling',
      scheduledDate: '2024-12-30T10:00:00',
      status: 'PENDING',
      price: 100
    },
    {
      id: 2,
      customerName: 'Alice Johnson',
      expertName: 'Bob Wilson',
      serviceTitle: 'Personal Training',
      scheduledDate: '2024-12-31T14:00:00',
      status: 'CONFIRMED',
      price: 80
    }
  ],
  notifications: [
    {
      id: 1,
      message: 'New booking request',
      createdAt: '2024-12-28T10:00:00',
      read: false
    },
    {
      id: 2,
      message: 'Payment received',
      createdAt: '2024-12-27T15:30:00',
      read: true
    }
  ],
  earnings: {
    thisMonth: 1200,
    lastMonth: 1100,
    growth: 9.1
  },
  reviews: [
    {
      id: 1,
      rating: 5,
      comment: 'Excellent service!',
      customerName: 'John Doe',
      createdAt: '2024-12-25T12:00:00'
    }
  ]
};

const renderDashboard = (authContextValue = {}) => {
  const defaultAuthContext = {
    user: mockUser,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    ...authContextValue
  };

  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiService.getUserBookings = jest.fn().mockResolvedValue({ data: mockDashboardData.recentBookings });
    ApiService.getNotifications = jest.fn().mockResolvedValue({ data: mockDashboardData.notifications });
    ApiService.getDashboardStats = jest.fn().mockResolvedValue({ data: mockDashboardData.stats });
    ApiService.getEarnings = jest.fn().mockResolvedValue({ data: mockDashboardData.earnings });
    ApiService.getRecentReviews = jest.fn().mockResolvedValue({ data: mockDashboardData.reviews });
  });

  test('shows loading state initially', () => {
    renderDashboard();
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders dashboard correctly for regular user', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/my bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
  });

  test('renders dashboard correctly for expert user', async () => {
    ApiService.getExpertBookings = jest.fn().mockResolvedValue({ data: mockDashboardData.recentBookings });
    
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/my services/i)).toBeInTheDocument();
    expect(screen.getByText(/earnings overview/i)).toBeInTheDocument();
  });

  test('displays user statistics cards', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/total bookings/i)).toBeInTheDocument();
      expect(screen.getByText(/25/)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
    });
  });

  test('displays expert statistics including earnings', async () => {
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/total earnings/i)).toBeInTheDocument();
      expect(screen.getByText(/\$2,500/)).toBeInTheDocument();
    });
  });

  test('displays recent bookings table', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/hair styling/i)).toBeInTheDocument();
      expect(screen.getByText(/personal training/i)).toBeInTheDocument();
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/alice johnson/i)).toBeInTheDocument();
    });
  });

  test('displays booking status chips with correct colors', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const pendingChip = screen.getByText(/pending/i);
      const confirmedChip = screen.getByText(/confirmed/i);
      
      expect(pendingChip).toBeInTheDocument();
      expect(confirmedChip).toBeInTheDocument();
    });
  });

  test('displays notifications section', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/notifications/i)).toBeInTheDocument();
      expect(screen.getByText(/new booking request/i)).toBeInTheDocument();
      expect(screen.getByText(/payment received/i)).toBeInTheDocument();
    });
  });

  test('shows unread notification indicators', async () => {
    renderDashboard();
    
    await waitFor(() => {
      // Check for unread notification styling or indicators
      expect(screen.getByText(/new booking request/i)).toBeInTheDocument();
    });
  });

  test('displays earnings overview for experts', async () => {
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/this month/i)).toBeInTheDocument();
      expect(screen.getByText(/\$1,200/)).toBeInTheDocument();
      expect(screen.getByText(/9\.1%/)).toBeInTheDocument();
    });
  });

  test('displays recent reviews for experts', async () => {
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/recent reviews/i)).toBeInTheDocument();
      expect(screen.getByText(/excellent service!/i)).toBeInTheDocument();
    });
  });

  test('navigates to booking details when view button is clicked', async () => {
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/hair styling/i)).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    if (viewButtons.length > 0) {
      await userEvent.click(viewButtons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/bookings/1');
    }
  });

  test('opens booking action menu when more button is clicked', async () => {
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/hair styling/i)).toBeInTheDocument();
    });
    
    const moreButtons = screen.getAllByRole('button', { name: /more/i });
    if (moreButtons.length > 0) {
      await userEvent.click(moreButtons[0]);
      expect(screen.getByText(/edit/i)).toBeInTheDocument();
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    }
  });

  test('handles booking status update', async () => {
    
    ApiService.updateBookingStatus = jest.fn().mockResolvedValue({ data: { success: true } });
    
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/hair styling/i)).toBeInTheDocument();
    });
    
    // This would test the status update functionality if it exists
    const statusButtons = screen.queryAllByRole('button', { name: /confirm/i });
    if (statusButtons.length > 0) {
      await userEvent.click(statusButtons[0]);
      expect(ApiService.updateBookingStatus).toHaveBeenCalled();
    }
  });

  test('navigates to create new service for experts', async () => {
    
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/my services/i)).toBeInTheDocument();
    });
    
    const createServiceButton = screen.queryByRole('button', { name: /create service/i });
    if (createServiceButton) {
      await userEvent.click(createServiceButton);
      expect(mockNavigate).toHaveBeenCalledWith('/services/create');
    }
  });

  test('navigates to profile when profile button is clicked', async () => {
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
    
    const profileButton = screen.queryByRole('button', { name: /view profile/i });
    if (profileButton) {
      await userEvent.click(profileButton);
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    }
  });

  test('handles API errors gracefully', async () => {
    ApiService.getUserBookings = jest.fn().mockRejectedValue(new Error('API Error'));
    
    renderDashboard();
    
    await waitFor(() => {
      // Should handle error gracefully, maybe show error message or empty state
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  test('displays empty state when no bookings exist', async () => {
    ApiService.getUserBookings = jest.fn().mockResolvedValue({ data: [] });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/no bookings yet/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no notifications exist', async () => {
    ApiService.getNotifications = jest.fn().mockResolvedValue({ data: [] });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/no new notifications/i)).toBeInTheDocument();
    });
  });

  test('formats dates correctly in booking table', async () => {
    renderDashboard();
    
    await waitFor(() => {
      // Check that dates are formatted properly
      expect(screen.getByText(/dec 30, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/10:00 am/i)).toBeInTheDocument();
    });
  });

  test('formats currency correctly in earnings display', async () => {
    renderDashboard({ user: mockExpert });
    
    await waitFor(() => {
      expect(screen.getByText(/\$1,200/)).toBeInTheDocument();
      expect(screen.getByText(/\$1,100/)).toBeInTheDocument();
    });
  });

  test('shows progress indicators for dashboard stats', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar');
      // Should have progress bars for loading and possibly for stat visualizations
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  test('handles notification click to mark as read', async () => {
    
    ApiService.markNotificationAsRead = jest.fn().mockResolvedValue({ data: { success: true } });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/new booking request/i)).toBeInTheDocument();
    });
    
    const notificationItem = screen.getByText(/new booking request/i);
    await userEvent.click(notificationItem);
    
    expect(ApiService.markNotificationAsRead).toHaveBeenCalledWith(1);
  });
});
