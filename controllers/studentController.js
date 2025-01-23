const mongoose = require('mongoose');
const BorrowedBook = require('../models/borrowedBooks');
const Book = require('../models/books');
const Student = require('../models/userModel')

//getting book and student by id
const getBookAndStudent = async(req, res) =>{
    try{
        const {studentId, bookId} = req.params;

        console.log({studentId, bookId});
        //fetching the book and the student
        const book = await Book.findById(bookId);
        console.log({book});
        if(!book){
            return res.status(404).json({message:'Book not found'});
        }
        //
        const student = await Student.findById(studentId);
        console.log({student});
        if(!student){
            return res.status(404).json({message:'Student not found'});
        }

                res.status(200).json({
                    book: {
                        id: book._id,
                        title: book.title,
                        author: book.author,
                        availableCopies: book.copiesAvailable,
                        edition: book.edition
                    },
                    student: {
                        id: student._id,
                        name: student.name,
                        email: student.email,
                        role: student.role
                    }
                }
      )
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

// Borrow a book
const borrow = async (req, res) => {
    try {
        const { bookId, studentId } = req.body;
        console.log('Request Body:', req.body);

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(bookId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        
        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.copiesAvailable <= 0) {
            return res.status(400).json({ message: 'No copies available for this book' });
        }

        // Check if student already has this book
        const existingBorrow = await BorrowedBook.findOne({
            bookId,
            studentId,
            returnDate: null
        });

        if (existingBorrow) {
            return res.status(400).json({ message: 'You have already borrowed this book' });
        }

        // Create new borrow record
        const newBorrowedBook = new BorrowedBook({
            bookId,
            studentId,
            borrowDate: new Date(),
            return: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due date in 14 days
        });

        // Decrease available copies
        book.copiesAvailable -= 1;
        
        await Promise.all([
            newBorrowedBook.save(),
            book.save()
        ]);

        res.status(201).json({
            message: 'Book borrowed successfully',
            borrowedBook: newBorrowedBook
        });
    } catch (error) {
        console.error('Borrow error:', error);
        res.status(500).json({ 
            message: 'You have already borrowed this book', 
            error: error.message 
        });
    }
};

// Student returning book
const returnBook = async (req, res) => {
    try {
        const borrowedBook = await BorrowedBook.findById(req.params.id);
        
        if (!borrowedBook) {
            return res.status(404).json({ message: 'Borrowed book record not found' });
        }

        // Find the book to increase available copies
        const book = await Book.findById(borrowedBook.bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the borrowed book record
        borrowedBook.returnDate = new Date();
        
        // Increase available copies
        book.copiesAvailable += 1;

        // Save both updates
        await Promise.all([
            borrowedBook.save(),
            book.save()
        ]);

        res.json({
            message: 'Book returned successfully',
            borrowedBook
        });
    } catch (error) {
        console.error('Return error:', error);
        res.status(500).json({ message: 'Failed to return book', error: error.message });
    }
};

// Getting borrowed books for student
const borrowByStudent = async (req, res) => {
    try {
        const borrowedBooks = await BorrowedBook.find({ 
            studentId: req.params.studentId,
            returnDate: null // Only get currently borrowed books
        }).populate('bookId'); // This will populate book details

        res.json(borrowedBooks);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch borrowed books', error: error.message });
    }
};

module.exports = {
    borrow,
    returnBook,
    borrowByStudent,
    getBookAndStudent
};