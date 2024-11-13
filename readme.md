Here’s the updated `README.md` for your project based on your SQLite database setup and the API functionality you shared:

---

# Task Management System

This is a Task Management application that allows users to manage tasks and update their profiles. The backend is built using **Node.js**, **Express**, and **SQLite** as the database. It includes user authentication, task creation, and task management features.

## Features

- **User Registration & Authentication**
  - Users can sign up with a username, password, email, and other profile details.
  - Users can log in using their credentials and access their profiles and tasks.
  - Passwords are securely hashed using **bcryptjs**.

- **Profile Management**
  - Users can update their profile information (name, email, password).
  - Current password verification is required to change the password.

- **Task Management**
  - Users can create, view, update, and delete tasks.
  - Tasks have a status field to indicate if they are "pending", "in progress", or "completed".
  - Each task is associated with a user and cannot be accessed by others.

## Table Structure

The database is managed by SQLite with two primary tables:

1. **USERS**
    - Stores information about the users, such as:
        - `id`: Unique identifier for each user (UUID)
        - `username`: Unique username for authentication
        - `password`: Hashed password for login
        - `name`: Name of the user
        - `email`: Email of the user
    
2. **TASKS**
    - Stores tasks for each user:
        - `id`: Unique identifier for each task (UUID)
        - `user_id`: References the `id` from the `USERS` table
        - `title`: The task title
        - `description`: Detailed description of the task
        - `status`: Task status (`done`, `pending`, `in progress`, `completed`)
        - `created_at`: Date and time when the task was created
        - `last_modified`: Date and time when the task was last modified

## Project Setup

Follow these steps to get the backend running:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Install Dependencies

Run the following command to install the necessary dependencies:

```bash
npm install
```

### 3. Start the Server

To start the backend server:

```bash
npm start
```

This will run the server on port `3000` (or the port defined in the environment variables).

### 4. Database Setup

The project uses **SQLite** for storing user data and tasks. The database file `todo.db` will be automatically created in the root of the project.

The schema for the tables is created automatically when the server starts up.

### 5. Available API Endpoints

#### User Authentication

- **POST `/todo/register`**: User registration (username, password, name, email).
- **POST `/todo/login`**: User login (username, password). Returns a JWT token.

#### Profile Management

- **GET `/todo/profile-details`**: Fetch the current user's profile details (name and email).
- **PUT `/todo/profile`**: Update the user's profile details (name, email, currentPassword, newPassword).

#### Task Management

- **GET `/todo/tasks`**: Get all tasks for the authenticated user.
- **POST `/todo/tasks`**: Create a new task (title, description, status).
- **PUT `/todo/tasks/:id`**: Update an existing task (title, description, status).
- **DELETE `/todo/tasks/:id`**: Delete a task by ID.

### 6. Authorization

All protected routes (profile and task management) require the user to be authenticated. Authentication is handled via **JWT tokens**. 

The token should be included in the `Authorization` header as a Bearer token for any protected routes.

Example:

```bash
Authorization: Bearer <JWT_TOKEN>
```

### 7. Error Handling

The API returns standard HTTP status codes with a descriptive error message in the response body when something goes wrong.

- **200 OK**: Request was successful.
- **400 Bad Request**: Invalid request, e.g., missing required fields.
- **401 Unauthorized**: Authentication failed, e.g., invalid credentials or missing token.
- **404 Not Found**: Requested resource not found.
- **500 Internal Server Error**: Server-side error.

---

### Additional Notes:

- **Hashing Passwords**: The application uses **bcryptjs** to securely hash user passwords before storing them in the database.
  
- **Database Management**: SQLite is used for this project, and the schema is automatically set up using the `sqlite3` module. The database file is created at `todo.db`.

- **Middleware**: The application uses a custom middleware for authentication, which verifies the JWT token before allowing access to protected routes.

---