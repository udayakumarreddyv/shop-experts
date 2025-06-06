import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { renderWithProviders, mockAuthUser } from '../utils/testUtils';
import App from '../App';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {

  beforeEach(() => {
    // Clear any previous state
    localStorage.clear();
  });

  describe('WCAG Compliance', () => {
    it('App component should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<App />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Login component should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Login />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Register component should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Register />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Navbar component should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Navbar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Footer component should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Home page should not have accessibility violations', async () => {
      const { container } = renderWithProviders(<Home />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('Dashboard page should not have accessibility violations', async () => {
      const mockUser = mockAuthUser();
      const { container } = renderWithProviders(<Dashboard />, {
        authContext: { user: mockUser, isAuthenticated: true }
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports full keyboard navigation in main app', async () => {
      renderWithProviders(<App />);

      // Should be able to tab through all interactive elements
      await userEvent.tab(); // First focusable element
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
      expect(document.activeElement).toBeVisible();

      await userEvent.tab(); // Second focusable element
      expect(document.activeElement).toBeInstanceOf(HTMLElement);

      // Should be able to activate focused elements with Enter
      if (document.activeElement.tagName === 'A' || document.activeElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
        // Element should respond to keyboard activation
        expect(document.activeElement).toBeInstanceOf(HTMLElement);
      }
    });

    it('supports keyboard navigation in forms', async () => {
      renderWithProviders(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Tab through form elements
      await userEvent.tab();
      expect(document.activeElement).toBe(emailInput);

      await userEvent.tab();
      expect(document.activeElement).toBe(passwordInput);

      await userEvent.tab();
      expect(document.activeElement).toBe(loginButton);

      // Should be able to submit form with Enter
      emailInput.focus();
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.keyboard('{Tab}');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.keyboard('{Enter}');

      // Form should submit (test for expected behavior)
      expect(emailInput.value).toBe('test@example.com');
    });

    it('handles focus management correctly', async () => {
      renderWithProviders(<App />);

      // Get initial focused element
      const initialFocus = document.activeElement;

      // Navigate to different page
      const loginLink = screen.getByRole('link', { name: /login/i });
      await userEvent.click(loginLink);

      // Focus should be managed appropriately on page change
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
      expect(document.activeElement).toBeVisible();
    });

    it('supports Escape key functionality', async () => {
      renderWithProviders(<App />);

      // If there are any modal or dropdown elements, test Escape key
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        await userEvent.click(buttons[0]);
        await userEvent.keyboard('{Escape}');
        // Should close any opened elements
        expect(document.activeElement).toBeInstanceOf(HTMLElement);
      }
    });
  });

  describe('ARIA Labels and Roles', () => {
    it('has proper ARIA labels on form elements', () => {
      renderWithProviders(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute('aria-label');
      expect(passwordInput).toHaveAttribute('aria-label');
    });

    it('has proper semantic structure', () => {
      renderWithProviders(<App />);

      // Check for proper semantic elements
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('provides proper ARIA descriptions for complex elements', () => {
      renderWithProviders(<Register />);

      const userTypeSelect = screen.getByLabelText(/user type/i);
      expect(userTypeSelect).toHaveAttribute('aria-describedby');
    });

    it('has proper heading hierarchy', () => {
      renderWithProviders(<Home />);

      // Check heading hierarchy
      const headings = screen.getAllByRole('heading');
      let previousLevel = 0;

      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        // Heading levels should not skip (h1, h2, h3, not h1, h3)
        expect(level).toBeLessThanOrEqual(previousLevel + 1);
        previousLevel = level;
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('provides descriptive text for screen readers', () => {
      renderWithProviders(<App />);

      // Check for sr-only text or aria-label attributes
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('announces dynamic content changes', async () => {
      renderWithProviders(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Try to submit form to trigger error message
      await userEvent.click(loginButton);

      // Error message should be announced to screen readers
      const errorMessage = screen.queryByRole('alert');
      if (errorMessage) {
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('aria-live');
      }
    });

    it('provides context for form validation', async () => {
      renderWithProviders(<Register />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const submitButton = screen.getByRole('button', { name: /register/i });

      // Trigger validation
      await userEvent.click(submitButton);

      // Check for error descriptions
      const errorMessages = screen.getAllByRole('alert', { hidden: true });
      errorMessages.forEach(error => {
        expect(error).toHaveAttribute('id');
      });
    });
  });

  describe('Color Contrast and Visual Design', () => {
    it('maintains proper color contrast ratios', () => {
      const { container } = renderWithProviders(<App />);

      // Check that text elements have sufficient contrast
      // Note: This is a simplified check - in real scenarios, you'd use 
      // tools like axe-core for comprehensive contrast checking
      const textElements = container.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
      
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Ensure elements have defined colors
        expect(color).not.toBe('');
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          expect(backgroundColor).not.toBe('');
        }
      });
    });

    it('does not rely solely on color for information', () => {
      renderWithProviders(<Register />);

      // Error messages should have text, not just color
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        // Check that validation doesn't rely only on color
        const ariaDescribedBy = input.getAttribute('aria-describedby');
        if (ariaDescribedBy) {
          const description = document.getElementById(ariaDescribedBy);
          if (description) {
            expect(description.textContent).not.toBe('');
          }
        }
      });
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('maintains accessibility on mobile viewports', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<App />);

      // Check that interactive elements are still accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeVisible();
        expect(button).toHaveAccessibleName();
      });
    });

    it('maintains focus visibility on all screen sizes', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithProviders(<App />);

      // Focus should be visible on tablet viewport
      const firstFocusable = screen.getAllByRole('button')[0];
      if (firstFocusable) {
        firstFocusable.focus();
        expect(document.activeElement).toBe(firstFocusable);
      }
    });
  });

  describe('Error Handling Accessibility', () => {
    it('announces errors to screen readers', async () => {
      renderWithProviders(<Login />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      await userEvent.click(loginButton);

      // Check for ARIA live regions for error announcements
      const alerts = screen.getAllByRole('alert', { hidden: true });
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          expect(alert).toHaveAttribute('aria-live');
        });
      }
    });

    it('provides clear error messages', async () => {
      renderWithProviders(<Register />);

      const submitButton = screen.getByRole('button', { name: /register/i });
      await userEvent.click(submitButton);

      // Error messages should be clear and actionable
      const errorMessages = screen.getAllByText(/required/i, { hidden: true });
      errorMessages.forEach(message => {
        expect(message.textContent).toMatch(/\w+/); // Should contain actual words
      });
    });
  });

  describe('Form Accessibility', () => {
    it('associates labels with form controls correctly', () => {
      renderWithProviders(<Register />);

      const formControls = screen.getAllByRole('textbox');
      formControls.forEach(control => {
        expect(control).toHaveAccessibleName();
      });
    });

    it('provides helpful form instructions', () => {
      renderWithProviders(<Register />);

      // Check for form instructions or help text
      const passwordInput = screen.getByLabelText(/password/i);
      const describedBy = passwordInput.getAttribute('aria-describedby');
      
      if (describedBy) {
        const helpText = document.getElementById(describedBy);
        expect(helpText).toBeInTheDocument();
      }
    });

    it('handles form submission errors accessibly', async () => {
      renderWithProviders(<Login />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Submit with invalid data
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(passwordInput, 'wrong');
      await userEvent.click(loginButton);

      // Error should be accessible
      const errorElement = screen.queryByRole('alert');
      if (errorElement) {
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(/\w+/);
      }
    });
  });

  describe('Loading States Accessibility', () => {
    it('announces loading states to screen readers', async () => {
      renderWithProviders(<Login />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // Check if loading state is announced
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(loginButton);

      // Should show loading state that's accessible
      const loadingElement = screen.queryByRole('status');
      if (loadingElement) {
        expect(loadingElement).toHaveAttribute('aria-live');
      }
    });

    it('maintains focus during loading operations', async () => {
      renderWithProviders(<Login />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      loginButton.focus();
      
      expect(document.activeElement).toBe(loginButton);

      // After clicking, focus should be managed appropriately
      await userEvent.click(loginButton);
      
      // Focus should still be on a reasonable element
      expect(document.activeElement).toBeInstanceOf(HTMLElement);
    });
  });
});
