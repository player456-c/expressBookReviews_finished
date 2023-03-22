const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password){
        if(!isValid(username)){ 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        }else{
            return res.status(404).json({message: "User already exists!"});    
        };
    };
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //console.log(req);
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn=req.params.isbn;
    //console.log(req);
    return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author=req.params.author;
    let filtered_books=[];
    Object.keys(books).forEach(key => {
        if(books[key]['author']===author){
            filtered_books.push(books[key]);
        };
    });
    //console.log(filtered_books);
    return res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title=req.params.title;
    let filtered_books=[];
    Object.keys(books).forEach(key => {
        if(books[key]['title']===title){
            filtered_books.push(books[key]);
        };
    });
    //console.log(filtered_books);
    return res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn=req.params.isbn;
    //console.log(req);
    return res.send(books[isbn]['reviews']);
});

module.exports.general = public_users;
