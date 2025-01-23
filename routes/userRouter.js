const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    loginUser
} = require('../controllers/userController');

// Route to handle user creation (POST request)
router.post('/register', createUser);
//login
router.post('/login', loginUser)
//calling the get function
router.get('/allUser', getAllUsers);

module.exports = router;
