const express = require('express');
const {
  adminLogin,
  getDashboardStats,
  getElectionPeriods,
  upsertElectionPeriod,
  getAllUsers,
  getAllVotes,
  getVotingResults,
  resetUserVote,
  exportVotingData,
  exportUsersCSV,
  exportVotingResultsCSV,
  exportComprehensiveReport,
  bulkImportUsers,
  regenerateUserToken,
  updateUser,
  deleteUser,
  deleteVoteForUser
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

const {
  getAllCandidates,
  getCandidateDetails,
  updateCandidate,
  createCandidate,
  deleteCandidate
} = require('../controllers/candidateController');

const router = express.Router();

// Public: Admin login
router.post('/login', adminLogin);

// Protected routes below
router.get('/stats', verifyAdmin, getDashboardStats);
// Election schedule
router.get('/election-periods', verifyAdmin, getElectionPeriods);
router.put('/election-periods', verifyAdmin, upsertElectionPeriod);

// User management
router.get('/users', verifyAdmin, getAllUsers);
router.put('/users/:nisn', verifyAdmin, updateUser);
router.delete('/users/:nisn', verifyAdmin, deleteUser);

// Vote management
router.get('/votes', verifyAdmin, getAllVotes);

// Voting results
router.get('/results', verifyAdmin, getVotingResults);

// Reset user vote (for testing)
router.delete('/users/:nisn/vote', verifyAdmin, resetUserVote);
// Delete vote by period or all: /users/:nisn/vote?period=PJ|KETUA|ALL
router.delete('/users/:nisn/vote/by-period', verifyAdmin, deleteVoteForUser);

// Regenerate user token
router.put('/users/:nisn/token', verifyAdmin, regenerateUserToken);

// Export data
router.get('/export', verifyAdmin, exportVotingData);
router.get('/export/users-csv', verifyAdmin, exportUsersCSV);
router.get('/export/results-csv', verifyAdmin, exportVotingResultsCSV);
router.get('/export/comprehensive', verifyAdmin, exportComprehensiveReport);

// Bulk import users
router.post('/import/users', verifyAdmin, bulkImportUsers);

// Candidate management
router.get('/candidates', verifyAdmin, getAllCandidates);
router.get('/candidates/:candidateId', verifyAdmin, getCandidateDetails);
router.put('/candidates/:candidateId', verifyAdmin, updateCandidate);
router.post('/candidates', verifyAdmin, createCandidate);
router.delete('/candidates/:candidateId', verifyAdmin, deleteCandidate);

module.exports = router;
