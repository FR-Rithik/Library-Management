const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const studentRouter = require('./routes/studentRouter');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = 3002;

// Connect the database
connectDB();

// Use middleware to parse JSON
app.use(express.json()); // MUST COME BEFORE THE ROUTES

console.log("the first appearance");


//app.use(bodyParser.json());

// Saving to DB (routes)
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('/api', studentRouter);
// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Root route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public','auth', 'index.html'));
// });
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
