const Book = require('../models/books');
const borrowedBooks = require('../models/borrowedBooks');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure environment variables are loaded

const addBook = async (req, res) => {
    try {
      // Extract book data from the request body
      const { title, author, edition, ISBN, copiesAvailable } = req.body;
  
      // Check if a book with the same ISBN already exists
      const existingBook = await Book.findOne({ ISBN });
      if (existingBook) {
        return res.status(400).json({ 
            message: 'A book with this ISBN already exists' 
        });
      }
      else {
        // If the book doesn't exist, create a new book
        const newBook = new Book({
          title,
          author,
          edition,
          ISBN,
          copiesAvailable,
        });
  
        const savedBook = await newBook.save();
  
        return res.status(201).json({
          message: 'Book added successfully',
          book: savedBook,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: 'Failed to process the book',
        error: error.message,
      });
    }
  };

// fetch all the books
const getAllBooks = async (req, res) => {
  try {
      const books = await Book.find(); // Fetching all data
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

//update books

const updateBook = async(req, res) =>{
  try {
    const bookId = req.params.id;
    const updateData = req.body;

    // Validate input
    if (!updateData.title || !updateData.author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }

    // Find and update book
    const updatedBook = await Book.findByIdAndUpdate(
        bookId, 
        updateData, 
        { 
            new: true,       // Return updated document
            runValidators: true // Run model validation
        }
    );

    // Check if book exists
    if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Successful update
    res.json(updatedBook);
} catch (error) {
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Validation Error',
            errors: Object.values(error.errors).map(err => err.message)
        });
    }

    // Generic server error
    res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
    });
}

}

//delete Book
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(bookId);

    // Check if book was found and deleted
    if (!deletedBook) {
        return res.status(404).json({ 
            message: 'Book not found' 
        });
    }

    // Successful deletion
    res.json({ 
        message: 'Book deleted successfully',
        deletedBook: deletedBook 
    });
} catch (error) {
    // Handle potential errors
    console.error('Delete error:', error);
    res.status(500).json({ 
        message: 'Error deleting book', 
        error: error.message 
    });
}

//checking unique ISBN
// const checkISBN = async (req, res) => {
//   try {
//     const isbn = req.params.isbn;
//     const existingBook = await Book.findOne({ ISBN: isbn });
    
//     res.json({
//         exists: !!existingBook,
//         book: existingBook
//     });
//   } catch (error) {
//     res.status(500).json({ 
//         message: 'Error checking ISBN',
//         error: error.message 
//     });
//   }
//   }
}

const returnBookSearch = async (req, res) => {
  try {
    // Validate input
    const { studentRoll, bookIsbn } = req.body;
    if (!studentRoll || !bookIsbn) {
      return res.status(400).json({ message: "Student roll and book ISBN are required" });
    }

    console.log(studentRoll, bookIsbn);

    // Fetch student by roll number
    const student = await User.findOne({ roll: studentRoll });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch book by ISBN
    const book = await Book.findOne({ ISBN: bookIsbn });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    console.log(student, book);
    // Check if book is currently borrowed by this student
    const ifStudentAndBook = await borrowedBooks.findOne({
      bookId: book._id,
      studentId: student._id,
      returnDate: null,
    });

    if (!ifStudentAndBook) {
      return res.status(404).json({ message: "No active borrowed record for this student and book" });
    }

    // Create response object
    const returnItem = {
      name: student.name,
      roll: student.roll,
      title: book.title,
      isbn: book.ISBN,
      id: ifStudentAndBook._id
    };

    // Log the results (for debugging)
    // console.log("Borrowed Record:", ifStudentAndBook);
    // console.log("Response Item:", returnItem);

    // Send successful response
    res.status(200).json(returnItem);
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in returnBookSearch:", error);
    res.status(500).json({ 
      message: "An error occurred while processing the request", 
      error: error.message 
    });
  }
};


// Student returning book
const returnBook = async (req, res) => {
  try {
      const borrowedBook = await borrowedBooks.findById(req.params.id);
      console.log('here is borrowed Book: ', borrowedBook);
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

  
  module.exports = { 
    addBook,
    getAllBooks,
    updateBook,
    deleteBook,
    returnBookSearch,
    returnBook
    //checkISBN
   };
