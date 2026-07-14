import Department from "../models/Department.js";

// create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;
    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({ name, description, manager });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()     //"Get all departments, and for each one, replace the manager's ID with their actual first and last name, then sort the whole list alphabetically by department name."
      .populate("manager", "firstName lastName")
      .sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "manager",
      "firstName lastName",
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update a department

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
     const { name, description, manager } = req.body;
    if (name !== undefined) department.name = name;
    if (description !== undefined) department.description = description;
    if (manager !== undefined) department.manager = manager;
     await department.save();
    res.json(department);
  } catch (erroor) {
    res.status(500).json({ message: error.message });
  }
};

// delete a department

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export  {
  createDepartment,
  getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};
