const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');


const createEmployee = async (req, res) => {
  try {
    const {
      email, password, role, // for User account
      firstName, lastName, phone, address, dateOfBirth, gender,
      employeeId, department, jobPosition, reportingTo,
      dateOfJoining, employmentType, baseSalary
    } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Check if employeeId already exists
    const empIdExists = await Employee.findOne({ employeeId });
    if (empIdExists) {
      return res.status(400).json({ message: 'Employee ID already in use' });
    }

    // 3. Create User account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'employee'
    });

    // 4. Create Employee profile linked to that User
    const employee = await Employee.create({
      user: user._id,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
      employeeId,
      department,
      jobPosition,
      reportingTo: reportingTo || null,
      dateOfJoining,
      employmentType,
      baseSalary
    });

    const populatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name')
      .populate('jobPosition', 'title')
      .populate('reportingTo', 'firstName lastName')
      .populate('user', 'email role');

    res.status(201).json(populatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const { department, status, employmentType } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (status) filter.status = status;
    if (employmentType) filter.employmentType = employmentType;

    const employees = await Employee.find(filter)
      .populate('department', 'name')
      .populate('jobPosition', 'title')
      .populate('reportingTo', 'firstName lastName')
      .populate('user', 'email role isActive')
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name')
      .populate('jobPosition', 'title')
      .populate('reportingTo', 'firstName lastName')
      .populate('user', 'email role isActive');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// access Any authenticated user
const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id })
      .populate('department', 'name')
      .populate('jobPosition', 'title')
      .populate('reportingTo', 'firstName lastName');

    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatableFields = [
      'firstName', 'lastName', 'phone', 'address', 'dateOfBirth', 'gender',
      'department', 'jobPosition', 'reportingTo', 'employmentType',
      'baseSalary', 'status', 'profilePicture'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate('department', 'name')
      .populate('jobPosition', 'title')
      .populate('reportingTo', 'firstName lastName');

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.status = 'terminated';
    await employee.save();

    // Also deactivate their login access
    await User.findByIdAndUpdate(employee.user, { isActive: false });

    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deactivateEmployee
};