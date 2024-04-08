const express = require('express');
const Board = require('../Models/Board');

const router = express.Router();


router.post("/getBoards", async (req, res) => {
   try {
      const user_name = req.body.user_name;
      console.log(user_name);
      const allBoards = await Board.find({
            board_user : user_name,
            board_isDeleted : false,
         })
         res.json({success:true, message: "board successfully fetched", boards : allBoards})
      } catch (error) {
           res.status(400).json({ message : error,error: 'An error occurred' });
         
      }
})

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
            console.log(error);
           res.status(500).json({ error: 'An error occurred' });
         }
      }
   }   
)

router.post("/deleteBoard", 
   async(req, res)=>{
      console.log(req.body.boardId);
      try{
         const result = await Board.updateOne(
            {
               boardId: req.body.boardId,
            },
            {
               $set: {
                  board_isDeleted: true,
               },
             }
         )
         console.log(result);
         res.json({success:true, message: "board successfully deleted"})
      }
      catch (error){
         console.log(error, "cannot delete board");
      }
   }
)
module.exports = router;