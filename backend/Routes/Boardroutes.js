const express = require('express');
const Board = require('../Models/Board');

// Get all boards
// router.get('/boards', async (req, res) => {
//    try {
//       const boards = await Board.find().populate('tasks');
//       res.send(boards);
//    } catch (error) {
//       console.error('Error fetching boards:', error);
//       res.status(500).send({ error: 'Server error', details: error.message });
//    }
// });



const router = express.Router();


router.post("/createBoard", 
   async (req, res) =>{
      try {
         await Board.create({
            board_title: req.body.title, 
            boardId : req.body.board_id, 
            board_user: req.body.board_user
         })
         res.json({success:true, message: "board successfully created"})
      } catch (error) {
         if (error.code === 11000) { // MongoDB duplicate key error code
           res.status(400).json({ error: 'Duplicate title' });
         } else {
           res.status(500).json({ error: 'An error occurred' });
         }
      }
   }   
)

router.port("/deleteBoard", 
   async(req, res)=>{
      try{
         await Board.fetch({

         })
      }
      catch {}
   }
)
module.exports = router;