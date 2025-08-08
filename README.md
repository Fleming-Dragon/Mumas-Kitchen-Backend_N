# Mama's Kitchen Backend API

A robust Node.js backend API for Mama's Kitchen e-commerce platform, providing authentic homestyle food delivery services.

## 🍛 Features

- **User Authentication**: Secure JWT-based authentication and authorization
- **Product Management**: CRUD operations for food items with categories
- **Reviews & Ratings**: Customer feedback system
- **Testimonials**: Customer testimonials management
- **Contact System**: Contact form with email notifications
- **Admin Panel**: Administrative operations for content management
- **File Upload**: Image upload for products
- **Rate Limiting**: API protection with configurable rate limits
- **Email Services**: Automated email notifications

## 🏗️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Security**: Helmet.js, CORS, Rate limiting
- **Validation**: Express Validator, Joi
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Update the environment variables with your configuration:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/mamas-kitchen

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d

   # Frontend URLs
   FRONTEND_URL=http://localhost:3000,http://localhost:5173

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

4. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

## 🚀 Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🛣️ API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `DELETE /api/auth/deleteaccount` - Delete user account

### Products

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Reviews

- `GET /api/reviews` - Get all approved reviews
- `GET /api/reviews/product/:productId` - Get reviews for specific product
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review (Admin only)
- `DELETE /api/reviews/:id` - Delete review (Admin only)

### Testimonials

- `GET /api/testimonials` - Get all approved testimonials
- `POST /api/testimonials` - Submit testimonial
- `PUT /api/testimonials/:id` - Update testimonial (Admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin only)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin only)

### Admin

- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user status

## 🍳 Product Categories

- **appetizers** - Starters and snacks
- **main-course** - Main dishes and curries
- **desserts** - Sweet treats and traditional desserts
- **beverages** - Drinks and refreshments
- **specials** - Chef's special items
- **snacks** - Light bites and finger foods

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```javascript
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **user** - Regular customer access
- **admin** - Administrative access to all features

## 📊 Database Models

### User

- Personal information and authentication credentials
- Role-based access control
- Account status management

### Product

- Complete product information with images
- Nutritional information and ingredients
- Availability and pricing
- SEO optimization fields

### Review

- Customer ratings and comments
- Approval system for moderation

### Testimonial

- Customer success stories
- Location and rating information

### Contact

- Contact form submissions
- Type categorization and status tracking

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API abuse prevention
- **Input Validation** - Data sanitization
- **Password Hashing** - Secure password storage
- **JWT Authentication** - Stateless authentication

## 📧 Email Functionality

- Contact form notifications
- Welcome emails for new users
- Admin notifications for important events

## 🎯 Admin Features

- User management
- Product CRUD operations
- Review moderation
- Testimonial approval
- Contact form management
- Dashboard analytics

## 🛠️ Development

### Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── validators/      # Input validation
├── uploads/         # File uploads
└── tests/          # Test files
```

### Code Style

- Use consistent naming conventions
- Follow RESTful API principles
- Implement proper error handling
- Add comprehensive validation
- Write clear documentation

## 🚨 Error Handling

The API includes comprehensive error handling with:

- Detailed error messages
- Proper HTTP status codes
- Development vs production error responses
- Request validation errors
- Database operation errors

## 📝 Logging

- Request logging with timestamps
- Error logging with stack traces
- Performance monitoring
- Security event logging

## 🔧 Configuration

Environment-based configuration for:

- Database connections
- JWT settings
- Email services
- CORS policies
- Rate limiting
- File upload limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## � License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@mamaskitchen.com or create an issue in the repository.

---

**Mama's Kitchen** - Bringing authentic home-cooked flavors to your doorstep! 🍛❤️

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configurations:

   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/anand-agro
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start MongoDB** (if using local installation)

   ```bash
   mongod
   ```

5. **Seed the database** (optional - adds sample data)

   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 🔗 API Endpoints

### Products

- `GET /api/products` - Get all products (with filtering, pagination)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/featured` - Get featured products

### Reviews

- `GET /api/reviews/product/:productId` - Get reviews for a product
- `POST /api/reviews` - Create a new review
- `GET /api/reviews` - Get all reviews (admin)

### Testimonials

- `GET /api/testimonials` - Get approved testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `POST /api/testimonials` - Submit new testimonial

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (admin)
- `GET /api/contact/:id` - Get single contact submission (admin)
- `PUT /api/contact/:id/status` - Update contact status (admin)

### Health Check

- `GET /api/health` - API health status

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting per IP
- **Input Validation**: Joi validation for all inputs
- **Error Handling**: Centralized error handling
- **Environment Variables**: Sensitive data protection

## 🔄 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Contact Form**: 5 submissions per hour per IP
- **Reviews**: 3 submissions per hour per IP
- **Testimonials**: 2 submissions per day per IP

## 📧 Email Configuration

The application uses Nodemailer for sending emails. Configure the following environment variables:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@anandagro.com
```

For Gmail, you'll need to:

1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `EMAIL_PASS`

## 🗄️ Database Models

### Product

- Basic product information
- Categories, pricing, stock
- Images and features
- Nutritional information
- SEO fields
- Rating aggregation

### Review

- Product reviews and ratings
- Approval system
- Email validation
- Helpful votes tracking

### Testimonial

- Customer testimonials
- Featured testimonials
- Approval and ordering system

### Contact

- Contact form submissions
- Status tracking
- Priority levels
- Admin notes

## 🔍 Validation

All API endpoints include comprehensive input validation using express-validator:

- **Email format validation**
- **Required field validation**
- **Length constraints**
- **Type validation**
- **Custom business logic validation**

## 🚨 Error Handling

The API includes centralized error handling for:

- **Validation errors**: 400 Bad Request
- **Not found errors**: 404 Not Found
- **Database errors**: 500 Internal Server Error
- **Authentication errors**: 401 Unauthorized
- **Authorization errors**: 403 Forbidden

## 📊 Sample Data

The seeder script (`utils/seeder.js`) includes:

- 7 sample products across 3 categories
- 4 featured testimonials
- Sample reviews for products
- Proper relationships between models

Run the seeder with:

```bash
node utils/seeder.js
```

## 🔧 Development Tips

1. **Database Connection**: Ensure MongoDB is running before starting the server
2. **Environment Variables**: Copy `.env.example` to `.env` and configure
3. **API Testing**: Use tools like Postman or Thunder Client
4. **Logs**: Check console for detailed error messages in development
5. **CORS**: Frontend URL must match `FRONTEND_URL` in environment

## 📈 Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper JWT secrets
4. Set up SSL/TLS
5. Configure reverse proxy (nginx)
6. Set up proper logging
7. Configure email service

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper validation for new endpoints
3. Include error handling
4. Update this README if needed
5. Test all endpoints before submitting

## 📄 License

This project is licensed under the MIT License.
