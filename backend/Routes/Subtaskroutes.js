const express = require('express');
const router = express.Router();
const multer = require('multer');
// const { validateFile } = require('../Subtask'); // Adjust the path as necessary
const Subtask = require("../Models/Subtask")
const Task = require('../Models/Task');
const rateLimit = require('express-rate-limit');
// const Subtask = require('../Models/Subtask');


router.post("/createSubtask", async (req, res) => {

    //const { taskId, subtaskId } = req.params;
    try {
        if (!req.body.subtask_title) {
            return res.status(400).send('Title is required');
        }
        
        await Subtask.create({
            cardId: req.body.cardId,
            card_title: req.body.card_title,
            subtask_title: req.body.subtask_title, 
            subtaskId: req.body.subtaskId, 
            isCompleted: req.body.isCompleted,
            isDeleted: req.body.isDeleted,
        });

        res.json({ success: true, message: "Subtask created" });
    } catch (error) {
        console.error("Error creating subtask:", error);
        res.status(500).json({ success: false, error: "An error occurred while creating the subtask" });
    }
});

router.post("/deleteSubtask", async (req, res) => {
    const subtaskId  = req.body.subtaskId;
    try {
        const result = await Subtask.updateOne(
            {
                subtaskId: subtaskId
            },
            {
                $set: {
                    isDeleted: true
                }
            }
        )
        if (result) {
            res.status(200).json({ success: true, message: "Subtask deleted successfully" });
        } else {
            res.status(400).json({ success: false, message: "Subtask deletion failed" });
        }
    } catch (error) {
        console.error("Error deleting subtask:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/markSubtask", async(req, res)=>{
    const subtaskId = req.body.subtaskId;
    const value = req.body.value;
    if(!subtaskId) return res.status(400).json({success: false, message: "subtask id is required"});
    try {
        const result = await Subtask.updateOne({
            subtaskId: subtaskId,
        },
        {
            $set:{
                isCompleted: value
            }
        }
    )
    if (result) {
        res.status(200).json({ success: true, message: "Subtask marked successfully" });
    } else {
        res.status(400).json({ success: false, message: "Subtask marking failed" });
    }
    } catch (error) {
        console.error("Error marking subtask:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


router.post('/getCollabSubtasks', async(req, res) => {
    try {
        const cardId = req.body.cardId;
        console.log(cardId);
        if(!cardId) 
        {
            return res.json({success: false, message: "card id required"})
        }

        const subtasks = await Subtask.find({cardId: cardId, 
            isDeleted: false,
        });
        console.log(subtasks)
        res.json({success:true, message: "collab subtasks fetched", subtasks: subtasks});

    } catch (error) {
        console.log(error)
        res.status(400).json({message: error, error: "an error occured"})
    }
})






// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'downloads/'); // Adjust the path as necessary
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Apply rate limiting to all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Placeholder for authentication and authorization middleware
const isAuthenticated = (req, res, next) => {
    // Implement your authentication logic here
    // For example, check if the user is logged in
    if (!req.user) {
        return res.status(401).send('Unauthorized');
    }
    next();
};

// Endpoint to upload an attachment to a subtask
router.post('/:taskId/subtasks/:subtaskId/attachments', isAuthenticated, upload.single('file'), async (req, res) => {
    const { taskId, subtaskId } = req.params;
    const file = req.file;

    try {
        await validateFile(file); // Validate the file

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).send('Task not found');

        const subtask = task.subtasks.id(subtaskId);
        if (!subtask) return res.status(404).send('Subtask not found');

        subtask.attachments.push({ filename: file.filename, mimetype: file.mimetype, path: file.path });
        await task.save();

        res.send({ message: 'Attachment uploaded successfully', attachment: file });
    } catch (error) {
        console.error('Error uploading attachment:', error.message);
        res.status(400).send(error.message); // Send back the specific error message
    }
});

// Endpoint to add a comment to a subtask
// Expected request: POST /tasks/:taskId/subtasks/:subtaskId/comments
// Request body: JSON with key 'commentText' containing the comment text
// Response: JSON object with message and updated subtask
router.post('/:taskId/subtasks/:subtaskId/comments', isAuthenticated, async (req, res) => {
 const { taskId, subtaskId } = req.params;
 const { commentText } = req.body;

 // Basic validation
 if (!commentText || commentText.trim().length === 0) {
    return res.status(400).send('Comment text is required');
 }

 try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send('Task not found');

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).send('Subtask not found');

    subtask.comments.push({ text: commentText, timestamp: new Date() });
    await task.save();

    // Return the updated subtask or task document
    res.send({ message: 'Comment added successfully', subtask });
 } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Server error');
 }
});

// Endpoint to raise a query for a subtask
// Expected request: POST /tasks/:taskId/subtasks/:subtaskId/queries
// Request body: JSON with key 'queryText' containing the query text
// Response: JSON object with message and updated query
router.post('/:taskId/subtasks/:subtaskId/queries', isAuthenticated, async (req, res) => {
 const { taskId, subtaskId } = req.params;
 const { queryText } = req.body;

 try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send('Task not found');

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).send('Subtask not found');

    // Assuming you have a queries array in your subtask schema
    subtask.queries.push({ text: queryText, timestamp: new Date() });
    await task.save();

    res.send({ message: 'Query raised successfully', query: { text: queryText, timestamp: new Date() } });
 } catch (error) {
    console.error('Error raising query:', error);
    res.status(500).send('Server error');
 }
});

// Export the router
module.exports = router;
