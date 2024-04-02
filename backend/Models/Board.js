const mongoose = require('mongoose');

// const boardSchema = new mongoose.Schema({
//  board_title: {
//     type: String,
//     required: true,
//  },
//  description: String,
//  board_tasks: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Task',
//  }],
//  board_createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//  },
//  board_createdAt: {
//     type: Date,
//     default: Date.now,
//  },
//  board_updatedAt: {
//     type: Date,
//     default: Date.now,
//  },
//  baord_permissions: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     canView: {
//       type: Boolean,
//       default: false,
//     },
//     canEdit: {
//       type: Boolean,
//       default: false,
//     },
//  }],
//  board_sharedWith: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//  }],
// });

// // Pre-save hook to update the updatedAt field
// boardSchema.pre('save', function(next) {
//  this.updatedAt = Date.now();
//  next();
// });



const boardSchema = new mongoose.Schema({
   board_title: String,
   board_id: Number,
   board_user: String,
  });


module.exports = mongoose.model('Board', boardSchema);