const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// It's crucial to use environment variables for sensitive data like JWT_SECRET.
// For development, a fallback is provided, but this should be configured securely for production.
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-dev';
const SALT_ROUNDS = 10; // For bcrypt password hashing

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    const [result] = await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Retrieve user from database
    const [users] = await db.query('SELECT id, username, password_hash FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
    }

    const user = users[0];

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Password incorrect
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      username: user.username
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(200).json({ message: 'Login successful.', token: token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in.' });
  }
};

module.exports = {
  register,
  login
};
