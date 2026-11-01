
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());


const databasePath = path.join(__dirname, "database.db");

let db = null;

// Get all books
app.get("/books/", async (request, response) => {
    const books = await db.all("SELECT * FROM book ORDER BY id");
    response.status(200).send(books);
});

// Get a book by ID
app.get("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const book = await db.get(
        "SELECT * FROM book WHERE id = ?",
        [bookId]
    );

    if (book === undefined) {
        response.status(404).send("Book Not Found");
    } else {
        response.status(200).send(book);
    }
});

// Add a new book
app.post("/books/", async (request, response) => {
    const { title, author, price, pages } = request.body;

    const result = await db.run(
        `INSERT INTO book (title, author, price, pages)
         VALUES (?, ?, ?, ?)`,
        [title, author, price, pages]
    );

    response.status(201).send({
        message: "Book Added Successfully",
        bookId: result.lastID
    });
});

// Update a book
app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    const result = await db.run(
        `UPDATE book
         SET title = ?, author = ?, price = ?, pages = ?
         WHERE id = ?`,
        [title, author, price, pages, bookId]
    );

    if (result.changes === 0) {
        response.status(404).send("Book Not Found");
    } else {
        response.status(200).send("Book Details Updated Successfully");
    }
});

// Delete a book
app.delete("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const result = await db.run(
        "DELETE FROM book WHERE id = ?",
        [bookId]
    );

    if (result.changes === 0) {
        response.status(404).send("Book Not Found");
    } else {
        response.status(200).send("Book Deleted Successfully");
    }
});

// Initialize database and start server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        });

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();
