import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

// Mock react-router-dom Navigate component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => {
    mockNavigate(to);
    return <div data-testid="navigate-to">{to}</div>;
  }
}));

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const renderProtectedRoute = (authContextValue = {}, requiredRole = null) => {
  const defaultAuthContext = {
    user: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    ...authContextValue
  };

  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <MemoryRouter>
        <ProtectedRoute requiredRole={requiredRole}>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner when loading is true', () => {
    renderProtectedRoute({ loading: true });
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderProtectedRoute({ user: null, loading: false });
    
    expect(screen.getByTestId('navigate-to')).toHaveTextContent('/login');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders children when user is authenticated and no role required', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER'
    };

    renderProtectedRoute({ user: mockUser, loading: false });
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
  });

  test('renders children when user has correct role', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'EXPERT'
    };

    renderProtectedRoute({ user: mockUser, loading: false }, 'EXPERT');
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
  });

  test('redirects to dashboard when user lacks required role', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER'
    };

    renderProtectedRoute({ user: mockUser, loading: false }, 'EXPERT');
    
    expect(screen.getByTestId('navigate-to')).toHaveTextContent('/dashboard');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('redirects to dashboard when user role is undefined but role is required', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
      // role is undefined
    };

    renderProtectedRoute({ user: mockUser, loading: false }, 'ADMIN');
    
    expect(screen.getByTestId('navigate-to')).toHaveTextContent('/dashboard');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles admin role correctly', () => {
    const mockAdmin = {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'ADMIN'
    };

    renderProtectedRoute({ user: mockAdmin, loading: false }, 'ADMIN');
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-to')).not.toBeInTheDocument();
  });

  test('loading state has proper styling', () => {
    renderProtectedRoute({ loading: true });
    
    const loadingContainer = screen.getByRole('progressbar').parentElement;
    expect(loadingContainer).toHaveStyle({
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center'
    });
  });

  test('works with multiple children components', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'USER'
    };

    render(
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <BrowserRouter>
          <ProtectedRoute>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </ProtectedRoute>
        </BrowserRouter>
      </AuthContext.Provider>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  test('case sensitivity for role checking', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'expert' // lowercase
    };

    renderProtectedRoute({ user: mockUser, loading: false }, 'EXPERT');
    
    // Should redirect because roles don't match (case sensitive)
    expect(screen.getByTestId('navigate-to')).toHaveTextContent('/dashboard');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
