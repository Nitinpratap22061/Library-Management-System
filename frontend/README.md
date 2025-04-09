# Library Management System - Frontend

The frontend for the Library Management System built with React and Material UI.

## Features

- Modern UI with Material UI components
- Responsive design for all device sizes
- Context API for state management
- Private routes with role-based access control
- Book browsing and search functionality
- Request and issue management interfaces

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context for state management
├── pages/          # Page components
├── utils/          # Utility functions and API calls
├── App.js          # Main application component
└── index.js        # Application entry point
```

## Key Components

### Authentication

- `Login.js` - Login form
- `Register.js` - Registration form
- `AuthContext.js` - Authentication context and provider

### Book Management

- `BooksList.js` - Display all books
- `BookItem.js` - Individual book display card
- `AddBookForm.js` - Form for adding new books (admin)

### Request Management

- `BookRequests.js` - Admin interface for handling book requests
- `BookRequestItem.js` - Individual request display with approve/reject actions
- `UserRequests.js` - User interface to view their requests

### Issue Management

- `MyBooks.js` - User interface to view borrowed books
- `IssuedBookItem.js` - Individual borrowed book display
- `AllIssues.js` - Admin interface to view all book issues

## Styling

The application uses Material UI for styling with:
- Theme customization
- Responsive layout
- Dark/light mode support

## API Integration

All API calls are centralized in the `utils/api.js` file, providing:
- Authentication requests
- Book management
- Request handling
- Issue tracking

## Environment Configuration

The application uses the proxy setting in `package.json` to forward API requests to the backend server during development:

```json
"proxy": "http://localhost:5000"
```
