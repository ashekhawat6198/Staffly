import JobPosition from "../models/JobPosition.js";

// access Admin, HR
const createJobPosition = async (req, res) => {
  try {
    const { title, department, description } = req.body;

    const jobPosition = await JobPosition.create({ title, department, description });
    res.status(201).json(jobPosition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobPositions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;

    const jobPositions = await JobPosition.find(filter)
      .populate("department", "name")
      .sort({ title: 1 });

    res.json(jobPositions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobPositionById = async (req, res) => {
  try {
    const jobPosition = await JobPosition.findById(req.params.id)
      .populate("department", "name");

    if (!jobPosition) {
      return res.status(404).json({ message: "Job position not found" });
    }

    res.json(jobPosition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// access Admin, HR
const updateJobPosition = async (req, res) => {
  try {
    const jobPosition = await JobPosition.findById(req.params.id);

    if (!jobPosition) {
      return res.status(404).json({ message: "Job position not found" });
    }

    const { title, department, description } = req.body;
    if (title !== undefined) jobPosition.title = title;
    if (department !== undefined) jobPosition.department = department;
    if (description !== undefined) jobPosition.description = description;

    await jobPosition.save();
    res.json(jobPosition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// access Admin only
const deleteJobPosition = async (req, res) => {
  try {
    const jobPosition = await JobPosition.findById(req.params.id);

    if (!jobPosition) {
      return res.status(404).json({ message: "Job position not found" });
    }

    await jobPosition.deleteOne();
    res.json({ message: "Job position deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createJobPosition,
  getJobPositions,
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition
};
