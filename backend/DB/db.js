require('dotenv').config();
const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URL;

const connectDB = async () => {
    await mongoose.connect(mongoUrl)
    .then(() => console.log('Connected'))
    .catch(err => console.error('Could not connect to MongoDB', err));
};

module.exports = connectDB;