
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();

app.use(express.json());

// Database file path
const databasePath = path.join(__dirname, "database.db");

let db = null;

// Homepage route
app.get("/", (request, response) => {
    response.send("Welcome to Lab 2 - SQLite CRUD API");
});

// 1. GET all books
app.get("/books/", async (request, response) => {
    const getBooksQuery = `
        SELECT *
        FROM book
        ORDER BY id;
    `;

    const booksArray = await db.all(getBooksQuery);
    response.send(booksArray);
});

// 2. GET a book by ID
app.get("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const getBookQuery = `
        SELECT *
        FROM book
        WHERE id = ?;
    `;

    const book = await db.get(getBookQuery, [bookId]);

    if (book === undefined) {
        response.status(404).send("Book Not Found");
    } else {
        response.send(book);
    }
});

// 3. POST a new book
app.post("/books/", async (request, response) => {
    const { title, author, price, pages } = request.body;

    const addBookQuery = `
        INSERT INTO book (title, author, price, pages)
        VALUES (?, ?, ?, ?);
    `;

    const result = await db.run(addBookQuery, [
        title,
        author,
        price,
        pages
    ]);

    response.status(201).send({
        message: "Book Added Successfully",
        bookId: result.lastID
    });
});

// 4. PUT - Update a book by ID
app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const { title, author, price, pages } = request.body;

    const updateBookQuery = `
        UPDATE book
        SET
            title = ?,
            author = ?,
            price = ?,
            pages = ?
        WHERE id = ?;
    `;

    const result = await db.run(updateBookQuery, [
        title,
        author,
        price,
        pages,
        bookId
    ]);

    if (result.changes === 0) {
        response.status(404).send("Book Not Found");
    } else {
        response.status(200).send("Book Details Updated Successfully");
    }
});

// 5. DELETE a book by ID
app.delete("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;

    const deleteBookQuery = `
        DELETE FROM book
        WHERE id = ?;
    `;

    const result = await db.run(deleteBookQuery, [bookId]);

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

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();
