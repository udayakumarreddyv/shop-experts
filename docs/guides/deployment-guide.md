# Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Deployment Environments](#deployment-environments)
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
  - [Building the Backend](#building-the-backend)
  - [Environment Configuration](#backend-environment-configuration)
  - [Database Setup](#database-setup)
  - [Deployment Options](#backend-deployment-options)
- [Frontend Deployment](#frontend-deployment)
  - [Building the Frontend](#building-the-frontend)
  - [Environment Configuration](#frontend-environment-configuration)
  - [Deployment Options](#frontend-deployment-options)
- [Docker Deployment](#docker-deployment)
- [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
- [Monitoring and Logging](#monitoring-and-logging)
- [Rollback Procedures](#rollback-procedures)
- [Security Considerations](#security-considerations)

## Overview

This guide details the process for deploying the Shop Experts platform to different environments, including development, staging, and production. The application consists of a Spring Boot backend and a React frontend, which can be deployed together or separately.

## Deployment Environments

- **Development**: Local environment for feature development
- **Testing**: Isolated environment for thorough testing
- **Staging**: Pre-production environment that mirrors production
- **Production**: Live environment accessible to end users

## Prerequisites

- Access credentials for deployment targets
- Database credentials for the target environment
- SSL certificates for secure communication (production)
- DNS configuration for domain mapping
- CI/CD pipeline access (if applicable)

## Backend Deployment

### Building the Backend

```bash
# Navigate to backend directory
cd backend

# Clean and build the project
mvn clean package -DskipTests

# Verify the JAR file
ls -la target/shop-experts-0.0.1-SNAPSHOT.jar
```

The resulting JAR file is self-contained and includes an embedded Tomcat server.

### Backend Environment Configuration

Create environment-specific properties files:

- `application-dev.properties` - Development configuration
- `application-test.properties` - Testing configuration
- `application-staging.properties` - Staging configuration
- `application-prod.properties` - Production configuration

Key configuration parameters:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://<DB_HOST>:<DB_PORT>/<DB_NAME>
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>

# JWT Configuration
app.jwtSecret=<YOUR_SECRET_KEY>
app.jwtExpirationMs=86400000

# File Storage Configuration
file.upload-dir=/path/to/uploads

# Email Configuration
spring.mail.host=<SMTP_HOST>
spring.mail.port=<SMTP_PORT>
spring.mail.username=<EMAIL_USERNAME>
spring.mail.password=<EMAIL_PASSWORD>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Payment Gateway Configuration (Stripe)
app.stripe.secretKey=<STRIPE_SECRET_KEY>
```

### Database Setup

1. Create the production database:

```bash
# PostgreSQL example
createdb -h <DB_HOST> -p <DB_PORT> -U <USERNAME> shop_experts_prod
```

2. The application will initialize the schema on first run using JPA/Hibernate.

### Backend Deployment Options

#### Option 1: Traditional Server Deployment

```bash
# Copy the JAR file to the server
scp target/shop-experts-0.0.1-SNAPSHOT.jar user@server:/path/to/deployment/

# SSH into the server
ssh user@server

# Run the JAR file with environment-specific properties
java -jar shop-experts-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

For production deployments, use a service manager like systemd:

```bash
# Create a systemd service file
sudo nano /etc/systemd/system/shop-experts.service

# Content of the service file
[Unit]
Description=Shop Experts API Service
After=network.target

[Service]
User=appuser
WorkingDirectory=/path/to/deployment
ExecStart=java -jar shop-experts-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
SuccessExitStatus=143
TimeoutStopSec=10
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target

# Enable and start the service
sudo systemctl enable shop-experts
sudo systemctl start shop-experts
```

#### Option 2: Cloud Platform Deployment

For AWS Elastic Beanstalk:

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init

# Deploy the application
eb create shop-experts-prod
```

## Frontend Deployment

### Building the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

The build artifacts will be located in the `build` directory.

### Frontend Environment Configuration

Create environment-specific `.env` files:

- `.env.development` - Development configuration
- `.env.test` - Testing configuration
- `.env.production` - Production configuration

Example `.env.production`:

```
REACT_APP_API_BASE_URL=https://api.shopexperts.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxx
REACT_APP_MAPS_API_KEY=xxxxxxxx
```

### Frontend Deployment Options

#### Option 1: Static Hosting (Nginx)

```bash
# Copy build files to Nginx server
scp -r build/* user@server:/var/www/html/shop-experts/

# Configure Nginx
server {
    listen 80;
    server_name shopexperts.com www.shopexperts.com;
    
    root /var/www/html/shop-experts;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option 2: Cloud Static Hosting (AWS S3 + CloudFront)

1. Create an S3 bucket and configure it for website hosting
2. Upload the build files:

```bash
aws s3 sync build/ s3://shop-experts-website --delete
```

3. Create a CloudFront distribution pointing to the S3 bucket

## Docker Deployment

### Docker Compose Setup

Create a `docker-compose.yml` file:

```yaml
version: '3'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: shop_experts
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - shop-experts-network

  backend:
    build: ./backend
    depends_on:
      - postgres
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/shop_experts
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    ports:
      - "8080:8080"
    networks:
      - shop-experts-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - shop-experts-network

networks:
  shop-experts-network:

volumes:
  postgres-data:
```

Deploy with Docker Compose:

```bash
docker-compose up -d
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Workflow

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy Shop Experts

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '8'
          distribution: 'adopt'
          
      - name: Test Backend
        run: |
          cd backend
          mvn test
          
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm test -- --watchAll=false
          
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.PRIVATE_KEY }}
          script: |
            cd /path/to/shop-experts
            git pull
            cd backend
            mvn clean package -DskipTests
            sudo systemctl restart shop-experts
            cd ../frontend
            npm install
            npm run build
            cp -r build/* /var/www/html/shop-experts/
```

## Monitoring and Logging

### Logging Configuration

Configure logging in `application.properties`:

```properties
# Logging configuration
logging.level.root=INFO
logging.level.com.shopexperts=DEBUG
logging.file.name=/var/log/shop-experts/application.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### Monitoring Tools

- Spring Boot Actuator for system metrics
- Prometheus for metrics collection
- Grafana for visualization
- ELK Stack for log aggregation and analysis

## Rollback Procedures

### Manual Rollback

```bash
# Backend rollback
ssh user@server
cd /path/to/deployment
java -jar shop-experts-0.0.1-SNAPSHOT-PREVIOUS.jar --spring.profiles.active=prod

# Frontend rollback
scp -r previous-build/* user@server:/var/www/html/shop-experts/
```

### Automated Rollback

In CI/CD pipeline, add a rollback job that deploys the previous stable version on failure.

## Security Considerations

1. Use HTTPS for all communications
2. Keep secrets secure using environment variables or secure vaults
3. Apply security headers in web server configuration
4. Implement rate limiting for API endpoints
5. Regularly update dependencies for security patches
6. Perform security scans before deployment
