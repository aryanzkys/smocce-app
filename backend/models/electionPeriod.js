const mongoose = require('mongoose');

const ElectionPeriodSchema = new mongoose.Schema({
  period: { type: String, enum: ['PJ', 'KETUA'], required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.models.ElectionPeriod || mongoose.model('ElectionPeriod', ElectionPeriodSchema);
