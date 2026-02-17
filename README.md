# Scalable Web Application

A production-ready, full-stack web application built with modern technologies featuring comprehensive authentication, protected routes, and a complete task management dashboard with CRUD operations.

## 🚀 Features

### Authentication & Security
- **JWT-based Authentication** with secure token management
- **Password Hashing** using bcrypt (10 salt rounds)
- **Protected Routes** with authentication middleware
- **Input Validation** on both client and server side
- **Rate Limiting** (100 requests per 15 minutes)
- **Security Headers** with Helmet.js
- **CORS Configuration** for secure cross-origin requests

### Task Management
- **Full CRUD Operations** (Create, Read, Update, Delete)
- **Advanced Filtering** by status, priority, and search terms
- **Sorting Capabilities** by date, priority, and status
- **Real-time Statistics** dashboard
- **Task Status Management** (pending, in-progress, completed)
- **Priority Levels** (low, medium, high)
- **Due Date Tracking**

### User Experience
- **Responsive Design** with Tailwind CSS
- **Toast Notifications** for user feedback
- **Loading States** for better UX
- **Form Validation** with real-time error feedback
- **Modal-based Task Creation/Editing**
- **Mobile-first Design** approach

## 🛠️ Technology Stack

### Frontend
- **React 18** with Hooks
- **React Router DOM 6** for routing
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **React Toastify** for notifications
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for rate limiting
- **helmet** for security headers

## 📁 Project Structure

```
scalable-webapp/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TaskCard.js
│   │   │   └── TaskModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── README.md
├── QUICKSTART.md
├── ARCHITECTURE.md
├── SCALABILITY_GUIDE.md
├── Postman_Collection.json
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://dathukorra06_db_user:<db_password>@cluster0.v1o4dlb.mongodb.net/?appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   SALT_ROUNDS=10
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=Scalable Web App
   ```

5. **Start the frontend development server:**
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 Usage

### Authentication Flow
1. **Register** a new account or **Login** with existing credentials
2. **Dashboard** loads with your tasks and statistics
3. **Create, edit, or delete** tasks as needed
4. **Filter and search** tasks using the control panel
5. **Update profile** or **change password** in the Profile section

### Demo Credentials
For testing purposes, you can use:
- **Email:** demo@example.com
- **Password:** Demo123!

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

## 📱 Responsive Design

The application is fully responsive and works on:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktops** (1024px and up)
- **Large screens** (1280px and up)

## 🔒 Security Features

### Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### JWT Security
- 7-day token expiration
- Secure token storage in localStorage
- Automatic token validation
- Token refresh on password change

### Rate Limiting
- 100 requests per 15 minutes per IP
- Automatic blocking of excessive requests
- Custom error messages for rate limit exceeded

## 🎨 Customization

### Tailwind CSS
The application uses Tailwind CSS with custom color palette:
- **Primary:** Blue color scheme (#3b82f6)
- **Secondary:** Gray color scheme
- **Status Colors:** Blue (pending), Yellow (in-progress), Green (completed)
- **Priority Colors:** Green (low), Yellow (medium), Red (high)

### Environment Variables
All configuration is managed through environment variables for easy deployment across different environments.

## 📚 Documentation

For detailed information, please refer to:
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture details
- [SCALABILITY_GUIDE.md](SCALABILITY_GUIDE.md) - Production deployment guide
- [Postman_Collection.json](Postman_Collection.json) - API testing collection

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify database name and credentials

2. **CORS Error**
   - Check CLIENT_URL in backend .env
   - Ensure frontend is running on correct port

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear localStorage if token is invalid

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check postcss.config.js and tailwind.config.js
   - Run `npm run build` for production styles

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React documentation and community
- Express.js framework
- MongoDB and Mongoose
- Tailwind CSS team
- All open-source contributors

---

**Happy Coding!** 🚀