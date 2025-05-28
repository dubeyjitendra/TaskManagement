document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  const loginSection = document.getElementById('login-section');
  const taskSection = document.getElementById('task-section');
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task-button');
  const taskList = document.getElementById('task-list');

  // Hardcoded credentials
  const correctUsername = 'user';
  const correctPassword = 'password';

  let tasks = []; // Initialize tasks array
  let editingTaskId = null; // Variable to store the ID of the task being edited

  loginButton.addEventListener('click', () => {
    const enteredUsername = usernameInput.value;
    const enteredPassword = passwordInput.value;

    if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
      loginSection.style.display = 'none';
      taskSection.style.display = 'block';
      loginError.textContent = '';
      renderTasks();
    } else {
      loginError.textContent = 'Invalid username or password.';
    }
  });

  function renderTasks() {
    taskList.innerHTML = ''; // Clear the current content

    tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.textContent = task.text;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.style.marginLeft = '10px';
      editButton.addEventListener('click', () => {
        editingTaskId = task.id;
        taskInput.value = task.text;
        addTaskButton.textContent = 'Update Task';
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.style.marginLeft = '5px'; // Add some space
      deleteButton.addEventListener('click', () => {
        // Remove the task from the tasks array
        tasks = tasks.filter(t => t.id !== task.id);

        // If the deleted task was being edited, reset the form
        if (editingTaskId === task.id) {
          taskInput.value = '';
          addTaskButton.textContent = 'Add Task';
          editingTaskId = null;
        }

        // Re-render the task list
        renderTasks();
      });

      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);
      taskList.appendChild(listItem);
    });
  }

  addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
      return;
    }

    if (editingTaskId !== null) {
      // Edit mode
      const taskToUpdate = tasks.find(task => task.id === editingTaskId);
      if (taskToUpdate) {
        taskToUpdate.text = taskText;
      }
      addTaskButton.textContent = 'Add Task';
      editingTaskId = null;
    } else {
      // Add mode
      const newTask = {
        id: Date.now(),
        text: taskText
      };
      tasks.push(newTask);
    }

    renderTasks();
    taskInput.value = '';
  });
});
