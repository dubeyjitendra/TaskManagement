const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const taskRoutes = require('./routes/taskRoutes'); // Import task routes

// Set default environment variables for convenience if not already set
// IMPORTANT: In production, these should be set via your hosting environment or a .env file.
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'your_db_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'your_db_password';
process.env.DB_DATABASE = process.env.DB_DATABASE || 'task_manager_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-dev-only'; // Change this for production!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// API Routes
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth
app.use('/api/tasks', taskRoutes); // Mount task routes under /api/tasks

// Root route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Using DB_HOST:', process.env.DB_HOST);
  console.log('Using DB_USER:', process.env.DB_USER);
  // Avoid logging password in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Using DB_PASSWORD:', process.env.DB_PASSWORD ? '********' : 'Not set');
  }
  console.log('Using DB_DATABASE:', process.env.DB_DATABASE);
  console.log('JWT_SECRET is set:', process.env.JWT_SECRET ? 'Yes' : 'No (Using default, not for production!)');
});
