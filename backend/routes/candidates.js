const express = require('express');
const {
  getAllCandidates,
  getCandidatesByType,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateDetails
} = require('../controllers/candidateController');

const router = express.Router();

// Public routes
router.get('/', getAllCandidates);
router.get('/search', getCandidatesByType);
router.get('/:candidateId', getCandidateDetails);

// Admin routes (in production, add authentication middleware)
router.post('/', createCandidate);
router.put('/:candidateId', updateCandidate);
router.delete('/:candidateId', deleteCandidate);

module.exports = router;
