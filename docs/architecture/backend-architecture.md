# Backend Architecture

## Spring Boot Application Structure

The backend follows a layered architecture pattern with clear separation of concerns.

```mermaid
graph TB
    subgraph "Presentation Layer"
        Controllers[REST Controllers]
        Security[Security Filters]
        CORS[CORS Configuration]
    end
    
    subgraph "Business Logic Layer"
        Services[Service Classes]
        Validation[Input Validation]
        BusinessRules[Business Rules]
    end
    
    subgraph "Data Access Layer"
        Repositories[JPA Repositories]
        Entities[JPA Entities]
        DataSource[Data Source Configuration]
    end
    
    subgraph "Cross-cutting Concerns"
        JWT[JWT Token Management]
        Exception[Exception Handling]
        Config[Configuration Management]
        Logging[Logging & Monitoring]
    end
    
    Controllers --> Security
    Security --> Services
    Services --> Validation
    Validation --> BusinessRules
    BusinessRules --> Repositories
    Repositories --> Entities
    Entities --> DataSource
    
    JWT --> Security
    Exception --> Controllers
    Config --> Services
    Logging --> Controllers
    Logging --> Services
```

## Component Architecture

```mermaid
classDiagram
    class AuthController {
        +signin(LoginRequest)
        +signup(SignUpRequest)
        +signout()
        +refreshToken()
    }
    
    class SearchController {
        +searchExperts(criteria)
        +getExpertDetails(id)
        +filterByLocation(location)
        +getCategories()
    }
    
    class BookingController {
        +createBooking(booking)
        +getBookings(userId)
        +updateBookingStatus(id, status)
        +cancelBooking(id)
    }
    
    class ReviewController {
        +createReview(review)
        +getReviews(expertId)
        +updateReview(id, review)
        +deleteReview(id)
    }
    
    class UserService {
        +createUser(user)
        +findByEmail(email)
        +updateProfile(user)
        +deleteUser(id)
    }
    
    class BookingService {
        +processBooking(booking)
        +validateBooking(booking)
        +calculatePrice(booking)
        +sendConfirmation(booking)
    }
    
    class PaymentService {
        +processPayment(payment)
        +refundPayment(bookingId)
        +validatePayment(payment)
    }
    
    class NotificationService {
        +sendEmail(notification)
        +sendInAppNotification(notification)
        +getNotifications(userId)
    }
    
    AuthController --> UserService
    BookingController --> BookingService
    BookingService --> PaymentService
    BookingService --> NotificationService
    ReviewController --> UserService
```

## Security Architecture

```mermaid
graph LR
    subgraph "Security Configuration"
        SecurityConfig[SecurityConfig.java]
        JwtConfig[JWT Configuration]
        CorsConfig[CORS Configuration]
        OAuth2Config[OAuth2 Configuration]
    end
    
    subgraph "Authentication Flow"
        JwtFilter[JWT Authentication Filter]
        UserDetails[Custom User Details Service]
        AuthProvider[Authentication Provider]
    end
    
    subgraph "Authorization"
        RoleCheck[Role-based Access Control]
        MethodSecurity[Method-level Security]
        ResourceSecurity[Resource-level Security]
    end
    
    SecurityConfig --> JwtFilter
    JwtConfig --> JwtFilter
    JwtFilter --> UserDetails
    UserDetails --> AuthProvider
    AuthProvider --> RoleCheck
    RoleCheck --> MethodSecurity
    MethodSecurity --> ResourceSecurity
    CorsConfig --> SecurityConfig
    OAuth2Config --> SecurityConfig
```

## Database Design

```mermaid
erDiagram
    User {
        Long id PK
        String email UK
        String username UK
        String password
        String firstName
        String lastName
        String phoneNumber
        Role role FK
        AuthProvider provider
        String providerId
        Boolean emailVerified
        DateTime createdAt
        DateTime updatedAt
    }
    
    Role {
        Long id PK
        RoleName name UK
        String description
    }
    
    Expert {
        Long id PK
        Long userId FK
        String businessName
        String description
        String category
        String location
        Double latitude
        Double longitude
        Decimal hourlyRate
        String availability
        Boolean verified
        DateTime createdAt
    }
    
    Booking {
        Long id PK
        Long userId FK
        Long expertId FK
        DateTime bookingDate
        DateTime startTime
        DateTime endTime
        BookingStatus status
        Decimal totalAmount
        String paymentIntentId
        String notes
        DateTime createdAt
        DateTime updatedAt
    }
    
    Review {
        Long id PK
        Long userId FK
        Long expertId FK
        Long bookingId FK
        Integer rating
        String comment
        String photoUrl
        Boolean verified
        DateTime createdAt
    }
    
    Notification {
        Long id PK
        Long userId FK
        String title
        String message
        NotificationType type
        Boolean read
        String actionUrl
        DateTime createdAt
    }
    
    RewardAccount {
        Long id PK
        Long userId FK
        Integer totalPoints
        Integer availablePoints
        DateTime lastUpdated
    }
    
    RewardTransaction {
        Long id PK
        Long rewardAccountId FK
        Integer points
        TransactionType type
        String description
        String referenceId
        DateTime createdAt
    }
    
    User ||--|| Role : has
    User ||--o| Expert : becomes
    User ||--o{ Booking : makes
    Expert ||--o{ Booking : receives
    User ||--o{ Review : writes
    Expert ||--o{ Review : receives
    Booking ||--o| Review : generates
    User ||--o{ Notification : receives
    User ||--|| RewardAccount : owns
    RewardAccount ||--o{ RewardTransaction : contains
```

## API Layer Architecture

```mermaid
graph TB
    subgraph "HTTP Request Processing"
        Request[HTTP Request]
        Filter[Security Filter Chain]
        Controller[REST Controller]
        Validation[Request Validation]
    end
    
    subgraph "Business Processing"
        Service[Service Layer]
        BusinessLogic[Business Logic]
        Repository[Repository Layer]
    end
    
    subgraph "Response Processing"
        Response[HTTP Response]
        Serialization[JSON Serialization]
        ErrorHandling[Exception Handling]
    end
    
    Request --> Filter
    Filter --> Controller
    Controller --> Validation
    Validation --> Service
    Service --> BusinessLogic
    BusinessLogic --> Repository
    Repository --> BusinessLogic
    BusinessLogic --> Service
    Service --> Controller
    Controller --> Serialization
    Serialization --> Response
    
    ErrorHandling --> Response
    Validation --> ErrorHandling
    Service --> ErrorHandling
    Repository --> ErrorHandling
```

## Service Layer Design

### Authentication Service Flow
```mermaid
sequenceDiagram
    participant C as Controller
    participant AS as AuthService
    participant US as UserService
    participant JWT as JWTUtil
    participant DB as Database
    participant Email as EmailService
    
    C->>AS: authenticateUser(credentials)
    AS->>US: findByEmail(email)
    US->>DB: SELECT user WHERE email = ?
    DB-->>US: User entity
    US-->>AS: User details
    AS->>AS: validatePassword(password)
    AS->>JWT: generateToken(user)
    JWT-->>AS: JWT token
    AS->>Email: sendLoginNotification(user)
    AS-->>C: AuthenticationResponse
```

### Booking Service Flow
```mermaid
sequenceDiagram
    participant C as Controller
    participant BS as BookingService
    participant PS as PaymentService
    participant NS as NotificationService
    participant RS as RewardService
    participant DB as Database
    
    C->>BS: createBooking(bookingRequest)
    BS->>BS: validateBooking(request)
    BS->>PS: createPaymentIntent(amount)
    PS-->>BS: paymentIntent
    BS->>DB: save(booking)
    DB-->>BS: saved booking
    BS->>NS: sendBookingConfirmation(booking)
    BS->>RS: addBookingPoints(userId)
    BS-->>C: BookingResponse
```

## Configuration Management

```mermaid
graph LR
    subgraph "Configuration Sources"
        AppProps[application.properties]
        EnvVars[Environment Variables]
        Profile[Spring Profiles]
        External[External Config]
    end
    
    subgraph "Configuration Classes"
        SecurityConfig[SecurityConfig]
        DataConfig[DataSourceConfig]
        WebConfig[WebConfig]
        MailConfig[MailConfig]
    end
    
    subgraph "Runtime Configuration"
        JwtSecret[JWT Secret]
        DatabaseUrl[Database URL]
        StripeKey[Stripe API Key]
        EmailSettings[Email Settings]
    end
    
    AppProps --> SecurityConfig
    EnvVars --> DataConfig
    Profile --> WebConfig
    External --> MailConfig
    
    SecurityConfig --> JwtSecret
    DataConfig --> DatabaseUrl
    WebConfig --> StripeKey
    MailConfig --> EmailSettings
```

## Exception Handling Strategy

```mermaid
graph TB
    subgraph "Exception Types"
        ValidationEx[Validation Exception]
        AuthEx[Authentication Exception]
        AuthzEx[Authorization Exception]
        BusinessEx[Business Logic Exception]
        DataEx[Data Access Exception]
        ExternalEx[External Service Exception]
    end
    
    subgraph "Exception Handlers"
        GlobalHandler[Global Exception Handler]
        SecurityHandler[Security Exception Handler]
        ValidationHandler[Validation Exception Handler]
    end
    
    subgraph "Response Types"
        ErrorResponse[Error Response DTO]
        FieldErrors[Field Error Details]
        HttpStatus[HTTP Status Codes]
    end
    
    ValidationEx --> ValidationHandler
    AuthEx --> SecurityHandler
    AuthzEx --> SecurityHandler
    BusinessEx --> GlobalHandler
    DataEx --> GlobalHandler
    ExternalEx --> GlobalHandler
    
    ValidationHandler --> FieldErrors
    SecurityHandler --> ErrorResponse
    GlobalHandler --> ErrorResponse
    
    FieldErrors --> HttpStatus
    ErrorResponse --> HttpStatus
```

## Testing Architecture

```mermaid
graph TB
    subgraph "Unit Tests"
        ServiceTests[Service Layer Tests]
        RepositoryTests[Repository Tests]
        UtilTests[Utility Class Tests]
    end
    
    subgraph "Integration Tests"
        ControllerTests[Controller Integration Tests]
        SecurityTests[Security Integration Tests]
        DatabaseTests[Database Integration Tests]
    end
    
    subgraph "Test Infrastructure"
        TestContainers[Testcontainers]
        MockMvc[MockMvc]
        TestConfig[Test Configuration]
        TestData[Test Data Builders]
    end
    
    ServiceTests --> MockMvc
    ControllerTests --> TestContainers
    DatabaseTests --> TestContainers
    SecurityTests --> TestConfig
    
    TestConfig --> TestData
    TestContainers --> TestData
```

## Performance Optimization

### Database Optimization
```mermaid
graph LR
    subgraph "Query Optimization"
        Indexing[Database Indexing]
        QueryOpt[Query Optimization]
        LazyLoading[Lazy Loading]
        Pagination[Pagination]
    end
    
    subgraph "Connection Management"
        ConnectionPool[Connection Pooling]
        TransactionMgmt[Transaction Management]
        BatchProcessing[Batch Processing]
    end
    
    subgraph "Caching Strategy"
        EntityCache[Entity Caching]
        QueryCache[Query Result Caching]
        AppCache[Application-level Caching]
    end
    
    Indexing --> ConnectionPool
    QueryOpt --> TransactionMgmt
    LazyLoading --> BatchProcessing
    Pagination --> EntityCache
    
    ConnectionPool --> EntityCache
    TransactionMgmt --> QueryCache
    BatchProcessing --> AppCache
```

## Deployment Configuration

```mermaid
graph TB
    subgraph "Build Process"
        Maven[Maven Build]
        Testing[Run Tests]
        Packaging[JAR Packaging]
    end
    
    subgraph "Environment Configuration"
        DevProfile[Development Profile]
        TestProfile[Test Profile]
        ProdProfile[Production Profile]
    end
    
    subgraph "Runtime Environment"
        JVM[JVM Configuration]
        SystemProps[System Properties]
        EnvVars[Environment Variables]
    end
    
    Maven --> Testing
    Testing --> Packaging
    
    DevProfile --> JVM
    TestProfile --> SystemProps
    ProdProfile --> EnvVars
    
    Packaging --> DevProfile
    Packaging --> TestProfile
    Packaging --> ProdProfile
```
