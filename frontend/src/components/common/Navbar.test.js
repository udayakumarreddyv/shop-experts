import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderNavbar = (authContextValue = {}) => {
  const defaultAuthContext = {
    user: null,
    token: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    ...authContextValue
  };

  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar correctly when user is not logged in', () => {
    renderNavbar();
    
    expect(screen.getByText(/shop experts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('renders navbar correctly when user is logged in', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    expect(screen.getByText(/shop experts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /account of current user/i })).toBeInTheDocument();
  });

  test('shows user avatar when profile image is available', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      profileImageUrl: 'https://example.com/avatar.jpg',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'Test User');
  });

  test('shows user initials when no profile image is available', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      profileImageUrl: null,
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    expect(screen.getByText('TU')).toBeInTheDocument();
  });

  test('navigates to login when login button is clicked', async () => {
    renderNavbar();
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await userEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to register when register button is clicked', async () => {
    renderNavbar();
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    await userEvent.click(registerButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to dashboard when dashboard button is clicked', async () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    const dashboardButton = screen.getByRole('button', { name: /dashboard/i });
    await userEvent.click(dashboardButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('opens profile menu when profile button is clicked', async () => {
    
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    await userEvent.click(profileButton);
    
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test('opens notification menu when notification button is clicked', async () => {
    
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    const notificationButton = screen.getByRole('button', { name: /notifications/i });
    await userEvent.click(notificationButton);
    
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/no new notifications/i)).toBeInTheDocument();
  });

  test('shows notification badge when there are unread notifications', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user'],
      unreadNotifications: 3
    };

    renderNavbar({ user: mockUser });
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('logs out user when logout is clicked', async () => {
    
    const mockLogout = jest.fn();
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser, logout: mockLogout });
    
    // Open profile menu
    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    await userEvent.click(profileButton);
    
    // Click logout
    const logoutButton = screen.getByText(/logout/i);
    await userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to profile when profile menu item is clicked', async () => {
    
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    // Open profile menu
    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    await userEvent.click(profileButton);
    
    // Click profile
    const profileMenuItem = screen.getByText(/profile/i);
    await userEvent.click(profileMenuItem);
    
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  test('shows expert-specific navigation for expert users', () => {
    const mockExpert = {
      id: 2,
      firstName: 'Test',
      lastName: 'Expert',
      email: 'expert@example.com',
      roles: ['expert']
    };

    renderNavbar({ user: mockExpert });
    
    expect(screen.getByRole('button', { name: /my services/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookings/i })).toBeInTheDocument();
  });

  test('closes menus when clicking outside', async () => {
    
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    // Open profile menu
    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    await userEvent.click(profileButton);
    
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    
    // Click outside to close menu
    await userEvent.click(document.body);
    
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
  });

  test('handles keyboard navigation', async () => {
    
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roles: ['user']
    };

    renderNavbar({ user: mockUser });
    
    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    
    // Focus and press Enter
    profileButton.focus();
    await userEvent.keyboard('{Enter}');
    
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    
    // Press Escape to close
    await userEvent.keyboard('{Escape}');
    
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
  });
});
