const User = require('../models/userModel'); // Correct import for the model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure environment variables are loaded

const createUser = async (req, res) => {

    const { name, roll, email, password } = req.body;

    //finding duplicate user
    const isDuplicate = await User.findOne({
        $or:[
            {email: email},
            {roll: roll}
        ]
    })

    if(isDuplicate){
        let message = 'User with ';
        if (isDuplicate.email === email && isDuplicate.roll === roll) {
            message += 'this email and roll number';
        } else if (isDuplicate.email === email) {
            message += 'this email';
        } else if (isDuplicate.roll === roll) {
            message += 'this roll number';
        }
        message += ' already exists.';

        return res.status(400).json({ error: message });
    }

    console.log('hollo buddy');
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = new User({
            name: name,
            roll: roll,
            email: email,
            password: hashedPassword  // Save hashed password
        });

        console.log('New User Data:', newUser);

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
         // Handle errors, including duplicate key errors from the database
         if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ error: `User with this ${field} already exists.` });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

// Login route
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('here i am 1');
        
        // Validate password (assuming bcrypt is used for hashing passwords)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a token (if using JWT)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log(user._id);
        if(user.role == 0)
        res.status(200).json({ redirectUrl: `/admin/index.html?id=${user._id}` });
        else res.status(200).json({ redirectUrl: `/student/index.html?id=${user._id}` });
    } catch (error) {
        console.log('here i am 3');
        res.status(500).json({ error: error.message });
    }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetching all data
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    loginUser
};
