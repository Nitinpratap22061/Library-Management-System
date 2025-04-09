# DBMS Project Management System

## Overview
This is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing database management system projects.



## Features
- User authentication and authorization
- Project management functionality
- File upload capabilities
- SMS notifications using Twilio
- Secure password handling with bcrypt
- JWT-based authentication

## Technologies Used
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Twilio for SMS services

### Frontend
- React.js
- Redux for state management
- Axios for API calls
- Material-UI/Tailwind CSS for styling

## Project Structure
```
project-dbms/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/project-dbms.git
cd project-dbms
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Run the Application
```bash
# Start Backend (from backend directory)
npm run dev

# Start Frontend (from frontend directory)
npm start
```

## Environment Variables
Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## API Documentation
### Auth Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Project Routes
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create new project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

---
Created by Your Name - Feel free to contact me!
