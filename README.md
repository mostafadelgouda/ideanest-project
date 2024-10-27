# Ideanest Project

## Description

This project is a TypeScript-based Node.js application that serves as a backend service. It includes user authentication, organization management, and integrates with MongoDB.

## Features

- User registration and authentication with JWT
- Secure password storage using bcrypt
- Organization management with CRUD operations
- Input validation with express-validator
- Dockerized for easy deployment and development

## Technologies Used

- Node.js
- TypeScript
- Express
- MongoDB
- JWT for authentication
- bcrypt for password hashing
- Docker for containerization

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18 or later)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ideanest-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

You can run the application in a development environment using Docker:

1. Build and run the Docker container:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:8080`.

### Development

The application is set up to use `nodemon` for hot-reloading during development. You can modify the code, and changes will be automatically reflected without needing to restart the server.

### Docker Commands

- **Build the Docker image:** 

  ```bash
  docker-compose build
  ```

- **Run the Docker container:**

  ```bash
  docker-compose up
  ```

- **Stop the Docker container:**

  ```bash
  docker-compose down
  ```

## API Endpoints

### Authentication

- **POST /api/v1/auth/register** - Register a new user
- **POST /api/v1/auth/signin** - Log in an existing user
- **GET /api/v1/auth/me** - Get logged-in user details
- **POST /api/v1/auth/refresh-token** - Refresh the access token

### Organization Management

- **GET /api/v1/organizations/:id** - Get organization details
- **POST /api/v1/organizations** - Create a new organization
- **PUT /api/v1/organizations/:id** - Update an existing organization
- **DELETE /api/v1/organizations/:id** - Delete an organization

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

- Mostafa Adel