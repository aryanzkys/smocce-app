const Candidate = require('../models/candidate');

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ isActive: true }).sort({ type: 1, name: 1 });
    
    // Group candidates by type
    const ketua = candidates.filter(c => c.type === 'ketua');
    const pj = candidates.filter(c => c.type === 'pj');
    
    // Group PJ by bidang
    const pjByBidang = {};
    pj.forEach(candidate => {
      if (!pjByBidang[candidate.bidang]) {
        pjByBidang[candidate.bidang] = [];
      }
      pjByBidang[candidate.bidang].push(candidate);
    });

    res.json({
      ketua,
      pj: pjByBidang
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get candidates by type and bidang
const getCandidatesByType = async (req, res) => {
  try {
    const { type, bidang } = req.query;
    
    let query = { isActive: true, type };
    if (bidang && type === 'pj') {
      query.bidang = bidang;
    }

    const candidates = await Candidate.find(query).sort({ name: 1 });
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new candidate (Admin only)
const createCandidate = async (req, res) => {
  try {
    const { candidateId, name, type, bidang, vision, mission, experience, photo } = req.body;

    // Check if candidateId already exists
    const existingCandidate = await Candidate.findOne({ candidateId });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Candidate ID already exists' });
    }

    const candidate = new Candidate({
      candidateId,
      name,
      type,
      bidang: type === 'pj' ? bidang : undefined,
      vision,
      mission,
      experience,
      photo: photo || '/default-avatar.jpg'
    });

    await candidate.save();
    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update candidate (Admin only)
const updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const updates = req.body;

    // Fallback: jika updates.photo kosong/null, isi default
    if (!updates.photo || updates.photo.trim() === '') {
      updates.photo = '/default-avatar.jpg';
    }
    const candidate = await Candidate.findOneAndUpdate(
      { candidateId },
      updates,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete candidate (Admin only)
const deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findOneAndUpdate(
      { candidateId },
      { isActive: false },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get candidate details
const getCandidateDetails = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await Candidate.findOne({ candidateId, isActive: true });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCandidates,
  getCandidatesByType,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateDetails
};
