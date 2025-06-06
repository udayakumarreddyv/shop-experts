# Authentication API Documentation

## Overview

The Authentication API provides endpoints for user registration, login, logout, and token management. It supports both traditional email/password authentication and OAuth2 social login integration.

## Base URL
```
http://localhost:8080/api/auth
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Auth Controller
    participant S as Auth Service
    participant U as User Service
    participant DB as Database
    participant JWT as JWT Util
    
    Note over C,JWT: User Registration Flow
    C->>A: POST /signup
    A->>S: registerUser(signUpRequest)
    S->>U: existsByEmail(email)
    U->>DB: Check email exists
    DB-->>U: Boolean result
    U-->>S: Email availability
    S->>U: createUser(user)
    U->>DB: Save user
    DB-->>U: Saved user
    U-->>S: User created
    S-->>A: Registration success
    A-->>C: 201 Created + User info
    
    Note over C,JWT: User Login Flow
    C->>A: POST /signin
    A->>S: authenticateUser(loginRequest)
    S->>U: findByEmailOrUsername(login)
    U->>DB: Query user
    DB-->>U: User entity
    U-->>S: User details
    S->>S: validatePassword(password)
    S->>JWT: generateToken(user)
    JWT-->>S: JWT token
    S-->>A: Authentication success
    A-->>C: 200 OK + JWT token + User info
```

## Endpoints

### 1. User Registration

**POST** `/api/auth/signup`

Register a new user account.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "phoneNumber": "+1234567890"
}
```

#### Validation Rules
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `username`: Required, 3-20 characters, alphanumeric + underscore, unique
- `password`: Required, 8-100 characters, must contain uppercase, lowercase, digit, special character
- `phoneNumber`: Optional, valid phone format

#### Response
**Success (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "USER",
    "emailVerified": false,
    "createdAt": "2025-06-06T10:30:00Z"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is already in use"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ]
}
```

### 2. User Login

**POST** `/api/auth/signin`

Authenticate user and receive JWT token.

#### Request Body
```json
{
  "emailOrUsername": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "emailVerified": true
    }
  }
}
```

**Error (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS"
}
```

### 3. User Logout

**POST** `/api/auth/signout`

Logout user and invalidate token (optional implementation for token blacklisting).

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4. Token Refresh

**POST** `/api/auth/refresh`

Refresh an expired or near-expiry JWT token.

#### Request Body
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400
  }
}
```

### 5. Password Reset Request

**POST** `/api/auth/forgot-password`

Request password reset email.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### 6. Password Reset Confirmation

**POST** `/api/auth/reset-password`

Reset password using token from email.

#### Request Body
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### 7. Email Verification

**GET** `/api/auth/verify-email`

Verify user email address.

#### Query Parameters
- `token`: Email verification token

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 8. Resend Verification Email

**POST** `/api/auth/resend-verification`

Resend email verification link.

#### Request Body
```json
{
  "email": "john.doe@example.com"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

## OAuth2 Social Login

### Supported Providers
- Google
- Facebook
- GitHub (future)

### OAuth2 Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client App
    participant A as Auth Controller
    participant O as OAuth2 Provider
    participant S as Auth Service
    participant DB as Database
    
    U->>C: Click "Login with Google"
    C->>O: Redirect to OAuth2 provider
    U->>O: Authenticate with provider
    O->>C: Redirect with authorization code
    C->>A: POST /oauth2/callback/{provider}
    A->>O: Exchange code for access token
    O-->>A: Access token + user info
    A->>S: processOAuth2Login(userInfo)
    S->>DB: Find or create user
    DB-->>S: User entity
    S->>S: Generate JWT token
    S-->>A: Authentication success
    A-->>C: JWT token + user info
    C-->>U: Login successful
```

### OAuth2 Endpoints

#### 1. OAuth2 Authorization URL

**GET** `/api/auth/oauth2/authorize/{provider}`

Get authorization URL for OAuth2 provider.

#### Path Parameters
- `provider`: google, facebook

#### Response
```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://accounts.google.com/oauth/authorize?..."
  }
}
```

#### 2. OAuth2 Callback

**POST** `/api/auth/oauth2/callback/{provider}`

Handle OAuth2 callback and authenticate user.

#### Request Body
```json
{
  "code": "authorization_code_from_provider",
  "state": "csrf_state_token"
}
```

#### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "OAuth2 login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "john.doe@gmail.com",
      "username": "johndoe_google",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "provider": "GOOGLE",
      "emailVerified": true
    }
  }
}
```

## JWT Token Structure

### Token Format
```
Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjM5NTU2NDAwLCJleHAiOjE2Mzk2NDI4MDB9.signature
```

### Token Payload
```json
{
  "sub": "1",                    // User ID
  "email": "john.doe@example.com",
  "username": "johndoe",
  "role": "USER",
  "iat": 1639556400,            // Issued at
  "exp": 1639642800             // Expires at
}
```

### Token Usage
Include the JWT token in the Authorization header for authenticated requests:
```
Authorization: Bearer <jwt_token>
```

## Error Responses

### Common Error Codes

| Code | Description | Example |
|------|-------------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Access denied |
| 409 | Conflict | Email already exists |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2025-06-06T10:30:00Z",
  "path": "/api/auth/signin",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Security Considerations

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain digit
- Must contain special character
- Cannot be common passwords

### Rate Limiting
- Login attempts: 5 per minute per IP
- Registration: 3 per hour per IP
- Password reset: 3 per hour per email

### Token Security
- JWT tokens are signed with HS512 algorithm
- Tokens expire after 24 hours
- Refresh tokens expire after 30 days
- Tokens should be stored securely on client side

### CORS Configuration
- Allowed origins: `http://localhost:3000` (development)
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Authorization, Content-Type
- Credentials allowed: true

## Testing Examples

### cURL Examples

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!",
    "phoneNumber": "+1234567890"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Authenticated Request
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```
