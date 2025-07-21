const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllVotes,
  getVotingResults,
  resetUserVote,
  exportVotingData,
  exportUsersCSV,
  exportVotingResultsCSV,
  exportComprehensiveReport,
  bulkImportUsers,
  regenerateUserToken
} = require('../controllers/adminController');

const {
  getAllCandidates,
  getCandidateDetails,
  updateCandidate,
  createCandidate,
  deleteCandidate
} = require('../controllers/candidateController');

const router = express.Router();

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);

// Vote management
router.get('/votes', getAllVotes);

// Voting results
router.get('/results', getVotingResults);

// Reset user vote (for testing)
router.delete('/users/:nisn/vote', resetUserVote);

// Regenerate user token
router.put('/users/:nisn/token', regenerateUserToken);

// Export data
router.get('/export', exportVotingData);
router.get('/export/users-csv', exportUsersCSV);
router.get('/export/results-csv', exportVotingResultsCSV);
router.get('/export/comprehensive', exportComprehensiveReport);

// Bulk import users
router.post('/import/users', bulkImportUsers);

// Candidate management
router.get('/candidates', getAllCandidates);
router.get('/candidates/:candidateId', getCandidateDetails);
router.put('/candidates/:candidateId', updateCandidate);
router.post('/candidates', createCandidate);
router.delete('/candidates/:candidateId', deleteCandidate);

module.exports = router;
