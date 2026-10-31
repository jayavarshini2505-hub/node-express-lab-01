# Node.js and Express.js Backend Lab

## Project Description
This project demonstrates the creation of a basic HTTP server using Node.js and the implementation of REST API endpoints using Express.js.

The application includes different routes to display a welcome message, student information, the current date and time, and a custom 404 error message.

## Technologies Used
- Node.js
- Express.js
- JavaScript
- npm
- Visual Studio Code

## Project Structure

```text
lab-01/
│
├── node_modules/
├── screenshots/
│   ├── http-server.png
│   ├── home.png
│   ├── about.png
│   ├── not-found.png
│   └── time.png
│
├── .gitignore
├── http-server.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

### 1. Initialize the Node.js project

```bash
npm init -y
```

### 2. Install Express.js

```bash
npm install express
```

### 3. Run the application

```bash
node server.js
```

The server runs at:

`http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Displays the welcome message |
| GET | `/about` | Returns student information in JSON format |
| GET | `/time` | Returns the current date and time |
| GET | Any undefined route | Returns 404 Page Not Found |

## Screenshots

### 1. HTTP Server
![HTTP Server](screenshots/http-server.png)

### 2. Home Route
![Home Route](screenshots/home.png)

### 3. About Route
![About Route](screenshots/about.png)

### 4. 404 Not Found Route
![404 Route](screenshots/not-found.png)

### 5. Time Route
![Time Route](screenshots/time.png)

## How to Test the API

Open your browser and visit the following URLs:

- http://localhost:3000/
- http://localhost:3000/about
- http://localhost:3000/time
- http://localhost:3000/invalid

## Conclusion

This lab helped me understand the fundamentals of Node.js and Express.js, including server creation, route handling, HTTP GET requests, JSON responses, status codes, and error handling.