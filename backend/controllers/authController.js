const User = require('../models/User');

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

    res.json({
      nisn: user.nisn,
      token: user.token,
      bidang: user.bidang,
      hasVoted: user.hasVoted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, checkToken };
