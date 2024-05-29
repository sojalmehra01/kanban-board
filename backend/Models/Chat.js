const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message: String,
    sender: String,
    receiver: String,
    timestamp: { type: Date, default: Date.now }
});

// const ChatSchema = new mongoose.Schema({
//     Message: MessageSchema
// });

module.exports = mongoose.model('Message', MessageSchema);
