# KaamHeru API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "municipality": "Bharatpur",
  "role": "public",
  "phoneNumber": "9876543210",
  "address": "123 Street, Bharatpur"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "public",
      "municipality": "Bharatpur"
    }
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
```
*Requires authentication*

### Update Profile
```http
PUT /auth/update-profile
```
*Requires authentication*

**Request Body:**
```json
{
  "fullName": "John Updated",
  "phoneNumber": "9876543211",
  "address": "456 New Street"
}
```

## Project Endpoints

### Get All Projects
```http
GET /projects
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `municipality` (string): Filter by municipality
- `status` (string): Filter by status
- `category` (string): Filter by category
- `sortBy` (string): Sort field (default: createdAt)
- `sortOrder` (string): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project-id",
        "projectId": "PRJ-001",
        "title": "Road Construction",
        "description": "Construction of main road",
        "category": "Road Construction",
        "municipality": "Bharatpur",
        "status": "In Progress",
        "budget": {
          "allocated": 5000000,
          "spent": 2000000
        },
        "timeline": {
          "startDate": "2024-01-01",
          "endDate": "2024-12-31"
        },
        "progress": {
          "percentage": 40,
          "lastUpdated": "2024-06-01T00:00:00.000Z"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProjects": 45,
      "hasMore": true
    }
  }
}
```

### Get Single Project
```http
GET /projects/:id
```

### Create Project
```http
POST /projects
```
*Requires admin role*

**Request Body:**
```json
{
  "projectId": "PRJ-002",
  "title": "Water Supply Project",
  "description": "Installation of water supply system",
  "category": "Water Supply",
  "municipality": "Kawasoti",
  "location": "Kawasoti City Center",
  "budget": {
    "allocated": 2000000
  },
  "timeline": {
    "startDate": "2024-03-01",
    "endDate": "2024-09-30"
  },
  "priority": "High"
}
```

### Update Project
```http
PUT /projects/:id
```
*Requires admin or assigned contractor role*

### Delete Project
```http
DELETE /projects/:id
```
*Requires admin role*
       `
### Assign Contractor
```http
PUT /projects/:id/assign-contractor
```
*Requires admin role*

**Request Body:**
```json
{
  "contractorId": "contractor-user-id"
}
```

### Get Contractor Projects
```http
GET /projects/contractor/:contractorId
```
*Requires authentication*

## User Endpoints

### Get All Users
```http
GET /users
```
*Requires admin role*

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by role
- `municipality` (string): Filter by municipality
- `isActive` (boolean): Filter by active status
- `search` (string): Search in username, fullName, email

### Get User by ID
```http
GET /users/:id
```
*Requires authentication*

### Update User
```http
PUT /users/:id
```
*Requires admin or own user account*

### Deactivate User
```http
DELETE /users/:id
```
*Requires admin role*

### Activate User
```http
PUT /users/:id/activate
```
*Requires admin role*

### Get Contractors
```http
GET /users/contractors
```

**Query Parameters:**
- `municipality` (string): Filter by municipality
- `page` (number): Page number
- `limit` (number): Items per page

## Review Endpoints

### Get Project Reviews
```http
GET /reviews/project/:projectId
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review-id",
        "rating": 4,
        "satisfaction": "Satisfied",
        "comment": "Good progress on the project",
        "reviewer": {
          "username": "citizen1",
          "fullName": "Citizen One"
        },
        "createdAt": "2024-06-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalReviews": 15
    },
    "stats": {
      "avgRating": 4.2,
      "totalReviews": 15
    }
  }
}
```

### Create Review
```http
POST /reviews
```
*Requires public user role*

**Request Body:**
```json
{
  "project": "project-id",
  "rating": 5,
  "satisfaction": "Very Satisfied",
  "comment": "Excellent work done by the contractor",
  "images": ["/uploads/image1.jpg", "/uploads/image2.jpg"]
}
```

### Respond to Review
```http
PUT /reviews/:id/respond
```
*Requires contractor role*

**Request Body:**
```json
{
  "response": "Thank you for your feedback. We appreciate your support."
}
```

### Verify Review
```http
PUT /reviews/:id/verify
```
*Requires admin role*

### Get User Reviews
```http
GET /reviews/user/:userId
```
*Requires authentication*

## Update Endpoints

### Get Project Updates
```http
GET /updates/project/:projectId
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by update type

### Create Update
```http
POST /updates
```
*Requires admin or assigned contractor role*

**Request Body:**
```json
{
  "project": "project-id",
  "updateType": "Progress Update",
  "title": "Monthly Progress Report",
  "description": "Completed 40% of the road construction work",
  "images": ["/uploads/progress1.jpg"],
  "newProgress": 40
}
```

### Update Update
```http
PUT /updates/:id
```
*Requires creator or admin role*

### Delete Update
```http
DELETE /updates/:id
```
*Requires creator or admin role*

### Get User Updates
```http
GET /updates/user/:userId
```
*Requires authentication*

## File Upload Endpoints

### Upload Single Image
```http
POST /upload/image
```
*Requires authentication*

**Request:** multipart/form-data with file field named "image"

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "image-1234567890.jpg",
    "path": "/uploads/image-1234567890.jpg",
    "originalName": "my-photo.jpg",
    "size": 1024000
  }
}
```

### Upload Multiple Images
```http
POST /upload/images
```
*Requires authentication*

**Request:** multipart/form-data with files field named "images" (max 5 files)

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Data Models

### User Model
```json
{
  "username": "string",
  "email": "string",
  "fullName": "string",
  "role": "public|contractor|admin",
  "municipality": "string",
  "phoneNumber": "string",
  "address": "string",
  "isActive": "boolean",
  "contractorDetails": {
    "licenseNumber": "string",
    "specialization": ["string"],
    "experience": "number",
    "completedProjects": "number"
  }
}
```

### Project Model
```json
{
  "projectId": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "municipality": "string",
  "location": "string",
  "status": "Planned|In Progress|Delayed|Completed|Cancelled",
  "priority": "Low|Medium|High|Critical",
  "budget": {
    "allocated": "number",
    "spent": "number"
  },
  "timeline": {
    "startDate": "date",
    "endDate": "date",
    "actualStartDate": "date",
    "actualEndDate": "date"
  },
  "assignedContractor": "objectId",
  "assignedBy": "objectId",
  "progress": {
    "percentage": "number",
    "lastUpdated": "date"
  },
  "images": ["string"],
  "isVisible": "boolean",
  "compliance": {
    "approved": "boolean",
    "approvedBy": "objectId",
    "approvedAt": "date",
    "notes": "string"
  }
}
```

### Review Model
```json
{
  "project": "objectId",
  "reviewer": "objectId",
  "rating": "number (1-5)",
  "satisfaction": "Very Satisfied|Satisfied|Neutral|Dissatisfied|Very Dissatisfied",
  "comment": "string",
  "images": ["string"],
  "contractorResponse": {
    "text": "string",
    "respondedAt": "date",
    "respondedBy": "objectId"
  },
  "isVerified": "boolean",
  "isPublic": "boolean"
}
```

### Update Model
```json
{
  "project": "objectId",
  "updatedBy": "objectId",
  "updateType": "Status Change|Progress Update|Photo Update|Budget Update|Timeline Change|Issue Report",
  "title": "string",
  "description": "string",
  "images": ["string"],
  "previousStatus": "string",
  "newStatus": "string",
  "previousProgress": "number",
  "newProgress": "number",
  "isPublic": "boolean",
  "priority": "Low|Medium|High"
}
```
