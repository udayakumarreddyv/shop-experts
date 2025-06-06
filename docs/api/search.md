# Search and Discovery API

## Overview

The Search API provides comprehensive search functionality for finding service providers, experts, and services. It includes location-based search, filtering, sorting, and recommendation capabilities.

## Base URL

All search endpoints are relative to: `/api/search`

## Authentication

Most search endpoints are publicly accessible. Advanced features require user authentication.

---

## Quick Search

### Get Quick Search Results

Provides fast, basic search results across experts and services.

```http
GET /api/search/quick
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `limit` | integer | No | Maximum results (default: 10, max: 50) |

**Example Request:**

```bash
curl -X GET "https://api.shopexperts.com/api/search/quick?q=car%20repair&limit=10"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "experts": [
      {
        "id": "123",
        "name": "Mike's Auto Repair",
        "rating": 4.8,
        "location": "Downtown",
        "expertise": ["automotive", "repair"],
        "profileImage": "https://example.com/image.jpg"
      }
    ],
    "services": [
      {
        "id": "456",
        "name": "Oil Change",
        "category": "automotive",
        "averagePrice": 35.00,
        "providers": 15
      }
    ],
    "totalResults": {
      "experts": 25,
      "services": 12
    }
  }
}
```

---

## Expert Search

### Search Experts

Find service providers and experts with advanced filtering options.

```http
GET /api/search/experts
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query |
| `category` | string | No | Service category |
| `location` | string | No | Location (city, zip, coordinates) |
| `radius` | integer | No | Search radius in miles (default: 25) |
| `minRating` | number | No | Minimum rating (1-5) |
| `maxPrice` | number | No | Maximum price range |
| `availability` | string | No | Availability filter (today, tomorrow, week) |
| `sortBy` | string | No | Sort by (rating, distance, price, popularity) |
| `sortOrder` | string | No | Sort order (asc, desc) |
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Results per page (default: 20, max: 100) |

**Example Request:**

```bash
curl -X GET "https://api.shopexperts.com/api/search/experts?q=plumber&location=New%20York&radius=10&minRating=4.0&sortBy=rating&sortOrder=desc"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "experts": [
      {
        "id": "123",
        "name": "Expert Plumbing Services",
        "description": "Professional plumbing services for residential and commercial properties",
        "rating": 4.9,
        "reviewCount": 156,
        "location": {
          "address": "123 Main St, New York, NY 10001",
          "latitude": 40.7128,
          "longitude": -74.0060,
          "distance": 2.5
        },
        "services": [
          {
            "id": "789",
            "name": "Emergency Plumbing",
            "price": {
              "min": 75,
              "max": 150,
              "unit": "hour"
            }
          }
        ],
        "availability": {
          "today": true,
          "nextAvailable": "2024-01-15T09:00:00Z"
        },
        "profileImage": "https://example.com/profile.jpg",
        "verified": true,
        "responseTime": "Usually responds within 1 hour"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalResults": 87,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "categories": [
        {"id": "plumbing", "name": "Plumbing", "count": 45},
        {"id": "emergency", "name": "Emergency Services", "count": 23}
      ],
      "priceRanges": [
        {"min": 0, "max": 50, "count": 12},
        {"min": 51, "max": 100, "count": 34}
      ]
    }
  }
}
```

---

## Service Search

### Search Services

Find specific services and their providers.

```http
GET /api/search/services
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query |
| `category` | string | No | Service category |
| `subcategory` | string | No | Service subcategory |
| `location` | string | No | Location filter |
| `radius` | integer | No | Search radius in miles |
| `minPrice` | number | No | Minimum price |
| `maxPrice` | number | No | Maximum price |
| `duration` | string | No | Service duration filter |
| `sortBy` | string | No | Sort by (price, rating, popularity) |
| `page` | integer | No | Page number |
| `limit` | integer | No | Results per page |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "456",
        "name": "Home Cleaning Service",
        "description": "Professional home cleaning with eco-friendly products",
        "category": "home",
        "subcategory": "cleaning",
        "price": {
          "min": 80,
          "max": 150,
          "unit": "service",
          "currency": "USD"
        },
        "duration": {
          "min": 120,
          "max": 180,
          "unit": "minutes"
        },
        "rating": 4.7,
        "providers": [
          {
            "id": "789",
            "name": "Clean House Pro",
            "rating": 4.8,
            "price": 95,
            "location": "Downtown",
            "availability": "Available today"
          }
        ],
        "totalProviders": 8
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalResults": 24
    }
  }
}
```

---

## Location-Based Search

### Search by Location

Find experts and services near a specific location.

```http
GET /api/search/location
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | Yes* | Latitude |
| `lng` | number | Yes* | Longitude |
| `address` | string | Yes* | Address string |
| `radius` | integer | No | Search radius in miles (default: 10) |
| `category` | string | No | Filter by category |
| `limit` | integer | No | Maximum results |

*Either coordinates (lat/lng) or address is required

**Example Request:**

```bash
curl -X GET "https://api.shopexperts.com/api/search/location?lat=40.7128&lng=-74.0060&radius=5&category=automotive"
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "location": {
      "formatted": "New York, NY 10001",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "results": [
      {
        "id": "123",
        "name": "Downtown Auto Repair",
        "type": "expert",
        "distance": 1.2,
        "rating": 4.6,
        "location": {
          "address": "456 Broadway, New York, NY 10013",
          "latitude": 40.7205,
          "longitude": -74.0052
        }
      }
    ],
    "summary": {
      "totalResults": 15,
      "averageDistance": 3.2,
      "nearestDistance": 0.5
    }
  }
}
```

---

## Categories and Filters

### Get Categories

Retrieve available service categories and subcategories.

```http
GET /api/search/categories
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "home",
        "name": "Home Services",
        "icon": "home",
        "subcategories": [
          {
            "id": "cleaning",
            "name": "Cleaning",
            "expertCount": 245
          },
          {
            "id": "plumbing",
            "name": "Plumbing",
            "expertCount": 189
          }
        ],
        "totalExperts": 1250
      },
      {
        "id": "automotive",
        "name": "Automotive",
        "icon": "car",
        "subcategories": [
          {
            "id": "repair",
            "name": "Repair",
            "expertCount": 156
          }
        ],
        "totalExperts": 324
      }
    ]
  }
}
```

### Get Search Filters

Get available filter options for search results.

```http
GET /api/search/filters
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Category to get filters for |
| `location` | string | No | Location context |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "priceRanges": [
      {"min": 0, "max": 50, "label": "Under $50"},
      {"min": 51, "max": 100, "label": "$51 - $100"},
      {"min": 101, "max": 200, "label": "$101 - $200"},
      {"min": 201, "max": null, "label": "Over $200"}
    ],
    "ratings": [
      {"min": 4.5, "label": "4.5+ stars"},
      {"min": 4.0, "label": "4.0+ stars"},
      {"min": 3.5, "label": "3.5+ stars"}
    ],
    "availability": [
      {"value": "today", "label": "Available Today"},
      {"value": "tomorrow", "label": "Available Tomorrow"},
      {"value": "week", "label": "Available This Week"}
    ],
    "distance": [
      {"radius": 5, "label": "Within 5 miles"},
      {"radius": 10, "label": "Within 10 miles"},
      {"radius": 25, "label": "Within 25 miles"}
    ]
  }
}
```

---

## Recommendations

### Get Personalized Recommendations

Get personalized expert and service recommendations (requires authentication).

```http
GET /api/search/recommendations
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Recommendation type (experts, services, popular) |
| `limit` | integer | No | Maximum results (default: 10) |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "123",
        "name": "Recommended Auto Shop",
        "type": "expert",
        "reason": "Based on your recent automotive bookings",
        "rating": 4.8,
        "location": "Near you",
        "matchScore": 0.95
      }
    ],
    "reasons": [
      "Popular in your area",
      "Similar to your past bookings",
      "Highly rated by users like you"
    ]
  }
}
```

### Get Popular Services

Get trending and popular services.

```http
GET /api/search/popular
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeframe` | string | No | Time period (day, week, month) |
| `location` | string | No | Location filter |
| `category` | string | No | Category filter |

---

## Search Analytics

### Save Search Query

Track search queries for analytics (requires authentication).

```http
POST /api/search/analytics
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "query": "car repair",
  "category": "automotive",
  "location": "New York",
  "resultsCount": 25,
  "clickedResults": ["123", "456"]
}
```

---

## Error Responses

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Invalid search parameters | Missing or invalid query parameters |
| 404 | No results found | Search returned no results |
| 429 | Rate limit exceeded | Too many search requests |
| 500 | Search service unavailable | Internal search service error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SEARCH_PARAMS",
    "message": "Invalid search parameters provided",
    "details": {
      "invalidParams": ["radius", "category"]
    }
  }
}
```

---

## Rate Limiting

- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 500 requests per hour
- **Premium users**: 2000 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

---

## Search Best Practices

### Query Optimization

1. **Use specific terms**: "plumber emergency repair" vs "fix water"
2. **Include location**: Improves relevance and speed
3. **Use filters**: Narrow results with category, price, rating filters
4. **Pagination**: Use reasonable page sizes (20-50 results)

### Performance Tips

1. **Cache categories**: Category list changes infrequently
2. **Debounce searches**: Wait for user to finish typing
3. **Progressive loading**: Load basic results first, then details
4. **Location caching**: Cache user location for faster searches

### Integration Examples

#### Search with Auto-complete

```javascript
// Debounced search function
const searchExperts = debounce(async (query) => {
  const response = await fetch(`/api/search/quick?q=${encodeURIComponent(query)}&limit=5`);
  const data = await response.json();
  return data.experts;
}, 300);
```

#### Location-based Search

```javascript
// Get user location and search nearby
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  const response = await fetch(`/api/search/location?lat=${latitude}&lng=${longitude}&radius=10`);
  const nearbyExperts = await response.json();
});
```
