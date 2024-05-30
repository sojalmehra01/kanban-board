const express = require('express');
const router = express.Router();
const Message = require('../Models/Chat');

router.post('/messages', async (req, res) => {
    const { message, sender, receiver } = req.body;
    
    // Validate the request body
    if (!message || !sender || !receiver) {
        return res.status(400).json({ message: "Please provide message, sender, and receiver." });
    }
    try {
        const newMessage = new Message({
            Message: {
                message,
                sender,
                receiver,
                timestamp: new Date(),
            }
        });
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


router.post("/createMessage", 
    async(req,res)=>{
        try{
            await Message.create({
                room: req.body.room, 
                author: req.body.author, 
                message: req.body.message, 
                time: req.body.time,
            })
            res.json({success:true, message: "message successfully sent"})
        }
        catch(error){
            res.status(500).json({success: false, error: "an error occured"});
        }
    }
)

module.exports = router;
