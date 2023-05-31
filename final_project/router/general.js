const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Here is the list of available books!"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(200).json({message: "Here are the books by ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let booksKeys = Object.keys(books);
  let filteredBooks = booksKeys.map(key =>
    books[key]).filter(book => book.author === author);
  res.send(filteredBooks);
  return res.status(200).json({message: "Here are the books by that author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksKeys = Object.keys(books);
  let filteredBooksByTitle = booksKeys.map(key =>
    books[key]).filter(book => book.title === title);
  res.send(filteredBooksByTitle);
  return res.status(200).json({message:"Here is the title you requested"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let reviews = req.params.reviews;
  let booksKeys = Object.keys(books);
  let filteredBooksByIsbn = booksKeys.map(key =>
    books[key]).filter(book => book.isbn === isbn);
  res.send(filteredBooksByIsbn[reviews])
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
