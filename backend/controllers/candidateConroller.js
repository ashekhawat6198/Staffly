const Candidate = require('../models/Candidate');

//Create/add a new candidate
const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, resumeUrl, appliedFor } = req.body;

    const exists = await Candidate.findOne({ email, appliedFor });
    if (exists) {
      return res.status(400).json({ message: 'Candidate already applied for this position' });
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      resumeUrl,
      appliedFor,
      status: 'applied'
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all candidates (with filters)
const getCandidates = async (req, res) => {
  try {
    const { status, appliedFor } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (appliedFor) filter.appliedFor = appliedFor;

    const candidates = await Candidate.find(filter)
      .populate({
        path: 'appliedFor',
        select: 'title department',
        populate: { path: 'department', select: 'name' }
      })
      .sort({ fitScore: -1, createdAt: -1 }); // best fit first

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get single candidate
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('appliedFor', 'title department');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update candidate status (screening, interview, offered, hired, rejected)
const updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.status = status;
    await candidate.save();

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update candidate details (e.g. after AI parses resume)
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const updatableFields = [
      'name', 'phone', 'resumeUrl', 'parsedSkills', 'parsedExperience', 'fitScore'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        candidate[field] = req.body[field];
      }
    });

    await candidate.save();
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await candidate.deleteOne();
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateStatus,
  updateCandidate,
  deleteCandidate
};