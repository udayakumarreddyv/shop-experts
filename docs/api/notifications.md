# Notifications API Documentation

## Overview
The Notifications API manages real-time and push notifications for users and experts. It handles notification delivery, preferences, and tracking across multiple channels including in-app, email, and SMS.

## Base URL
```
/api/notifications
```

## Authentication
All notification endpoints require authentication via JWT token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Get User Notifications

**GET** `/api/notifications`

Retrieves notifications for the authenticated user.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `status` (optional): Filter by status (UNREAD, READ, ALL)
- `type` (optional): Filter by type (BOOKING, REVIEW, PAYMENT, SYSTEM)
- `priority` (optional): Filter by priority (HIGH, MEDIUM, LOW)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "notif_123456789",
        "type": "BOOKING",
        "subType": "BOOKING_CONFIRMED",
        "title": "Booking Confirmed",
        "message": "Your booking with Mike Johnson has been confirmed for June 10, 2025 at 2:00 PM",
        "priority": "HIGH",
        "status": "UNREAD",
        "data": {
          "bookingId": "book_123456789",
          "expertId": "exp_123456789",
          "appointmentDate": "2025-06-10T14:00:00Z"
        },
        "actionUrl": "/bookings/book_123456789",
        "createdAt": "2025-06-06T10:00:00Z",
        "readAt": null,
        "expiresAt": "2025-06-16T10:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 45,
    "totalPages": 3,
    "unreadCount": 12
  }
}
```

### 2. Mark Notification as Read

**POST** `/api/notifications/{notificationId}/read`

Marks a specific notification as read.

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "notif_123456789",
    "status": "READ",
    "readAt": "2025-06-06T10:30:00Z"
  }
}
```

### 3. Mark All Notifications as Read

**POST** `/api/notifications/mark-all-read`

Marks all unread notifications as read for the authenticated user.

#### Response
```json
{
  "status": "success",
  "data": {
    "markedCount": 12,
    "timestamp": "2025-06-06T10:30:00Z"
  }
}
```

### 4. Delete Notification

**DELETE** `/api/notifications/{notificationId}`

Deletes a specific notification.

#### Response
```json
{
  "status": "success",
  "message": "Notification deleted successfully"
}
```

### 5. Get Notification Preferences

**GET** `/api/notifications/preferences`

Retrieves notification preferences for the authenticated user.

#### Response
```json
{
  "status": "success",
  "data": {
    "userId": "user_123456789",
    "channels": {
      "inApp": {
        "enabled": true,
        "types": {
          "BOOKING": true,
          "REVIEW": true,
          "PAYMENT": true,
          "SYSTEM": true,
          "MARKETING": false
        }
      },
      "email": {
        "enabled": true,
        "address": "user@example.com",
        "verified": true,
        "types": {
          "BOOKING": true,
          "REVIEW": false,
          "PAYMENT": true,
          "SYSTEM": true,
          "MARKETING": false
        }
      },
      "sms": {
        "enabled": false,
        "phoneNumber": "+1234567890",
        "verified": false,
        "types": {
          "BOOKING": true,
          "REVIEW": false,
          "PAYMENT": true,
          "SYSTEM": false,
          "MARKETING": false
        }
      },
      "push": {
        "enabled": true,
        "deviceTokens": [
          {
            "token": "device_token_123",
            "platform": "IOS",
            "lastUsed": "2025-06-06T09:00:00Z"
          }
        ],
        "types": {
          "BOOKING": true,
          "REVIEW": true,
          "PAYMENT": true,
          "SYSTEM": false,
          "MARKETING": false
        }
      }
    },
    "quietHours": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "07:00",
      "timezone": "America/New_York"
    },
    "frequency": {
      "digest": "DAILY",
      "immediate": ["BOOKING", "PAYMENT"]
    }
  }
}
```

### 6. Update Notification Preferences

**PUT** `/api/notifications/preferences`

Updates notification preferences for the authenticated user.

#### Request Body
```json
{
  "channels": {
    "inApp": {
      "enabled": true,
      "types": {
        "BOOKING": true,
        "REVIEW": true,
        "PAYMENT": true,
        "SYSTEM": true,
        "MARKETING": false
      }
    },
    "email": {
      "enabled": true,
      "types": {
        "BOOKING": true,
        "REVIEW": false,
        "PAYMENT": true,
        "SYSTEM": true,
        "MARKETING": false
      }
    },
    "sms": {
      "enabled": false,
      "types": {
        "BOOKING": true,
        "REVIEW": false,
        "PAYMENT": true,
        "SYSTEM": false,
        "MARKETING": false
      }
    },
    "push": {
      "enabled": true,
      "types": {
        "BOOKING": true,
        "REVIEW": true,
        "PAYMENT": true,
        "SYSTEM": false,
        "MARKETING": false
      }
    }
  },
  "quietHours": {
    "enabled": true,
    "startTime": "22:00",
    "endTime": "07:00",
    "timezone": "America/New_York"
  },
  "frequency": {
    "digest": "DAILY",
    "immediate": ["BOOKING", "PAYMENT"]
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "updated": true,
    "timestamp": "2025-06-06T10:30:00Z"
  }
}
```

### 7. Register Device Token

**POST** `/api/notifications/devices`

Registers a device token for push notifications.

#### Request Body
```json
{
  "token": "device_token_123456",
  "platform": "IOS | ANDROID | WEB",
  "appVersion": "1.2.3",
  "deviceModel": "iPhone 12"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "tokenId": "token_123456789",
    "registered": true,
    "timestamp": "2025-06-06T10:30:00Z"
  }
}
```

### 8. Send Test Notification

**POST** `/api/notifications/test`

Sends a test notification to verify delivery (development/testing only).

#### Request Body
```json
{
  "channel": "EMAIL | SMS | PUSH | IN_APP",
  "title": "Test Notification",
  "message": "This is a test notification",
  "data": {
    "testId": "test_123"
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "notificationId": "notif_test_123",
    "sent": true,
    "channel": "EMAIL",
    "timestamp": "2025-06-06T10:30:00Z"
  }
}
```

### 9. Get Notification Statistics (Admin)

**GET** `/api/notifications/statistics`

Retrieves notification delivery statistics (admin only).

#### Query Parameters
- `startDate` (optional): Start date for statistics (ISO date)
- `endDate` (optional): End date for statistics (ISO date)
- `channel` (optional): Filter by channel
- `type` (optional): Filter by notification type

#### Response
```json
{
  "status": "success",
  "data": {
    "period": {
      "startDate": "2025-06-01",
      "endDate": "2025-06-06"
    },
    "totals": {
      "sent": 15430,
      "delivered": 14892,
      "read": 12440,
      "clicked": 3220,
      "failed": 538
    },
    "byChannel": {
      "IN_APP": {
        "sent": 8940,
        "delivered": 8940,
        "read": 7520,
        "clicked": 2100
      },
      "EMAIL": {
        "sent": 4320,
        "delivered": 4180,
        "read": 3420,
        "clicked": 890
      },
      "PUSH": {
        "sent": 1890,
        "delivered": 1580,
        "read": 1320,
        "clicked": 230
      },
      "SMS": {
        "sent": 280,
        "delivered": 192,
        "read": 180,
        "clicked": 0
      }
    },
    "byType": {
      "BOOKING": {
        "sent": 6890,
        "deliveryRate": 96.2,
        "readRate": 78.4
      },
      "REVIEW": {
        "sent": 3240,
        "deliveryRate": 94.8,
        "readRate": 65.2
      },
      "PAYMENT": {
        "sent": 2890,
        "deliveryRate": 97.1,
        "readRate": 89.3
      },
      "SYSTEM": {
        "sent": 2410,
        "deliveryRate": 95.6,
        "readRate": 72.1
      }
    },
    "trends": {
      "daily": [
        {
          "date": "2025-06-01",
          "sent": 2450,
          "delivered": 2380,
          "read": 2010
        }
      ]
    }
  }
}
```

### 10. Create Broadcast Notification (Admin)

**POST** `/api/notifications/broadcast`

Creates and sends a broadcast notification to multiple users (admin only).

#### Request Body
```json
{
  "title": "System Maintenance Notice",
  "message": "Scheduled maintenance will occur on June 15th from 2-4 AM EST",
  "type": "SYSTEM",
  "priority": "MEDIUM",
  "channels": ["IN_APP", "EMAIL"],
  "targetAudience": {
    "userType": "ALL | CUSTOMERS | EXPERTS",
    "location": "optional location filter",
    "registrationDate": {
      "after": "2024-01-01",
      "before": "2025-06-01"
    }
  },
  "scheduledFor": "2025-06-10T09:00:00Z",
  "expiresAt": "2025-06-20T09:00:00Z",
  "actionUrl": "/system/maintenance",
  "data": {
    "maintenanceId": "maint_123"
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "broadcastId": "broadcast_123456789",
    "scheduled": true,
    "estimatedRecipients": 1540,
    "scheduledFor": "2025-06-10T09:00:00Z"
  }
}
```

## Notification Types

### Booking Notifications
- `BOOKING_CONFIRMED` - Booking confirmation
- `BOOKING_CANCELLED` - Booking cancellation
- `BOOKING_RESCHEDULED` - Booking rescheduled
- `BOOKING_REMINDER` - Upcoming booking reminder
- `BOOKING_COMPLETED` - Service completion
- `EXPERT_ASSIGNED` - Expert assigned to booking
- `EXPERT_EN_ROUTE` - Expert is on the way

### Review Notifications
- `REVIEW_RECEIVED` - New review received
- `REVIEW_RESPONSE` - Response to your review
- `REVIEW_REMINDER` - Reminder to leave review

### Payment Notifications
- `PAYMENT_SUCCESSFUL` - Payment processed successfully
- `PAYMENT_FAILED` - Payment processing failed
- `REFUND_PROCESSED` - Refund has been processed
- `INVOICE_GENERATED` - New invoice available

### System Notifications
- `ACCOUNT_CREATED` - Welcome notification
- `PASSWORD_CHANGED` - Password change confirmation
- `PROFILE_UPDATED` - Profile update confirmation
- `MAINTENANCE_NOTICE` - System maintenance notification
- `FEATURE_ANNOUNCEMENT` - New feature announcements

### Marketing Notifications
- `PROMOTION_AVAILABLE` - Special offers and promotions
- `NEWSLETTER` - Newsletter and updates
- `RECOMMENDATION` - Service recommendations

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid notification preferences",
  "errors": [
    {
      "field": "quietHours.startTime",
      "message": "Invalid time format. Use HH:mm"
    }
  ]
}
```

#### 404 Not Found
```json
{
  "status": "error",
  "message": "Notification not found"
}
```

#### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many notification requests. Please try again later."
}
```

## WebSocket Events

### Real-time Notifications
Connect to WebSocket endpoint: `/ws/notifications`

#### Authentication
Send JWT token in connection headers:
```
Authorization: Bearer <jwt_token>
```

#### Event Format
```json
{
  "event": "notification.new",
  "data": {
    "id": "notif_123456789",
    "type": "BOOKING",
    "subType": "BOOKING_CONFIRMED",
    "title": "Booking Confirmed",
    "message": "Your booking has been confirmed",
    "priority": "HIGH",
    "data": {
      "bookingId": "book_123456789"
    },
    "actionUrl": "/bookings/book_123456789",
    "timestamp": "2025-06-06T10:00:00Z"
  }
}
```

#### Client Events
```json
{
  "event": "notification.read",
  "data": {
    "notificationId": "notif_123456789"
  }
}
```

## Business Rules

### Delivery Rules
1. Notifications respect user preference settings
2. Quiet hours are enforced for non-urgent notifications
3. Failed delivery attempts are retried with exponential backoff
4. Users cannot receive duplicate notifications for the same event
5. Expired notifications are automatically cleaned up

### Priority Handling
- **HIGH**: Immediate delivery, bypasses quiet hours
- **MEDIUM**: Standard delivery with preference respect
- **LOW**: Batch delivery, can be delayed

### Rate Limiting
- Maximum 50 notifications per user per hour
- Maximum 5 broadcast notifications per admin per day
- Email notifications limited to 10 per user per day
- SMS notifications limited to 3 per user per day

## Integration Points

### Booking Service
- Triggers booking-related notifications
- Provides booking context and details
- Manages appointment reminders

### Payment Service
- Sends payment confirmation notifications
- Handles refund notifications
- Manages invoice notifications

### Review Service
- Sends review-related notifications
- Manages review reminder campaigns
- Handles review response notifications

### User Service
- Manages user preferences
- Validates user contact information
- Handles account-related notifications

### Expert Service
- Sends expert-specific notifications
- Manages expert availability notifications
- Handles expert assignment notifications

## Performance Considerations

### Delivery Optimization
- Batch processing for non-urgent notifications
- Queue-based delivery system with retries
- Parallel processing for different channels
- Smart scheduling based on user activity patterns

### Storage Management
- Automatic cleanup of old notifications (90 days)
- Archiving of important notifications
- Compression of notification data
- Efficient indexing for quick retrieval

## Monitoring and Analytics

### Delivery Metrics
- Delivery success rates by channel
- Read rates and engagement metrics
- Failed delivery analysis
- User preference trends

### Performance Metrics
- Average delivery time
- Queue processing times
- WebSocket connection stability
- Database query performance
