const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['ketua', 'pj'], required: true },
  bidang: { type: String }, // Only for PJ candidates
  photo: { type: String, default: '/default-avatar.jpg' },
  vision: { type: String, required: true },
  mission: { type: String },
  experience: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
