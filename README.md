Movie Reservation System - Backend

Overview
This is the backend service for the Movie Reservation System. It provides APIs for user authentication, movie listings, reservations, and more. The backend is built using Node.js, Express.js, and MongoDB.

Features
* User authentication (Signup/Login)
* Movie listing management
* Reservation system
* Secure password handling with bcrypt
* JSON Web Token (JWT) authentication
* Error handling and validation
* Technologies Used
* Node.js
* Express.js
* MongoDB
* bcryptjs (for password hashing)
* jsonwebtoken (for authentication)
* dotenv (for environment variables)

Installation
Clone the repository:
git clone https://github.com/your-username/movie-reservation-backend.git

Navigate to the project directory:
cd movie-reservation-backend

Install dependencies:
npm install

Create a .env file and add the required environment variables:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the server:
node server.js
