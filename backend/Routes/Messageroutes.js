const express = require('express');
const router = express.Router();
const Message = require('../Models/Chat');

router.post('/messages', async (req, res) => {
    const { message, sender, receiver } = req.body;

    // Validate the request body
    if (!message || !sender || !receiver) {
        return res.status(400).json({ message: "Please provide message, sender, and receiver." });
    }
    const newMessage = new Message({
        Message: {
            message,
            sender,
            receiver,
            timestamp: new Date(),
        }
    });

    try {
        await newMessage.save();
        res.status(201).send(newMessage);
    } catch (err) {
        res.status(500).json({ message: "Error creating the message" });
    }
});

router.get('/messages', async (req, res) => {
    try {
        const allMessages = await Message.find({});
        res.send(allMessages);
    } catch (err) {
        res.status(500).json({ message: "Error getting the messages" });
    }
});

module.exports = router;
