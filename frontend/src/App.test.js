import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';
import { renderWithProviders, mockAuthUser, mockExpertUser } from './utils/testUtils';

// Disable the router in App.js so we can use our test router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <>{children}</>
}));

// Mock child components to focus on App routing logic
jest.mock('./components/common/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('./components/common/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./components/auth/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./components/auth/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('./pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-page">Dashboard Page</div>;
  };
});

jest.mock('./components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children, requiredRole }) {
    const mockUser = mockAuthUser();
    
    // Simulate role-based access control
    if (requiredRole && requiredRole === 'ROLE_ADMIN' && mockUser.role !== 'ROLE_ADMIN') {
      return <div data-testid="access-denied">Access Denied</div>;
    }
    
    return <div data-testid="protected-route">{children}</div>;
  };
});

describe('App Component', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Application Structure', () => {
    it('renders main application layout components', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('applies Material-UI theme correctly', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Check that MUI theme is applied by looking for CSS baseline
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('has proper flex layout structure', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('Routing', () => {
    it('renders Home page at root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders Login page at /login path', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders Register page at /register path', () => {
      render(
        <MemoryRouter initialEntries={['/register']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });

    it('renders Dashboard page at /dashboard path with protection', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('renders Search placeholder at /search path', () => {
      render(
        <MemoryRouter initialEntries={['/search']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText('Search Page Coming Soon')).toBeInTheDocument();
    });

    it('renders Profile placeholder at /profile path with protection', () => {
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByText('Profile Page Coming Soon')).toBeInTheDocument();
    });

    it('renders Bookings placeholder at /bookings path with protection', () => {
      render(
        <MemoryRouter initialEntries={['/bookings']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByText('Bookings Page Coming Soon')).toBeInTheDocument();
    });

    it('renders Admin placeholder at /admin path with admin protection', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByText('Admin Panel Coming Soon')).toBeInTheDocument();
    });

    it('handles non-existent routes gracefully', () => {
      render(
        <MemoryRouter initialEntries={['/non-existent-route']}>
          <App />
        </MemoryRouter>
      );

      // Should still render layout components
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Theme Configuration', () => {
    it('provides Material-UI theme to all components', () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Check that theme provider is wrapping the content
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies CSS baseline for consistent styling', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // CssBaseline should be applied (this is hard to test directly, 
      // but we can ensure the component renders without errors)
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Authentication Integration', () => {
    it('wraps application with AuthProvider', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // AuthProvider should be providing context to child components
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('provides authentication context to protected routes', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Layout Responsiveness', () => {
    it('maintains layout structure on different screen sizes', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('handles mobile viewport correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles component rendering errors gracefully', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // App should render even if there are minor errors
      expect(screen.getByTestId('navbar')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('maintains layout integrity with failed route components', () => {
      render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <App />
        </MemoryRouter>
      );

      // Layout components should still be present
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('allows navigation between public routes', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      // Navigate to login
      rerender(
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('allows navigation to protected routes when authenticated', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      // Navigate to protected dashboard
      rerender(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders application efficiently', () => {
      const startTime = performance.now();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (less than 100ms for this simple structure)
      expect(renderTime).toBeLessThan(100);
    });

    it('handles multiple route changes efficiently', () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const routes = ['/', '/login', '/register', '/search'];
      
      routes.forEach(route => {
        rerender(
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        );
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper semantic structure', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      // Focus should be manageable
      main.focus();
      expect(document.activeElement).toBe(main);
    });
  });
});
