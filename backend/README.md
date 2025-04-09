# Library Management System - Backend

This is the backend API for the Library Management System built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- User authentication with JWT
- Role-based access control
- Book management
- Request system for book borrowing
- Issue tracking

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables by creating a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library-management
   JWT_SECRET=your_jwt_secret_key
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - User login (returns JWT token)
- **GET** `/api/auth/profile` - Get current user profile (requires authentication)

### Books

- **GET** `/api/books` - Get all books
- **POST** `/api/books/add` - Add a new book (admin only)
- **DELETE** `/api/books/:id` - Delete a book (admin only)

### Requests

- **POST** `/api/requests/request/:bookId` - Request a book (student)
- **GET** `/api/requests/my-requests` - Get user's requests (student)
- **GET** `/api/requests/requests` - Get all requests (admin only)
- **POST** `/api/requests/approve/:requestId` - Approve a request (admin only)
- **POST** `/api/requests/reject/:requestId` - Reject a request (admin only)

### Issues

- **GET** `/api/issues/my` - Get user's issued books (student)
- **GET** `/api/issues/all` - Get all issued books (admin only)
- **POST** `/api/issues/return/:bookId` - Return a book

## Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `role`: String (enum: ["student", "admin"], default: "student")

### Book
- `title`: String (required)
- `author`: String (required)
- `description`: String
- `quantity`: Number (default: 1)

### Request
- `user`: ObjectId (ref: "User")
- `book`: ObjectId (ref: "Book")
- `status`: String (enum: ["pending", "approved", "rejected"], default: "pending")
- `requestDate`: Date
- `responseDate`: Date
- `responseMessage`: String

### Issue
- `user`: ObjectId (ref: "User")
- `book`: ObjectId (ref: "Book")
- `issueDate`: Date
- `dueDate`: Date
- `returnDate`: Date
- `isReturned`: Boolean (default: false)

## Middleware

- `auth.js`: Authentication middleware
  - `protect`: Ensures routes are accessible only to authenticated users
  - `allowRoles`: Restricts routes to specific user roles (e.g., admin) 