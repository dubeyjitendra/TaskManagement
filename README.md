# Task Management Application

## Overview

This is a single-page web application that allows users to manage their tasks. It features user authentication (registration and login) and full CRUD (Create, Read, Update, Delete) functionality for tasks. The frontend is built with HTML, CSS, and vanilla JavaScript, while the backend is a Node.js/Express application that interacts with a MySQL database for persistent storage.

## Features

*   **User Registration:** New users can create an account.
*   **User Login:** Registered users can log in to access their tasks.
*   **Create Tasks:** Logged-in users can add new tasks.
*   **View Tasks:** Logged-in users can see a list of their tasks.
*   **Update Tasks:** Users can edit the description of their tasks and mark them as completed or incomplete.
*   **Delete Tasks:** Users can remove tasks they no longer need.
*   **Persistent Storage:** User and task data is stored in a MySQL database.
*   **Token-based Authentication:** Secure access to task management features using JSON Web Tokens (JWT).

## Quick Start

This section provides a brief overview of the steps to get the application running. For detailed instructions, please refer to the "Setup and Running" section below.

1.  **Database Setup:**
    *   Ensure MySQL is running.
    *   Create a database (e.g., `task_manager_db`).
    *   Create tables using `backend/database_schema.sql`. (See details below)
2.  **Backend Setup:**
    *   Navigate to `cd backend`.
    *   Create and configure your `backend/.env` file with database credentials and JWT secret. (See template below)
    *   Install dependencies: `npm install`.
    *   Run the server: `npm start` (or `node server.js`). Expected to run on `http://localhost:3000`.
3.  **Frontend Usage:**
    *   Open `index.html` in the root project directory in your web browser.

*For detailed instructions, especially for database setup and `.env` configuration, please see the full "Setup and Running" section.*

## Project Structure

The project is organized as follows:

```
/
├── index.html            # Main HTML file for the frontend
├── script.js             # JavaScript logic for the frontend
├── style.css             # CSS styles for the frontend
├── backend/
│   ├── server.js         # Main Express server file
│   ├── package.json      # Node.js project metadata and dependencies
│   ├── database_schema.sql # SQL script to create database tables
│   ├── config/
│   │   └── db.js         # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js # Logic for authentication
│   │   └── taskController.js # Logic for task CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js   # Routes for authentication endpoints
│   │   └── taskRoutes.js   # Routes for task CRUD endpoints
│   └── .gitignore        # Specifies intentionally untracked files (e.g., node_modules, .env)
└── README.md             # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm:** Download and install from [nodejs.org](https://nodejs.org/).
*   **MySQL Server:** Download and install from [mysql.com](https://www.mysql.com/downloads/). Make sure the MySQL server is running.

## Setup and Running

Follow these steps to get the application running on your local machine.

### 1. Database Setup

*   **Connect to MySQL:** Open your MySQL client (e.g., MySQL command line, MySQL Workbench).
*   **Create the Database:** Execute the following SQL command to create a new database (you can choose a different name if you prefer, but remember to update it in the backend configuration).
    ```sql
    CREATE DATABASE task_manager_db;
    ```
*   **Create Tables:** Use the provided schema file to create the `users` and `tasks` tables. Navigate to the project's root directory in your terminal and run:
    ```bash
    mysql -u your_mysql_user -p task_manager_db < backend/database_schema.sql
    ```
    Replace `your_mysql_user` with your MySQL username and `task_manager_db` with the database name you created. You will be prompted for your MySQL password.

### 2. Backend Setup

*   **Navigate to Backend Directory:**
    ```bash
    cd backend
    ```
*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Environment Variables:**
    For security and proper configuration, the backend uses environment variables to store sensitive information like database credentials and JWT secrets. Create a `.env` file in the `backend/` directory. This file is listed in `.gitignore` and should not be committed to version control.

    Use the following template for your `backend/.env` file, replacing placeholder values with your actual credentials:
    ```env
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=task_manager_db # Or the name you chose in step 1
    JWT_SECRET=your_very_strong_and_unique_jwt_secret # Choose a long, random string
    PORT=3000 # Optional, the server defaults to 3000 if not set
    ```
    **Note:** While the `server.js` file includes default fallback values for development if these environment variables are not set, it is strongly recommended to use a `.env` file for all setups.

*   **Run the Backend Server:**
    You can run the server using one of the following commands (depending on your `package.json` setup and preferences):
    *   If you have a `start` script in `backend/package.json` (e.g., `"start": "node server.js"` or `"start": "nodemon server.js"`):
        ```bash
        npm start
        ```
    *   Alternatively, you can run it directly with Node.js or Nodemon (if installed globally or as a project dev dependency):
        ```bash
        node server.js
        ```
        or, for automatic restarts during development:
        ```bash
        nodemon server.js
        ```
    The backend server should now be running (typically on `http://localhost:3000`).

### 3. Frontend Usage

*   **Open `index.html`:** Navigate to the root directory of the project and open the `index.html` file directly in your web browser (e.g., by double-clicking it or using "File > Open" in your browser).

The application should now be functional. You can register a new user, log in, and start managing tasks.

## API Endpoints

The backend exposes the following API endpoints, which the frontend interacts with:

*   **Authentication:**
    *   `POST /api/auth/register`: Register a new user.
    *   `POST /api/auth/login`: Log in an existing user and receive a JWT.
*   **Tasks (Protected by JWT):**
    *   `GET /api/tasks`: Get all tasks for the authenticated user.
    *   `POST /api/tasks`: Create a new task for the authenticated user.
    *   `PUT /api/tasks/:id`: Update an existing task (description and/or completion status) by its ID.
    *   `DELETE /api/tasks/:id`: Delete a task by its ID.

---
This README provides a comprehensive guide to understanding, setting up, and running the Task Management Application.