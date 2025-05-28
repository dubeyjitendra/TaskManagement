document.addEventListener('DOMContentLoaded', () => {
  // API Base URL
  const baseUrl = 'http://localhost:3000/api';

  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const taskSection = document.getElementById('task-section');

  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const logoutButton = document.getElementById('logout-button');

  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const registerUsernameInput = document.getElementById('register-username');
  const registerPasswordInput = document.getElementById('register-password');

  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task-button');
  const taskList = document.getElementById('task-list');

  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const taskError = document.getElementById('task-error');
  const apiErrorDisplay = document.getElementById('api-error-display');

  const showRegisterLink = document.getElementById('show-register-link');
  const showLoginLink = document.getElementById('show-login-link');

  let tasks = [];
  let editingTaskId = null;

  // --- Helper Functions ---
  function clearErrors() {
    loginError.textContent = '';
    registerError.textContent = '';
    taskError.textContent = '';
    apiErrorDisplay.textContent = '';
  }

  function displayApiError(message) {
    apiErrorDisplay.textContent = message;
  }

  function displayFormError(element, message) {
    element.textContent = message;
  }

  async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    options.headers = headers;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // Attempt to parse error from API, otherwise use status text
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Not a JSON error response
        }
        const message = errorData?.message || response.statusText || `HTTP error ${response.status}`;
        throw new Error(message);
      }
      // If response is OK but no content, return null or an empty object as appropriate
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null; 
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error; // Re-throw to be caught by caller
    }
  }

  // --- UI Toggles ---
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    taskSection.style.display = 'none';
    clearErrors();
  });

  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    taskSection.style.display = 'none';
    clearErrors();
  });

  function showLoginView() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    taskSection.style.display = 'none';
    clearErrors();
  }

  function showTaskView() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    taskSection.style.display = 'block';
    clearErrors();
  }

  // --- Authentication ---
  loginButton.addEventListener('click', async (event) => {
    event.preventDefault();
    clearErrors();
    const username = loginUsernameInput.value;
    const password = loginPasswordInput.value;

    if (!username || !password) {
      displayFormError(loginError, 'Username and password are required.');
      return;
    }

    try {
      const data = await fetchWithAuth(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem('jwtToken', data.token);
      showTaskView();
      await loadTasks();
    } catch (error) {
      displayFormError(loginError, error.message || 'Login failed.');
    }
  });

  registerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    clearErrors();
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    if (!username || !password) {
      displayFormError(registerError, 'Username and password are required.');
      return;
    }

    try {
      await fetchWithAuth(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      // Optionally, inform user to login, or auto-login
      alert('Registration successful! Please login.');
      showLoginView();
      loginUsernameInput.value = username; // Pre-fill for convenience
    } catch (error) {
      displayFormError(registerError, error.message || 'Registration failed.');
    }
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwtToken');
    tasks = [];
    editingTaskId = null;
    taskList.innerHTML = '';
    showLoginView();
  });

  // --- Task Management ---
  async function loadTasks() {
    try {
      const fetchedTasks = await fetchWithAuth(`${baseUrl}/tasks`);
      tasks = fetchedTasks || []; // Ensure tasks is an array even if API returns null/undefined
      renderTasks();
    } catch (error) {
      displayApiError(error.message || 'Failed to load tasks.');
      // If token is invalid (e.g. 401), redirect to login
      if (error.message.toLowerCase().includes('not authorized') || error.message.toLowerCase().includes('token failed')) {
        handleLogout(); // Or a more specific function to handle session expiry
      }
    }
  }

  function renderTasks() {
    taskList.innerHTML = '';
    if (!Array.isArray(tasks)) {
        console.error("Tasks is not an array:", tasks);
        tasks = []; // Reset to empty array if it's not an array
    }

    tasks.forEach(task => {
      const listItem = document.createElement('li');
      if (task.is_completed) {
        listItem.classList.add('completed');
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.is_completed;
      checkbox.addEventListener('change', async () => {
        await updateTaskStatus(task.id, checkbox.checked);
      });

      const textSpan = document.createElement('span');
      textSpan.textContent = task.description;
      textSpan.style.flexGrow = '1'; // Allow text to take available space
      textSpan.style.marginLeft = '10px';
      if (task.is_completed) {
        textSpan.style.textDecoration = 'line-through';
      }


      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        editingTaskId = task.id;
        taskInput.value = task.description; // Use description, not text
        addTaskButton.textContent = 'Update Task';
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteTaskItem(task.id);
      });
      
      const buttonsDiv = document.createElement('div');
      buttonsDiv.appendChild(editButton);
      buttonsDiv.appendChild(deleteButton);

      listItem.appendChild(checkbox);
      listItem.appendChild(textSpan);
      listItem.appendChild(buttonsDiv);
      taskList.appendChild(listItem);
    });
  }
  
  async function updateTaskStatus(taskId, isCompleted) {
    clearErrors();
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      await fetchWithAuth(`${baseUrl}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ description: taskToUpdate.description, is_completed: isCompleted }),
      });
      // Refresh tasks from server to ensure consistency
      await loadTasks();
    } catch (error) {
      displayFormError(taskError, error.message || 'Failed to update task status.');
      // Revert checkbox if API call fails (optional)
      await loadTasks(); // Re-render to show original state
    }
  }


  addTaskButton.addEventListener('click', async () => {
    clearErrors();
    const taskDescription = taskInput.value.trim();

    if (taskDescription === '') {
      displayFormError(taskError, 'Task description cannot be empty.');
      return;
    }

    try {
      if (editingTaskId !== null) {
        // Edit mode
        const taskToUpdate = tasks.find(task => task.id === editingTaskId);
        if (!taskToUpdate) return; // Should not happen if UI is consistent

        await fetchWithAuth(`${baseUrl}/tasks/${editingTaskId}`, {
          method: 'PUT',
          body: JSON.stringify({ description: taskDescription, is_completed: taskToUpdate.is_completed }),
        });
        addTaskButton.textContent = 'Add Task';
        editingTaskId = null;
      } else {
        // Add mode
        await fetchWithAuth(`${baseUrl}/tasks`, {
          method: 'POST',
          body: JSON.stringify({ description: taskDescription }),
        });
      }
      taskInput.value = '';
      await loadTasks(); // Refresh list
    } catch (error) {
      displayFormError(taskError, error.message || 'Failed to save task.');
    }
  });
  
  async function deleteTaskItem(taskId) {
    clearErrors();
    try {
      await fetchWithAuth(`${baseUrl}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      // If this task was being edited, reset the form
      if (editingTaskId === taskId) {
          taskInput.value = '';
          addTaskButton.textContent = 'Add Task';
          editingTaskId = null;
      }
      await loadTasks(); // Refresh list
    } catch (error) {
      displayFormError(taskError, error.message || 'Failed to delete task.');
    }
  }

  // --- Initial Check ---
  // Check if user is already logged in (e.g., JWT in localStorage)
  const token = localStorage.getItem('jwtToken');
  if (token) {
    showTaskView();
    loadTasks(); // Load tasks if token exists
  } else {
    showLoginView();
  }
});
