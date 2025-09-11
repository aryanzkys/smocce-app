const User = require('../models/User');
const Vote = require('../models/vote');

const login = async (req, res) => {
  const { nisn, token } = req.body;

  try {
    const user = await User.findOne({ nisn });

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'NISN atau Token salah.' });
    }

    if (user.hasVoted) {
      return res.status(403).json({ message: 'Anda sudah memberikan suara.' });
    }

    res.status(200).json({
      message: 'Login sukses',
      user: {
        nisn: user.nisn,
        bidang: user.bidang
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check token by NISN
const checkToken = async (req, res) => {
  try {
    const { nisn } = req.body;
    
    if (!nisn) {
      return res.status(400).json({ message: 'NISN is required' });
    }

    const user = await User.findOne({ nisn });
    if (!user) {
      return res.status(404).json({ message: 'NISN tidak ditemukan' });
    }

    // Try to read vote progress to expose per-election status (Ketua & PJ)
    let ketua = false;
    let pj = false;
    let ketuaVotedAt = null;
    let pjVotedAt = null;

    try {
      const vote = await Vote.findOne({ nisn: user.nisn });
      if (vote) {
        ketua = Boolean(vote.ketuaCompleted || vote.ketuaVotedAt || vote.ketuaId);
        pj = Boolean(vote.pjCompleted || vote.pjVotedAt || vote.pjId);
        ketuaVotedAt = vote.ketuaVotedAt || null;
        pjVotedAt = vote.pjVotedAt || null;
      }
    } catch (e) {
      // Non-fatal; keep defaults
      console.error('checkToken vote lookup error:', e);
    }

    res.json({
      nisn: user.nisn,
      token: user.token,
      bidang: user.bidang,
      hasVoted: user.hasVoted || ketua || pj, // backward compat overall flag
      electionStatus: {
        ketua,
        pj,
      },
      votedAt: {
        ketua: ketuaVotedAt,
        pj: pjVotedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, checkToken };
