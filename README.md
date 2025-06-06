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

### Frontend
- **Framework**: ReactJS
- **UI Library**: Material-UI
- **HTTP Client**: Axios
- **Routing**: React Router
- **Testing**: Jest, React Testing Library, Axe for accessibility
- **State Management**: Context API

### Backend
- **Framework**: Spring Boot 2.7.x
- **Security**: Spring Security, JWT
- **Database Access**: Spring Data JPA
- **Database**: H2 In-Memory Database (Development), PostgreSQL (Production)
- **Documentation**: Swagger/OpenAPI
- **Testing**: JUnit, Mockito

### Shared
- **Authentication**: JWT + Social Login Integration
- **Payment Processing**: Stripe Integration
- **File Storage**: Cloudinary/Local Storage
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Java 11 or higher
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
```

### Frontend Setup (ReactJS)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests (including accessibility tests)
npm test

# Build for production
npm run build
```

## Application Access

- **Backend API**: http://localhost:8080
  - Swagger UI: http://localhost:8080/swagger-ui/
  - H2 Console (dev): http://localhost:8080/h2-console

- **Frontend**: http://localhost:3000

## Project Structure

```
shop-experts/
├── backend/                # Spring Boot application
│   ├── src/main/java       # Java source files
│   ├── src/main/resources  # Configuration files
│   ├── src/test            # Test files
│   └── pom.xml             # Maven configuration
│
├── frontend/               # ReactJS application
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── package.json        # npm configuration
│   └── jest.config.json    # Jest configuration
│
└── README.md               # Project documentation
```

## Accessibility Features

The application is designed with accessibility in mind, following WCAG 2.1 guidelines:
- Proper heading hierarchy
- ARIA attributes for interactive elements
- Keyboard navigation support
- Screen reader announcements for dynamic content
- Color contrast compliance
- Form input validation feedback

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
