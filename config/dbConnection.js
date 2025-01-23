const mongoose = require("mongoose");

// Define the async function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log("Error in dbConnection");
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
