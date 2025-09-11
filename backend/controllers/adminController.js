const User = require('../models/User');
const Vote = require('../models/vote');
const jwt = require('jsonwebtoken');
const ElectionPeriod = require('../models/electionPeriod');

// Allowed bidang list (single source of truth)
const VALID_BIDANG = [
  'Matematika', 'Fisika', 'Biologi', 'Kimia', 'Informatika',
  'Astronomi', 'Ekonomi', 'Kebumian', 'Geografi'
];

// Admin login (username/password from ENV)
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'smocce2025';
    if (username !== adminUser || password !== adminPass) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    const secret = process.env.ADMIN_JWT_SECRET || 'supersecret_admin';
    const token = jwt.sign(
      { role: 'admin', username },
      secret,
      { expiresIn: '12h' }
    );
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const votedUsers = await User.countDocuments({ hasVoted: true });
    const pendingUsers = totalUsers - votedUsers;

    // Vote statistics by bidang
    const votesByBidang = await Vote.aggregate([
      {
        $group: {
          _id: '$bidang',
          count: { $sum: 1 }
        }
      }
    ]);

    // Ketua votes count
    const ketuaVotes = await Vote.aggregate([
      {
        $group: {
          _id: '$ketuaId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // PJ votes by bidang
    const pjVotes = await Vote.aggregate([
      {
        $group: {
          _id: { bidang: '$bidang', pjId: '$pjId' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.bidang': 1, count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalVotes,
      votedUsers,
      pendingUsers,
      votesByBidang,
      ketuaVotes,
      pjVotes,
      turnoutPercentage: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users with voting status (admin-only; includes token)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

  const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ nisn: 1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user (currently allows updating 'bidang' only)
const updateUser = async (req, res) => {
  try {
    const { nisn } = req.params; // current NISN
    const { bidang, nisn: newNisn } = req.body;

    if (!bidang && !newNisn) {
      return res.status(400).json({ message: 'Nothing to update. Provide bidang and/or nisn.' });
    }

    if (bidang && !VALID_BIDANG.includes(bidang)) {
      return res.status(400).json({ message: `Invalid bidang. Must be one of: ${VALID_BIDANG.join(', ')}` });
    }

    let user = await User.findOne({ nisn });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedVotes = 0;

    // Handle NISN change
    if (newNisn && newNisn !== user.nisn) {
      if (!/^\d+$/.test(newNisn)) {
        return res.status(400).json({ message: 'NISN harus berupa angka saja' });
      }
      const exists = await User.findOne({ nisn: newNisn });
      if (exists) {
        return res.status(409).json({ message: 'NISN baru sudah digunakan oleh user lain' });
      }
      // Update votes referencing old NISN
      const voteUpdate = await Vote.updateMany({ nisn }, { $set: { nisn: newNisn } });
      updatedVotes = voteUpdate.modifiedCount || 0;
      user.nisn = newNisn;
    }

    if (bidang) {
      user.bidang = bidang;
    }

    await user.save();

    res.json({ message: 'User updated successfully', updatedVotes, user: {
      nisn: user.nisn,
      bidang: user.bidang,
      hasVoted: user.hasVoted,
      token: user.token,
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user and their votes
const deleteUser = async (req, res) => {
  try {
    const { nisn } = req.params;

    const user = await User.findOne({ nisn });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete related votes first
    await Vote.deleteMany({ nisn });
    await User.deleteOne({ nisn });

    res.json({ message: 'User and related votes deleted successfully', nisn });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all votes with details
const getAllVotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const votes = await Vote.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Vote.countDocuments();

    res.json({
      votes,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get voting results
const getVotingResults = async (req, res) => {
  try {
    // Ketua results
    const ketuaResults = await Vote.aggregate([
      {
        $group: {
          _id: '$ketuaId',
          votes: { $sum: 1 },
          voters: { $push: '$nisn' }
        }
      },
      { $sort: { votes: -1 } }
    ]);

    // PJ results by bidang
    const pjResults = await Vote.aggregate([
      {
        $group: {
          _id: { bidang: '$bidang', pjId: '$pjId' },
          votes: { $sum: 1 },
          voters: { $push: '$nisn' }
        }
      },
      { $sort: { '_id.bidang': 1, votes: -1 } }
    ]);

    // Group PJ results by bidang
    const pjByBidang = {};
    pjResults.forEach(result => {
      const bidang = result._id.bidang;
      if (!pjByBidang[bidang]) {
        pjByBidang[bidang] = [];
      }
      pjByBidang[bidang].push({
        pjId: result._id.pjId,
        votes: result.votes,
        voters: result.voters
      });
    });

    res.json({
      ketuaResults,
      pjResults: pjByBidang
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset user voting status (for testing)
const resetUserVote = async (req, res) => {
  try {
    const { nisn } = req.params;
    
    const user = await User.findOne({ nisn });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove votes
    await Vote.deleteMany({ nisn });
    
    // Reset user status
    user.hasVoted = false;
    await user.save();

    res.json({ message: 'User vote reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export voting data
const exportVotingData = async (req, res) => {
  try {
    const votes = await Vote.find().sort({ createdAt: -1 });
    const users = await User.find({}, { token: 0 }).sort({ nisn: 1 });

    res.json({
      votes,
      users,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export users data in CSV format
const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find({}, { token: 0 }).sort({ nisn: 1 });
    
    // Create CSV header
    let csv = 'NISN,Bidang,Status Voting,Tanggal Vote\n';
    
    // Add user data
    for (const user of users) {
      const vote = await Vote.findOne({ nisn: user.nisn });
      const voteDate = vote ? new Date(vote.createdAt).toLocaleString('id-ID') : '-';
      const status = user.hasVoted ? 'Sudah Vote' : 'Belum Vote';
      
      csv += `${user.nisn},${user.bidang},${status},${voteDate}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=data-pemilih-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export detailed voting results in CSV format
const exportVotingResultsCSV = async (req, res) => {
  try {
    const votes = await Vote.find().sort({ createdAt: -1 });
    
    // Create CSV header
    let csv = 'NISN,Bidang,Kandidat Ketua,Kandidat PJ,Tanggal Vote,Waktu Vote\n';
    
    // Add voting data
    votes.forEach(vote => {
      const date = new Date(vote.createdAt);
      const dateStr = date.toLocaleDateString('id-ID');
      const timeStr = date.toLocaleTimeString('id-ID');
      
      csv += `${vote.nisn},${vote.bidang},${vote.ketuaId},${vote.pjId},${dateStr},${timeStr}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=hasil-voting-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export comprehensive report in JSON format
const exportComprehensiveReport = async (req, res) => {
  try {
    const users = await User.find({}, { token: 0 }).sort({ nisn: 1 });
    const votes = await Vote.find().sort({ createdAt: -1 });
    
    // Statistics
    const totalUsers = users.length;
    const votedUsers = users.filter(u => u.hasVoted).length;
    const pendingUsers = totalUsers - votedUsers;
    
    // Vote statistics by bidang
    const votesByBidang = await Vote.aggregate([
      {
        $group: {
          _id: '$bidang',
          count: { $sum: 1 }
        }
      }
    ]);

    // Ketua results
    const ketuaResults = await Vote.aggregate([
      {
        $group: {
          _id: '$ketuaId',
          votes: { $sum: 1 }
        }
      },
      { $sort: { votes: -1 } }
    ]);

    // PJ results by bidang
    const pjResults = await Vote.aggregate([
      {
        $group: {
          _id: { bidang: '$bidang', pjId: '$pjId' },
          votes: { $sum: 1 }
        }
      },
      { $sort: { '_id.bidang': 1, votes: -1 } }
    ]);

    const report = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'Admin',
        totalRecords: {
          users: totalUsers,
          votes: votes.length
        }
      },
      statistics: {
        totalUsers,
        votedUsers,
        pendingUsers,
        turnoutPercentage: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(2) : 0,
        votesByBidang
      },
      results: {
        ketua: ketuaResults,
        pj: pjResults
      },
      detailedData: {
        users: users.map(user => ({
          nisn: user.nisn,
          bidang: user.bidang,
          hasVoted: user.hasVoted,
          createdAt: user.createdAt
        })),
        votes: votes.map(vote => ({
          nisn: vote.nisn,
          bidang: vote.bidang,
          ketuaId: vote.ketuaId,
          pjId: vote.pjId,
          createdAt: vote.createdAt
        }))
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-lengkap-${new Date().toISOString().split('T')[0]}.json`);
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate random token
const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Regenerate user token
const regenerateUserToken = async (req, res) => {
  try {
    const { nisn } = req.params;
    
    const user = await User.findOne({ nisn });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new token
    let newToken;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      newToken = generateToken();
      const existingUser = await User.findOne({ token: newToken });
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Failed to generate unique token' });
    }

    // Update user token
    user.token = newToken;
    await user.save();

    res.json({ 
      message: 'Token regenerated successfully',
      nisn: user.nisn,
      newToken: newToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Bulk import users from CSV/Excel data (NISN dan Bidang saja, Token auto-generate)
const bulkImportUsers = async (req, res) => {
  try {
    const { users } = req.body; // Array of user objects
    
    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: 'Invalid users data' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
      duplicates: 0,
      updated: 0,
      tokensGenerated: []
    };

  // Validasi bidang yang diizinkan
  const validBidang = VALID_BIDANG;

    for (const userData of users) {
      try {
        const { nisn, bidang } = userData;
        
        // Validate required fields (hanya NISN dan Bidang)
        if (!nisn || !bidang) {
          results.failed++;
          results.errors.push(`Missing required fields for NISN: ${nisn || 'unknown'}`);
          continue;
        }

        // Validate NISN format (harus angka)
        if (!/^\d+$/.test(nisn)) {
          results.failed++;
          results.errors.push(`Invalid NISN format: ${nisn} (must be numbers only)`);
          continue;
        }

        // Validate bidang
  if (!validBidang.includes(bidang)) {
          results.failed++;
          results.errors.push(`Invalid bidang: ${bidang}. Must be one of: ${validBidang.join(', ')}`);
          continue;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ nisn });
        if (existingUser) {
          // Update existing user (bidang bisa berubah, token tetap)
          existingUser.bidang = bidang;
          await existingUser.save();
          results.updated++;
          results.duplicates++;
          continue;
        }

        // Generate unique token untuk user baru
        let userToken;
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 20) {
          userToken = generateToken();
          const existingTokenUser = await User.findOne({ token: userToken });
          if (!existingTokenUser) {
            isUnique = true;
          }
          attempts++;
        }
        
        if (!isUnique) {
          results.failed++;
          results.errors.push(`Failed to generate unique token for NISN: ${nisn} after ${attempts} attempts`);
          continue;
        }

        // Create new user
        const newUser = new User({
          nisn,
          token: userToken,
          bidang,
          hasVoted: false
        });

        await newUser.save();
        results.success++;
        
        // Simpan info token yang di-generate untuk ditampilkan ke admin
        results.tokensGenerated.push({
          nisn,
          bidang,
          token: userToken
        });

      } catch (error) {
        results.failed++;
        results.errors.push(`Error processing user ${userData.nisn}: ${error.message}`);
      }
    }

    res.json({
      message: 'Bulk import completed',
      results,
      summary: {
        total: users.length,
        success: results.success,
        updated: results.updated,
        failed: results.failed,
        tokensGenerated: results.tokensGenerated.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  // election schedule
  getElectionPeriods: async (req, res) => {
    try {
      const docs = await ElectionPeriod.find({}).lean()
      res.json({ periods: docs })
    } catch (e) { res.status(500).json({ message: 'Server error' }) }
  },
  upsertElectionPeriod: async (req, res) => {
    try {
      const { period, name, description, startDate, endDate } = req.body
      if (!period || !startDate || !endDate || !name) {
        return res.status(400).json({ message: 'period, name, startDate, endDate wajib' })
      }
      if (!['PJ','KETUA'].includes(period)) {
        return res.status(400).json({ message: 'period harus PJ atau KETUA' })
      }
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid' })
      }
      if (end <= start) {
        return res.status(400).json({ message: 'endDate harus setelah startDate' })
      }
      const doc = await ElectionPeriod.findOneAndUpdate(
        { period },
        { period, name, description: description || '', startDate: start, endDate: end },
        { new: true, upsert: true }
      )
      res.json({ message: 'Periode tersimpan', period: doc })
    } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }) }
  },
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
  deleteUser
};
