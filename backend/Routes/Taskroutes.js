const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
// const subtask = reqiure('./Subtaskroutes')

// // Placeholder for authentication and authorization middleware
// const isAuthenticated = (req, res, next) => {
//  // Implement your authentication logic here
//  // For example, check if the user is logged in
//  if (!req.user) {
//     return res.status(401).send('Unauthorized');
//  }
//  next();
// };

// Get tasks by board ID
// router.get('/boards/:id/tasks', async (req, res) => {
//  const { id } = req.params;
//  try {
//     const tasks = await Task.find({ boardId: id });
//     res.send(tasks);
//  } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).send('Server error');
//  }
// });

// Create a new task
router.post('/addCard', async (req, res) => {
try {
   if (!req.body.card_title) {
      return res.status(400).send('Title is required');
   }
   await Task.create({
      boardId: req.body.boardId,
      cardId: req.body.cardId,
      card_title: req.body.card_title,
      card_user : req.body.card_user,
      card_sharedWith: []
   })
   res.json({success:true, message :"card created successfully "})
 } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Server error');
 }
});

router.post('/getCollaborationCards', async(req, res) => {
   try{
      const query = { card_sharedWith: { $elemMatch: {email:req.body.user} } };
        
      const cards = await Task.find(query);
      if(cards.length > 0)
         {
            res.json({success:true, cards})
         }
      else{
         res.status(404).json({ success: false, message: 'Collaborator not found' });
      }
   }
   catch(error)
   {
      console.error('Error fetching documents:', error);
      res.status(500).json({succes: false, message: "internal server error"});
   }
})


router.post('/addCollaborator', async(req, res) => {
   try {
      if(!req.body.collaborator_email)
         {
            return res.status(400).send("Collaborator's Email is required")
         }

      const result = await Task.updateOne(
         {
            cardId: req.body.cardId,
         },
         {
            $push:{
               card_sharedWith: {email: req.body.collaborator_email},
            }
         }
      )
      if(result){
         res.status(200).json({success:true, message: "collaborator added successfully"});
      }
      else{
         res.status(400).json({success:false, message: "cannot add collaborator"});
      }
      

   } catch (error) {
      console.error("error adding collaborator", error);
      res.status(500).json({succes: false, message: "internal server error"});
   }
})

// // Subtask-related routes

// // Add a subtask to a task
// router.post('/boards/:boardId/tasks/:taskId/subtasks', isAuthenticated, async (req, res) => {
//  const { boardId, taskId } = req.params;
//  const { title } = req.body;

//  try {
//     const task = await Task.findOne({ _id: taskId, boardId });
//     if (!task) {
//         return res.status(404).send('Task not found');
//     }
//     task.subtasks.push({ title });
//     await task.save();
//     res.send(task);
//  } catch (error) {
//     console.error('Error adding subtask:', error);
//     res.status(500).send('Server error');
//  }
// });

// // Get all subtasks of a task
// router.get('/boards/:boardId/tasks/:taskId/subtasks', async (req, res) => {
//  const { boardId, taskId } = req.params;
//  try {
//     const task = await Task.findOne({ _id: taskId, boardId }).populate('subtasks');
//     if (!task) {
//         return res.status(404).send('Task not found');
//     }
//     res.send(task.subtasks);
//  } catch (error) {
//     console.error('Error fetching subtasks:', error);
//     res.status(500).send('Server error');
//  }
// });





module.exports = router;