const express = require('express');
const router = express.Router();
const Board = require('../Models/Board');

// Get all boards
router.get('/boards', async (req, res) => {
 try {
    const boards = await Board.find().populate('tasks');
    res.send(boards);
 } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).send({ error: 'Server error', details: error.message });
 }
});

// Create a new board
router.post('/boards', async (req, res) => {
 const { name } = req.body;
 // Consider adding validation here
 try {
    const board = new Board({ name });
    await board.save();
    res.status(201).send(board);
 } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).send({ error: 'Server error', details: error.message });
 }
});

module.exports = router;