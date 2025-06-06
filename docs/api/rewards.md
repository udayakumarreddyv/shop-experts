# Rewards API Documentation

## Overview
The Rewards API manages the loyalty and rewards program for the Shop Experts platform. It handles point accumulation, redemption, tier management, and reward catalog operations.

## Base URL
```
/api/rewards
```

## Authentication
All rewards endpoints require authentication via JWT token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Get User Rewards Summary

**GET** `/api/rewards/summary`

Retrieves the rewards summary for the authenticated user.

#### Response
```json
{
  "status": "success",
  "data": {
    "userId": "user_123456789",
    "currentBalance": 2450,
    "lifetimeEarned": 8900,
    "lifetimeRedeemed": 6450,
    "tier": {
      "level": "GOLD",
      "name": "Gold Member",
      "pointsToNext": 550,
      "nextTier": "PLATINUM",
      "benefits": [
        "10% bonus points on all bookings",
        "Priority customer support",
        "Exclusive Gold member discounts"
      ],
      "multiplier": 1.1
    },
    "recentActivity": [
      {
        "id": "activity_123",
        "type": "EARNED",
        "points": 100,
        "description": "Booking completed - Engine Diagnostic",
        "date": "2025-06-06T10:00:00Z",
        "bookingId": "book_123456789"
      }
    ],
    "expiringPoints": {
      "amount": 200,
      "expiryDate": "2025-12-31"
    }
  }
}
```

### 2. Get Points History

**GET** `/api/rewards/history`

Retrieves detailed points transaction history.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `type` (optional): Filter by transaction type (EARNED, REDEEMED, EXPIRED, ADJUSTED)
- `startDate` (optional): Start date filter (ISO date)
- `endDate` (optional): End date filter (ISO date)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "txn_123456789",
        "type": "EARNED",
        "points": 100,
        "description": "Booking completed - Engine Diagnostic",
        "details": {
          "bookingId": "book_123456789",
          "expertId": "exp_123456789",
          "serviceType": "DIAGNOSTIC",
          "bonusMultiplier": 1.1
        },
        "balanceAfter": 2450,
        "createdAt": "2025-06-06T10:00:00Z",
        "expiresAt": "2025-12-31T23:59:59Z"
      },
      {
        "id": "txn_123456788",
        "type": "REDEEMED",
        "points": -500,
        "description": "Redeemed: $5 Service Credit",
        "details": {
          "rewardId": "reward_123",
          "rewardName": "Service Credit",
          "voucherCode": "CREDIT_ABC123"
        },
        "balanceAfter": 2350,
        "createdAt": "2025-06-05T15:30:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 45,
    "totalPages": 3
  }
}
```

### 3. Get Available Rewards

**GET** `/api/rewards/catalog`

Retrieves the catalog of available rewards for redemption.

#### Query Parameters
- `category` (optional): Filter by category (SERVICE_CREDITS, DISCOUNTS, PHYSICAL_REWARDS, EXPERIENCES)
- `minPoints` (optional): Minimum points required
- `maxPoints` (optional): Maximum points required
- `available` (optional): Show only available rewards (default: true)

#### Response
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "SERVICE_CREDITS",
        "name": "Service Credits",
        "description": "Credits to use towards future services",
        "rewards": [
          {
            "id": "reward_123",
            "name": "$5 Service Credit",
            "description": "Apply $5 credit to any automotive service",
            "pointsCost": 500,
            "category": "SERVICE_CREDITS",
            "value": 5.00,
            "currency": "USD",
            "availability": {
              "available": true,
              "stock": "UNLIMITED",
              "validUntil": "2025-12-31"
            },
            "restrictions": [
              "Cannot be combined with other offers",
              "Valid for 6 months from redemption"
            ],
            "imageUrl": "/images/rewards/service-credit-5.png"
          }
        ]
      },
      {
        "id": "DISCOUNTS",
        "name": "Discounts",
        "description": "Percentage discounts on services",
        "rewards": [
          {
            "id": "reward_124",
            "name": "15% Off Next Service",
            "description": "Get 15% off your next automotive service",
            "pointsCost": 750,
            "category": "DISCOUNTS",
            "value": 15,
            "valueType": "PERCENTAGE",
            "availability": {
              "available": true,
              "stock": 100,
              "validUntil": "2025-12-31"
            },
            "restrictions": [
              "Maximum discount of $50",
              "Valid for 3 months from redemption"
            ]
          }
        ]
      }
    ],
    "userTier": "GOLD",
    "tierBenefits": {
      "discountMultiplier": 0.9,
      "exclusiveRewards": true
    }
  }
}
```

### 4. Redeem Reward

**POST** `/api/rewards/redeem`

Redeems a reward using accumulated points.

#### Request Body
```json
{
  "rewardId": "reward_123",
  "quantity": 1,
  "deliveryMethod": "EMAIL | SMS | PHYSICAL_ADDRESS",
  "deliveryDetails": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "ST",
      "zipCode": "12345",
      "country": "US"
    }
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "redemptionId": "redemption_123456789",
    "rewardId": "reward_123",
    "rewardName": "$5 Service Credit",
    "pointsRedeemed": 500,
    "newBalance": 1950,
    "voucher": {
      "code": "CREDIT_ABC123",
      "value": 5.00,
      "currency": "USD",
      "expiresAt": "2025-12-06T23:59:59Z",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    },
    "deliveryInfo": {
      "method": "EMAIL",
      "estimatedDelivery": "2025-06-06T10:05:00Z",
      "trackingId": "track_123456"
    },
    "redeemedAt": "2025-06-06T10:00:00Z"
  }
}
```

### 5. Get Redemption History

**GET** `/api/rewards/redemptions`

Retrieves user's reward redemption history.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `status` (optional): Filter by status (PENDING, DELIVERED, USED, EXPIRED, CANCELLED)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "redemption_123456789",
        "rewardId": "reward_123",
        "rewardName": "$5 Service Credit",
        "pointsRedeemed": 500,
        "status": "DELIVERED",
        "voucher": {
          "code": "CREDIT_ABC123",
          "value": 5.00,
          "currency": "USD",
          "expiresAt": "2025-12-06T23:59:59Z",
          "used": false,
          "usedAt": null
        },
        "deliveryInfo": {
          "method": "EMAIL",
          "deliveredAt": "2025-06-06T10:05:00Z"
        },
        "redeemedAt": "2025-06-06T10:00:00Z"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 12,
    "totalPages": 1
  }
}
```

### 6. Get Tier Information

**GET** `/api/rewards/tiers`

Retrieves information about all available tiers and requirements.

#### Response
```json
{
  "status": "success",
  "data": {
    "currentTier": "GOLD",
    "tiers": [
      {
        "level": "BRONZE",
        "name": "Bronze Member",
        "pointsRequired": 0,
        "pointsToNext": 1000,
        "benefits": [
          "Earn 1x points on all bookings",
          "Access to basic rewards catalog"
        ],
        "multiplier": 1.0,
        "color": "#CD7F32"
      },
      {
        "level": "SILVER",
        "name": "Silver Member",
        "pointsRequired": 1000,
        "pointsToNext": 2000,
        "benefits": [
          "Earn 1.05x points on all bookings",
          "5% discount on reward redemptions",
          "Extended warranty on services"
        ],
        "multiplier": 1.05,
        "color": "#C0C0C0"
      },
      {
        "level": "GOLD",
        "name": "Gold Member",
        "pointsRequired": 3000,
        "pointsToNext": 2000,
        "benefits": [
          "Earn 1.1x points on all bookings",
          "10% discount on reward redemptions",
          "Priority customer support",
          "Exclusive Gold member rewards"
        ],
        "multiplier": 1.1,
        "color": "#FFD700",
        "current": true
      },
      {
        "level": "PLATINUM",
        "name": "Platinum Member",
        "pointsRequired": 5000,
        "pointsToNext": null,
        "benefits": [
          "Earn 1.2x points on all bookings",
          "15% discount on reward redemptions",
          "Dedicated account manager",
          "Exclusive Platinum experiences",
          "Free annual service inspection"
        ],
        "multiplier": 1.2,
        "color": "#E5E4E2"
      }
    ],
    "userProgress": {
      "currentPoints": 3550,
      "pointsToNextTier": 1450,
      "progressPercentage": 71.0
    }
  }
}
```

### 7. Earn Points (Internal)

**POST** `/api/rewards/earn`

Internal endpoint to award points for completed actions.

#### Request Body
```json
{
  "userId": "user_123456789",
  "action": "BOOKING_COMPLETED | REVIEW_SUBMITTED | REFERRAL | FIRST_BOOKING | MILESTONE",
  "points": 100,
  "description": "Booking completed - Engine Diagnostic",
  "metadata": {
    "bookingId": "book_123456789",
    "serviceType": "DIAGNOSTIC",
    "expertId": "exp_123456789"
  },
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "transactionId": "txn_123456789",
    "pointsAwarded": 110,
    "bonusApplied": 10,
    "newBalance": 2560,
    "tierProgress": {
      "currentTier": "GOLD",
      "pointsToNext": 1440,
      "tierUpgraded": false
    }
  }
}
```

### 8. Check Voucher Status

**GET** `/api/rewards/vouchers/{voucherCode}`

Checks the status and validity of a reward voucher.

#### Response
```json
{
  "status": "success",
  "data": {
    "code": "CREDIT_ABC123",
    "rewardName": "$5 Service Credit",
    "value": 5.00,
    "currency": "USD",
    "status": "ACTIVE",
    "isValid": true,
    "isExpired": false,
    "isUsed": false,
    "expiresAt": "2025-12-06T23:59:59Z",
    "usedAt": null,
    "restrictions": [
      "Cannot be combined with other offers",
      "Valid for automotive services only"
    ],
    "redemptionId": "redemption_123456789",
    "userId": "user_123456789"
  }
}
```

### 9. Use Voucher

**POST** `/api/rewards/vouchers/{voucherCode}/use`

Marks a voucher as used during a booking or purchase.

#### Request Body
```json
{
  "bookingId": "book_123456789",
  "amount": 5.00,
  "description": "Applied to Engine Diagnostic service"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "code": "CREDIT_ABC123",
    "used": true,
    "usedAt": "2025-06-06T14:30:00Z",
    "usedAmount": 5.00,
    "usedFor": {
      "bookingId": "book_123456789",
      "description": "Applied to Engine Diagnostic service"
    }
  }
}
```

### 10. Get Referral Program

**GET** `/api/rewards/referrals`

Retrieves referral program information and user's referral status.

#### Response
```json
{
  "status": "success",
  "data": {
    "program": {
      "enabled": true,
      "referrerReward": 500,
      "refereeReward": 250,
      "description": "Refer a friend and both get rewards!"
    },
    "userReferrals": {
      "totalReferrals": 5,
      "successfulReferrals": 3,
      "pendingReferrals": 2,
      "totalPointsEarned": 1500,
      "referralCode": "REFER_USER123",
      "referralLink": "https://shopexperts.com/join?ref=REFER_USER123"
    },
    "recentReferrals": [
      {
        "id": "ref_123456789",
        "refereeEmail": "friend@example.com",
        "status": "COMPLETED",
        "pointsEarned": 500,
        "referredAt": "2025-06-01T10:00:00Z",
        "completedAt": "2025-06-03T14:30:00Z"
      }
    ]
  }
}
```

### 11. Create Referral

**POST** `/api/rewards/referrals`

Creates a new referral invitation.

#### Request Body
```json
{
  "email": "friend@example.com",
  "message": "Join Shop Experts and get expert automotive services!"
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "referralId": "ref_123456789",
    "refereeEmail": "friend@example.com",
    "referralCode": "REFER_USER123",
    "referralLink": "https://shopexperts.com/join?ref=REFER_USER123",
    "invitationSent": true,
    "sentAt": "2025-06-06T10:00:00Z"
  }
}
```

## Point Earning Rules

### Booking Points
- **First Booking**: 200 points
- **Booking Completion**: 50-200 points (based on service value)
- **On-time Service**: 25 bonus points
- **No-show Penalty**: -50 points

### Review Points
- **Submit Review**: 25 points
- **Detailed Review (>100 words)**: 50 points
- **Photo/Video with Review**: 25 bonus points

### Referral Points
- **Successful Referral**: 500 points (referrer), 250 points (referee)
- **First Booking by Referee**: Additional 100 points

### Special Actions
- **Profile Completion**: 100 points
- **Anniversary Bonus**: 200 points annually
- **Milestone Rewards**: 500 points (every 10 bookings)

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Insufficient points for redemption",
  "details": {
    "required": 500,
    "available": 350
  }
}
```

#### 404 Not Found
```json
{
  "status": "error",
  "message": "Reward not found or no longer available"
}
```

#### 409 Conflict
```json
{
  "status": "error",
  "message": "Voucher has already been used"
}
```

## Integration Points

### Booking Service
- Awards points for completed bookings
- Validates voucher usage during checkout
- Applies reward discounts

### User Service
- Manages tier status and benefits
- Updates user profile with reward information
- Handles referral tracking

### Payment Service
- Processes reward credits and discounts
- Manages voucher redemptions
- Handles refund adjustments for points

### Notification Service
- Sends point earning notifications
- Tier upgrade announcements
- Voucher expiration reminders
- Referral status updates

## Business Rules

### Point Expiration
- Points expire 12 months after earning
- Tier status prevents point expiration at higher levels
- Users receive notifications 30 days before expiration

### Tier Maintenance
- Tier status reviewed annually
- Requires minimum activity to maintain tier
- Tier downgrades have 3-month grace period

### Fraud Prevention
- Points cannot be transferred between accounts
- Suspicious activity triggers account review
- Referral abuse detection and prevention
- Voucher usage tracking and validation

## Rate Limiting

- Point earning: Maximum 1000 points per day per user
- Redemptions: Maximum 5 redemptions per day per user
- Referrals: Maximum 10 referrals per day per user
- Voucher checks: 100 requests per hour per user
