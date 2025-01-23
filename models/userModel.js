const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,   // Name is required
      trim: true        // Removes any leading/trailing spaces
    },
    email: {
      type: String,
      required: true,   // Email is required
      unique: true,     // Ensure the email is unique
      lowercase: true,  // Automatically convert email to lowercase
      trim: true        // Removes any leading/trailing spaces
    },
    roll: {
      type: String,
      required: true,   // Password is required
      minlength: 6, 
      trim: true, 
      unique: true   // Password should be at least 6 characters long
    },
    password: {
      type: String,
      required: true,   // Password is required
      minlength: 6,     // Password should be at least 6 characters long
    },
    role: {
      type: Number,
      default: 1  // student
    },
  }, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
  });
  

// Create and Export the User Model
const User = mongoose.model('User', userSchema);
module.exports = User;
