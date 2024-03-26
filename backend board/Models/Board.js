const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
 },
 description: String,
 tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
 }],
 createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
 },
 createdAt: {
    type: Date,
    default: Date.now,
 },
 updatedAt: {
    type: Date,
    default: Date.now,
 },
 permissions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
 sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
 }],
});

// Pre-save hook to update the updatedAt field
boardSchema.pre('save', function(next) {
 this.updatedAt = Date.now();
 next();
});

module.exports = mongoose.model('Board', boardSchema);
