const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "database.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
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

// GET /books/ with search, filter, sorting, and pagination
app.get("/books/", async (request, response) => {
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    limit = 10,
    offset = 0,
    min_price,
    max_price,
  } = request.query;

  let getBooksQuery = `
    SELECT *
    FROM book
    WHERE title LIKE '%${search_q}%'
  `;

  if (min_price !== undefined && max_price !== undefined) {
    getBooksQuery += ` AND price BETWEEN ${min_price} AND ${max_price}`;
  } else if (min_price !== undefined) {
    getBooksQuery += ` AND price >= ${min_price}`;
  } else if (max_price !== undefined) {
    getBooksQuery += ` AND price <= ${max_price}`;
  }

  getBooksQuery += `
    ORDER BY ${order_by} ${order}
    LIMIT ${limit} OFFSET ${offset};
  `;

  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

// GET /books/:bookId/
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `SELECT * FROM book WHERE id = ${bookId};`;
  const book = await db.get(getBookQuery);

  if (book === undefined) {
    response.status(404).send({ message: "Book Not Found" });
  } else {
    response.send(book);
  }
});

// POST /books/ with input validation
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (!title || !author || price === undefined || isNaN(Number(price))) {
    return response.status(400).send({
      message: "Invalid input: title, author, and numeric price are required",
    });
  }

  const addBookQuery = `
    INSERT INTO book (title, author, price, pages)
    VALUES ('${title}', '${author}', ${price}, ${pages || 0});
  `;

  const dbResponse = await db.run(addBookQuery);
  response.status(201).send({
    message: "Book Added Successfully",
    bookId: dbResponse.lastID,
  });
});

// PUT /books/:bookId/
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const checkBookQuery = `SELECT * FROM book WHERE id = ${bookId};`;
  const existingBook = await db.get(checkBookQuery);

  if (existingBook === undefined) {
    return response.status(404).send({ message: "Book Not Found" });
  }

  const { title, author, price, pages } = request.body;
  const updateBookQuery = `
    UPDATE book
    SET
      title = '${title !== undefined ? title : existingBook.title}',
      author = '${author !== undefined ? author : existingBook.author}',
      price = ${price !== undefined ? price : existingBook.price},
      pages = ${pages !== undefined ? pages : existingBook.pages}
    WHERE id = ${bookId};
  `;

  await db.run(updateBookQuery);
  response.status(200).send({ message: "Book Updated Successfully" });
});

// DELETE /books/:bookId/
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const checkBookQuery = `SELECT * FROM book WHERE id = ${bookId};`;
  const existingBook = await db.get(checkBookQuery);

  if (existingBook === undefined) {
    return response.status(404).send({ message: "Book Not Found" });
  }

  const deleteBookQuery = `DELETE FROM book WHERE id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.status(200).send({ message: "Book Deleted Successfully" });
});

module.exports = app;