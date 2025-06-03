# Task Manager App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for managing projects and their associated tasks. The application features user authentication, project creation and management, and a Kanban-style board for task organization within each project.

## Features

* **User Authentication**: Secure registration and login for users.
* **Project Management**: Create, view, update, and delete projects. Each project is associated with the logged-in user.
* **Task Management**:
    * Create, view, update, and delete tasks within specific projects.
    * Tasks include properties like title, description, status (pending, in-progress, completed), and due date.
    * Kanban-style drag-and-drop interface for managing task status on the project detail page.
* **API**:
    * RESTful API for users, projects, and tasks.
    * Protected routes requiring token authentication.
    * Input validation for API requests.
    * Pagination and filtering for task lists.
* **Frontend**:
    * Built with React and Vite.
    * State management using Redux Toolkit.
    * Routing handled by React Router.
    * UI components from Material-UI.
    * Theming support with light and dark modes.
* **Backend**:
    * Node.js with Express.js framework.
    * MongoDB with Mongoose for database interaction.
    * JWT for token-based authentication.
    * Password hashing using bcryptjs.
* **Testing**:
    * Backend API tests using Jest and Supertest.
    * In-memory MongoDB server for testing.

## Technologies Used

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (jsonwebtoken)
* bcryptjs
* cors
* dotenv
* express-validator

### Frontend

* React
* Vite
* Redux Toolkit
* React Router DOM
* Axios
* Material-UI (MUI)
* Emotion (for MUI styling)
* Framer Motion (for animations)
* React Beautiful DnD (for drag and drop)

### Development & Testing (Backend)

* Nodemon
* Jest
* Supertest
* mongodb-memory-server
* cross-env

## Setup and Installation

### Prerequisites

* Node.js (>=18.x recommended for backend, >=14.18.0 or >=16.0.0 for frontend with Vite)
* npm (Node Package Manager)
* MongoDB (either a local instance or a cloud-hosted solution like MongoDB Atlas)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    NODE_ENV=development
    PORT=5001 # Or any port you prefer
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    ```
    * Replace `<your_mongodb_connection_string>` with your actual MongoDB connection string.
    * Replace `<your_jwt_secret_key>` with a strong, unique secret for JWT generation.

4.  **Run the backend server:**
    * For development with Nodemon (auto-restarts on file changes):
        ```bash
        npm run dev
        ```
    * To start the server normally:
        ```bash
        npm start
        ```
    The backend API will be running, typically at `http://localhost:5001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    # From the project root
    cd frontend
    # Or, if you are in the backend directory:
    # cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **(Optional) Create a `.env` file** in the `frontend` directory if you need to override the default API base URL (though the Vite proxy is usually sufficient for development):
    ```env
    VITE_API_BASE_URL=http://localhost:5001
    ```
    The `vite.config.js` is already set up to proxy `/api` requests to `http://localhost:5001` during development.

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application will be available, typically at `http://localhost:5173` (Vite's default) or another port if 5173 is in use.

## Available Scripts

### Backend

* `npm start`: Starts the production server.
* `npm run dev`: Starts the development server using Nodemon.
* `npm test`: Runs backend tests using Jest in watch mode.

### Frontend

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the application for production.
* `npm run lint`: Lints the codebase using ESLint.
* `npm run preview`: Serves the production build locally for preview.

## API Endpoints Overview

(For detailed routes and validations, please refer to the `backend/routes/` directory.)

* **User Authentication**:
    * `POST /api/users/register`: Register a new user.
    * `POST /api/users/login`: Login an existing user.
    * `GET /api/users/profile`: Get current user's profile (protected).
* **Projects**:
    * `POST /api/projects`: Create a new project (protected).
    * `GET /api/projects`: Get all projects for the authenticated user (protected).
    * `GET /api/projects/:id`: Get a specific project by ID (protected).
    * `PUT /api/projects/:id`: Update a project (protected).
    * `DELETE /api/projects/:id`: Delete a project and its related tasks (protected).
    * `GET /api/projects/:id/tasks`: Get all tasks for a specific project (protected).
* **Tasks**:
    * `POST /api/tasks`: Create a new task (protected, requires `projectId`).
    * `GET /api/tasks`: Get tasks for the authenticated user, with pagination and filtering (protected).
    * `GET /api/tasks/:id`: Get a specific task by ID (protected).
    * `PUT /api/tasks/:id`: Update a task (protected).
    * `DELETE /api/tasks/:id`: Delete a task (protected).

## Project Structure Highlights

* **`backend/`**: Contains the Node.js/Express.js server-side code.
    * **`config/`**: Database connection setup.
    * **`controllers/`**: Logic for handling requests (user, project, task).
    * **`middleware/`**: Custom middleware (authentication, validation).
    * **`models/`**: Mongoose schemas for User, Project, and Task.
    * **`routes/`**: API route definitions.
    * **`tests/`**: Jest test files for API routes.
    * **`utils/`**: Utility functions (e.g., token generation).
    * **`server.js`**: Main application entry point for the backend.
* **`frontend/`**: Contains the React client-side code.
    * **`src/`**: Main source code for the React application.
        * **`app/`**: Redux store configuration.
        * **`components/`**: Reusable UI components (e.g., Navbar, ProtectedRoute).
        * **`contexts/`**: React context for theming.
        * **`features/`**: Redux slices and services for different domains (auth, projects, tasks, ui).
        * **`pages/`**: Top-level page components for different routes.
        * **`main.jsx`**: Main application entry point for the frontend.
    * **`vite.config.js`**: Vite configuration file.
