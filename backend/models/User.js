const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nisn: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  bidang: { type: String, required: true },
  hasVoted: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
