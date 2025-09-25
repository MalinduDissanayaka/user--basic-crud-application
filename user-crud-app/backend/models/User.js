const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);