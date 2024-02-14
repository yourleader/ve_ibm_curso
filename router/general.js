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
//obtain books using route and callback
public_users.get('/callback', function (req, res) {
  getAllBooks((err, books) => {
    if (err) {
      // If an error occurs, send a server error response
      res.status(500).json({ message: "Failed to load books", error: err });
    } else {
      // if book exist then return the list of books
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

public_users.get('/author/promise/:author', async function (req, res) {
  const { author } = req.params;

 
  async function getBooksByAuthor(author) {
    return Promise.resolve(Object.values(books).filter(book => book.author.includes(author)));
  }

  try {
    const filteredBooks = await getBooksByAuthor(author);

    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: "An error occurred", error: error.message });
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

//obtener por medio de promesas  asincronas

public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;

  async function getBooksByTitle(title) {
    return Promise.resolve(Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase())));
  }

  try {
    const filteredBooks = await getBooksByTitle(title);

    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: "An error occurred", error: error.message });
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


public_users.get('/isbn/promise/:isbn', async function (req, res) {  
  try {
    const { isbn } = req.params;  
    const bookId = parseInt(isbn, 10);  
    const book = await getBookDetailsAsync(bookId);  

    if (book) {  
      res.json(book);  
    } else {  
      res.status(404).json({ message: "Book not found" });  
    }  
  } catch (error) {  
    res.status(500).json({ message: "An error occurred", error: error.message });   
  } 
});  

function getBookDetailsAsync(bookId) {  
  return new Promise((resolve, reject) => {  
    // Assuming `books` is a predefined collection where bookId is the key
    const book = books[bookId];  
    if (book) {  
      resolve(book);  
    } else {  
      reject(new Error("Book not found"));  
    }  
  });  
}

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
