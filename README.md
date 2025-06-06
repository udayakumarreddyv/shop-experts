# Shop Experts - Talent Discovery Platform

A comprehensive platform for discovering and booking local talents and businesses with advanced search, booking, and management features. This monorepo contains both the frontend React application and the backend Spring Boot service.

## Features

- **User Management**: Registration, login (including social login), profile management
- **Search & Discovery**: Location-based search with filters for local talents/businesses
- **Booking & Payments**: Talent reservation and integrated payment gateway
- **Feedback System**: Ratings, reviews, photo uploads, and validation
- **Offers & Notifications**: Talent promotions, system alerts, and personalized notifications
- **Referral & Rewards**: Points system for referrals, reviews, and usage
- **Dashboards**: Analytics for users and businesses
- **Admin Panel**: User/business moderation, analytics, and support tools
- **Accessibility**: WCAG compliant components for inclusive user experience

## Tech Stack

### Frontend (ReactJS Application)
- **Framework**: React 18.2.0
- **UI Library**: Material-UI (MUI) 5.14.20
  - MUI Core, Icons, and Date Pickers
  - Emotion for styling (@emotion/react, @emotion/styled)
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.20.1
- **Date Handling**: Day.js 1.11.10
- **Testing Framework**: 
  - Jest with React Testing Library
  - Jest-axe for accessibility testing
  - MSW (Mock Service Worker) for API mocking
  - Custom test utilities and comprehensive test suites
- **State Management**: React Context API
- **Development Tools**:
  - React Scripts 5.0.1
  - Babel presets for modern JavaScript
  - Identity-obj-proxy for CSS module mocking
- **Performance**: Web Vitals monitoring

#### Frontend Test Categories
- **Unit Tests**: Component and service testing
- **Integration Tests**: End-to-end user flows
- **Accessibility Tests**: WCAG compliance validation
- **Performance Tests**: Core Web Vitals monitoring
- **Coverage**: Comprehensive code coverage reporting

### Backend (Spring Boot Application)
- **Framework**: Spring Boot 2.7.18
- **Java Version**: Java 8
- **Security**: 
  - Spring Security with JWT authentication
  - JSON Web Token (JJWT 0.9.1)
  - OAuth2 social login support
- **Database Access**: Spring Data JPA
- **Database**: 
  - H2 In-Memory Database (Development)
  - PostgreSQL support (Production ready)
- **Validation**: Spring Boot Starter Validation
- **Email**: Spring Boot Mail integration
- **Payment Processing**: Stripe Java SDK 22.30.0
- **Testing Framework**:
  - JUnit with Spring Boot Test
  - Mockito (including mockito-inline)
  - Testcontainers 1.17.6 for integration testing
  - Spring Security Test
- **Code Quality**: 
  - Coveo fmt-maven-plugin for code formatting
  - Maven build system

#### Backend API Endpoints
The application includes the following REST controllers:
- **AuthController**: User authentication and registration
- **AdminController**: Administrative functions and user management
- **BookingController**: Talent booking and reservation management
- **FileController**: File upload and management
- **NotificationController**: System notifications and alerts
- **ReviewController**: Rating and review system
- **RewardController**: Points and rewards management
- **SearchController**: Location-based search and filtering

### Configuration & Infrastructure
- **CORS**: Configured for frontend-backend communication
- **File Upload**: 10MB max file size with custom upload directory
- **Email Integration**: SMTP configuration for notifications
- **Database**: H2 console enabled for development
- **JWT**: Configurable secret and expiration settings
- **Proxy Setup**: Frontend proxies API calls to backend

## Getting Started

### Prerequisites
- **Java**: Java 8 or higher (configured for Java 8)
- Maven 3.6 or higher
- Node.js 16 or higher
- npm 8 or higher

### Run Both Applications Together
```bash
# Clone the repository
git clone https://github.com/yourusername/shop-experts.git
cd shop-experts

# Start the backend (in one terminal)
cd backend
mvn spring-boot:run

# Start the frontend (in another terminal)
cd frontend
npm install
npm start
```

### Backend Setup (Spring Boot)
```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Run tests
mvn test

# Code formatting (automatic)
mvn fmt:format

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Backend Configuration
The backend uses the following default configuration:
- **Server Port**: 8080
- **Database**: H2 in-memory (jdbc:h2:mem:shopexperts)
- **H2 Console**: Enabled at `/h2-console`
- **File Uploads**: Max 10MB per file
- **CORS**: Configured for `http://localhost:3000`
- **JWT Expiration**: 24 hours (86400000ms)

### Frontend Setup (ReactJS)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run all tests
npm test

# Run specific test suites
npm run test:components      # Component tests
npm run test:integration     # Integration tests
npm run test:accessibility   # Accessibility tests
npm run test:performance     # Performance tests
npm run test:coverage        # Coverage report

# Run all test categories
npm run test:all

# Build for production
npm run build
```

#### Frontend Test Scripts
The frontend includes comprehensive testing with multiple specialized test commands:
- `test:watch` - Run tests in watch mode
- `test:ci` - Run tests for CI/CD with coverage
- `test:integration` - End-to-end integration tests
- `test:accessibility` - WCAG compliance testing
- `test:performance` - Core Web Vitals testing
- `test:handlers` - MSW handler testing
- `test:components` - Component-specific tests
- `test:pages` - Page component tests
- `test:services` - API service tests
- `test:context` - Context provider tests

## Application Access

- **Frontend**: http://localhost:3000
  - Main application interface
  - Responsive design with Material-UI components
  - Accessibility-compliant interface

- **Backend API**: http://localhost:8080
  - RESTful API endpoints
  - JWT-secured endpoints
  - File upload capabilities
  - H2 Console (development): http://localhost:8080/h2-console
    - JDBC URL: `jdbc:h2:mem:shopexperts`
    - Username: `sa`
    - Password: `password`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Core Feature Endpoints
- `GET /api/search/**` - Search and discovery functionality
- `POST /api/bookings/**` - Booking management
- `GET/POST /api/reviews/**` - Review and rating system
- `GET /api/notifications/**` - Notification management
- `GET/POST /api/rewards/**` - Rewards and points system
- `POST /api/files/upload` - File upload functionality
- `GET /api/admin/**` - Administrative functions (admin role required)

## Project Structure

```
shop-experts/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/shopexperts/
│   │   ├── ShopExpertsApplication.java  # Main application class
│   │   ├── config/             # Configuration classes
│   │   │   ├── DataInitializer.java     # Database initialization
│   │   │   ├── SecurityConfig.java      # Security configuration
│   │   │   └── WebConfig.java           # Web configuration
│   │   ├── controller/         # REST controllers
│   │   │   ├── AdminController.java     # Admin management
│   │   │   ├── AuthController.java      # Authentication
│   │   │   ├── BookingController.java   # Booking operations
│   │   │   ├── FileController.java      # File uploads
│   │   │   ├── NotificationController.java # Notifications
│   │   │   ├── ReviewController.java    # Reviews & ratings
│   │   │   ├── RewardController.java    # Rewards system
│   │   │   └── SearchController.java    # Search functionality
│   │   ├── model/              # JPA entities
│   │   │   ├── AuthProvider.java        # Authentication providers
│   │   │   ├── Booking.java            # Booking entity
│   │   │   ├── BookingStatus.java      # Booking status enum
│   │   │   ├── Notification.java       # Notification entity
│   │   │   ├── Review.java             # Review entity
│   │   │   ├── RewardAccount.java      # Reward account
│   │   │   ├── RewardTransaction.java  # Reward transactions
│   │   │   ├── Role.java               # User roles
│   │   │   └── User.java               # User entity
│   │   ├── payload/            # Request/Response DTOs
│   │   ├── repository/         # JPA repositories
│   │   ├── security/           # Security components
│   │   └── service/            # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties      # Application configuration
│   ├── src/test/               # Test files
│   ├── pom.xml                 # Maven dependencies
│   └── fmt-plugin.txt          # Code formatting configuration
│
├── frontend/                   # ReactJS application
│   ├── public/                 # Public assets
│   │   ├── index.html          # Main HTML template
│   │   ├── manifest.json       # PWA manifest
│   │   └── robots.txt          # Search engine directives
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── admin/          # Admin panel components
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── Login.js    # Login form
│   │   │   │   └── Register.js # Registration form
│   │   │   ├── booking/        # Booking-related components
│   │   │   ├── common/         # Shared components
│   │   │   │   ├── Footer.js   # Application footer
│   │   │   │   └── Navbar.js   # Navigation bar
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── expert/         # Expert profile components
│   │   │   ├── search/         # Search and filter components
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.js  # Authentication state
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.js    # User dashboard
│   │   │   └── Home.js         # Landing page
│   │   ├── services/           # API communication
│   │   │   └── ApiService.js   # Axios-based API client
│   │   ├── utils/              # Utility functions
│   │   │   └── testUtils.js    # Testing utilities
│   │   ├── mocks/              # MSW mock handlers
│   │   │   ├── handlers.js     # API mock handlers
│   │   │   └── server.js       # Mock server setup
│   │   ├── __tests__/          # Test files
│   │   │   ├── accessibility.test.js   # Accessibility tests
│   │   │   ├── integration.test.js     # Integration tests
│   │   │   └── performance.test.js     # Performance tests
│   │   ├── App.js              # Main App component
│   │   ├── index.js            # Application entry point
│   │   └── setupTests.js       # Test configuration
│   ├── package.json            # npm dependencies and scripts
│   ├── jest.config.json        # Jest testing configuration
│   └── run-tests.sh           # Test execution script
│
└── README.md                   # Project documentation
```

### Key Architectural Patterns

#### Backend Architecture
- **MVC Pattern**: Clear separation of controllers, services, and repositories
- **Security Layer**: JWT-based authentication with role-based access control
- **Data Layer**: JPA entities with H2/PostgreSQL support
- **Service Layer**: Business logic encapsulation
- **Configuration**: Externalized configuration via application.properties

#### Frontend Architecture
- **Component-Based**: Modular React components with Material-UI
- **Context Pattern**: Centralized state management with React Context
- **Service Layer**: Axios-based API communication
- **Protected Routes**: Route-level authentication guards
- **Test-Driven**: Comprehensive testing with multiple test categories

## Accessibility Features

The application is designed with accessibility in mind, following WCAG 2.1 guidelines:
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **ARIA Support**: ARIA attributes for interactive elements and dynamic content
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Announcements for dynamic content changes
- **Color Contrast**: WCAG AA compliant color contrast ratios
- **Form Validation**: Accessible error messaging and validation feedback
- **Focus Management**: Proper focus handling and visual indicators

### Accessibility Testing
- **Jest-axe Integration**: Automated accessibility testing in unit tests
- **Dedicated Test Suite**: `npm run test:accessibility` for comprehensive a11y testing
- **Coverage Reporting**: Accessibility coverage included in test reports

## Development Workflow

### Code Quality & Standards
- **Backend**: Automatic code formatting with Coveo fmt-maven-plugin
- **Frontend**: ESLint configuration with React best practices
- **Testing**: Minimum coverage thresholds enforced
- **Git Hooks**: Pre-commit formatting and testing (when configured)

### Environment Configuration
- **Development**: H2 in-memory database, hot reloading
- **Testing**: Isolated test environments with Testcontainers
- **Production**: PostgreSQL database, optimized builds

### API Integration
- **Proxy Setup**: Frontend development server proxies API calls to backend
- **CORS Configuration**: Proper CORS setup for cross-origin requests
- **Authentication Flow**: JWT token management across frontend/backend
- **File Uploads**: Multipart form data support with size limits

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## Documentation

### Guides
- [Getting Started Guide](docs/guides/getting-started.md) - Quick setup instructions for new developers
- [Development Setup Guide](docs/guides/development-setup.md) - Detailed development environment configuration
- [Testing Guide](docs/guides/testing-guide.md) - Comprehensive testing procedures and best practices
- [Deployment Guide](docs/guides/deployment-guide.md) - Instructions for deploying to various environments
- [Troubleshooting Guide](docs/guides/troubleshooting-guide.md) - Solutions for common issues and debugging tips

### API Documentation
- [Authentication API](docs/api/authentication.md) - User registration, login, and token management
- [Admin API](docs/api/admin.md) - Administrative functions and user management
- [Booking API](docs/api/booking.md) - Talent booking and reservation management
- [File Upload API](docs/api/file-upload.md) - File upload and management
- [Notifications API](docs/api/notifications.md) - System notifications and alerts
- [Reviews API](docs/api/reviews.md) - Rating and review system
- [Rewards API](docs/api/rewards.md) - Points and referral management
- [Search API](docs/api/search.md) - Location-based search and filtering

### Architecture Documentation
- [System Overview](docs/architecture/system-overview.md) - High-level architecture and system design
- [Frontend Architecture](docs/architecture/frontend-architecture.md) - React application structure and patterns
- [Backend Architecture](docs/architecture/backend-architecture.md) - Spring Boot application organization
- [Database Design](docs/architecture/database-design.md) - Schema design and entity relationships

## License

This project is licensed under the MIT License - see the LICENSE file for details.
