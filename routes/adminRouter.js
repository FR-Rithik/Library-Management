const express = require('express');
const router = express.Router();
const { 
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    returnBook,
    returnBookSearch
    //checkISBN

} = require('../controllers/adminController');

// POST route to add a new book
router.post('/books', addBook);
router.get('/books', getAllBooks);
router.put('/books/:id',updateBook);
router.delete('/books/:id', deleteBook);
router.post('/returnBookSearch', returnBookSearch);
router.post('/returnBook/:id', returnBook);
//router.get('/check-isbn/:isbn', checkISBN);

module.exports = router;
