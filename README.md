TODO Application (MVC)
A robust, full-stack TODO application built with Node.js, Express, and MongoDB. This project demonstrates the Model-View-Controller (MVC) design pattern, secure authentication, and integration testing.

Features
Authentication: Secure Sign-up and Login using bcryptjs (12 salt rounds) and express-session.

MVC Architecture: Clean separation of concerns between data, logic, and UI.

State Management: Organize tasks into Pending, Completed, and Trash (soft-delete).

Security: Uses Helmet for secure headers and express-session with connect-mongo for persistent sessions.

Logging: Custom formatted logging system for requests and errors.

Mobile Responsive: Custom CSS with media queries for all devices.

Entity Relationship (ER) Diagram
The application follows a 1:N (One-to-Many) relationship between Users and Tasks.

User: _id, username, password (hashed).

Todo: _id, text, status (Enum: pending, completed, deleted), userId (Foreign Key)

Prerequisites
Node.js (v18+)

MongoDB Atlas account or Local MongoDB instance

Setup & Installation
Clone the repository:

git clone https://github.com/Chidiogoezeh/Second-semester-month-3
cd todo-mvc-app

Install dependencies:

npm install

Environment Variables: Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string

SESSION_SECRET=whatever_you _like_secret_key

NODE_ENV=development

Start the server:

npm start

Testing & Quality Assurance
The project includes automated integration tests using Jest and Supertest.

To run the tests:

npm test

Test Coverage:

Security (Unauthorized redirects)

User Authentication (Registration and Password hashing)

CRUD Logic (User-specific data filtering)

Deployment (Render)
This application is ready for deployment on Render.

Connect your GitHub repository to Render.

Add Environment Variables (MONGO_URI, SESSION_SECRET, NODE_ENV=production) in the Render Dashboard.

The build command is npm install and the start command is npm start.

Folder Structure
controllers/ - Request handling and logic.

models/ - Mongoose schemas.

routes/ - API and View routing.

public/ - CSS and Client-side JavaScript.

views/ - EJS templates.

utils/ - Formatted Logger.

tests/ - Integration test suite.

