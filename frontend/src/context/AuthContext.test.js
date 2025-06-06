import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import ApiService from '../services/ApiService';

// Mock ApiService
jest.mock('../services/ApiService');

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

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
  });

  test('useAuth throws error when used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  test('initializes with no user when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('initializes with user from localStorage', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    };

    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  test('successful login stores token and user data', async () => {
    const mockLoginResponse = {
      data: {
        accessToken: 'new-token',
        user: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        }
      }
    };

    ApiService.login = jest.fn().mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(loginResult.success).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockLoginResponse.data.user)
    );
    expect(result.current.user).toEqual(mockLoginResponse.data.user);
  });

  test('failed login returns error message', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    };

    ApiService.login = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.message).toBe('Invalid credentials');
    expect(result.current.user).toBeNull();
  });

  test('login handles network error gracefully', async () => {
    ApiService.login = jest.fn().mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.message).toBe('Login failed');
  });

  test('successful registration returns success message', async () => {
    const mockRegisterResponse = {
      data: {
        message: 'Registration successful'
      }
    };

    ApiService.register = jest.fn().mockResolvedValue(mockRegisterResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'USER'
      });
    });

    expect(registerResult.success).toBe(true);
    expect(registerResult.message).toBe('Registration successful');
  });

  test('failed registration returns error message', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Email already exists'
        }
      }
    };

    ApiService.register = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        fullName: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        userType: 'USER'
      });
    });

    expect(registerResult.success).toBe(false);
    expect(registerResult.message).toBe('Email already exists');
  });

  test('registration handles network error gracefully', async () => {
    ApiService.register = jest.fn().mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'USER'
      });
    });

    expect(registerResult.success).toBe(false);
    expect(registerResult.message).toBe('Registration failed');
  });

  test('logout clears user data and localStorage', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    };

    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(result.current.user).toBeNull();
  });

  test('provides all required context values', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('register');
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.register).toBe('function');
  });

  test('handles malformed user data in localStorage', () => {
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce('invalid-json');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('loading state changes correctly during initialization', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Initially loading should be false after initialization
    expect(result.current.loading).toBe(false);
  });

  test('preserves user state across re-renders', () => {
    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    };

    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));

    const { result, rerender } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user).toEqual(mockUser);

    rerender();

    expect(result.current.user).toEqual(mockUser);
  });

  test('initializes properly when localStorage has malformed user data', () => {
    // Mock console.error to prevent error output in test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Set malformed user data in local storage
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce('{ "id": 1, "firstName": "Test" -- malformed json');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Should not crash and should have null user
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    
    // Should have tried to clear the invalid data
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
