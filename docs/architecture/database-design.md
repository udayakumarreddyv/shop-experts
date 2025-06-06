# Database Design and Schema

## Entity Relationship Diagram

```mermaid
erDiagram
    User {
        bigint id PK
        varchar email UK "NOT NULL"
        varchar username UK "NOT NULL"
        varchar password "NOT NULL"
        varchar first_name "NOT NULL"
        varchar last_name "NOT NULL"
        varchar phone_number
        bigint role_id FK "NOT NULL"
        varchar provider "DEFAULT 'LOCAL'"
        varchar provider_id
        boolean email_verified "DEFAULT FALSE"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Role {
        bigint id PK
        varchar name UK "NOT NULL"
        varchar description
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Expert {
        bigint id PK
        bigint user_id FK "NOT NULL"
        varchar business_name "NOT NULL"
        text description
        varchar category "NOT NULL"
        varchar location "NOT NULL"
        decimal latitude "PRECISION(10,8)"
        decimal longitude "PRECISION(11,8)"
        decimal hourly_rate "PRECISION(10,2)"
        text availability
        boolean verified "DEFAULT FALSE"
        varchar profile_image_url
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Booking {
        bigint id PK
        bigint user_id FK "NOT NULL"
        bigint expert_id FK "NOT NULL"
        date booking_date "NOT NULL"
        time start_time "NOT NULL"
        time end_time "NOT NULL"
        varchar status "NOT NULL DEFAULT 'PENDING'"
        decimal total_amount "PRECISION(10,2) NOT NULL"
        varchar payment_intent_id
        varchar payment_status "DEFAULT 'PENDING'"
        text notes
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Review {
        bigint id PK
        bigint user_id FK "NOT NULL"
        bigint expert_id FK "NOT NULL"
        bigint booking_id FK
        integer rating "CHECK (rating >= 1 AND rating <= 5)"
        text comment
        varchar photo_url
        boolean verified "DEFAULT FALSE"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp updated_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Notification {
        bigint id PK
        bigint user_id FK "NOT NULL"
        varchar title "NOT NULL"
        text message "NOT NULL"
        varchar type "NOT NULL"
        boolean read_status "DEFAULT FALSE"
        varchar action_url
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
        timestamp expires_at
    }
    
    RewardAccount {
        bigint id PK
        bigint user_id FK "NOT NULL"
        integer total_points "DEFAULT 0"
        integer available_points "DEFAULT 0"
        timestamp last_updated "DEFAULT CURRENT_TIMESTAMP"
    }
    
    RewardTransaction {
        bigint id PK
        bigint reward_account_id FK "NOT NULL"
        integer points "NOT NULL"
        varchar transaction_type "NOT NULL"
        varchar description "NOT NULL"
        varchar reference_id
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    Category {
        bigint id PK
        varchar name UK "NOT NULL"
        varchar description
        varchar icon_url
        boolean active "DEFAULT TRUE"
        integer sort_order "DEFAULT 0"
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    ExpertCategory {
        bigint expert_id FK
        bigint category_id FK
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    BookingStatusHistory {
        bigint id PK
        bigint booking_id FK "NOT NULL"
        varchar old_status
        varchar new_status "NOT NULL"
        varchar changed_by "NOT NULL"
        text reason
        timestamp created_at "DEFAULT CURRENT_TIMESTAMP"
    }
    
    User ||--|| Role : "has"
    User ||--o| Expert : "becomes"
    User ||--o{ Booking : "makes"
    Expert ||--o{ Booking : "receives"
    User ||--o{ Review : "writes"
    Expert ||--o{ Review : "receives"
    Booking ||--o| Review : "generates"
    User ||--o{ Notification : "receives"
    User ||--|| RewardAccount : "owns"
    RewardAccount ||--o{ RewardTransaction : "contains"
    Expert ||--o{ ExpertCategory : "belongs_to"
    Category ||--o{ ExpertCategory : "contains"
    Booking ||--o{ BookingStatusHistory : "tracks"
```

## Database Schema Details

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role_id BIGINT NOT NULL,
    provider VARCHAR(50) DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_provider (provider, provider_id)
);
```

#### Experts Table
```sql
CREATE TABLE experts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    hourly_rate DECIMAL(10,2),
    availability TEXT,
    verified BOOLEAN DEFAULT FALSE,
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_expert_user (user_id),
    INDEX idx_location (latitude, longitude),
    INDEX idx_verified (verified),
    INDEX idx_hourly_rate (hourly_rate)
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    expert_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (expert_id) REFERENCES experts(id),
    INDEX idx_user_bookings (user_id, booking_date),
    INDEX idx_expert_bookings (expert_id, booking_date),
    INDEX idx_booking_status (status),
    INDEX idx_booking_date (booking_date),
    
    CONSTRAINT chk_booking_time CHECK (start_time < end_time),
    CONSTRAINT chk_booking_status CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED'))
);
```

### Data Relationships

```mermaid
graph LR
    subgraph "User Management"
        Users[Users Table]
        Roles[Roles Table]
        Experts[Experts Table]
    end
    
    subgraph "Booking System"
        Bookings[Bookings Table]
        StatusHistory[Booking Status History]
        Payments[Payment Records]
    end
    
    subgraph "Review System"
        Reviews[Reviews Table]
        ReviewPhotos[Review Photos]
    end
    
    subgraph "Notification System"
        Notifications[Notifications Table]
        NotificationTemplates[Templates]
    end
    
    subgraph "Rewards System"
        RewardAccounts[Reward Accounts]
        RewardTransactions[Reward Transactions]
        RewardRules[Reward Rules]
    end
    
    subgraph "Category System"
        Categories[Categories Table]
        ExpertCategories[Expert Categories]
    end
    
    Users --> Roles
    Users --> Experts
    Users --> Bookings
    Experts --> Bookings
    Bookings --> StatusHistory
    Bookings --> Reviews
    Users --> Reviews
    Experts --> Reviews
    Users --> Notifications
    Users --> RewardAccounts
    RewardAccounts --> RewardTransactions
    Experts --> ExpertCategories
    Categories --> ExpertCategories
```

## Indexing Strategy

```mermaid
graph TB
    subgraph "Primary Indexes"
        PK[Primary Keys - Clustered]
        UK[Unique Keys - Unique]
    end
    
    subgraph "Search Indexes"
        LocationIdx[Location Index - Spatial]
        TextIdx[Text Search Index]
        DateIdx[Date Range Index]
    end
    
    subgraph "Performance Indexes"
        StatusIdx[Status Filtering]
        UserIdx[User-based Queries]
        ExpertIdx[Expert-based Queries]
    end
    
    subgraph "Composite Indexes"
        BookingComposite[User + Date + Status]
        ReviewComposite[Expert + Rating + Date]
        SearchComposite[Location + Category + Verified]
    end
    
    PK --> LocationIdx
    UK --> TextIdx
    LocationIdx --> StatusIdx
    TextIdx --> UserIdx
    DateIdx --> ExpertIdx
    
    StatusIdx --> BookingComposite
    UserIdx --> ReviewComposite
    ExpertIdx --> SearchComposite
```

### Key Indexes

```sql
-- Location-based search optimization
CREATE INDEX idx_expert_location ON experts(latitude, longitude, verified);

-- Booking queries optimization
CREATE INDEX idx_booking_user_date ON bookings(user_id, booking_date, status);
CREATE INDEX idx_booking_expert_date ON bookings(expert_id, booking_date, status);

-- Review queries optimization
CREATE INDEX idx_review_expert_rating ON reviews(expert_id, rating, created_at);

-- Search optimization
CREATE INDEX idx_expert_search ON experts(verified, category, hourly_rate);

-- Notification queries
CREATE INDEX idx_notification_user_unread ON notifications(user_id, read_status, created_at);
```

## Data Validation Rules

```mermaid
graph TB
    subgraph "User Validation"
        EmailValid[Email Format Validation]
        PasswordStrength[Password Strength]
        PhoneFormat[Phone Number Format]
    end
    
    subgraph "Booking Validation"
        TimeValidation[Time Slot Validation]
        DateValidation[Future Date Validation]
        AvailabilityCheck[Expert Availability Check]
        PaymentValidation[Payment Amount Validation]
    end
    
    subgraph "Review Validation"
        RatingRange[Rating 1-5 Range]
        BookingExists[Booking Completion Check]
        DuplicateReview[Duplicate Review Prevention]
    end
    
    subgraph "Business Rules"
        BookingConflict[Booking Conflict Prevention]
        ExpertVerification[Expert Verification Status]
        RewardCalculation[Reward Points Calculation]
    end
    
    EmailValid --> TimeValidation
    PasswordStrength --> DateValidation
    PhoneFormat --> AvailabilityCheck
    TimeValidation --> RatingRange
    DateValidation --> BookingExists
    AvailabilityCheck --> DuplicateReview
    PaymentValidation --> BookingConflict
    RatingRange --> ExpertVerification
    BookingExists --> RewardCalculation
```

## Database Constraints

### Check Constraints
```sql
-- Rating validation
ALTER TABLE reviews ADD CONSTRAINT chk_rating 
CHECK (rating >= 1 AND rating <= 5);

-- Booking time validation
ALTER TABLE bookings ADD CONSTRAINT chk_booking_time 
CHECK (start_time < end_time);

-- Positive amounts
ALTER TABLE bookings ADD CONSTRAINT chk_positive_amount 
CHECK (total_amount > 0);

-- Latitude/Longitude bounds
ALTER TABLE experts ADD CONSTRAINT chk_latitude 
CHECK (latitude >= -90 AND latitude <= 90);

ALTER TABLE experts ADD CONSTRAINT chk_longitude 
CHECK (longitude >= -180 AND longitude <= 180);
```

### Foreign Key Constraints
```sql
-- Cascading deletes for user-related data
ALTER TABLE experts ADD CONSTRAINT fk_expert_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE bookings ADD CONSTRAINT fk_booking_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;

ALTER TABLE bookings ADD CONSTRAINT fk_booking_expert 
FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE RESTRICT;
```

## Query Optimization Patterns

### Common Query Patterns

```sql
-- Expert search with location and filters
SELECT e.*, u.first_name, u.last_name, 
       AVG(r.rating) as avg_rating,
       COUNT(r.id) as review_count
FROM experts e
JOIN users u ON e.user_id = u.id
LEFT JOIN reviews r ON e.id = r.expert_id
WHERE e.verified = true
  AND e.latitude BETWEEN ? AND ?
  AND e.longitude BETWEEN ? AND ?
  AND e.category = ?
GROUP BY e.id
HAVING avg_rating >= ?
ORDER BY avg_rating DESC, review_count DESC
LIMIT ? OFFSET ?;

-- User booking history with expert details
SELECT b.*, e.business_name, u.first_name, u.last_name
FROM bookings b
JOIN experts e ON b.expert_id = e.id
JOIN users u ON e.user_id = u.id
WHERE b.user_id = ?
ORDER BY b.booking_date DESC, b.start_time DESC;

-- Expert dashboard - upcoming bookings
SELECT b.*, u.first_name, u.last_name, u.phone_number
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.expert_id = ?
  AND b.booking_date >= CURDATE()
  AND b.status IN ('PENDING', 'CONFIRMED')
ORDER BY b.booking_date ASC, b.start_time ASC;
```

## Data Migration Strategy

```mermaid
graph TB
    subgraph "Migration Process"
        Schema[Schema Migration]
        DataMigration[Data Migration]
        Validation[Data Validation]
        Rollback[Rollback Strategy]
    end
    
    subgraph "Version Control"
        FlywayMigration[Flyway Migrations]
        VersionTracking[Version Tracking]
        ChangeLog[Change Log]
    end
    
    subgraph "Testing"
        TestData[Test Data Setup]
        IntegrationTest[Integration Testing]
        PerformanceTest[Performance Testing]
    end
    
    subgraph "Deployment"
        BlueGreen[Blue-Green Deployment]
        ZeroDowntime[Zero Downtime Migration]
        Monitoring[Migration Monitoring]
    end
    
    Schema --> DataMigration
    DataMigration --> Validation
    Validation --> Rollback
    
    FlywayMigration --> VersionTracking
    VersionTracking --> ChangeLog
    
    TestData --> IntegrationTest
    IntegrationTest --> PerformanceTest
    
    BlueGreen --> ZeroDowntime
    ZeroDowntime --> Monitoring
    
    Rollback --> FlywayMigration
    ChangeLog --> TestData
    PerformanceTest --> BlueGreen
```

## Backup and Recovery

```mermaid
graph LR
    subgraph "Backup Strategy"
        FullBackup[Full Database Backup]
        IncrementalBackup[Incremental Backup]
        PointInTime[Point-in-Time Recovery]
    end
    
    subgraph "Storage"
        LocalStorage[Local Storage]
        CloudStorage[Cloud Storage]
        ArchiveStorage[Archive Storage]
    end
    
    subgraph "Recovery Procedures"
        AutomatedRecovery[Automated Recovery]
        ManualRecovery[Manual Recovery]
        DisasterRecovery[Disaster Recovery]
    end
    
    subgraph "Monitoring"
        BackupVerification[Backup Verification]
        RecoveryTesting[Recovery Testing]
        AlertSystem[Alert System]
    end
    
    FullBackup --> LocalStorage
    IncrementalBackup --> CloudStorage
    PointInTime --> ArchiveStorage
    
    LocalStorage --> AutomatedRecovery
    CloudStorage --> ManualRecovery
    ArchiveStorage --> DisasterRecovery
    
    AutomatedRecovery --> BackupVerification
    ManualRecovery --> RecoveryTesting
    DisasterRecovery --> AlertSystem
```

## Performance Monitoring

### Database Metrics
- Query execution time
- Index usage statistics
- Connection pool metrics
- Database size and growth
- Lock wait times
- Cache hit ratios

### Optimization Recommendations
- Regular ANALYZE TABLE for query optimizer
- Periodic index maintenance
- Query plan analysis for slow queries
- Connection pool tuning
- Database parameter optimization
