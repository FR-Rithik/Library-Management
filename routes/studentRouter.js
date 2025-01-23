const express = require('express');
const router = express.Router();
const { 
    borrow, 
    returnBook, 
    borrowByStudent,
    getBookAndStudent
} = require('../controllers/studentController');

// Make sure the controller functions are properly imported
router.post('/borrow', borrow);  // This was undefined before
// router.post('/return/:id', returnBook);
router.get('/borrowed/:studentId', borrowByStudent);
router.get('/borrowed/:studentId/:bookId', getBookAndStudent);

module.exports = router;