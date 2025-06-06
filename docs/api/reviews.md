# Reviews API Documentation

## Overview
The Reviews API manages user reviews and ratings for automotive services and experts. It provides endpoints for creating, retrieving, updating, and managing reviews with proper validation and moderation.

## Base URL
```
/api/reviews
```

## Authentication
All review endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Create Review

**POST** `/api/reviews`

Creates a new review for a completed booking.

#### Request Body
```json
{
  "bookingId": "string",
  "rating": "number (1-5)",
  "title": "string",
  "comment": "string",
  "wouldRecommend": "boolean",
  "serviceAspects": {
    "punctuality": "number (1-5)",
    "professionalism": "number (1-5)",
    "quality": "number (1-5)",
    "communication": "number (1-5)",
    "value": "number (1-5)"
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "rev_123456789",
    "bookingId": "book_123456789",
    "userId": "user_123456789",
    "expertId": "exp_123456789",
    "rating": 4.5,
    "title": "Excellent service!",
    "comment": "Very professional and quick diagnosis.",
    "wouldRecommend": true,
    "serviceAspects": {
      "punctuality": 5,
      "professionalism": 5,
      "quality": 4,
      "communication": 5,
      "value": 4
    },
    "status": "PENDING_MODERATION",
    "createdAt": "2025-06-06T10:00:00Z",
    "updatedAt": "2025-06-06T10:00:00Z"
  }
}
```

### 2. Get Reviews for Expert

**GET** `/api/reviews/expert/{expertId}`

Retrieves all approved reviews for a specific expert.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `sort` (optional): Sort field (default: createdAt)
- `direction` (optional): Sort direction (ASC/DESC, default: DESC)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "rev_123456789",
        "userId": "user_123456789",
        "userName": "John D.",
        "userInitials": "JD",
        "rating": 4.5,
        "title": "Excellent service!",
        "comment": "Very professional and quick diagnosis.",
        "wouldRecommend": true,
        "serviceAspects": {
          "punctuality": 5,
          "professionalism": 5,
          "quality": 4,
          "communication": 5,
          "value": 4
        },
        "createdAt": "2025-06-06T10:00:00Z",
        "verifiedBooking": true
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "direction": "DESC",
        "property": "createdAt"
      }
    },
    "totalElements": 25,
    "totalPages": 3,
    "first": true,
    "last": false
  },
  "meta": {
    "averageRating": 4.3,
    "totalReviews": 25,
    "ratingDistribution": {
      "5": 12,
      "4": 8,
      "3": 3,
      "2": 1,
      "1": 1
    },
    "recommendationPercentage": 88
  }
}
```

### 3. Get User's Reviews

**GET** `/api/reviews/my-reviews`

Retrieves all reviews created by the authenticated user.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `status` (optional): Filter by status (PENDING_MODERATION, APPROVED, REJECTED)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "rev_123456789",
        "bookingId": "book_123456789",
        "expertId": "exp_123456789",
        "expertName": "Mike Johnson",
        "serviceName": "Engine Diagnostic",
        "rating": 4.5,
        "title": "Excellent service!",
        "comment": "Very professional and quick diagnosis.",
        "status": "APPROVED",
        "createdAt": "2025-06-06T10:00:00Z",
        "canEdit": true,
        "canDelete": false
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10
    },
    "totalElements": 5,
    "totalPages": 1
  }
}
```

### 4. Update Review

**PUT** `/api/reviews/{reviewId}`

Updates an existing review (only allowed within 24 hours of creation).

#### Request Body
```json
{
  "rating": "number (1-5)",
  "title": "string",
  "comment": "string",
  "wouldRecommend": "boolean",
  "serviceAspects": {
    "punctuality": "number (1-5)",
    "professionalism": "number (1-5)",
    "quality": "number (1-5)",
    "communication": "number (1-5)",
    "value": "number (1-5)"
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "rev_123456789",
    "rating": 5.0,
    "title": "Outstanding service!",
    "comment": "Updated: Exceeded all expectations.",
    "wouldRecommend": true,
    "serviceAspects": {
      "punctuality": 5,
      "professionalism": 5,
      "quality": 5,
      "communication": 5,
      "value": 5
    },
    "status": "PENDING_MODERATION",
    "updatedAt": "2025-06-06T11:00:00Z"
  }
}
```

### 5. Get Review Statistics

**GET** `/api/reviews/statistics`

Retrieves platform-wide review statistics (admin only).

#### Response
```json
{
  "status": "success",
  "data": {
    "totalReviews": 1543,
    "averageRating": 4.2,
    "reviewsThisMonth": 89,
    "pendingModeration": 12,
    "ratingDistribution": {
      "5": 687,
      "4": 542,
      "3": 201,
      "2": 78,
      "1": 35
    },
    "topRatedExperts": [
      {
        "expertId": "exp_123",
        "expertName": "Mike Johnson",
        "averageRating": 4.9,
        "reviewCount": 45
      }
    ],
    "recentReviews": [
      {
        "id": "rev_latest",
        "expertName": "Sarah Wilson",
        "rating": 5,
        "title": "Perfect service",
        "createdAt": "2025-06-06T09:30:00Z"
      }
    ]
  }
}
```

### 6. Moderate Review (Admin)

**POST** `/api/reviews/{reviewId}/moderate`

Moderates a review (approve/reject with reason).

#### Request Body
```json
{
  "action": "APPROVE | REJECT",
  "reason": "string (required for REJECT)"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "rev_123456789",
    "status": "APPROVED",
    "moderatedBy": "admin_123",
    "moderatedAt": "2025-06-06T12:00:00Z",
    "moderationReason": null
  }
}
```

### 7. Flag Review

**POST** `/api/reviews/{reviewId}/flag`

Flags a review for inappropriate content.

#### Request Body
```json
{
  "reason": "INAPPROPRIATE_LANGUAGE | FAKE_REVIEW | SPAM | OTHER",
  "details": "string (optional)"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Review has been flagged for moderation"
}
```

### 8. Get Review Analytics

**GET** `/api/reviews/analytics/expert/{expertId}`

Gets detailed review analytics for an expert.

#### Response
```json
{
  "status": "success",
  "data": {
    "expertId": "exp_123456789",
    "summary": {
      "totalReviews": 45,
      "averageRating": 4.6,
      "recommendationRate": 92
    },
    "trends": {
      "last30Days": {
        "reviews": 8,
        "averageRating": 4.8
      },
      "last90Days": {
        "reviews": 23,
        "averageRating": 4.7
      }
    },
    "aspectRatings": {
      "punctuality": 4.7,
      "professionalism": 4.8,
      "quality": 4.5,
      "communication": 4.6,
      "value": 4.4
    },
    "ratingDistribution": {
      "5": 28,
      "4": 12,
      "3": 3,
      "2": 1,
      "1": 1
    }
  }
}
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "rating",
      "message": "Rating must be between 1 and 5"
    }
  ]
}
```

#### 403 Forbidden
```json
{
  "status": "error",
  "message": "You can only review completed bookings"
}
```

#### 404 Not Found
```json
{
  "status": "error",
  "message": "Review not found"
}
```

#### 409 Conflict
```json
{
  "status": "error",
  "message": "You have already reviewed this booking"
}
```

## Business Rules

### Review Creation Rules
1. Users can only review completed bookings
2. One review per booking per user
3. Reviews can only be created within 30 days of booking completion
4. All reviews go through moderation before being published
5. Rating must be between 1-5 stars
6. Comment must be between 10-500 characters

### Review Editing Rules
1. Reviews can be edited within 24 hours of creation
2. Edited reviews go back to pending moderation status
3. Users cannot edit reviews once they are published

### Moderation Rules
1. Reviews are automatically flagged if they contain profanity
2. Reviews with ratings of 1-2 stars require additional moderation
3. Expert responses to reviews are also moderated
4. Fake reviews are detected using ML algorithms

### Rating Calculation
1. Expert ratings are calculated as weighted average
2. Recent reviews (last 90 days) have higher weight
3. Verified bookings have higher weight than unverified
4. Flagged or moderated reviews may have reduced weight

## Integration Points

### Booking Service
- Validates booking completion status
- Retrieves booking details for review context
- Updates booking with review status

### Notification Service
- Sends review notifications to experts
- Sends moderation notifications to users
- Sends review reminder notifications

### User Service
- Retrieves user profile information
- Validates user permissions
- Updates user reputation scores

### Expert Service
- Updates expert rating and review statistics
- Triggers expert profile updates
- Manages expert review responses

## Rate Limiting

- Review creation: 5 reviews per hour per user
- Review updates: 3 updates per hour per user
- Review flags: 10 flags per hour per user
- Analytics requests: 100 requests per hour per user

## Webhooks

### Review Events
```json
{
  "event": "review.created | review.updated | review.approved | review.rejected",
  "data": {
    "reviewId": "rev_123456789",
    "expertId": "exp_123456789",
    "userId": "user_123456789",
    "rating": 4.5,
    "timestamp": "2025-06-06T10:00:00Z"
  }
}
```
