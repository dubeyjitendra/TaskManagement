const mysql = require('mysql2');

// Database connection details
// IMPORTANT: These should ideally be set via environment variables for security.
// Fallback values are provided for development convenience.
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'your_db_user'; // Replace with your default DB user
const DB_PASSWORD = process.env.DB_PASSWORD || 'your_db_password'; // Replace with your default DB password
const DB_NAME = process.env.DB_DATABASE || 'task_manager_db'; // Replace with your default DB name

// Create a connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to be used in other parts of the application
module.exports = pool.promise(); // Using promises for async/await support
