# Testing Guide

## Table of Contents

- [Overview](#overview)
- [Frontend Testing](#frontend-testing)
  - [Unit Tests](#frontend-unit-tests)
  - [Integration Tests](#frontend-integration-tests)
  - [Accessibility Tests](#accessibility-tests)
  - [Performance Tests](#performance-tests)
- [Backend Testing](#backend-testing)
  - [Unit Tests](#backend-unit-tests)
  - [Integration Tests](#backend-integration-tests)
  - [API Tests](#api-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Testing](#cicd-testing)
- [Troubleshooting Tests](#troubleshooting-tests)

## Overview

The Shop Experts platform implements comprehensive testing across both frontend and backend components to ensure high-quality, reliable, and accessible user experiences. This guide outlines the testing approach, tools, and practices used in the project.

## Frontend Testing

### Frontend Unit Tests

Unit tests verify individual components and functions work as expected in isolation.

#### Running Frontend Unit Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all frontend tests
npm test

# Run specific tests
npm test -- --testPathPattern=Login.test.js

# Run tests in watch mode
npm test -- --watch
```

#### Writing Frontend Unit Tests

Unit tests are written using Jest and React Testing Library. Here's an example:

```javascript
// Simple component test
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Frontend Integration Tests

Integration tests verify that multiple components work together correctly, simulating real user workflows.

#### Running Integration Tests

```bash
# Run integration tests
npm test -- integration.test.js
```

Our integration tests are located in `src/__tests__/integration.test.js` and simulate complete user workflows like registration, login, booking services, etc.

### Accessibility Tests

Accessibility tests ensure the application is usable by people with disabilities and complies with WCAG standards.

#### Running Accessibility Tests

```bash
# Run accessibility tests 
npm test -- accessibility.test.js
```

We use `jest-axe` for programmatic accessibility testing.

### Performance Tests

Performance tests monitor Core Web Vitals and ensure the application runs smoothly.

```bash
# Run performance tests
npm test -- performance.test.js
```

## Backend Testing

### Backend Unit Tests

Unit tests validate individual service and repository methods.

#### Running Backend Unit Tests

```bash
# Navigate to backend directory
cd backend

# Run all backend tests
mvn test

# Run specific test class
mvn -Dtest=UserServiceTest test

# Run specific test method
mvn -Dtest=UserServiceTest#testCreateUser test
```

### Backend Integration Tests

Integration tests verify that backend components work together correctly, including database operations.

```bash
# Run integration tests only
mvn -Dtest=*IT test
```

We use Testcontainers for database integration testing to simulate a real database environment.

### API Tests

API tests validate the REST endpoints and ensure they handle requests and responses correctly.

```bash
# Run API tests
mvn -Dtest=*ControllerTest test
```

## Test Coverage

We aim for high test coverage to ensure most of our code is tested.

### Checking Coverage

```bash
# Frontend coverage
cd frontend
npm test -- --coverage

# Backend coverage
cd backend
mvn jacoco:report
```

Coverage reports can be found at:
- Frontend: `frontend/coverage/lcov-report/index.html`
- Backend: `backend/target/site/jacoco/index.html`

## CI/CD Testing

Tests are automatically run in our CI/CD pipeline on every pull request and before deployments.

- Pull Request: All tests must pass before merging
- Pre-deployment: Integration and E2E tests run to verify system integrity
- Post-deployment: Smoke tests verify the deployment was successful

## Troubleshooting Tests

### Common Frontend Test Issues

1. **Tests fail with 'Unable to find role="button"'**
   - Verify the component is rendering correctly
   - Check if the element has the correct accessibility role

2. **Mock service worker issues**
   - Ensure the mock handlers match the API endpoints being used
   - Verify the mock server is started before tests run

3. **Context provider errors**
   - Wrap your components with the necessary providers using `renderWithProviders`

### Common Backend Test Issues

1. **Database connection failures**
   - Verify H2 is configured correctly for test profiles
   - Check Testcontainers configuration

2. **Authentication issues in tests**
   - Use `@WithMockUser` for secured endpoints
   - Configure the security context properly

3. **Transaction rollback issues**
   - Ensure test methods are appropriately annotated with `@Transactional`
   - Check for any transactions that might be committed outside test scope
