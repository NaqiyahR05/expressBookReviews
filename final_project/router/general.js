const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate async fetching of books
        const getAllBooks = () => new Promise((resolve, reject) => {
            if (books) resolve(books);
            else reject("No books found");
        });

        const allBooks = await getAllBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports.general = public_users;

// Task 11: Get book details by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const getBookByISBN = () => new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        const book = await getBookByISBN();
        res.send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

  
// Task 12: Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].author.toLowerCase() === author) {
                    result.push({ isbn, ...books[isbn] });
                }
            }
            result.length ? resolve(result) : reject("No books found by this author");
        });

        const booksByAuthor = await getBooksByAuthor();
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});



// Task 13: Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    try {
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === title) {
                    result.push({ isbn, ...books[isbn] });
                }
            }
            result.length ? resolve(result) : reject("No books found with this title");
        });

        const booksByTitle = await getBooksByTitle();
        res.send(JSON.stringgit add .

            ify(booksByTitle, null, 4));
    } catch (error) {
        res.status(404).json({ message: error });
    }
});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(JSON.stringify(book.reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;