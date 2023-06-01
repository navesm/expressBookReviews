const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    // Find the book in the books database
    const book = books[isbn];
  
    // If the book exists
    if (book) {
      // Find the existing review for the same user
      const existingReview = book.reviews[username];
  
      // If the user has already reviewed this book, update the existing review
      if (existingReview) {
        book.reviews[username] = review;
      } else {
        // If the user has not reviewed this book, add a new review
        book.reviews[username] = review;
      }
  
      return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
  
    // Find the book in the books database
    const book = books[isbn];
  
    // If the book exists
    if (book) {
      // Check if the user has a review for this book
      if (book.reviews.hasOwnProperty(username)) {
        // Delete the user's review
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ message: "Review not found for the given user" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
