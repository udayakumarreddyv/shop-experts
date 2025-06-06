import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../context/AuthContext';
import ApiService from '../../services/ApiService';

// Mock ApiService
jest.mock('../../services/ApiService');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderLogin = (authContextValue = {}) => {
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
    <AuthProvider value={defaultAuthContext}>
      <Login />
    </AuthProvider>,
    { wrapper: BrowserRouter }
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiService.login = jest.fn();
  });

  test('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    
    const mockLogin = jest.fn().mockResolvedValue({
      data: {
        accessToken: 'mock-token',
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' }
      }
    });
    
    ApiService.login = mockLogin;
    
    renderLogin({ login: jest.fn() });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('displays error message on login failure', async () => {
    
    const mockLogin = jest.fn().mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });
    
    ApiService.login = mockLogin;
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    
    const mockLogin = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    ApiService.login = mockLogin;
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('toggles password visibility', async () => {
    
    renderLogin();
    
    // Use data-testid to unambiguously select the password field
    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('navigates to register page', async () => {
    
    renderLogin();
    
    const registerLink = screen.getByText(/sign up/i);
    await userEvent.click(registerLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('redirects authenticated user', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    renderLogin({ user: mockUser, token: 'mock-token' });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles network error gracefully', async () => {
    
    const mockLogin = jest.fn().mockRejectedValue(new Error('Network Error'));
    
    ApiService.login = mockLogin;
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
