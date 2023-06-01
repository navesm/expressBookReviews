const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password) {
      return res.status(400).send("Username and password are required");
  }
  if (users.find(user => user.username === username)) {
      return res.status(409).send('Username already exists');
  }
  const newUser = {username, password};
  users.push(newUser);
  res.status(200).send('User registered successfully!');
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
      })
        .then((bookList) => {
          return res.send(bookList);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to fetch book list" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
      resolve(isbn)
  }).then((book) =>{
     return res.send(books[isbn]);
  }).catch(error => {
      console.error(error);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let booksKeys = Object.keys(books);
  let filteredBooks = booksKeys.map(key =>
    books[key]).filter(book => book.author === author);
    new Promise((resolve, reject) => {
        resolve(filteredBooks);
      })
        .then(filteredBooks => {
          res.send(filteredBooks);
        })
        .catch(error => {
          // Handle any potential errors here
          console.error(error);
          res.status(500).send('An error occurred');
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksKeys = Object.keys(books);
  let filteredBooksByTitle = booksKeys.map(key =>
    books[key]).filter(book => book.title === title);
  new Promise((resolve, reject) => {
      resolve(filteredBooksByTitle);
  }).then(filteredBooksByTitle => {
      res.send(filteredBooksByTitle);
  }).catch(error => {
      console.error(error);
      return res.status(500).json({message:"Could not retrieve that title. Please try again."});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookKeys = Object.keys(books);
  const book = bookKeys.map(key =>
    books[key]).filter(book => book.isbn === isbn);
  if (!book) {
      return res.status(404).send('Book not found');
  }
  const reviews = book.reviews;
  if(!reviews || reviews.length === 0) {
      return res.send("No reviews for this book yet.")
  }
 res.send(reviews);
  return res.status(200).json({message: "Here are the reviews for that ISBN"});
});

module.exports.general = public_users;
