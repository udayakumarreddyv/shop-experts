# Admin API Documentation

## Overview
The Admin API provides comprehensive administrative functionality for managing the Shop Experts platform. It includes user management, content moderation, analytics, system configuration, and monitoring capabilities.

## Base URL
```
/api/admin
```

## Authentication
All admin endpoints require authentication with admin privileges:
```
Authorization: Bearer <admin_jwt_token>
X-Admin-Role: SUPER_ADMIN | ADMIN | MODERATOR
```

## User Management

### 1. Get All Users

**GET** `/api/admin/users`

Retrieves a paginated list of all users with detailed information.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `sort` (optional): Sort field (default: createdAt)
- `direction` (optional): Sort direction (ASC/DESC, default: DESC)
- `search` (optional): Search by name, email, or phone
- `status` (optional): Filter by status (ACTIVE, SUSPENDED, BANNED, PENDING)
- `userType` (optional): Filter by type (CUSTOMER, EXPERT)
- `registrationDate` (optional): Filter by registration date range

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "user_123456789",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "userType": "CUSTOMER",
        "status": "ACTIVE",
        "emailVerified": true,
        "phoneVerified": true,
        "createdAt": "2025-06-01T10:00:00Z",
        "lastLoginAt": "2025-06-06T09:30:00Z",
        "totalBookings": 15,
        "totalSpent": 1450.00,
        "averageRating": 4.8,
        "flaggedReports": 0,
        "location": {
          "city": "New York",
          "state": "NY",
          "zipCode": "10001"
        }
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 1543,
    "totalPages": 78
  }
}
```

### 2. Get User Details

**GET** `/api/admin/users/{userId}`

Retrieves detailed information about a specific user.

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "user_123456789",
    "personalInfo": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "dateOfBirth": "1985-06-15",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "US"
      }
    },
    "accountInfo": {
      "userType": "CUSTOMER",
      "status": "ACTIVE",
      "emailVerified": true,
      "phoneVerified": true,
      "createdAt": "2025-06-01T10:00:00Z",
      "lastLoginAt": "2025-06-06T09:30:00Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    },
    "statistics": {
      "totalBookings": 15,
      "completedBookings": 13,
      "cancelledBookings": 2,
      "totalSpent": 1450.00,
      "averageBookingValue": 111.54,
      "averageRating": 4.8,
      "reviewsGiven": 12,
      "rewardsPoints": 2450
    },
    "recentActivity": [
      {
        "type": "BOOKING_CREATED",
        "description": "Created booking for Engine Diagnostic",
        "timestamp": "2025-06-06T08:00:00Z"
      }
    ],
    "flags": []
  }
}
```

### 3. Update User Status

**PUT** `/api/admin/users/{userId}/status`

Updates a user's account status.

#### Request Body
```json
{
  "status": "ACTIVE | SUSPENDED | BANNED",
  "reason": "string (required for SUSPENDED/BANNED)",
  "duration": "string (optional, e.g., '30d', '7d')",
  "notifyUser": "boolean"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "userId": "user_123456789",
    "previousStatus": "ACTIVE",
    "newStatus": "SUSPENDED",
    "reason": "Violating terms of service",
    "updatedBy": "admin_123",
    "updatedAt": "2025-06-06T10:00:00Z",
    "notificationSent": true
  }
}
```

### 4. Reset User Password

**POST** `/api/admin/users/{userId}/reset-password`

Generates a password reset for a user.

#### Request Body
```json
{
  "sendEmail": "boolean",
  "temporaryPassword": "boolean"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "resetToken": "temp_token_123",
    "temporaryPassword": "TempPass123!",
    "emailSent": true,
    "expiresAt": "2025-06-06T18:00:00Z"
  }
}
```

## Expert Management

### 5. Get All Experts

**GET** `/api/admin/experts`

Retrieves all experts with their verification and performance data.

#### Query Parameters
- `page`, `size`, `sort`, `direction` (pagination parameters)
- `status` (optional): Filter by verification status
- `specialty` (optional): Filter by specialty
- `rating` (optional): Filter by minimum rating
- `location` (optional): Filter by location

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "exp_123456789",
        "userId": "user_987654321",
        "personalInfo": {
          "firstName": "Mike",
          "lastName": "Johnson",
          "email": "mike@example.com",
          "phone": "+1234567890"
        },
        "professionalInfo": {
          "businessName": "Mike's Auto Service",
          "licenseNumber": "LIC123456",
          "certifications": ["ASE Certified", "BMW Specialist"],
          "yearsExperience": 15,
          "specialties": ["DIAGNOSTIC", "REPAIR", "MAINTENANCE"]
        },
        "verification": {
          "status": "VERIFIED",
          "verifiedAt": "2025-06-01T10:00:00Z",
          "verifiedBy": "admin_123",
          "documentsUploaded": true,
          "backgroundCheckPassed": true,
          "insuranceVerified": true
        },
        "performance": {
          "averageRating": 4.7,
          "totalReviews": 89,
          "completionRate": 96.5,
          "responseTime": "12 minutes",
          "totalBookings": 156,
          "monthlyEarnings": 4250.00
        },
        "availability": {
          "status": "ONLINE",
          "lastSeen": "2025-06-06T09:45:00Z"
        }
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 342,
    "totalPages": 18
  }
}
```

### 6. Verify Expert

**POST** `/api/admin/experts/{expertId}/verify`

Verifies or rejects an expert application.

#### Request Body
```json
{
  "action": "APPROVE | REJECT",
  "reason": "string (required for REJECT)",
  "notes": "string (optional)",
  "verificationLevel": "BASIC | PREMIUM | MASTER"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "expertId": "exp_123456789",
    "verificationStatus": "VERIFIED",
    "verificationLevel": "PREMIUM",
    "verifiedBy": "admin_123",
    "verifiedAt": "2025-06-06T10:00:00Z",
    "notificationSent": true
  }
}
```

## Content Moderation

### 7. Get Flagged Content

**GET** `/api/admin/moderation/flagged`

Retrieves content flagged for moderation.

#### Query Parameters
- `contentType` (optional): REVIEW, PROFILE, MESSAGE, BOOKING
- `priority` (optional): HIGH, MEDIUM, LOW
- `status` (optional): PENDING, APPROVED, REJECTED

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "flag_123456789",
        "contentType": "REVIEW",
        "contentId": "rev_123456789",
        "flaggedBy": "user_987654321",
        "flagReason": "INAPPROPRIATE_LANGUAGE",
        "flagDetails": "Contains offensive language",
        "priority": "HIGH",
        "status": "PENDING",
        "content": {
          "text": "This service was terrible...",
          "author": "John D.",
          "createdAt": "2025-06-06T08:00:00Z"
        },
        "flaggedAt": "2025-06-06T09:00:00Z",
        "moderatedBy": null,
        "moderatedAt": null
      }
    ],
    "summary": {
      "totalPending": 15,
      "highPriority": 5,
      "mediumPriority": 7,
      "lowPriority": 3
    }
  }
}
```

### 8. Moderate Content

**POST** `/api/admin/moderation/{flagId}/moderate`

Moderates flagged content.

#### Request Body
```json
{
  "action": "APPROVE | REJECT | REMOVE",
  "reason": "string",
  "publicNote": "string (optional)",
  "escalate": "boolean"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "flagId": "flag_123456789",
    "action": "REJECT",
    "moderatedBy": "admin_123",
    "moderatedAt": "2025-06-06T10:00:00Z",
    "notificationSent": true
  }
}
```

## Analytics and Reporting

### 9. Get Platform Analytics

**GET** `/api/admin/analytics/platform`

Retrieves comprehensive platform analytics.

#### Query Parameters
- `period` (optional): DAILY, WEEKLY, MONTHLY, YEARLY
- `startDate` (optional): Start date for custom period
- `endDate` (optional): End date for custom period

#### Response
```json
{
  "status": "success",
  "data": {
    "period": {
      "type": "MONTHLY",
      "startDate": "2025-06-01",
      "endDate": "2025-06-30"
    },
    "users": {
      "totalUsers": 15430,
      "newUsers": 450,
      "activeUsers": 8920,
      "userGrowthRate": 3.2,
      "userRetentionRate": 78.5
    },
    "experts": {
      "totalExperts": 890,
      "verifiedExperts": 756,
      "activeExperts": 634,
      "averageRating": 4.3,
      "expertGrowthRate": 2.1
    },
    "bookings": {
      "totalBookings": 5670,
      "completedBookings": 5234,
      "cancelledBookings": 436,
      "completionRate": 92.3,
      "averageBookingValue": 125.50,
      "totalRevenue": 711450.00
    },
    "reviews": {
      "totalReviews": 4820,
      "averageRating": 4.2,
      "reviewsThisMonth": 380,
      "flaggedReviews": 25
    },
    "trends": {
      "bookingsByDay": [
        {
          "date": "2025-06-01",
          "bookings": 195,
          "revenue": 24475.00
        }
      ],
      "topServices": [
        {
          "service": "Engine Diagnostic",
          "bookings": 890,
          "revenue": 89000.00
        }
      ],
      "topLocations": [
        {
          "city": "New York",
          "state": "NY",
          "bookings": 1250
        }
      ]
    }
  }
}
```

### 10. Get Financial Reports

**GET** `/api/admin/reports/financial`

Retrieves detailed financial reports.

#### Query Parameters
- `period`: DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
- `includeRefunds`: boolean
- `includeCommissions`: boolean

#### Response
```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalRevenue": 711450.00,
      "platformFees": 71145.00,
      "expertPayouts": 604282.50,
      "refunds": 15240.00,
      "netRevenue": 55905.00,
      "transactionCount": 5670
    },
    "breakdown": {
      "byService": [
        {
          "serviceType": "DIAGNOSTIC",
          "revenue": 245680.00,
          "transactions": 2456,
          "averageValue": 100.00
        }
      ],
      "byExpert": [
        {
          "expertId": "exp_123",
          "expertName": "Mike Johnson",
          "totalEarnings": 12450.00,
          "completedJobs": 89,
          "averageJobValue": 140.00
        }
      ],
      "byMonth": [
        {
          "month": "2025-06",
          "revenue": 89456.00,
          "transactions": 712,
          "growth": 5.2
        }
      ]
    },
    "trends": {
      "revenueGrowth": 5.2,
      "transactionGrowth": 3.8,
      "averageOrderValue": 125.50
    }
  }
}
```

## System Configuration

### 11. Get System Settings

**GET** `/api/admin/settings`

Retrieves current system configuration.

#### Response
```json
{
  "status": "success",
  "data": {
    "general": {
      "platformName": "Shop Experts",
      "maintenanceMode": false,
      "allowNewRegistrations": true,
      "requireEmailVerification": true,
      "requirePhoneVerification": false
    },
    "booking": {
      "maxAdvanceBookingDays": 30,
      "minAdvanceBookingHours": 2,
      "cancellationWindowHours": 24,
      "autoConfirmBookings": false
    },
    "payments": {
      "platformFeePercentage": 10.0,
      "allowCreditCards": true,
      "allowDigitalWallets": true,
      "allowBankTransfers": false,
      "refundWindowDays": 14
    },
    "notifications": {
      "emailNotificationsEnabled": true,
      "smsNotificationsEnabled": true,
      "pushNotificationsEnabled": true,
      "marketingEmailsEnabled": false
    },
    "security": {
      "jwtExpirationHours": 24,
      "passwordMinLength": 8,
      "maxLoginAttempts": 5,
      "lockoutDurationMinutes": 15,
      "requireMFA": false
    }
  }
}
```

### 12. Update System Settings

**PUT** `/api/admin/settings`

Updates system configuration settings.

#### Request Body
```json
{
  "general": {
    "maintenanceMode": false,
    "allowNewRegistrations": true
  },
  "booking": {
    "maxAdvanceBookingDays": 45,
    "cancellationWindowHours": 48
  },
  "payments": {
    "platformFeePercentage": 12.0
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "updated": true,
    "updatedBy": "admin_123",
    "updatedAt": "2025-06-06T10:00:00Z",
    "changes": [
      {
        "setting": "booking.maxAdvanceBookingDays",
        "oldValue": 30,
        "newValue": 45
      }
    ]
  }
}
```

### 13. Get Audit Logs

**GET** `/api/admin/audit-logs`

Retrieves system audit logs.

#### Query Parameters
- `page`, `size` (pagination)
- `action` (optional): Filter by action type
- `userId` (optional): Filter by user
- `startDate`, `endDate` (optional): Date range

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "audit_123456789",
        "action": "USER_STATUS_CHANGED",
        "userId": "admin_123",
        "userName": "Admin User",
        "targetUserId": "user_987654321",
        "targetUserName": "John Doe",
        "details": {
          "oldStatus": "ACTIVE",
          "newStatus": "SUSPENDED",
          "reason": "Terms of service violation"
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2025-06-06T10:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 50
    },
    "totalElements": 2340
  }
}
```

## System Monitoring

### 14. Get System Health

**GET** `/api/admin/health`

Retrieves system health status and metrics.

#### Response
```json
{
  "status": "success",
  "data": {
    "overall": "HEALTHY",
    "services": {
      "database": {
        "status": "HEALTHY",
        "responseTime": "15ms",
        "connections": 45,
        "maxConnections": 100
      },
      "redis": {
        "status": "HEALTHY",
        "responseTime": "2ms",
        "memory": "512MB",
        "maxMemory": "2GB"
      },
      "elasticsearch": {
        "status": "HEALTHY",
        "responseTime": "25ms",
        "indexSize": "2.3GB"
      },
      "paymentGateway": {
        "status": "HEALTHY",
        "responseTime": "340ms",
        "lastFailure": null
      }
    },
    "performance": {
      "averageResponseTime": "120ms",
      "requestsPerSecond": 45.2,
      "errorRate": 0.02,
      "uptime": "99.98%"
    },
    "alerts": []
  }
}
```

### 15. Get Error Logs

**GET** `/api/admin/logs/errors`

Retrieves recent error logs for troubleshooting.

#### Query Parameters
- `level` (optional): ERROR, WARN, INFO
- `service` (optional): Filter by service name
- `startDate`, `endDate` (optional): Date range

#### Response
```json
{
  "status": "success",
  "data": {
    "errors": [
      {
        "id": "error_123456789",
        "level": "ERROR",
        "message": "Database connection timeout",
        "service": "BookingService",
        "stackTrace": "java.sql.SQLException...",
        "userId": "user_123456789",
        "requestId": "req_987654321",
        "timestamp": "2025-06-06T09:45:00Z",
        "resolved": false
      }
    ],
    "summary": {
      "totalErrors": 45,
      "errorsByLevel": {
        "ERROR": 12,
        "WARN": 23,
        "INFO": 10
      },
      "errorsByService": {
        "BookingService": 15,
        "PaymentService": 8,
        "NotificationService": 5
      }
    }
  }
}
```

## Error Handling

### Common Error Responses

#### 403 Forbidden
```json
{
  "status": "error",
  "message": "Insufficient admin privileges for this operation"
}
```

#### 422 Unprocessable Entity
```json
{
  "status": "error",
  "message": "Invalid configuration value",
  "errors": [
    {
      "field": "platformFeePercentage",
      "message": "Fee percentage must be between 0 and 20"
    }
  ]
}
```

## Admin Roles and Permissions

### Role Hierarchy
1. **SUPER_ADMIN**: Full system access
2. **ADMIN**: Most administrative functions
3. **MODERATOR**: Content moderation only
4. **SUPPORT**: Read-only access to user data

### Permission Matrix
| Function | SUPER_ADMIN | ADMIN | MODERATOR | SUPPORT |
|----------|-------------|-------|-----------|---------|
| User Management | ✓ | ✓ | ✗ | Read Only |
| Expert Verification | ✓ | ✓ | ✗ | Read Only |
| Content Moderation | ✓ | ✓ | ✓ | ✗ |
| System Settings | ✓ | Limited | ✗ | ✗ |
| Financial Reports | ✓ | ✓ | ✗ | ✗ |
| Audit Logs | ✓ | Read Only | ✗ | ✗ |

## Rate Limiting

- General admin endpoints: 500 requests per hour per admin
- Analytics endpoints: 100 requests per hour per admin
- System modification endpoints: 50 requests per hour per admin
- Audit log access: 200 requests per hour per admin
