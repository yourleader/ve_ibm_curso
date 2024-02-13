const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Necesario para parsear el cuerpo de las peticiones POST
let books = require("./booksdb.js");
const regd_users = express.Router();

// Añadir bodyParser para parsear el cuerpo de las peticiones
regd_users.use(bodyParser.json());

let users = [
  {
      firstName: "John",
      lastName: "wick",
      email: "johnwick@gamil.com",
      DOB: "22-01-1990",
      password: "john123" // Asumiendo que añadimos contraseñas
  },
  {
      firstName: "John",
      lastName: "smith",
      email: "johnsmith@gamil.com",
      DOB: "21-07-1983",
      password: "smith123"
  },
  {
      firstName: "Joyal",
      lastName: "white",
      email: "joyalwhite@gamil.com",
      DOB: "21-03-1989",
      password: "white123"
  },
];

const isValid = (email) => {
  // Implementación simple para validar el email
  return /\S+@\S+\.\S+/.test(email);
}

const authenticatedUser = (email, password) => {
  // Verificar si el usuario existe y la contraseña coincide
  const user = users.find(user => user.email === email && user.password === password);
  return user !== undefined;
}

// Ruta de login actualizada para usar email y password
regd_users.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({message: "Email or password missing"});
  }
  if (!isValid(email) || !authenticatedUser(email, password)) {
      return res.status(401).json({message: "Invalid credentials"});
  }
  let accessToken = jwt.sign({
      data: email
    }, 'secretKey', { expiresIn: '1h' }); // Usar una clave secreta más segura
  return res.status(200).json({ accessToken });
});

// Añadir una reseña de libro
regd_users.use(bodyParser.json());

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;

  if (!review) {
    return res.status(400).json({message: "Review content is missing"});
  }

  // Buscar el libro por ISBN
  const book = books[isbn];
  if (book) {
    // Añadir la reseña al libro
    book.reviews.push(review); // Asumiendo que `reviews` es un arreglo
    return res.status(200).json({message: "Review added successfully", isbn, review});
  } else {
    // Si no se encuentra el libro con el ISBN proporcionado
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports = { authenticated: regd_users, isValid, users };
