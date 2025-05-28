const db = require('../config/db');

// Create a new task
const createTask = async (req, res) => {
  const { description, is_completed = false } = req.body; // Default is_completed to false
  const userId = req.user.id; // Assuming req.user is populated by the protect middleware

  if (!description) {
    return res.status(400).json({ message: 'Task description is required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, description, is_completed) VALUES (?, ?, ?)',
      [userId, description, is_completed]
    );
    const insertedTaskId = result.insertId;
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [insertedTaskId]);
    res.status(201).json({ message: 'Task created successfully.', task: newTask[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task.' });
  }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
};

// Update an existing task
const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { description, is_completed } = req.body;

  if (description === undefined && is_completed === undefined) {
    return res.status(400).json({ message: 'At least one field (description or is_completed) must be provided for update.' });
  }

  // Construct the query dynamically based on provided fields
  let query = 'UPDATE tasks SET ';
  const queryParams = [];

  if (description !== undefined) {
    query += 'description = ?';
    queryParams.push(description);
  }

  if (is_completed !== undefined) {
    if (queryParams.length > 0) query += ', ';
    query += 'is_completed = ?';
    queryParams.push(is_completed);
  }

  query += ' WHERE id = ? AND user_id = ?';
  queryParams.push(taskId, userId);

  try {
    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0) {
      // Check if task exists but belongs to another user, or doesn't exist at all
      const [taskCheck] = await db.query('SELECT id FROM tasks WHERE id = ?', [taskId]);
      if (taskCheck.length > 0) {
        return res.status(403).json({ message: 'Not authorized to update this task or task not found.' }); // More generic for security
      }
      return res.status(404).json({ message: 'Task not found.' });
    }
    
    const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.status(200).json({ message: 'Task updated successfully.', task: updatedTask[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task.' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

    if (result.affectedRows === 0) {
      // Similar check as in update
      const [taskCheck] = await db.query('SELECT id FROM tasks WHERE id = ?', [taskId]);
      if (taskCheck.length > 0) {
        return res.status(403).json({ message: 'Not authorized to delete this task or task not found.' });
      }
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task.' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
