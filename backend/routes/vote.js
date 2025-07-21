const express = require('express');
const User = require('../models/user');
const Vote = require('../models/vote');
const { getCurrentElectionPeriod, hasUserVotedInPeriod } = require('../config/election');

const router = express.Router();

// Endpoint untuk mendapatkan status pemilihan saat ini
router.get('/status', async (req, res) => {
  try {
    const electionStatus = getCurrentElectionPeriod();
    res.json(electionStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint untuk mendapatkan status vote user
router.get('/user-status/:nisn', async (req, res) => {
  const { nisn } = req.params;
  
  try {
    const user = await User.findOne({ nisn });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const vote = await Vote.findOne({ nisn });
    const electionStatus = getCurrentElectionPeriod();
    
    res.json({
      user: {
        nisn: user.nisn,
        bidang: user.bidang
      },
      vote: {
        pjCompleted: vote?.pjCompleted || false,
        ketuaCompleted: vote?.ketuaCompleted || false,
        pjVotedAt: vote?.pjVotedAt,
        ketuaVotedAt: vote?.ketuaVotedAt
      },
      election: electionStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint untuk vote PJ
router.post('/pj', async (req, res) => {
  const { nisn, pjId } = req.body;

  try {
    const electionStatus = getCurrentElectionPeriod();
    
    // Cek apakah periode pemilihan PJ aktif
    if (!electionStatus.active || electionStatus.period !== 'PJ') {
      return res.status(403).json({ 
        message: 'Periode pemilihan PJ tidak aktif',
        election: electionStatus
      });
    }

    const user = await User.findOne({ nisn });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek apakah user sudah vote PJ
    let vote = await Vote.findOne({ nisn });
    if (vote && vote.pjCompleted) {
      return res.status(403).json({ message: 'Anda sudah memilih PJ Bidang' });
    }

    // Update atau create vote
    if (vote) {
      vote.pjId = pjId;
      vote.pjCompleted = true;
      vote.pjVotedAt = new Date();
    } else {
      vote = new Vote({
        nisn,
        bidang: user.bidang,
        pjId,
        pjCompleted: true,
        pjVotedAt: new Date()
      });
    }

    await vote.save();
    res.json({ message: 'Vote PJ berhasil disimpan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint untuk vote Ketua
router.post('/ketua', async (req, res) => {
  const { nisn, ketuaId } = req.body;

  try {
    const electionStatus = getCurrentElectionPeriod();
    
    // Cek apakah periode pemilihan Ketua aktif
    if (!electionStatus.active || electionStatus.period !== 'KETUA') {
      return res.status(403).json({ 
        message: 'Periode pemilihan Ketua tidak aktif',
        election: electionStatus
      });
    }

    const user = await User.findOne({ nisn });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek apakah user sudah vote Ketua
    let vote = await Vote.findOne({ nisn });
    if (vote && vote.ketuaCompleted) {
      return res.status(403).json({ message: 'Anda sudah memilih Ketua SOC' });
    }

    // Update atau create vote
    if (vote) {
      vote.ketuaId = ketuaId;
      vote.ketuaCompleted = true;
      vote.ketuaVotedAt = new Date();
    } else {
      vote = new Vote({
        nisn,
        bidang: user.bidang,
        ketuaId,
        ketuaCompleted: true,
        ketuaVotedAt: new Date()
      });
    }

    await vote.save();
    
    // Update user hasVoted jika sudah vote keduanya
    if (vote.pjCompleted && vote.ketuaCompleted) {
      user.hasVoted = true;
      await user.save();
    }

    res.json({ message: 'Vote Ketua berhasil disimpan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint legacy untuk kompatibilitas (vote sekaligus - untuk testing)
router.post('/', async (req, res) => {
  const { nisn, ketuaId, pjId } = req.body;

  try {
    const user = await User.findOne({ nisn });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek apakah user sudah vote lengkap
    let vote = await Vote.findOne({ nisn });
    if (vote && vote.pjCompleted && vote.ketuaCompleted) {
      return res.status(403).json({ message: 'Anda sudah menyelesaikan pemilihan' });
    }

    // Create atau update vote lengkap
    if (vote) {
      if (pjId) {
        vote.pjId = pjId;
        vote.pjCompleted = true;
        vote.pjVotedAt = new Date();
      }
      if (ketuaId) {
        vote.ketuaId = ketuaId;
        vote.ketuaCompleted = true;
        vote.ketuaVotedAt = new Date();
      }
    } else {
      vote = new Vote({
        nisn,
        bidang: user.bidang,
        ketuaId,
        pjId,
        pjCompleted: !!pjId,
        ketuaCompleted: !!ketuaId,
        pjVotedAt: pjId ? new Date() : null,
        ketuaVotedAt: ketuaId ? new Date() : null
      });
    }

    await vote.save();

    // Update user hasVoted jika sudah vote keduanya
    if (vote.pjCompleted && vote.ketuaCompleted) {
      user.hasVoted = true;
      await user.save();
    }

    res.json({ message: 'Vote berhasil disimpan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
