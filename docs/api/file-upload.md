# File Upload API Documentation

## Overview
The File Upload API handles secure file uploads for various platform features including profile pictures, service documentation, certifications, proof of completion, and review media. It supports multiple file types with comprehensive validation and security measures.

## Base URL
```
/api/files
```

## Authentication
All file upload endpoints require authentication via JWT token:
```
Authorization: Bearer <jwt_token>
```

## Supported File Types

### Images
- **Formats**: JPEG, PNG, WebP, GIF
- **Max Size**: 10MB per file
- **Max Resolution**: 4096x4096 pixels
- **Use Cases**: Profile pictures, service photos, review images

### Documents
- **Formats**: PDF, DOC, DOCX
- **Max Size**: 25MB per file
- **Use Cases**: Certifications, licenses, contracts

### Videos
- **Formats**: MP4, MOV, AVI
- **Max Size**: 100MB per file
- **Max Duration**: 5 minutes
- **Use Cases**: Service demonstration videos, review videos

## Endpoints

### 1. Upload Single File

**POST** `/api/files/upload`

Uploads a single file with metadata.

#### Request Headers
```
Content-Type: multipart/form-data
```

#### Form Data Parameters
- `file`: File to upload (required)
- `purpose`: Upload purpose (required) - See [Upload Purposes](#upload-purposes)
- `description`: File description (optional)
- `isPublic`: Whether file should be publicly accessible (optional, default: false)
- `metadata`: Additional metadata as JSON string (optional)

#### Example Request
```bash
curl -X POST \
  -H "Authorization: Bearer <jwt_token>" \
  -F "file=@profile.jpg" \
  -F "purpose=PROFILE_PICTURE" \
  -F "description=Profile picture" \
  -F "isPublic=true" \
  https://api.shopexperts.com/api/files/upload
```

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "file_123456789",
    "originalName": "profile.jpg",
    "fileName": "file_123456789_profile.jpg",
    "contentType": "image/jpeg",
    "size": 245760,
    "purpose": "PROFILE_PICTURE",
    "isPublic": true,
    "uploadedBy": "user_123456789",
    "uploadedAt": "2025-06-06T10:00:00Z",
    "url": "https://cdn.shopexperts.com/files/file_123456789_profile.jpg",
    "thumbnailUrl": "https://cdn.shopexperts.com/thumbnails/file_123456789_profile_thumb.jpg",
    "metadata": {
      "width": 1024,
      "height": 768,
      "colorDepth": 24
    },
    "virus": {
      "scanned": true,
      "clean": true,
      "scannedAt": "2025-06-06T10:00:15Z"
    }
  }
}
```

### 2. Upload Multiple Files

**POST** `/api/files/upload/batch`

Uploads multiple files in a single request.

#### Form Data Parameters
- `files[]`: Array of files to upload (required)
- `purpose`: Upload purpose for all files (required)
- `descriptions[]`: Array of descriptions for each file (optional)
- `metadata`: Common metadata as JSON string (optional)

#### Response
```json
{
  "status": "success",
  "data": {
    "uploaded": [
      {
        "id": "file_123456789",
        "originalName": "cert1.pdf",
        "url": "https://cdn.shopexperts.com/files/file_123456789_cert1.pdf",
        "status": "SUCCESS"
      },
      {
        "id": "file_123456790",
        "originalName": "cert2.pdf",
        "url": "https://cdn.shopexperts.com/files/file_123456790_cert2.pdf",
        "status": "SUCCESS"
      }
    ],
    "failed": [],
    "summary": {
      "total": 2,
      "successful": 2,
      "failed": 0
    }
  }
}
```

### 3. Get File Information

**GET** `/api/files/{fileId}`

Retrieves detailed information about a specific file.

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "file_123456789",
    "originalName": "service_photo.jpg",
    "fileName": "file_123456789_service_photo.jpg",
    "contentType": "image/jpeg",
    "size": 1048576,
    "purpose": "SERVICE_PHOTO",
    "description": "Before and after repair photos",
    "isPublic": false,
    "uploadedBy": "user_123456789",
    "uploadedAt": "2025-06-06T10:00:00Z",
    "lastAccessedAt": "2025-06-06T14:30:00Z",
    "accessCount": 5,
    "url": "https://cdn.shopexperts.com/files/file_123456789_service_photo.jpg",
    "secureUrl": "https://cdn.shopexperts.com/secure/file_123456789?token=abc123",
    "thumbnailUrl": "https://cdn.shopexperts.com/thumbnails/file_123456789_thumb.jpg",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "colorDepth": 24,
      "exif": {
        "camera": "iPhone 12",
        "dateTaken": "2025-06-06T09:45:00Z",
        "location": {
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      }
    },
    "virus": {
      "scanned": true,
      "clean": true,
      "scannedAt": "2025-06-06T10:00:15Z",
      "engine": "ClamAV"
    },
    "tags": ["repair", "before", "after"]
  }
}
```

### 4. Get User's Files

**GET** `/api/files/my-files`

Retrieves files uploaded by the authenticated user.

#### Query Parameters
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `purpose` (optional): Filter by upload purpose
- `contentType` (optional): Filter by content type (image/*, application/pdf, etc.)
- `sort` (optional): Sort field (uploadedAt, size, name)
- `direction` (optional): Sort direction (ASC/DESC, default: DESC)

#### Response
```json
{
  "status": "success",
  "data": {
    "content": [
      {
        "id": "file_123456789",
        "originalName": "profile.jpg",
        "contentType": "image/jpeg",
        "size": 245760,
        "purpose": "PROFILE_PICTURE",
        "uploadedAt": "2025-06-06T10:00:00Z",
        "url": "https://cdn.shopexperts.com/files/file_123456789_profile.jpg",
        "thumbnailUrl": "https://cdn.shopexperts.com/thumbnails/file_123456789_thumb.jpg"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 45,
    "totalPages": 3,
    "summary": {
      "totalSize": 52428800,
      "imageCount": 32,
      "documentCount": 8,
      "videoCount": 5
    }
  }
}
```

### 5. Generate Secure Download URL

**POST** `/api/files/{fileId}/secure-url`

Generates a time-limited secure URL for file access.

#### Request Body
```json
{
  "expiresIn": 3600,
  "purpose": "DOWNLOAD | PREVIEW | SHARE",
  "allowedIPs": ["192.168.1.1", "10.0.0.1"]
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "secureUrl": "https://cdn.shopexperts.com/secure/file_123456789?token=eyJhbGciOiJIUzI1NiJ9...",
    "expiresAt": "2025-06-06T11:00:00Z",
    "accessType": "DOWNLOAD",
    "restrictions": {
      "maxDownloads": 1,
      "allowedIPs": ["192.168.1.1"]
    }
  }
}
```

### 6. Update File Metadata

**PUT** `/api/files/{fileId}/metadata`

Updates file metadata and description.

#### Request Body
```json
{
  "description": "Updated description",
  "isPublic": false,
  "tags": ["repair", "diagnostic", "completed"],
  "metadata": {
    "serviceId": "service_123",
    "location": "Workshop A"
  }
}
```

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "file_123456789",
    "description": "Updated description",
    "isPublic": false,
    "tags": ["repair", "diagnostic", "completed"],
    "updatedAt": "2025-06-06T10:30:00Z"
  }
}
```

### 7. Delete File

**DELETE** `/api/files/{fileId}`

Deletes a file and all its associated data.

#### Response
```json
{
  "status": "success",
  "data": {
    "id": "file_123456789",
    "deleted": true,
    "deletedAt": "2025-06-06T10:30:00Z"
  }
}
```

### 8. Get File Usage Analytics

**GET** `/api/files/{fileId}/analytics`

Retrieves usage analytics for a specific file.

#### Response
```json
{
  "status": "success",
  "data": {
    "fileId": "file_123456789",
    "analytics": {
      "totalViews": 125,
      "totalDownloads": 15,
      "uniqueViewers": 23,
      "averageViewDuration": 45,
      "lastAccessed": "2025-06-06T09:30:00Z",
      "peakAccessHour": 14,
      "topReferrers": [
        {
          "source": "app.shopexperts.com",
          "views": 89
        },
        {
          "source": "direct",
          "views": 36
        }
      ],
      "accessByDevice": {
        "mobile": 78,
        "desktop": 42,
        "tablet": 5
      }
    },
    "timeline": [
      {
        "date": "2025-06-01",
        "views": 12,
        "downloads": 2
      }
    ]
  }
}
```

### 9. Scan File for Viruses

**POST** `/api/files/{fileId}/scan`

Manually triggers a virus scan for a specific file.

#### Response
```json
{
  "status": "success",
  "data": {
    "fileId": "file_123456789",
    "scanId": "scan_123456789",
    "status": "SCANNING",
    "startedAt": "2025-06-06T10:00:00Z",
    "estimatedCompletion": "2025-06-06T10:02:00Z"
  }
}
```

### 10. Get Upload Statistics (Admin)

**GET** `/api/files/statistics`

Retrieves upload statistics and analytics (admin only).

#### Query Parameters
- `period` (optional): DAILY, WEEKLY, MONTHLY (default: WEEKLY)
- `startDate`, `endDate` (optional): Custom date range

#### Response
```json
{
  "status": "success",
  "data": {
    "period": {
      "type": "WEEKLY",
      "startDate": "2025-06-01",
      "endDate": "2025-06-07"
    },
    "summary": {
      "totalFiles": 2340,
      "totalSize": 15728640000,
      "totalUploads": 156,
      "averageFileSize": 6721280,
      "storageUsed": "14.6GB",
      "bandwidthUsed": "45.2GB"
    },
    "byType": {
      "images": {
        "count": 1890,
        "size": 9437184000,
        "percentage": 60.0
      },
      "documents": {
        "count": 340,
        "size": 5242880000,
        "percentage": 33.3
      },
      "videos": {
        "count": 110,
        "size": 1048576000,
        "percentage": 6.7
      }
    },
    "byPurpose": {
      "PROFILE_PICTURE": 890,
      "SERVICE_PHOTO": 567,
      "CERTIFICATION": 234,
      "REVIEW_MEDIA": 445,
      "DOCUMENTATION": 204
    },
    "trends": {
      "uploadsPerDay": [
        {
          "date": "2025-06-01",
          "uploads": 23,
          "totalSize": 157286400
        }
      ],
      "growthRate": 15.2,
      "popularFileTypes": ["JPEG", "PNG", "PDF", "MP4"]
    }
  }
}
```

## Upload Purposes

### Profile and Identity
- `PROFILE_PICTURE`: User profile pictures
- `COVER_PHOTO`: Profile cover photos
- `AVATAR`: Alternative avatar images

### Certifications and Documentation
- `CERTIFICATION`: Professional certifications
- `LICENSE`: Business licenses
- `INSURANCE`: Insurance documents
- `IDENTIFICATION`: ID verification documents

### Service Related
- `SERVICE_PHOTO`: Before/after service photos
- `DIAGNOSTIC_REPORT`: Diagnostic reports and documentation
- `ESTIMATE`: Service estimates and quotes
- `INVOICE`: Service invoices
- `RECEIPT`: Payment receipts

### Review and Media
- `REVIEW_PHOTO`: Photos attached to reviews
- `REVIEW_VIDEO`: Videos attached to reviews
- `TESTIMONIAL_MEDIA`: Testimonial photos/videos

### Marketing and Content
- `PROMOTIONAL_BANNER`: Marketing banners
- `SERVICE_GALLERY`: Service showcase images
- `BLOG_IMAGE`: Blog post images

## File Processing

### Image Processing
All uploaded images are automatically processed:

1. **Virus Scanning**: Scanned with ClamAV
2. **Format Validation**: Verified format and structure
3. **Thumbnail Generation**: Multiple sizes (150x150, 300x300, 600x600)
4. **Compression**: Optimized for web delivery
5. **EXIF Stripping**: Removes sensitive metadata (optional)
6. **Watermarking**: Applied for certain purposes (optional)

### Document Processing
Documents undergo:

1. **Virus Scanning**: Comprehensive malware detection
2. **Content Analysis**: Text extraction and indexing
3. **Thumbnail Generation**: First page preview
4. **Password Protection**: Detection and handling
5. **Format Validation**: Structure verification

### Video Processing
Videos are processed for:

1. **Virus Scanning**: Malware detection
2. **Format Conversion**: Standardized to MP4/H.264
3. **Thumbnail Extraction**: Frame thumbnails
4. **Duration Validation**: Length compliance
5. **Quality Optimization**: Bitrate optimization

## Security Measures

### Upload Security
- **File Type Validation**: Strict MIME type checking
- **Size Limits**: Per-file and per-user quotas
- **Content Scanning**: Virus and malware detection
- **User Authentication**: JWT token validation
- **Rate Limiting**: Upload frequency controls

### Access Control
- **Private Files**: Secure token-based access
- **Public Files**: CDN delivery with caching
- **Time-limited URLs**: Temporary access tokens
- **IP Restrictions**: Location-based access control
- **Download Tracking**: Access logging and analytics

### Data Protection
- **Encryption at Rest**: AES-256 encryption
- **Encryption in Transit**: TLS 1.3
- **Backup Strategy**: Geo-redundant backups
- **Audit Logging**: Complete access trails
- **Data Retention**: Configurable retention policies

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "File validation failed",
  "errors": [
    {
      "field": "file",
      "message": "File size exceeds maximum limit of 10MB"
    },
    {
      "field": "contentType",
      "message": "File type not supported. Allowed types: JPEG, PNG, PDF"
    }
  ]
}
```

#### 413 Payload Too Large
```json
{
  "status": "error",
  "message": "File size too large",
  "details": {
    "maxSize": 10485760,
    "actualSize": 15728640
  }
}
```

#### 415 Unsupported Media Type
```json
{
  "status": "error",
  "message": "File type not supported",
  "supportedTypes": ["image/jpeg", "image/png", "application/pdf"]
}
```

#### 423 Virus Detected
```json
{
  "status": "error",
  "message": "File contains malicious content",
  "details": {
    "threat": "Win32.Trojan.Generic",
    "action": "File quarantined"
  }
}
```

## Integration Points

### CDN Integration
- **CloudFront**: Global content delivery
- **S3 Storage**: Primary file storage
- **Image Optimization**: On-the-fly resizing
- **Cache Control**: Intelligent caching strategies

### External Services
- **Virus Scanning**: ClamAV integration
- **Image Processing**: ImageMagick/Sharp
- **Video Processing**: FFmpeg
- **OCR**: Tesseract for document text extraction

## Rate Limiting

- File uploads: 50 files per hour per user
- Batch uploads: 10 batches per hour per user
- Download requests: 200 per hour per user
- Secure URL generation: 100 per hour per user

## Storage Quotas

### User Limits
- **Free Users**: 1GB total storage
- **Premium Users**: 10GB total storage
- **Expert Users**: 25GB total storage
- **Enterprise**: Custom limits

### File Limits
- **Images**: 10MB per file
- **Documents**: 25MB per file
- **Videos**: 100MB per file
- **Total per upload**: 500MB
