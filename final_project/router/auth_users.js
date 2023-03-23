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
    let users_review = books[isbn]['reviews'][username];
    if(users_review!=undefined){
        return true;
    }else{
        return false;
    };
};

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn=req.params.isbn;
    let review=req.query.review;
    let username=req.session.authorization['username'];
    //console.log(req.query);
    //console.log(req.query.review);
    let message="";
    if(!userHasReview(username,isbn)){
        message="Your review has been added. If you want to update your review, simply write a new one.";
    }else{
        message="Your review has been updated.";
    };
    console.log(userHasReview(username,isbn));
    books[isbn]['reviews'][username]=review;

    //console.log(books[isbn]['reviews'][username]);
    return res.send(message);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn=req.params.isbn;
    let username=req.session.authorization['username'];
    if(userHasReview(username,isbn)){
        delete books[isbn]['reviews'][username];
    }else{
        return res.send("You don't have a review of that book.")
    };
    return res.send("Your review were successfully deleted.");
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
