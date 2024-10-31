const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
