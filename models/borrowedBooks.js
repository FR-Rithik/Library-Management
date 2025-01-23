const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    return: {  // Due date
        type: Date,
        required: true
    },
    returnDate: {  // Actual return date
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);