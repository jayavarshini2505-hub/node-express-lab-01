const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
const JWT_SECRET_KEY = "MY_SUPER_SECRET_JWT_KEY"; // Moved to .env in Lab 8
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create user table with unique username
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET / - Welcome Route
app.get("/", (request, response) => {
  response.send({
    message: "Welcome to Lab 4: Registration, Login and JWT API!",
    endpoints: {
      register: "POST /register/",
      login: "POST /login/",
    },
  });
});

// POST /register/ - User Registration
app.post("/register/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !name || !password) {
    return response.status(400).send({
      message: "All fields (username, name, password) are required",
    });
  }

  // Check if user already exists (parameterized query)
  const selectUserQuery = `SELECT * FROM user WHERE username = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser !== undefined) {
    return response.status(400).send({ message: "User already exists" });
  }

  // Hash password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  const createUserQuery = `
    INSERT INTO user (username, name, password)
    VALUES (?, ?, ?);
  `;
  await db.run(createUserQuery, [username, name, hashedPassword]);

  response.status(201).send({ message: "User created successfully" });
});

// POST /login/ - User Login & JWT Generation
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).send({
      message: "Username and password are required",
    });
  }

  // Check if user exists
  const selectUserQuery = `SELECT * FROM user WHERE username = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    return response.status(400).send({ message: "Invalid user" });
  }

  // Compare plain password with stored hash
  const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

  if (!isPasswordMatched) {
    return response.status(400).send({ message: "Invalid password" });
  }

  // Payload contains ONLY username (never password)
  const payload = { username: dbUser.username };
  const jwtToken = jwt.sign(payload, JWT_SECRET_KEY);

  response.status(200).send({ jwt_token: jwtToken });
});

module.exports = app;