# System Architecture Overview

## High-Level Architecture

The Shop Experts platform follows a modern full-stack architecture with clear separation of concerns between the frontend, backend, and data layers.

```mermaid
graph TB
    subgraph "Client Layer"
        Web[React Web App]
        Mobile[Mobile App<br/>Future]
    end
    
    subgraph "Load Balancer"
        LB[Load Balancer<br/>Future]
    end
    
    subgraph "Application Layer"
        subgraph "Frontend"
            React[React 18.2.0<br/>Material-UI 5.14.20]
            Router[React Router DOM 6.20.1]
            Context[Context API State]
            Axios[Axios HTTP Client]
        end
        
        subgraph "Backend"
            SpringBoot[Spring Boot 2.7.18<br/>Java 8]
            Security[Spring Security<br/>JWT Authentication]
            JPA[Spring Data JPA]
            Controllers[REST Controllers]
        end
    end
    
    subgraph "Data Layer"
        H2[(H2 Database<br/>Development)]
        PostgreSQL[(PostgreSQL<br/>Production)]
        FileStorage[File Storage<br/>Local/Cloud]
    end
    
    subgraph "External Services"
        Stripe[Stripe Payment API]
        Email[SMTP Email Service]
        OAuth[OAuth2 Providers<br/>Google, Facebook]
    end
    
    Web --> React
    Mobile --> LB
    LB --> SpringBoot
    React --> Axios
    Axios --> SpringBoot
    SpringBoot --> Security
    SpringBoot --> Controllers
    Controllers --> JPA
    JPA --> H2
    JPA --> PostgreSQL
    SpringBoot --> FileStorage
    SpringBoot --> Stripe
    SpringBoot --> Email
    Security --> OAuth
    
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0
    
    class React,Router,Context,Axios frontend
    class SpringBoot,Security,JPA,Controllers backend
    class H2,PostgreSQL,FileStorage database
    class Stripe,Email,OAuth external
```

## Technology Stack Summary

### Frontend Stack
- **Framework**: React 18.2.0 with functional components and hooks
- **UI Library**: Material-UI 5.14.20 for consistent design system
- **State Management**: React Context API for global state
- **Routing**: React Router DOM 6.20.1 for navigation
- **HTTP Client**: Axios 1.6.2 for API communication
- **Testing**: Jest + React Testing Library + Jest-axe for accessibility

### Backend Stack
- **Framework**: Spring Boot 2.7.18 with Java 8
- **Security**: Spring Security with JWT authentication
- **Database**: Spring Data JPA with H2 (dev) / PostgreSQL (prod)
- **API Design**: RESTful APIs with proper HTTP methods and status codes
- **Testing**: JUnit + Mockito + Testcontainers

### Integration & External Services
- **Authentication**: JWT tokens + OAuth2 social login
- **Payments**: Stripe integration for booking payments
- **Email**: SMTP integration for notifications
- **File Storage**: Local storage with cloud storage capability

## Core Components

### 1. User Management System
- User registration and authentication
- Profile management
- Role-based access control (User, Expert, Admin)
- Social login integration

### 2. Search & Discovery Engine
- Location-based search functionality
- Advanced filtering capabilities
- Expert/service categorization
- Real-time search suggestions

### 3. Booking & Payment System
- Service booking workflow
- Payment processing with Stripe
- Booking status management
- Calendar integration

### 4. Review & Rating System
- Customer feedback collection
- Rating aggregation
- Photo upload capabilities
- Review moderation

### 5. Notification System
- Real-time notifications
- Email notifications
- Push notification capability (future)
- Notification preferences

### 6. Rewards & Loyalty Program
- Points-based reward system
- Referral tracking
- Loyalty benefits
- Transaction history

### 7. Admin Dashboard
- User and expert management
- Analytics and reporting
- Content moderation
- System configuration

## Security Architecture

```mermaid
graph LR
    subgraph "Authentication Flow"
        Login[User Login] --> Validate[Credential Validation]
        Validate --> JWT[Generate JWT Token]
        JWT --> Response[Return Token + User Info]
    end
    
    subgraph "Authorization Flow"
        Request[API Request] --> Token[Extract JWT Token]
        Token --> Verify[Verify Token Signature]
        Verify --> Roles[Check User Roles]
        Roles --> Access[Grant/Deny Access]
    end
    
    subgraph "Security Layers"
        CORS[CORS Protection]
        CSRF[CSRF Protection]
        Encryption[Data Encryption]
        Validation[Input Validation]
    end
    
    Login --> Request
    Response --> Request
    Access --> CORS
    CORS --> CSRF
    CSRF --> Encryption
    Encryption --> Validation
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Spring Boot)
    participant D as Database
    participant E as External Services
    
    U->>F: User Action
    F->>F: Client-side Validation
    F->>B: HTTP Request (with JWT)
    B->>B: Authentication & Authorization
    B->>B: Business Logic Processing
    B->>D: Database Operation
    D-->>B: Data Response
    B->>E: External Service Call (if needed)
    E-->>B: Service Response
    B->>B: Response Processing
    B-->>F: HTTP Response (JSON)
    F->>F: State Update
    F-->>U: UI Update
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DevFE[React Dev Server<br/>Port 3000]
        DevBE[Spring Boot<br/>Port 8080]
        DevDB[(H2 In-Memory)]
    end
    
    subgraph "Production Environment"
        subgraph "Frontend Deployment"
            CDN[CDN Distribution]
            StaticFiles[Static React Build]
        end
        
        subgraph "Backend Deployment"
            AppServer[Application Server<br/>Spring Boot JAR]
            LB[Load Balancer]
        end
        
        subgraph "Database"
            ProdDB[(PostgreSQL)]
            Backup[(Database Backup)]
        end
        
        subgraph "Monitoring"
            Logs[Application Logs]
            Metrics[Performance Metrics]
            Health[Health Checks]
        end
    end
    
    DevFE --> DevBE
    DevBE --> DevDB
    
    CDN --> StaticFiles
    LB --> AppServer
    AppServer --> ProdDB
    ProdDB --> Backup
    AppServer --> Logs
    AppServer --> Metrics
    AppServer --> Health
```

## Key Architectural Decisions

### 1. Monorepo Structure
- **Decision**: Single repository for both frontend and backend
- **Rationale**: Simplified development, shared documentation, coordinated releases
- **Trade-offs**: Larger repository size, but better code organization

### 2. JWT Authentication
- **Decision**: Stateless JWT tokens for authentication
- **Rationale**: Scalable, stateless, works well with REST APIs
- **Trade-offs**: Token size vs. server-side session complexity

### 3. React Context for State Management
- **Decision**: React Context API instead of Redux
- **Rationale**: Simpler setup, sufficient for current complexity
- **Trade-offs**: Less powerful than Redux, but adequate for current needs

### 4. H2 for Development, PostgreSQL for Production
- **Decision**: Different databases for different environments
- **Rationale**: Fast development iteration with H2, production reliability with PostgreSQL
- **Trade-offs**: Environment parity vs. development speed

### 5. Material-UI Component Library
- **Decision**: Use Material-UI instead of custom CSS
- **Rationale**: Consistent design system, accessibility built-in, faster development
- **Trade-offs**: Bundle size vs. development speed and consistency

## Performance Considerations

### Frontend Performance
- Code splitting with React lazy loading
- Image optimization and lazy loading
- Bundle size optimization
- Web Vitals monitoring

### Backend Performance
- Database query optimization
- Caching strategies (future enhancement)
- Connection pooling
- API response optimization

### Infrastructure Performance
- CDN for static asset delivery
- Database indexing strategies
- Load balancing for horizontal scaling
- Monitoring and alerting systems

## Scalability Roadmap

### Phase 1: Current Implementation
- Single instance deployment
- Basic monitoring
- Manual scaling

### Phase 2: Enhanced Reliability
- Load balancer implementation
- Database clustering
- Automated backups
- Health monitoring

### Phase 3: Full Scalability
- Microservices architecture consideration
- Caching layer (Redis)
- Message queuing system
- Auto-scaling infrastructure
