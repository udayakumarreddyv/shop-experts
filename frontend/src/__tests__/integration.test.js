import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { renderWithProviders, mockAuthUser, mockExpertUser, mockBooking } from '../utils/testUtils';
import App from '../App';

// Integration tests for complete user workflows
describe('Integration Tests - User Workflows', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset any global state
    jest.clearAllMocks();
  });

  describe('User Registration and Login Flow', () => {
    it('completes full user registration and login process', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Start at home page
      expect(screen.getByText(/welcome to shop experts/i)).toBeInTheDocument();

      // Navigate to register
      const registerLink = screen.getByRole('link', { name: /register/i });
      await userEvent.click(registerLink);

      // Fill out registration form
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      
      // Select user type
      const userTypeSelect = screen.getByLabelText(/user type/i);
      await userEvent.click(userTypeSelect);
      await userEvent.click(screen.getByRole('option', { name: /customer/i }));

      // Submit registration
      const registerButton = screen.getByRole('button', { name: /register/i });
      await userEvent.click(registerButton);

      // Should redirect to login after successful registration
      await waitFor(() => {
        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
      });

      // Login with the same credentials
      await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);

      // Should redirect to dashboard after successful login
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });

    it('handles registration validation errors gracefully', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to register
      const registerLink = screen.getByRole('link', { name: /register/i });
      await userEvent.click(registerLink);

      // Try to submit without filling required fields
      const registerButton = screen.getByRole('button', { name: /register/i });
      await userEvent.click(registerButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      // Fill with invalid email
      await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
      await userEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('handles login errors and recovery flow', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to login
      const loginLink = screen.getByRole('link', { name: /login/i });
      await userEvent.click(loginLink);

      // Try login with wrong credentials
      await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Try with correct credentials
      await userEvent.clear(screen.getByLabelText(/email/i));
      await userEvent.clear(screen.getByLabelText(/password/i));
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      
      await userEvent.click(loginButton);

      // Should succeed and redirect
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('Expert Search and Booking Flow', () => {
    it('completes full expert search and booking process', async () => {
      // Start with authenticated user
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Start at home page
      expect(screen.getByText(/welcome to shop experts/i)).toBeInTheDocument();

      // Search for experts
      const searchInput = screen.getByPlaceholderText(/search for experts/i);
      await userEvent.type(searchInput, 'hair styling');

      const searchButton = screen.getByRole('button', { name: /search/i });
      await userEvent.click(searchButton);

      // Should show search results
      await waitFor(() => {
        expect(screen.getByText(/search results/i)).toBeInTheDocument();
        expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
      });

      // Click on an expert to view details
      const expertCard = screen.getByText(/jane smith/i).closest('[data-testid="expert-card"]');
      await userEvent.click(expertCard);

      // Should show expert details
      await waitFor(() => {
        expect(screen.getByText(/book appointment/i)).toBeInTheDocument();
        expect(screen.getByText(/hair cut & style/i)).toBeInTheDocument();
      });

      // Book an appointment
      const serviceCard = screen.getByText(/hair cut & style/i).closest('[data-testid="service-card"]');
      const bookButton = within(serviceCard).getByRole('button', { name: /book now/i });
      await userEvent.click(bookButton);

      // Fill booking form
      const dateInput = screen.getByLabelText(/date/i);
      await userEvent.type(dateInput, '2024-12-15');

      const timeSelect = screen.getByLabelText(/time/i);
      await userEvent.click(timeSelect);
      await userEvent.click(screen.getByRole('option', { name: /10:00 AM/i }));

      const notesInput = screen.getByLabelText(/notes/i);
      await userEvent.type(notesInput, 'First time booking, looking forward to it!');

      const confirmBookingButton = screen.getByRole('button', { name: /confirm booking/i });
      await userEvent.click(confirmBookingButton);

      // Should show booking confirmation
      await waitFor(() => {
        expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
        expect(screen.getByText(/december 15, 2024/i)).toBeInTheDocument();
      });
    });

    it('handles booking conflicts and alternative suggestions', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to expert booking
      // ... (navigate to expert details)

      // Try to book an unavailable slot
      const dateInput = screen.getByLabelText(/date/i);
      await userEvent.type(dateInput, '2024-12-25'); // Assume this is unavailable

      const timeSelect = screen.getByLabelText(/time/i);
      await userEvent.click(timeSelect);
      await userEvent.click(screen.getByRole('option', { name: /10:00 AM/i }));

      const confirmBookingButton = screen.getByRole('button', { name: /confirm booking/i });
      await userEvent.click(confirmBookingButton);

      // Should show conflict message and alternatives
      await waitFor(() => {
        expect(screen.getByText(/time slot not available/i)).toBeInTheDocument();
        expect(screen.getByText(/suggested alternatives/i)).toBeInTheDocument();
      });

      // Select an alternative
      const alternativeButton = screen.getByRole('button', { name: /book 2:00 PM instead/i });
      await userEvent.click(alternativeButton);

      // Should complete booking with alternative time
      await waitFor(() => {
        expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dashboard and Profile Management Flow', () => {
    it('allows user to manage profile and view bookings', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to dashboard
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      // Should show dashboard with user info
      await waitFor(() => {
        expect(screen.getByText(/welcome back, test/i)).toBeInTheDocument();
        expect(screen.getByText(/your bookings/i)).toBeInTheDocument();
      });

      // View booking details
      const viewBookingButton = screen.getByRole('button', { name: /view details/i });
      await userEvent.click(viewBookingButton);

      // Should show booking details modal
      await waitFor(() => {
        expect(screen.getByText(/booking details/i)).toBeInTheDocument();
        expect(screen.getByText(/cancel booking/i)).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      // Edit profile
      const editProfileButton = screen.getByRole('button', { name: /edit profile/i });
      await userEvent.click(editProfileButton);

      // Update profile information
      const phoneInput = screen.getByLabelText(/phone number/i);
      await userEvent.type(phoneInput, '555-123-4567');

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      await userEvent.click(saveButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
      });
    });

    it('handles expert dashboard workflow', async () => {
      const mockExpert = mockExpertUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockExpert));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to dashboard
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      // Should show expert dashboard
      await waitFor(() => {
        expect(screen.getByText(/expert dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/upcoming appointments/i)).toBeInTheDocument();
        expect(screen.getByText(/earnings this month/i)).toBeInTheDocument();
      });

      // Manage availability
      const manageAvailabilityButton = screen.getByRole('button', { name: /manage availability/i });
      await userEvent.click(manageAvailabilityButton);

      // Update availability
      const mondayCheckbox = screen.getByLabelText(/monday/i);
      await userEvent.click(mondayCheckbox);

      const saveAvailabilityButton = screen.getByRole('button', { name: /save availability/i });
      await userEvent.click(saveAvailabilityButton);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/availability updated/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and Route Protection Flow', () => {
    it('protects routes and redirects unauthorized users', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Try to access protected dashboard without authentication
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
      });

      // Login and try again
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);

      // Should now be able to access dashboard
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });

    it('handles role-based access control', async () => {
      const mockUser = mockAuthUser(); // Regular user
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Try to access admin panel as regular user
      // Manually navigate to admin route
      window.history.pushState({}, 'Admin', '/admin');

      // Should show access denied
      await waitFor(() => {
        expect(screen.getByText(/access denied/i)).toBeInTheDocument();
      });
    });

    it('maintains navigation state across page refreshes', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { rerender } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to dashboard
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Simulate page refresh by re-rendering
      rerender(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Should maintain authenticated state and dashboard view
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('handles network errors gracefully', async () => {
      // Mock network failure
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Try to login with network error
      const loginLink = screen.getByRole('link', { name: /login/i });
      await userEvent.click(loginLink);

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });

      // Restore original fetch
      global.fetch = originalFetch;
    });

    it('handles session expiration gracefully', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'expired-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Try to access protected resource with expired token
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      // Should redirect to login and show session expired message
      await waitFor(() => {
        expect(screen.getByText(/session expired/i)).toBeInTheDocument();
        expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
      });
    });

    it('handles concurrent user actions gracefully', async () => {
      const mockUser = mockAuthUser();
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate to dashboard
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      await userEvent.click(dashboardLink);

      // Simulate multiple concurrent actions
      const buttons = screen.getAllByRole('button');
      
      // Click multiple buttons rapidly
      await Promise.all(
        buttons.slice(0, 3).map(button => userEvent.click(button))
      );

      // Application should remain stable
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('supports full keyboard navigation workflow', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Navigate using Tab key
      await userEvent.tab(); // Should focus first focusable element
      expect(document.activeElement).toBeInTheDocument();

      // Continue tabbing through navigation
      await userEvent.tab();
      await userEvent.tab();
      
      // Should be able to activate elements with Enter/Space
      if (document.activeElement.tagName === 'A' || document.activeElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
      }

      // Should navigate to appropriate page
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });

    it('maintains focus management during navigation', async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );

      // Focus on a navigation link
      const loginLink = screen.getByRole('link', { name: /login/i });
      loginLink.focus();
      expect(document.activeElement).toBe(loginLink);

      // Navigate to login page
      await userEvent.click(loginLink);

      // Focus should be managed appropriately on the new page
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });
    });
  });
});
