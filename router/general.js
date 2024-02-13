const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  // Implementación de registro de usuario
  const { firstName, lastName, email, DOB, password } = req.body;
  if (!email || !password || !firstName || !lastName || !DOB) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Añadir validación de email existente si es necesario
  users.push({ firstName, lastName, email, DOB, password });
  console.log(users);
  return res.status(201).json({ message: "User registered successfully" });
});

// Obtain
public_users.get('/', function (req, res) {
  res.json(books);
});

public_users.get('/callback', function (req, res) {
  getAllBooks((err, books) => {
    if (err) {
      // If an error occurs, send a server error response
      res.status(500).json({ message: "Failed to load books", error: err });
    } else {
      // If books are successfully retrieved, send them back as JSON
      res.json(books);
    }
  });
});

// Function to get all books using a callback
function getAllBooks(callback) {
  // Directly call
  try {
    callback(null, books);
  } catch (error) {
    callback(error, null);
  }
}

// Obtener detalles del libro basado en ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  // Asumiendo que isbn es un string que representa un número, lo convertimos a número
  const bookId = parseInt(isbn, 10); // Convertir el parámetro a un número entero
  const book = books[bookId]; // Acceder directamente usando el ID como clave

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Obtener detalles del libro basado en autor
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author.includes(author));
  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Obtener todos los libros basados en título
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title.includes(title));
  if (filteredBooks.length > 0) {
    res.json(filteredBooks);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Obtener reseña del libro
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const bookId = parseInt(isbn, 10); // Convertir el parámetro a un número entero
  const book = books[bookId]; // Acceder directamente usando el ID como clave
  if (book.reviews.length > 0) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});
//obtain books by promise


public_users.get('/isbn/promise/:isbn', function (req, res) {
  const { isbn } = req.params;
  const bookId = parseInt(isbn, 10);


  getBookDetailsAsync(bookId)
    .then(book => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "An error occurred whatever", error: error.message });
    });
});

function getBookDetailsAsync(bookId) {
  return new Promise((resolve, reject) => {
    const book = books[bookId];

    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found!"));
    }
  });
}
module.exports.general = public_users;
