Portfolio Backend API
A robust and scalable backend API for a personal portfolio website built with Node.js, Express, TypeScript, and PostgreSQL. This API powers the portfolio frontend with authentication, blog management, project showcase, and user management features.

🚀 Live Deployment
Backend URL: https://portfolio-server-two-indol.vercel.app

🛠 Tech Stack
Runtime: Node.js

Framework: Express.js with TypeScript

Database: PostgreSQL with Prisma ORM

Authentication: JWT with bcrypt

CORS: Enabled for cross-origin requests

Compression: Response compression for performance

Environment: Dotenv for configuration

📋 API Modules

1. Authentication (/api/auth)
   POST /login - Email/password login

POST /google - Google OAuth authentication

POST /refresh - Refresh access token

POST /logout - User logout

GET /me - Get current user (protected)

2. Blog Posts (/api/post)
   GET / - Get all posts (public, with pagination/filtering)

GET /slug/:slug - Get post by slug (public)

GET /:id - Get post by ID (public)

POST / - Create new post (protected)

PATCH /:id - Update post (protected)

PATCH /:id/publish - Publish post (protected)

PATCH /:id/unpublish - Unpublish post (protected)

PATCH /:id/views - Increment view count

DELETE /:id - Delete post (protected)

3. Projects (/api/project)
   GET / - Get all projects (public, with pagination/filtering)

GET /:id - Get project by ID (public)

GET /author/:authorId - Get projects by author

GET /featured/list - Get featured projects

POST / - Create new project (protected)

PATCH /:id - Update project (protected)

DELETE /:id - Delete project (protected)

4. Users (/api/user)
   GET / - Get all users

GET /:id - Get user by ID

POST / - Create new user

PATCH /:id - Update user

DELETE /:id - Delete user

5. Statistics (/api/stats)
   GET / - Get dashboard statistics

🔐 Authentication & Authorization
JWT-based authentication with access tokens

Password hashing with bcrypt

Protected routes for owner-only operations

Automatic owner seeding on server startup

CORS configured for secure cross-origin requests

🗄 Database Schema
The application uses PostgreSQL with the following main models:

User: Portfolio owner and admin users

Post: Blog posts with publishing status

Project: Portfolio projects with technologies and links

Automatic migrations and type-safe queries with Prisma

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

PostgreSQL database

npm or yarn

Installation
Clone the repository

bash
git clone <repository-url>
cd portfolio-backend
Install dependencies

bash
npm install
Environment Configuration
Create a .env file in the root directory:

env
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
Database Setup

bash

# Generate Prisma client

npx prisma generate

# Run database migrations

npx prisma migrate dev

# Seed initial data (optional)

npx prisma db seed
Start the server

bash

# Development

npm run dev

# Production

npm run build
npm start
🧪 API Testing
Authentication
bash

# Login

curl -X POST https://portfolio-server-two-indol.vercel.app/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email": "admin@example.com", "password": "password"}'
Get All Posts
bash
curl https://portfolio-server-two-indol.vercel.app/api/post
Get Featured Projects
bash
curl https://portfolio-server-two-indol.vercel.app/api/project/featured/list
🔧 Development Scripts
npm run dev - Start development server with hot reload

npm run build - Build the application

npm start - Start production server

npm run test - Run test suite

npx prisma studio - Open Prisma database GUI

🌐 CORS Configuration
The API is configured to accept requests from:

http://localhost:3000 (local development)

https://asmshadportfolio.vercel.app (production frontend)

All Vercel preview deployments

📈 Features
RESTful API Design - Clean and predictable endpoints

Type Safety - Full TypeScript implementation

Error Handling - Comprehensive error handling and validation

Security - JWT authentication, password hashing, CORS protection

Performance - Response compression, efficient queries

Scalability - Modular architecture, database connection pooling

🚨 Error Handling
The API provides consistent error responses:

json
{
"success": false,
"message": "Error description",
"error": "Detailed error information"
}
🔒 Security Features
JWT token-based authentication

Password hashing with bcrypt

CORS protection

Input validation and sanitization

Secure cookie handling

Environment variable protection

Built with ❤️ for portfolio management
