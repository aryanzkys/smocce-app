const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  nisn: {
    type: String,
    required: true,
    unique: true
  },
  bidang: {
    type: String,
    required: true
  },
  ketuaId: {
    type: String,
    required: false // Tidak wajib karena pemilihan bertahap
  },
  pjId: {
    type: String,
    required: false // Tidak wajib karena pemilihan bertahap
  },
  // Tracking pemilihan bertahap
  pjVotedAt: {
    type: Date,
    default: null
  },
  ketuaVotedAt: {
    type: Date,
    default: null
  },
  // Untuk kompatibilitas dengan sistem lama
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // Status pemilihan
  pjCompleted: {
    type: Boolean,
    default: false
  },
  ketuaCompleted: {
    type: Boolean,
    default: false
  }
});

// Index untuk query yang efisien
voteSchema.index({ nisn: 1 });
voteSchema.index({ pjCompleted: 1 });
voteSchema.index({ ketuaCompleted: 1 });

module.exports = mongoose.model('Vote', voteSchema);
