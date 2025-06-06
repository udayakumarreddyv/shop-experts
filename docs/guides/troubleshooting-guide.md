# Troubleshooting Guide

## Table of Contents

- [Overview](#overview)
- [Common Frontend Issues](#common-frontend-issues)
  - [Authentication Problems](#authentication-problems)
  - [UI Rendering Issues](#ui-rendering-issues)
  - [API Communication Errors](#api-communication-errors)
  - [Performance Issues](#performance-issues)
- [Common Backend Issues](#common-backend-issues)
  - [Server Startup Problems](#server-startup-problems)
  - [Database Connection Issues](#database-connection-issues)
  - [Authentication and Authorization Errors](#authentication-and-authorization-errors)
  - [File Upload Problems](#file-upload-problems)
  - [Payment Processing Issues](#payment-processing-issues)
- [Environment-Specific Troubleshooting](#environment-specific-troubleshooting)
  - [Development Environment](#development-environment)
  - [Production Environment](#production-environment)
- [Debugging Tools and Techniques](#debugging-tools-and-techniques)
- [Logging and Monitoring](#logging-and-monitoring)
- [Getting Help](#getting-help)

## Overview

This guide provides solutions for common issues you might encounter when developing, deploying, or using the Shop Experts platform. It covers both frontend and backend troubleshooting, as well as environment-specific issues.

## Common Frontend Issues

### Authentication Problems

#### Issue: Unable to log in

**Symptoms:**
- Login form submits but returns to login page
- Error messages about invalid credentials
- JWT token not being stored in localStorage

**Solutions:**

1. **Check credentials:**
   - Verify username and password are correct
   - Check for typos or incorrect case

2. **API connectivity:**
   ```bash
   # Test API connection
   curl -X POST http://localhost:8080/api/auth/signin -H "Content-Type: application/json" -d '{"usernameOrEmail":"test@example.com","password":"password"}'
   ```

3. **LocalStorage issues:**
   - Open browser console and check:
   ```javascript
   localStorage.getItem('authToken')
   ```
   - Clear storage and try again:
   ```javascript
   localStorage.clear()
   ```

4. **CORS issues:**
   - Check browser console for CORS errors
   - Verify that backend CORS configuration includes frontend domain
   - Update WebConfig.java if needed

#### Issue: Session expiration

**Symptoms:**
- Suddenly logged out during active use
- "Unauthorized" errors in console

**Solutions:**

1. Increase JWT token expiration time in `application.properties`:
   ```properties
   app.jwtExpirationMs=86400000
   ```

2. Implement token refresh mechanism in AuthContext.js
3. Check for clock skew between client and server

### UI Rendering Issues

#### Issue: Components not displaying properly

**Symptoms:**
- Blank areas where components should be
- Error messages in console about React props or hooks
- Visual styling inconsistencies

**Solutions:**

1. **Check console errors:**
   - Open browser developer tools
   - Look for specific component errors

2. **Verify dependencies:**
   ```bash
   cd frontend
   npm list react react-dom
   ```

3. **Clear cache and rebuild:**
   ```bash
   npm run clean
   npm install
   npm start
   ```

4. **Style isolation issues:**
   - Check for CSS specificity conflicts
   - Verify Material-UI theme is properly applied
   - Check for missing CSS imports

### API Communication Errors

#### Issue: API calls failing

**Symptoms:**
- 404, 500, or other error codes
- Data not loading or updating
- Error messages in console about failed fetch/axios calls

**Solutions:**

1. **Check API URL configuration:**
   - Verify API base URL in ApiService.js
   - Check environment variables (.env files)

2. **Inspect network requests:**
   - Use browser Network tab to check request/response
   - Confirm correct headers are being sent (Authorization, Content-Type)

3. **Try direct API call:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/users/me
   ```

4. **Check request payload format:**
   - Ensure JSON is valid
   - Verify required fields are present
   - Check for proper content type headers

### Performance Issues

#### Issue: Slow page loading

**Symptoms:**
- Long wait times for components to appear
- Delayed response to user interactions
- High resource usage in Task Manager/Activity Monitor

**Solutions:**

1. **Analyze bundle size:**
   ```bash
   cd frontend
   npm run build -- --stats
   npx webpack-bundle-analyzer build/bundle-stats.json
   ```

2. **Check for excessive re-renders:**
   - Use React DevTools Profiler
   - Look for components rendering too frequently
   - Implement React.memo() for expensive components
   - Review dependency arrays in useEffect hooks

3. **Implement code splitting:**
   - Use React.lazy() for component loading
   - Add route-based code splitting

4. **Optimize image assets:**
   - Compress images
   - Use WebP format where supported
   - Implement lazy loading for images

## Common Backend Issues

### Server Startup Problems

#### Issue: Application fails to start

**Symptoms:**
- Error messages during server startup
- Process terminates immediately after launch
- Port binding exceptions

**Solutions:**

1. **Check port availability:**
   ```bash
   lsof -i :8080
   # If port is in use, kill the process or change port
   kill -9 <PID>
   ```

2. **Verify dependencies:**
   ```bash
   cd backend
   mvn dependency:tree
   ```

3. **Check Java version:**
   ```bash
   java -version
   # Should be Java 8 or higher
   ```

4. **Review application logs:**
   ```bash
   tail -f logs/application.log
   ```

5. **Memory issues:**
   - Increase heap space:
   ```bash
   java -Xmx512m -jar target/shop-experts-0.0.1-SNAPSHOT.jar
   ```

### Database Connection Issues

#### Issue: Cannot connect to database

**Symptoms:**
- "Failed to initialize JPA" errors
- "Could not open JPA EntityManager" messages
- "Connection refused" errors

**Solutions:**

1. **Verify database is running:**
   ```bash
   # For PostgreSQL
   pg_isready -h localhost -p 5432
   
   # For MySQL
   mysqladmin -h localhost -u root -p status
   ```

2. **Check connection properties:**
   - Verify URL, username, password in application.properties
   - Test connection manually:
   ```bash
   # PostgreSQL
   psql -h localhost -U username -d shop_experts
   
   # MySQL
   mysql -h localhost -u username -p shop_experts
   ```

3. **Database migration issues:**
   - Check schema creation logs
   - Ensure tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

4. **Reset development database:**
   ```bash
   # For H2
   rm ~/.h2/shop-experts-db.mv.db
   
   # For PostgreSQL
   dropdb shop_experts && createdb shop_experts
   ```

### Authentication and Authorization Errors

#### Issue: JWT authentication failing

**Symptoms:**
- 401 Unauthorized errors
- 403 Forbidden responses
- "Invalid token" or "Expired JWT" messages

**Solutions:**

1. **Check JWT secret:**
   - Verify app.jwtSecret in application.properties
   - Ensure it's sufficiently complex and consistent across restarts

2. **Token generation/validation:**
   - Debug JwtUtils.java to verify token creation
   - Check token structure at jwt.io

3. **Role-based access issues:**
   - Verify user roles in database
   - Check @PreAuthorize annotations on controllers
   - Confirm role hierarchy in SecurityConfig.java

4. **Session management:**
   - Implement token blacklisting for logged out users
   - Add token refresh mechanism

### File Upload Problems

#### Issue: File uploads failing

**Symptoms:**
- Errors when uploading files
- Missing files in storage location
- OutOfMemoryError or file size errors

**Solutions:**

1. **Check file upload configuration:**
   - Verify upload directory exists and has proper permissions
   - Check max file size settings in application.properties:
   ```properties
   spring.servlet.multipart.max-file-size=10MB
   spring.servlet.multipart.max-request-size=10MB
   ```

2. **Storage path issues:**
   - Ensure absolute paths are correctly resolved
   - Verify FileStorageService is using the correct base path

3. **File type validation:**
   - Check allowed MIME types
   - Implement proper file type validation

4. **Temporary storage:**
   - Ensure enough disk space for temporary files
   - Check tmp directory permissions

### Payment Processing Issues

#### Issue: Stripe payments failing

**Symptoms:**
- Payment errors in console logs
- Users unable to complete bookings
- Stripe webhook errors

**Solutions:**

1. **Check Stripe API keys:**
   - Verify secret key in application.properties
   - Ensure test/live mode matches your environment

2. **Webhook configuration:**
   - Verify webhook URL is accessible
   - Check webhook signature validation

3. **Test with Stripe CLI:**
   ```bash
   stripe listen --forward-to localhost:8080/api/payments/webhook
   ```

4. **Payment intent issues:**
   - Debug PaymentService.java
   - Check for proper error handling in payment flow

## Environment-Specific Troubleshooting

### Development Environment

#### Issue: Hot reload not working

**Solutions:**
- Check spring-boot-devtools is in classpath
- Verify IDE is properly configured for hot reload
- Restart with clean cache:
  ```bash
  mvn clean spring-boot:run
  ```

#### Issue: Frontend proxy not working

**Solutions:**
- Check proxy configuration in package.json
- Ensure backend server is running
- Verify port configuration matches

### Production Environment

#### Issue: Application crashing in production

**Solutions:**
- Check system resources (CPU, memory, disk)
- Analyze application logs for errors
- Verify environment variables are correctly set
- Implement proper error handling and graceful degradation

#### Issue: High response times

**Solutions:**
- Implement caching (Redis, Caffeine)
- Optimize database queries
- Add connection pooling
- Scale horizontally if needed

## Debugging Tools and Techniques

### Backend Debugging

1. **Remote debugging:**
   ```bash
   java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar target/shop-experts-0.0.1-SNAPSHOT.jar
   ```
   Connect IDE debugger to port 5005

2. **Enhanced logging:**
   Add to application.properties:
   ```properties
   logging.level.com.shopexperts=DEBUG
   logging.level.org.springframework.security=DEBUG
   logging.level.org.hibernate.SQL=DEBUG
   ```

3. **Database query logging:**
   ```properties
   spring.jpa.properties.hibernate.format_sql=true
   logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
   ```

### Frontend Debugging

1. **React Developer Tools:**
   - Install Chrome/Firefox extension
   - Inspect component hierarchy and props
   - Profile renders and performance

2. **Network analysis:**
   - Use browser Network tab
   - Filter by XHR requests
   - Check timing and payload size

3. **Source maps for production debugging:**
   ```bash
   # Enable source maps in production
   GENERATE_SOURCEMAP=true npm run build
   ```

## Logging and Monitoring

### Log Analysis

1. **Centralized logging:**
   - Configure ELK Stack (Elasticsearch, Logstash, Kibana)
   - Ship logs to central repository

2. **Common log issues:**
   - Check for exceptions and stack traces
   - Look for unexpected behavior patterns
   - Monitor performance metrics

### Performance Monitoring

1. **Application metrics:**
   - Enable Spring Boot Actuator
   - Configure Prometheus for metrics collection
   - Visualize with Grafana dashboards

2. **Frontend monitoring:**
   - Implement web vitals tracking
   - Use browser performance API
   - Add error boundary components

## Getting Help

If you've tried the solutions in this guide and still have issues:

1. **Check documentation:**
   - Review relevant sections in other guides
   - Check framework documentation (React, Spring)

2. **Search for similar issues:**
   - GitHub issues
   - Stack Overflow
   - Framework-specific forums

3. **Contact support:**
   - Internal: Slack channel #shop-experts-support
   - External: Email support@shopexperts.com
