const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    room: String,
    author: String,
    message: String,
    time: String,
});

// const ChatSchema = new mongoose.Schema({
//     Message: MessageSchema
// });

module.exports = mongoose.model('Message', MessageSchema);
