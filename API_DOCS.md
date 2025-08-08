# Mama's Kitchen API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Admin Credentials

- **Email**: admin@mamaskitchen.com
- **Password**: Admin@123

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "Mama's Kitchen API is running!",
  "timestamp": "2025-08-06T17:30:47.984Z",
  "environment": "development"
}
```

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mamaskitchen.com",
  "password": "Admin@123"
}
```

#### Get User Profile

```http
GET /auth/profile
Authorization: Bearer <token>
```

### Products

#### Get All Products

```http
GET /products
```

**Query Parameters:**

- `category` - Filter by category (appetizers, main-course, desserts, beverages, specials, snacks)
- `featured` - Filter featured products (true/false)
- `page` - Page number for pagination
- `limit` - Number of items per page

#### Get Single Product

```http
GET /products/:id
```

#### Get Products by Category

```http
GET /products/category/:category
```

#### Create Product (Admin Only)

```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Dish",
  "category": "main-course",
  "description": "Delicious new dish",
  "price": 199,
  "weight": {
    "value": 300,
    "unit": "g"
  },
  "images": [
    {
      "url": "/uploads/dish.jpg",
      "alt": "New Dish",
      "isPrimary": true
    }
  ]
}
```

### Reviews

#### Get All Reviews

```http
GET /reviews
```

#### Get Reviews for Product

```http
GET /reviews/product/:productId
```

#### Create Review

```http
POST /reviews
Content-Type: application/json

{
  "product": "product-id",
  "rating": 5,
  "title": "Great Food!",
  "comment": "Really enjoyed this dish",
  "name": "Customer Name",
  "email": "customer@email.com"
}
```

### Testimonials

#### Get All Testimonials

```http
GET /testimonials
```

#### Submit Testimonial

```http
POST /testimonials
Content-Type: application/json

{
  "name": "Happy Customer",
  "location": "Mumbai",
  "message": "Amazing food and service!",
  "rating": 5
}
```

### Contact

#### Submit Contact Form

```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "General Inquiry",
  "message": "I have a question about your menu",
  "type": "general"
}
```

#### Get Contact Submissions (Admin Only)

```http
GET /contact
Authorization: Bearer <admin-token>
```

### Admin

#### Get Dashboard Stats

```http
GET /admin/dashboard
Authorization: Bearer <admin-token>
```

#### Get All Users

```http
GET /admin/users
Authorization: Bearer <admin-token>
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Additional error details (optional)
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Contact Form**: 3 submissions per hour
- **Reviews**: 3 submissions per hour
- **Testimonials**: 2 submissions per day

## File Upload

Product images can be uploaded to the `/uploads` directory. Supported formats:

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

Maximum file size: 5MB

## Environment Variables

Make sure to set these in your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mamas-kitchen

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@mamaskitchen.com

# Company Information
COMPANY_NAME=Mama's Kitchen
COMPANY_EMAIL=info@mamaskitchen.com
COMPANY_PHONE=+91-XXXXXXXXXX
```
