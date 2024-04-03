const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
 board_title: {
    type: String,
    required: true,
 },
 boardId: {
  type: Number, 
  required: true,
 },
 board_user: {
    type: String,
    required: true,
 },
 board_createdAt: {
    type: Date,
    default: Date.now,
 },
 board_updatedAt: {
    type: Date,
    default: Date.now,
 },
 baord_permissions: [{
    userId: {
      type: String,
      ref: 'User',
    },
    canView: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
 }],
 board_sharedWith: [{
    type: String,
    ref: 'User',
 }],
});

// // Pre-save hook to update the updatedAt field
// boardSchema.pre('save', function(next) {
//  this.updatedAt = Date.now();
//  next();
// });



// const boardSchema = new mongoose.Schema({
//    board_title: String,
//    boardId: Number,
//    board_user: String,
//   });


module.exports = mongoose.model('Board', boardSchema);