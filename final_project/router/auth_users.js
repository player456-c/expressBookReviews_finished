const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
//write code to check if the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    }else{
        return false;
    };
};

const authenticatedUser = (username,password)=>{
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //console.log(req.body);

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
    }else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

function userHasReview(username,isbn){
    let users_review = books[isbn]['reviews'].filter((review)=>{
        return (user.username === username)
    });
    if(users_review.length > 0){
        return true;
    }else{
        return false;
    }
};

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn=req.params.isbn;
    let review=req.query.review;
    let username=req.session.authorization['username'];



    return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
