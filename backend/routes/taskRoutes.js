const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

const router = express.Router();

// Apply the protect middleware to all routes in this file
// This ensures that only authenticated users can access these task-related endpoints.
router.use(protect);

// Route to create a new task
// POST /api/tasks/
router.post('/', createTask);

// Route to get all tasks for the logged-in user
// GET /api/tasks/
router.get('/', getTasks);

// Route to update an existing task by its ID
// PUT /api/tasks/:id
router.put('/:id', updateTask);

// Route to delete a task by its ID
// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
