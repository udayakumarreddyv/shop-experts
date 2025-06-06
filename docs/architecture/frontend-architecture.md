# Frontend Architecture

## React Application Structure

The frontend follows a component-based architecture with clear separation of concerns and modern React patterns.

```mermaid
graph TB
    subgraph "Application Layer"
        App[App.js - Main Application]
        Router[React Router - Navigation]
        Context[Context Providers - Global State]
    end
    
    subgraph "Page Components"
        Home[Home Page]
        Dashboard[Dashboard Page]
        Profile[Profile Page]
        Search[Search Results Page]
        Booking[Booking Page]
        Admin[Admin Panel]
    end
    
    subgraph "Feature Components"
        Auth[Authentication Components]
        SearchComp[Search Components]
        BookingComp[Booking Components]
        ReviewComp[Review Components]
        Common[Common/Shared Components]
    end
    
    subgraph "Service Layer"
        ApiService[API Service - Axios]
        AuthService[Authentication Service]
        StorageService[Local Storage Service]
    end
    
    subgraph "Utilities & Helpers"
        TestUtils[Test Utilities]
        Constants[Application Constants]
        Validators[Form Validators]
        Formatters[Data Formatters]
    end
    
    App --> Router
    Router --> Context
    Context --> Home
    Context --> Dashboard
    Context --> Profile
    Context --> Search
    Context --> Booking
    Context --> Admin
    
    Home --> Auth
    Dashboard --> SearchComp
    Search --> BookingComp
    Booking --> ReviewComp
    Admin --> Common
    
    Auth --> ApiService
    SearchComp --> AuthService
    BookingComp --> StorageService
    
    ApiService --> TestUtils
    AuthService --> Constants
    StorageService --> Validators
    TestUtils --> Formatters
```

## Component Architecture

```mermaid
classDiagram
    class App {
        +render()
        +handleGlobalError()
        -initializeApp()
    }
    
    class AuthContext {
        +user: User
        +isAuthenticated: boolean
        +login(credentials)
        +logout()
        +register(userData)
        +updateProfile(userData)
    }
    
    class ProtectedRoute {
        +component: Component
        +requiredRole: string
        +render()
        -checkAuthentication()
        -checkAuthorization()
    }
    
    class Login {
        +email: string
        +password: string
        +handleSubmit()
        +validateForm()
        -resetForm()
    }
    
    class SearchComponent {
        +searchQuery: string
        +filters: Object
        +results: Array
        +handleSearch()
        +applyFilters()
        +loadMore()
    }
    
    class BookingComponent {
        +booking: Object
        +paymentMethod: Object
        +createBooking()
        +processPayment()
        +confirmBooking()
    }
    
    class ApiService {
        +baseURL: string
        +authToken: string
        +get(endpoint)
        +post(endpoint, data)
        +put(endpoint, data)
        +delete(endpoint)
        -handleError()
        -setAuthHeader()
    }
    
    App --> AuthContext
    App --> ProtectedRoute
    ProtectedRoute --> Login
    Login --> AuthContext
    SearchComponent --> ApiService
    BookingComponent --> ApiService
    AuthContext --> ApiService
```

## State Management Architecture

```mermaid
graph LR
    subgraph "Global State (Context)"
        AuthContext[Authentication Context]
        ThemeContext[Theme Context]
        NotificationContext[Notification Context]
    end
    
    subgraph "Component State (useState)"
        FormState[Form State]
        UIState[UI State]
        LocalState[Local Component State]
    end
    
    subgraph "Server State (API)"
        UserData[User Data]
        BookingData[Booking Data]
        SearchResults[Search Results]
        ReviewData[Review Data]
    end
    
    subgraph "Derived State"
        ComputedValues[Computed Values]
        FilteredData[Filtered Data]
        FormattedData[Formatted Data]
    end
    
    AuthContext --> UserData
    FormState --> UIState
    UIState --> LocalState
    UserData --> ComputedValues
    BookingData --> FilteredData
    SearchResults --> FormattedData
    
    ComputedValues --> FormState
    FilteredData --> FormState
    FormattedData --> UIState
```

## Component Hierarchy

```mermaid
graph TB
    subgraph "App.js"
        AppComponent[App Component]
        ErrorBoundary[Error Boundary]
        AuthProvider[Auth Context Provider]
    end
    
    subgraph "Layout Components"
        Navbar[Navigation Bar]
        Footer[Footer]
        Sidebar[Sidebar - Admin]
    end
    
    subgraph "Page Level Components"
        HomePage[Home Page]
        DashboardPage[Dashboard Page]
        SearchPage[Search Page]
        BookingPage[Booking Page]
        ProfilePage[Profile Page]
        AdminPage[Admin Page]
    end
    
    subgraph "Feature Components"
        subgraph "Authentication"
            LoginForm[Login Form]
            RegisterForm[Register Form]
            ForgotPassword[Forgot Password]
        end
        
        subgraph "Search & Discovery"
            SearchBar[Search Bar]
            FilterPanel[Filter Panel]
            ExpertCard[Expert Card]
            SearchResults[Search Results List]
        end
        
        subgraph "Booking System"
            BookingForm[Booking Form]
            DateTimePicker[Date Time Picker]
            PaymentForm[Payment Form]
            BookingConfirmation[Booking Confirmation]
        end
        
        subgraph "Reviews & Ratings"
            ReviewForm[Review Form]
            ReviewList[Review List]
            RatingStars[Rating Stars]
            PhotoUpload[Photo Upload]
        end
    end
    
    subgraph "Common Components"
        LoadingSpinner[Loading Spinner]
        ErrorMessage[Error Message]
        SuccessMessage[Success Message]
        Modal[Modal Dialog]
        Tooltip[Tooltip]
        Button[Custom Button]
        Input[Custom Input]
    end
    
    AppComponent --> ErrorBoundary
    ErrorBoundary --> AuthProvider
    AuthProvider --> Navbar
    AuthProvider --> HomePage
    AuthProvider --> DashboardPage
    AuthProvider --> SearchPage
    AuthProvider --> BookingPage
    AuthProvider --> ProfilePage
    AuthProvider --> AdminPage
    AuthProvider --> Footer
    
    HomePage --> SearchBar
    SearchPage --> FilterPanel
    SearchPage --> SearchResults
    SearchResults --> ExpertCard
    BookingPage --> BookingForm
    BookingForm --> DateTimePicker
    BookingForm --> PaymentForm
    ProfilePage --> ReviewList
    ReviewList --> RatingStars
    
    LoginForm --> Button
    RegisterForm --> Input
    SearchBar --> LoadingSpinner
    BookingForm --> Modal
    ExpertCard --> Tooltip
```

## Routing Architecture

```mermaid
graph TB
    subgraph "Router Configuration"
        BrowserRouter[Browser Router]
        Routes[Routes Configuration]
        ProtectedRoute[Protected Route Wrapper]
    end
    
    subgraph "Public Routes"
        HomeRoute[/ - Home]
        LoginRoute[/login - Login]
        RegisterRoute[/register - Register]
        SearchRoute[/search - Public Search]
    end
    
    subgraph "Protected Routes"
        DashboardRoute[/dashboard - User Dashboard]
        ProfileRoute[/profile - User Profile]
        BookingRoute[/booking - Create Booking]
        BookingsRoute[/bookings - My Bookings]
    end
    
    subgraph "Admin Routes"
        AdminRoute[/admin - Admin Dashboard]
        UsersRoute[/admin/users - User Management]
        AnalyticsRoute[/admin/analytics - Analytics]
    end
    
    subgraph "Route Guards"
        AuthGuard[Authentication Guard]
        RoleGuard[Role-based Guard]
        RedirectHandler[Redirect Handler]
    end
    
    BrowserRouter --> Routes
    Routes --> ProtectedRoute
    
    Routes --> HomeRoute
    Routes --> LoginRoute
    Routes --> RegisterRoute
    Routes --> SearchRoute
    
    ProtectedRoute --> DashboardRoute
    ProtectedRoute --> ProfileRoute
    ProtectedRoute --> BookingRoute
    ProtectedRoute --> BookingsRoute
    
    ProtectedRoute --> AdminRoute
    ProtectedRoute --> UsersRoute
    ProtectedRoute --> AnalyticsRoute
    
    ProtectedRoute --> AuthGuard
    AuthGuard --> RoleGuard
    RoleGuard --> RedirectHandler
```

## API Integration Architecture

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service Layer
    participant A as Axios Instance
    participant I as Interceptors
    participant B as Backend API
    
    C->>S: Call API method
    S->>A: Make HTTP request
    A->>I: Request interceptor
    I->>I: Add auth headers
    I->>B: Send request
    B-->>I: Response
    I->>I: Response interceptor
    I->>I: Handle errors
    I-->>A: Processed response
    A-->>S: Response data
    S-->>C: Formatted data
    
    Note over I,B: Handle 401 Unauthorized
    I->>I: Refresh token or redirect to login
    
    Note over C,S: Handle loading states
    C->>C: Show loading spinner
    S-->>C: Data received
    C->>C: Hide loading spinner
```

## Form Management

```mermaid
graph TB
    subgraph "Form Architecture"
        FormComponent[Form Component]
        FormState[Form State Management]
        Validation[Client-side Validation]
        Submission[Form Submission]
    end
    
    subgraph "Input Components"
        TextInput[Text Input]
        SelectInput[Select Input]
        DateInput[Date Input]
        FileInput[File Input]
        CheckboxInput[Checkbox Input]
    end
    
    subgraph "Validation Rules"
        Required[Required Fields]
        Email[Email Format]
        Phone[Phone Format]
        Custom[Custom Validators]
    end
    
    subgraph "Error Handling"
        FieldErrors[Field-level Errors]
        FormErrors[Form-level Errors]
        ServerErrors[Server Errors]
        ErrorDisplay[Error Display]
    end
    
    FormComponent --> FormState
    FormState --> TextInput
    FormState --> SelectInput
    FormState --> DateInput
    FormState --> FileInput
    FormState --> CheckboxInput
    
    Validation --> Required
    Validation --> Email
    Validation --> Phone
    Validation --> Custom
    
    Submission --> FieldErrors
    Submission --> FormErrors
    Submission --> ServerErrors
    FieldErrors --> ErrorDisplay
    FormErrors --> ErrorDisplay
    ServerErrors --> ErrorDisplay
```

## Testing Architecture

```mermaid
graph TB
    subgraph "Testing Framework"
        Jest[Jest Test Runner]
        ReactTestingLibrary[React Testing Library]
        JestAxe[Jest-axe A11y Testing]
        MSW[Mock Service Worker]
    end
    
    subgraph "Test Categories"
        UnitTests[Unit Tests]
        IntegrationTests[Integration Tests]
        AccessibilityTests[Accessibility Tests]
        PerformanceTests[Performance Tests]
    end
    
    subgraph "Test Utilities"
        TestUtils[Custom Test Utils]
        MockData[Mock Data Generators]
        TestWrappers[Test Wrappers]
        CustomMatchers[Custom Matchers]
    end
    
    subgraph "Test Coverage"
        ComponentCoverage[Component Coverage]
        ServiceCoverage[Service Coverage]
        UtilsCoverage[Utils Coverage]
        E2ECoverage[E2E Coverage]
    end
    
    Jest --> UnitTests
    ReactTestingLibrary --> IntegrationTests
    JestAxe --> AccessibilityTests
    MSW --> PerformanceTests
    
    UnitTests --> TestUtils
    IntegrationTests --> MockData
    AccessibilityTests --> TestWrappers
    PerformanceTests --> CustomMatchers
    
    TestUtils --> ComponentCoverage
    MockData --> ServiceCoverage
    TestWrappers --> UtilsCoverage
    CustomMatchers --> E2ECoverage
```

## Performance Optimization

```mermaid
graph LR
    subgraph "Code Splitting"
        LazyLoading[React.lazy()]
        RouteBasedSplitting[Route-based Splitting]
        ComponentSplitting[Component Splitting]
    end
    
    subgraph "Rendering Optimization"
        ReactMemo[React.memo()]
        UseMemo[useMemo Hook]
        UseCallback[useCallback Hook]
        VirtualScrolling[Virtual Scrolling]
    end
    
    subgraph "Bundle Optimization"
        TreeShaking[Tree Shaking]
        BundleAnalysis[Bundle Analysis]
        AssetOptimization[Asset Optimization]
        CompressionGzip[Gzip Compression]
    end
    
    subgraph "Runtime Performance"
        WebVitals[Web Vitals Monitoring]
        PerformanceAPI[Performance API]
        MemoryManagement[Memory Management]
        ImageOptimization[Image Optimization]
    end
    
    LazyLoading --> ReactMemo
    RouteBasedSplitting --> UseMemo
    ComponentSplitting --> UseCallback
    ReactMemo --> TreeShaking
    UseMemo --> BundleAnalysis
    UseCallback --> AssetOptimization
    VirtualScrolling --> CompressionGzip
    
    TreeShaking --> WebVitals
    BundleAnalysis --> PerformanceAPI
    AssetOptimization --> MemoryManagement
    CompressionGzip --> ImageOptimization
```

## Build and Deployment Process

```mermaid
graph TB
    subgraph "Development"
        LocalDev[Local Development]
        HotReload[Hot Reloading]
        DevServer[Development Server]
    end
    
    subgraph "Build Process"
        WebpackBuild[Webpack Build]
        JSXCompilation[JSX Compilation]
        CSSProcessing[CSS Processing]
        AssetProcessing[Asset Processing]
    end
    
    subgraph "Optimization"
        Minification[Code Minification]
        BundleSplitting[Bundle Splitting]
        AssetOptimization[Asset Optimization]
        CacheOptimization[Cache Optimization]
    end
    
    subgraph "Deployment"
        StaticFiles[Static File Generation]
        CDNDeployment[CDN Deployment]
        ServiceWorker[Service Worker]
        PWAManifest[PWA Manifest]
    end
    
    LocalDev --> WebpackBuild
    HotReload --> JSXCompilation
    DevServer --> CSSProcessing
    WebpackBuild --> AssetProcessing
    
    JSXCompilation --> Minification
    CSSProcessing --> BundleSplitting
    AssetProcessing --> AssetOptimization
    Minification --> CacheOptimization
    
    BundleSplitting --> StaticFiles
    AssetOptimization --> CDNDeployment
    CacheOptimization --> ServiceWorker
    StaticFiles --> PWAManifest
```

## Error Handling Strategy

```mermaid
graph TB
    subgraph "Error Boundaries"
        AppErrorBoundary[App Error Boundary]
        FeatureErrorBoundary[Feature Error Boundary]
        ComponentErrorBoundary[Component Error Boundary]
    end
    
    subgraph "Error Types"
        JSErrors[JavaScript Errors]
        APIErrors[API Errors]
        NetworkErrors[Network Errors]
        ValidationErrors[Validation Errors]
    end
    
    subgraph "Error Handling"
        TryCatch[Try-Catch Blocks]
        ErrorContext[Error Context]
        ErrorReporting[Error Reporting]
        UserNotification[User Notification]
    end
    
    subgraph "Recovery Strategies"
        Retry[Retry Mechanism]
        Fallback[Fallback UI]
        Graceful[Graceful Degradation]
        Redirect[Error Page Redirect]
    end
    
    AppErrorBoundary --> JSErrors
    FeatureErrorBoundary --> APIErrors
    ComponentErrorBoundary --> NetworkErrors
    JSErrors --> ValidationErrors
    
    APIErrors --> TryCatch
    NetworkErrors --> ErrorContext
    ValidationErrors --> ErrorReporting
    TryCatch --> UserNotification
    
    ErrorContext --> Retry
    ErrorReporting --> Fallback
    UserNotification --> Graceful
    Retry --> Redirect
```
