# Lab 3: REST API, query parameters, validation, debugging

## Live Demo
🚀 **Live Application:** https://node-express-lab-03.onrender.com

## GitHub Repository
🔗 https://github.com/jayavarshini2505-hub/node-express-lab-01

---

## Project Description

This project upgrades the Lab 2 Express.js and SQLite application into a clean RESTful API. 

It introduces advanced `GET` endpoint features like title searching using SQL `LIKE`, sorting, price range filtering using `BETWEEN`, and pagination (limit and offset). It also adds POST body validation for required fields (`title`, `author`, `price`), standardizes error messages, and ensures proper HTTP status codes across all CRUD operations (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

## Technologies Used

- Node.js
- Express.js
- SQLite (`sqlite`, `sqlite3`)
- JavaScript
- Nodemon
- Postman
- Git and GitHub
- Render (Deployment)

## Project Structure

```text
lab-03/
│
├── node_modules/
├── screenshots/
│   ├── get-all-books.png
│   ├── get-book-by-id.png
│   ├── get-book-not-found.png
│   ├── post-book-success.png
│   ├── post-book-validation-error.png
│   └── search-and-filter.png
│
├── .gitignore
├── app.js
├── database.db
├── package.json
├── package-lock.json
└── README.md