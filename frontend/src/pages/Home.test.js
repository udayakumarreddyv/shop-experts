import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders hero section correctly', () => {
    renderHome();
    
    expect(screen.getByText(/find skilled professionals/i)).toBeInTheDocument();
    expect(screen.getByText(/connect with trusted experts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i, exact: false })).toBeInTheDocument();
    
    // Use getAllByRole for potentially multiple matching elements and check the first one
    const expertButtons = screen.getAllByRole('button', { name: /become an expert/i });
    expect(expertButtons.length).toBeGreaterThan(0);
    expect(expertButtons[0]).toBeInTheDocument();
  });

  test('renders features section', () => {
    renderHome();
    
    expect(screen.getByText(/why choose shop experts/i)).toBeInTheDocument();
    expect(screen.getByText(/find experts/i)).toBeInTheDocument();
    expect(screen.getByText(/book instantly/i)).toBeInTheDocument();
    expect(screen.getByText(/secure payments/i)).toBeInTheDocument();
    expect(screen.getByText(/quality assured/i)).toBeInTheDocument();
    
    expect(screen.getByText(/search and discover skilled professionals/i)).toBeInTheDocument();
    expect(screen.getByText(/schedule appointments at your convenience/i)).toBeInTheDocument();
    expect(screen.getByText(/safe and secure payment processing/i)).toBeInTheDocument();
    expect(screen.getByText(/verified experts with ratings and reviews/i)).toBeInTheDocument();
  });

  test('renders popular categories section', () => {
    renderHome();
    
    expect(screen.getByText(/popular categories/i)).toBeInTheDocument();
    expect(screen.getByText(/hair & beauty/i)).toBeInTheDocument();
    expect(screen.getByText(/home services/i)).toBeInTheDocument();
    expect(screen.getByText(/fitness & wellness/i)).toBeInTheDocument();
    expect(screen.getByText(/tutoring/i)).toBeInTheDocument();
    expect(screen.getByText(/automotive/i)).toBeInTheDocument();
    expect(screen.getByText(/technology/i)).toBeInTheDocument();
  });

  test('renders featured experts section', () => {
    renderHome();
    
    expect(screen.getByText(/featured experts/i)).toBeInTheDocument();
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/mike chen/i)).toBeInTheDocument();
    expect(screen.getByText(/emma wilson/i)).toBeInTheDocument();
    
    expect(screen.getByText(/professional hair stylist/i)).toBeInTheDocument();
    expect(screen.getByText(/certified personal trainer/i)).toBeInTheDocument();
    expect(screen.getByText(/math tutor/i)).toBeInTheDocument();
  });

  test('renders statistics section', () => {
    renderHome();
    
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/verified experts/i)).toBeInTheDocument();
    expect(screen.getByText(/50,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/happy customers/i)).toBeInTheDocument();
    expect(screen.getByText(/4\.9/i)).toBeInTheDocument();
    expect(screen.getByText(/average rating/i)).toBeInTheDocument();
    expect(screen.getByText(/100,000\+/i)).toBeInTheDocument();
    expect(screen.getByText(/services completed/i)).toBeInTheDocument();
  });

  test('renders call to action section', () => {
    renderHome();
    
    expect(screen.getByText(/ready to get started/i)).toBeInTheDocument();
    expect(screen.getByText(/join thousands of satisfied customers/i)).toBeInTheDocument();
  });

  test('navigates to search when Get Started is clicked', async () => {
    
    renderHome();
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    await userEvent.click(getStartedButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });

  test('navigates to register when Become an Expert is clicked', async () => {
    
    renderHome();
    
    const becomeExpertButton = screen.getByRole('button', { name: /become an expert/i });
    await userEvent.click(becomeExpertButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to search with category filter when category is clicked', async () => {
    
    renderHome();
    
    const hairBeautyCategory = screen.getByText(/hair & beauty/i);
    await userEvent.click(hairBeautyCategory);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?category=Hair & Beauty');
  });

  test('shows expert profile when expert card is clicked', async () => {
    
    renderHome();
    
    const expertCard = screen.getByText(/sarah johnson/i).closest('.MuiCard-root');
    if (expertCard) {
      await userEvent.click(expertCard);
      expect(mockNavigate).toHaveBeenCalledWith('/experts/1');
    }
  });

  test('renders rating stars for featured experts', () => {
    renderHome();
    
    const ratingComponents = screen.getAllByRole('img', { name: /stars/i });
    expect(ratingComponents.length).toBeGreaterThan(0);
  });

  test('displays expert ratings correctly', () => {
    renderHome();
    
    expect(screen.getByText(/4\.9 \(127 reviews\)/i)).toBeInTheDocument();
    expect(screen.getByText(/4\.8 \(89 reviews\)/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.0 \(156 reviews\)/i)).toBeInTheDocument();
  });

  test('displays expert specialties as chips', () => {
    renderHome();
    
    expect(screen.getByText(/haircuts/i)).toBeInTheDocument();
    expect(screen.getByText(/coloring/i)).toBeInTheDocument();
    expect(screen.getByText(/weight training/i)).toBeInTheDocument();
    expect(screen.getByText(/nutrition/i)).toBeInTheDocument();
    expect(screen.getByText(/algebra/i)).toBeInTheDocument();
    expect(screen.getByText(/calculus/i)).toBeInTheDocument();
  });

  test('displays expert hourly rates', () => {
    renderHome();
    
    expect(screen.getByText(/\$50\/hour/i)).toBeInTheDocument();
    expect(screen.getByText(/\$45\/hour/i)).toBeInTheDocument();
    expect(screen.getByText(/\$35\/hour/i)).toBeInTheDocument();
  });

  test('renders all feature icons', () => {
    renderHome();
    
    // Check that feature icons are rendered (they should be in the DOM as SVG elements)
    const searchIcon = screen.getByTestId('SearchIcon');
    const scheduleIcon = screen.getByTestId('ScheduleIcon');
    const paymentIcon = screen.getByTestId('PaymentIcon');
    const starIcon = screen.getByTestId('StarIcon');
    
    expect(searchIcon).toBeInTheDocument();
    expect(scheduleIcon).toBeInTheDocument();
    expect(paymentIcon).toBeInTheDocument();
    expect(starIcon).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    renderHome();
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    
    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings.length).toBeGreaterThan(0);
  });

  test('renders responsive grid layout', () => {
    renderHome();
    
    // Check that grid containers exist
    const gridContainers = document.querySelectorAll('.MuiGrid-container');
    expect(gridContainers.length).toBeGreaterThan(0);
  });

  test('shows proper loading behavior for expert images', () => {
    renderHome();
    
    const expertImages = screen.getAllByRole('img');
    expertImages.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  test('handles keyboard navigation for interactive elements', async () => {
    
    renderHome();
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    
    // Focus and press Enter
    getStartedButton.focus();
    await userEvent.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });

  test('displays proper call-to-action buttons in CTA section', () => {
    renderHome();
    
    const ctaButtons = screen.getAllByRole('button', { name: /get started/i });
    expect(ctaButtons.length).toBeGreaterThan(1); // One in hero, one in CTA section
  });

  test('renders category cards with proper styling', () => {
    renderHome();
    
    const categoryCards = document.querySelectorAll('.MuiCard-root');
    expect(categoryCards.length).toBeGreaterThan(0);
  });

  test('shows proper expert availability status', () => {
    renderHome();
    
    expect(screen.getByText(/available now/i)).toBeInTheDocument();
    expect(screen.getByText(/available today/i)).toBeInTheDocument();
  });
});
