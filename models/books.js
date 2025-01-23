const mongoose = require('mongoose');

// Define the schema for the Book model
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true,     // Removes leading/trailing spaces
  },
  author: {
    type: String,
    required: true, // Author is required
    trim: true,
  },
  edition: {
    type: Number,
    required: true, // Year of publication is required
  },
  ISBN: {
    type: String,
    unique: true,   // Ensure the ISBN is unique
    required: true, // ISBN is required
    trim: true,
  },
  copiesAvailable: {
    type: Number,
    required: true, // Number of available copies is required
    min: 0,         // Minimum value is 0
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the Book model
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
