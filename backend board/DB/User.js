const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
 username: { type: String, unique: true },
 password: String
});

// userSchema.pre('save', async function(next) {
//  if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//  }
//  next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;



// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required:true
//     }
// })

// const User = mongoose.model('User', UserSchema);