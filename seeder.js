const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // Adjust the path to your User model
require('dotenv').config();

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in .env');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const seedAdminUser = async () => {
  try {
    const password = "password"; 
    const hashedPassword = await bcrypt.hash(password, 10);
    //const hashedPassword = "password"; 
    await bcrypt.hash('password', 10);
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 0, // Admin role
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
};

seedAdminUser();
