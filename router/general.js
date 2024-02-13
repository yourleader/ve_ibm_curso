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
  return res.status(201).json({ message: "User registered successfully" });
});

// Obtain
public_users.get('/', function (req, res) {
  res.json(books);
});

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
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
