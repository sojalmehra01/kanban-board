const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//  taskTracker: String,
//  description: String,
//  dueDate: Date,
//  priorityTag: { type: String, enum: ['Low', 'Medium', 'High','Urgent'] },
//  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'] },
//  comments: [{
//    text: String,
//    timestamp: Date
//  }],
//  attachments: [{
//    filename: String,
//    mimetype: String,
//    path: String
//  }],
//  history: [{
//    action: String,
//    timestamp: Date
//  }],
//  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//  subtasks: [{
//    title: String,
//    completed: Boolean
//     }],
//  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
// });

const taskSchema = new mongoose.Schema({
  boardId: {
    type: Number, 
    required: true,
  },
  cardId: {
    type: Number,
    required: true,
  },
  card_title : {
    type: String,
    required: true,
  },
  card_user: {
    type: String,
    required:true,
  },
  card_sharedWith:[{
    type: Object,
  }]
})

module.exports = mongoose.model('Task', taskSchema);
