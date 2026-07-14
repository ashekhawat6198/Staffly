import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";


// Helper: get today's date with time stripped (midnight) for consistent day-matching
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// check-in for the day

const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const today = getStartOfDay();

    // prevent dupliate check-in for the same day
    const existing = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });
    if (existing) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      date: today,
      checkInTime: new Date(),
      status: "Present",
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// check-out for the day

const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const today = getStartOfDay();

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: today,
    });
    if (!attendance) {
      return res
        .status(400)
        .json({ message: "You have not checked in for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out for today" });
    }
    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;

    // calculate total hours worked
    const hoursWorked =
      (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);
    attendence.hoursWorked = Math.round(hoursWorked * 100) / 100; // round to 2 decimal places

    if (attendance.hoursWorked >= 8) {
      attendance.status = "Present";
    } else if (attendance.hoursWorked >= 4) {
      attendance.status = "Half-Day";
    } else {
      attendance.status = "Present";
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  // get logged-in user's attendance history

  const getMyAttendance = async (req, res) => {
    try {
      const employee = await Employee.findOne({ user: req.user.id });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const filter = { employee: employee._id };
      const { startDate, endDate } = req.query;

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) {
          filter.date.$gte = new Date(startDate);
        }
        if (endDate) {
          filter.date.$lte = new Date(endDate);
        }
      }
      const records = await Attendance.find(filter).sort({ date: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// get all attendance records (Admin and HR/manager only) with filters

const getAllAttendance = async (req, res) => {
  try {
    const { employee, department, startDate, endDate, status } = req.query;
    const filter = {};

    if (employee) filter.employee = employee;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    let query = Attendance.find(filter)
      .populate({
        select: "firstName lastName employeeId department",
        populate: { path: "department", select: "name" },
      })
      .sort({ date: -1 });

      let records = await query;

      if(department) {
        records = records.filter(record => record.employee?.department?.toString() === department);
      }

      res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get specific emloyees attendance (for managers/hr viewing someone else)

    const getEmployeeAttendance = async (req, res) => {
       try{
            const {employeeId}=req.params;
            const {startDate, endDate}=req.query;
            const filter = {employee: employeeId};
            if(startDate || endDate) {
                filter.date = {};
                if(startDate) filter.date.$gte = new Date(startDate);
                if(endDate) filter.date.$lte = new Date(endDate);
            }
            const records = await Attendance.find(filter).sort({date: -1});
            res.json(records);
       }catch (error) {
            res.status(500).json({message: error.message});
       }
  

    }


   export {
        checkIn,
        checkOut,   
        getMyAttendance,
        getAllAttendance,
        getEmployeeAttendance
    };