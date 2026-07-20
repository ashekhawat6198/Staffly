import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

//  Create new employee (links to existing User if already registered, else creates one)
// @access Admin, HR
  const createEmployee = async (req, res) => {
  try {
    const {
      email, password, role,
      firstName, lastName, phone, address, dateOfBirth, gender,
      employeeId, department, jobPosition, reportingTo,
      joiningDate, employmentType, baseSalary
    } = req.body;

    // NEW: enforce role-assignment permissions
    if (role && ["admin", "hr"].includes(role) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign the admin or hr role" });
    }

    const empIdExists = await Employee.findOne({ employeeId });
    if (empIdExists) {
      return res.status(400).json({ message: "Employee ID already in use" });
    }

    let user = await User.findOne({ email });

    if (user) {
      const alreadyLinked = await Employee.findOne({ user: user._id });
      if (alreadyLinked) {
        return res.status(400).json({ message: "This user already has an employee profile" });
      }
      if (role) {
        user.role = role;
        await user.save();
      }
    } else {
      if (!password) {
        return res.status(400).json({ message: "Password is required to create a new user account" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        email,
        password: hashedPassword,
        role: role || "employee",
      });
    }

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
      joiningDate,
      employmentType,
      baseSalary
    });

    const populatedEmployee = await Employee.findById(employee._id)
      .populate("department", "name")
      .populate("jobPosition", "title")
      .populate("reportingTo", "firstName lastName")
      .populate("user", "email role");

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
      .populate("department", "name")
      .populate("jobPosition", "title")
      .populate("reportingTo", "firstName lastName")
      .populate("user", "email role isActive")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "name")
      .populate("jobPosition", "title")
      .populate("reportingTo", "firstName lastName")
      .populate("user", "email role isActive");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id })
      .populate("department", "name")
      .populate("jobPosition", "title")
      .populate("reportingTo", "firstName lastName");

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
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
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatableFields = [
      "firstName", "lastName", "phone", "address", "dateOfBirth", "gender",
      "department", "jobPosition", "reportingTo", "employmentType",
      "baseSalary", "status", "profilePicture"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        employee[field] = req.body[field];
      }
    });

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate("department", "name")
      .populate("jobPosition", "title")
      .populate("reportingTo", "firstName lastName");

    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = "terminated";
    await employee.save();

    await User.findByIdAndUpdate(employee.user, { isActive: false });

    res.json({ message: "Employee deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deactivateEmployee
};
