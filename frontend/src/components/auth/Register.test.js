import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
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

const renderRegister = (authContextValue = {}) => {
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
    <BrowserRouter>
      <AuthProvider value={defaultAuthContext}>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiService.register = jest.fn();
  });

  test('renders register form correctly', () => {
    renderRegister();
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('renders user type selection', () => {
    renderRegister();
    
    expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expert/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer/i)).toBeChecked();
  });

  test('shows expert fields when expert is selected', async () => {
    
    renderRegister();
    
    const expertRadio = screen.getByLabelText(/expert/i);
    await userEvent.click(expertRadio);
    
    expect(screen.getByLabelText(/expertise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/experience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hourly rate/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    
    renderRegister();
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    
    renderRegister();
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test('validates password confirmation', async () => {
    
    renderRegister();
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'differentpassword');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('validates password strength', async () => {
    
    renderRegister();
    
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, '123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  test('submits form with valid user data', async () => {
    
    const mockRegister = jest.fn().mockResolvedValue({
      data: { message: 'Registration successful' }
    });
    
    renderRegister({ register: mockRegister });
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        phone: '1234567890',
        userType: 'USER',
        expertise: '',
        experienceYears: '',
        hourlyRate: ''
      });
    });
  });

  test('submits form with expert data', async () => {
    
    const mockRegister = jest.fn().mockResolvedValue({
      data: { message: 'Registration successful' }
    });
    
    renderRegister({ register: mockRegister });
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test Expert');
    await userEvent.type(screen.getByLabelText(/email/i), 'expert@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    // Select expert type
    await userEvent.click(screen.getByLabelText(/expert/i));
    
    // Fill expert fields
    await userEvent.type(screen.getByLabelText(/expertise/i), 'Hair Styling');
    await userEvent.type(screen.getByLabelText(/experience/i), '5');
    await userEvent.type(screen.getByLabelText(/hourly rate/i), '50');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: 'Test Expert',
        email: 'expert@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        phone: '1234567890',
        userType: 'EXPERT',
        expertise: 'Hair Styling',
        experienceYears: '5',
        hourlyRate: '50'
      });
    });
  });

  test('displays error message on registration failure', async () => {
    
    const mockRegister = jest.fn().mockResolvedValue({
      success: false,
      message: 'Email already exists'
    });
    
    renderRegister({ register: mockRegister });
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during registration', async () => {
    
    const mockRegister = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    renderRegister({ register: mockRegister });
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('navigates to login page on successful registration', async () => {
    
    const mockRegister = jest.fn().mockResolvedValue({
      success: true,
      message: 'Registration successful'
    });
    
    renderRegister({ register: mockRegister });
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('navigates to login page via link', async () => {
    
    renderRegister();
    
    const loginLink = screen.getByText(/sign in/i);
    await userEvent.click(loginLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
