// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    // Add more fields as needed
});

module.exports = mongoose.model('Project', projectSchema);
