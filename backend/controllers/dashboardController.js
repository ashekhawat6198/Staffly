import Employee from "../models/Employee.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Department from "../models/Department.js";
import Attendance from "../models/Attendance.js"

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// get dashobard stats  (role-aware)

export const getDashboardStats = async (req, res) => {
  try {
     res.set("Cache-Control", "no-store");
    const { role, id } = req.user;
    const today = getStartOfDay();
    if (role == "admin" || role == "hr") {
      const [totalEmployees, pendingLeaves, todayAttendance, totalDepartments] =
        await Promise.all([
          Employee.countDocuments({ status: "active" }),
          LeaveRequest.countDocuments({ status: "pending" }),
          Attendance.countDocuments({ date: today }),
          Department.countDocuments(),
        ]);
      return res.json({
        role,
        stats: {
          totalEmployees,
          pendingLeaves,
          todayAttendance,
          totalDepartments,
        },
      });
    }
    // Employee / Manager view — personal stats
    const employee = await Employee.findOne({ user: id });
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const [todayCheckIn, myPendingLeaves] = await Promise.all([
      Attendance.findOne({ employee: employee._id, date: today }),
      LeaveRequest.countDocuments({
        employee: employee._id,
        status: "pending",
      }),
    ]);

    res.json({
      role,
      stats: {
        checkedInToday: !!todayCheckIn?.checkIn,
        checkedOutToday: !!todayCheckIn?.checkOut,
        myPendingLeaves,
      },
    });
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};
