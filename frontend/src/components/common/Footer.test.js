import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders footer correctly', () => {
    render(<Footer />);
    
    expect(screen.getByText(/shop experts/i)).toBeInTheDocument();
    expect(screen.getByText(/connect with skilled professionals/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2024 shop experts/i)).toBeInTheDocument();
  });

  test('renders customer section links', () => {
    render(<Footer />);
    
    expect(screen.getByText(/for customers/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /find experts/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /safety & trust/i })).toBeInTheDocument();
  });

  test('renders expert section links', () => {
    render(<Footer />);
    
    expect(screen.getByText(/for experts/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /become an expert/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resources/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /guidelines/i })).toBeInTheDocument();
  });

  test('renders support section links', () => {
    render(<Footer />);
    
    expect(screen.getByText(/support/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /help center/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
  });

  test('renders social media icons', () => {
    render(<Footer />);
    
    expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /linkedin/i })).toBeInTheDocument();
  });

  test('all links have correct href attributes', () => {
    render(<Footer />);
    
    expect(screen.getByRole('link', { name: /find experts/i })).toHaveAttribute('href', '/search');
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute('href', '/how-it-works');
    expect(screen.getByRole('link', { name: /safety & trust/i })).toHaveAttribute('href', '/safety');
    expect(screen.getByRole('link', { name: /become an expert/i })).toHaveAttribute('href', '/become-expert');
    expect(screen.getByRole('link', { name: /resources/i })).toHaveAttribute('href', '/expert-resources');
    expect(screen.getByRole('link', { name: /guidelines/i })).toHaveAttribute('href', '/expert-guidelines');
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help');
    expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
  });

  test('social media buttons are clickable', async () => {
    
    render(<Footer />);
    
    const facebookButton = screen.getByRole('button', { name: /facebook/i });
    const twitterButton = screen.getByRole('button', { name: /twitter/i });
    const instagramButton = screen.getByRole('button', { name: /instagram/i });
    const linkedinButton = screen.getByRole('button', { name: /linkedin/i });
    
    await userEvent.click(facebookButton);
    await userEvent.click(twitterButton);
    await userEvent.click(instagramButton);
    await userEvent.click(linkedinButton);
    
    // These buttons should be clickable without errors
    expect(facebookButton).toBeInTheDocument();
    expect(twitterButton).toBeInTheDocument();
    expect(instagramButton).toBeInTheDocument();
    expect(linkedinButton).toBeInTheDocument();
  });

  test('footer has proper accessibility attributes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    
    // Check that social media buttons have proper aria-labels
    expect(screen.getByRole('button', { name: /facebook/i })).toHaveAttribute('aria-label', 'Facebook');
    expect(screen.getByRole('button', { name: /twitter/i })).toHaveAttribute('aria-label', 'Twitter');
    expect(screen.getByRole('button', { name: /instagram/i })).toHaveAttribute('aria-label', 'Instagram');
    expect(screen.getByRole('button', { name: /linkedin/i })).toHaveAttribute('aria-label', 'LinkedIn');
  });

  test('footer maintains responsive layout structure', () => {
    render(<Footer />);
    
    // Check that all main sections are present
    expect(screen.getByText(/for customers/i)).toBeInTheDocument();
    expect(screen.getByText(/for experts/i)).toBeInTheDocument();
    expect(screen.getByText(/support/i)).toBeInTheDocument();
    
    // Check that copyright and social media section exists
    expect(screen.getByText(/© 2024 shop experts/i)).toBeInTheDocument();
  });
});
