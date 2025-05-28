const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
// POST /api/auth/register
router.post('/register', register);

// Route for user login
// POST /api/auth/login
router.post('/login', login);

module.exports = router;
