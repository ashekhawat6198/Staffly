import LeaveRequest from "../models/LeaveRequest.js";
import LeaveBalance from "../models/LeaveBalance.js";
import Employee from "../models/Employee.js";

// calculate total days between two dates (inclusive)
const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

// Apply for leave
const applyLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    const totalDays = calculateDays(startDate, endDate);
    const year = new Date(startDate).getFullYear();

    // Check leave balance (skip check for unpaid leave)
    if (leaveType !== "unpaid") {
      let balance = await LeaveBalance.findOne({ employee: employee._id, year });

      if (!balance) {
        balance = await LeaveBalance.create({ employee: employee._id, year });
      }

      const remaining = balance[leaveType]?.total - balance[leaveType]?.used;
      if (remaining < totalDays) {
        return res.status(400).json({
          message: `Insufficient ${leaveType} leave balance. Remaining: ${remaining} day(s)`
        });
      }
    }

    const leaveRequest = await LeaveRequest.create({
      employee: employee._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: "pending"
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in employee's own leave requests
const getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const leaves = await LeaveRequest.find({ employee: employee._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests (admin/hr/manager), with filters
const getAllLeaves = async (req, res) => {
  try {
    const { status, employee, leaveType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (employee) filter.employee = employee;
    if (leaveType) filter.leaveType = leaveType;

    const leaves = await LeaveRequest.find(filter)
      .populate("employee", "firstName lastName employeeId department")
      .populate("approvedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject a leave request
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ message: `Leave request is already ${leaveRequest.status}` });
    }

    const approver = await Employee.findOne({ user: req.user.id });

    leaveRequest.status = status;
    leaveRequest.approvedBy = approver ? approver._id : null;
    leaveRequest.approvedAt = new Date();
    if (status === "rejected") leaveRequest.rejectionReason = rejectionReason;

    if (status === "approved" && leaveRequest.leaveType !== "unpaid") {
      const year = new Date(leaveRequest.startDate).getFullYear();
      let balance = await LeaveBalance.findOne({ employee: leaveRequest.employee, year });

      if (!balance) {
        balance = await LeaveBalance.create({ employee: leaveRequest.employee, year });
      }

      balance[leaveRequest.leaveType].used += leaveRequest.totalDays;
      await balance.save();
    }

    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a leave request
const cancelLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leaveRequest.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this request" });
    }

    if (leaveRequest.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be cancelled" });
    }

    leaveRequest.status = "cancelled";
    await leaveRequest.save();

    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave balance
const getMyLeaveBalance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const year = req.query.year || new Date().getFullYear();

    let balance = await LeaveBalance.findOne({ employee: employee._id, year });
    if (!balance) {
      balance = await LeaveBalance.create({ employee: employee._id, year });
    }

    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  cancelLeave,
  getMyLeaveBalance
};
