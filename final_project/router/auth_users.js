const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    } //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }//returns boolean
//write code to check if username and password match the one we have in records.
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
    }, 'access', { expiresIn: 60 * 60  });

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    }
    else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;

  const book = books[isbn];

  if (book) {
    if (book.reviews[username]) {
      book.reviews[username] = review;
      return res.json({ message: `Review successfully updated.` })
    }

    book.reviews[username] = review;
    return res.json({ message: `Review successfully posted.` })
  }
  return res.status(403).json({ message: `Book with isbn '${isbn}' could not be found.` });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session.authorization;
  
    const book = books[isbn];
  
    if (book) {
      if (book.reviews[username])
        delete book.reviews[username];
  
      return res.json({ message: `Review successfully deleted.` })
    }
    return res.status(403).json({ message: `Book with ISBN '${isbn}' could not be found.` })
  });
  
  // delete a book review 

  
    
    //Write your code here
return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
