import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";

// helper get total working days in month

const getWorkingDaysInMonth=(month,year)=>{
  
  const totalDays=new Date(year,month,0).getDate();  // last day of month
  let workingDays=0;
  
  for(let day=1;day<=totalDays;day++){
    const date=new Date(year,month-1,day);  // js month starts from 0
    const dayOfWeek=date.getDay();
    if(dayOfWeek !==0 &&  dayOfWeek!==6){
      workingDays++;
    }
  }
return workingDays;

}

// helper: count unpaid leave days for an employee 
const getUnpaidLeaveDays = async (employeeId, month, year) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const unpaidLeaves = await LeaveRequest.find({
    employee: employeeId,
    leaveType: 'unpaid',
    status: 'approved',
    startDate: { $lte: endOfMonth },
    endDate: { $gte: startOfMonth }
  });

  // Sum up days (simple version — assumes leave falls within the month)
  let totalUnpaidDays = 0;
  unpaidLeaves.forEach((leave) => {
    totalUnpaidDays += leave.totalDays;
  });

  return totalUnpaidDays;
};


// calculate payroll for one employee of a specific month (admin,hr)

const generatePayroll = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      allowances = {},
      deductions = {},
    } = req.body;
    if (!employeeId || !month || !year) {
      return res
        .status(400)
        .json({ message: "Employee ID, month and year are required" });
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Prevent duplicate payroll generation for the same employee and month/year
    const existing = await Payroll.findOne({
      employee: employeeId,
      month,
      year,
    });
    if (existing) {
      return res
        .status(400)
        .json({
          message:
            "Payroll already generated for this employee for the specified month and year",
        });
    }
    const basicSalary = employee.baseSalary || 0;
    const hra = allowances.hra || 0;
    const transport = allowances.transport || 0;
    const otherAllowances = allowances.other || 0;

    // 1. working days in month
    const workingDays = getWorkingDaysInMonth(month, year);

    //2. unpaid leave
    const unpaidLeaveDays = await getunpaidLeaveDays(employeeId, month, year);

    //3. Gross salary=basic+all allowances
    const grossSalary = basicSalary + hra + transport + otherAllowances;

    //4. Unpaid leave deduction
    const perDaySalary = basicSalary / workingDays;
    const unpaidLeaveDeduction =
      Math.round(perDaySalary * unpaidLeaveDays * 100) / 100;

    //5. Tax deductions
    const taxDeduction = Math.round(grossSalary * 0.1 * 100) / 100; // 10% tax

    //6. Other deductions
    const otherDeductions = deductions.other || 0;

    //7. Total deductions
    const totalDeductions =
      taxDeduction + unpaidLeaveDeduction + otherDeductions;

    //8. Net salary
    const netSalary = Math.round((grossSalary - totalDeductions) * 100) / 100;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year,
      basicSalary,
      allowances: {
        hra,
        transport,
        other: otherAllowances,
      },
      deductions: {
        tax: taxDeduction,
        unpaidLeave: unpaidLeaveDeduction,
        other: otherDeductions,
      },
      grossSalary,
      netSalary,
      status: "draft",
    });

    res.status(201).json({
      payroll,
      breakdown: {
        workingDays,
        unpaidLeaveDays,
        perDaySalar: Math.round(perDaySalary * 100) / 100,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating payroll", error: error.message });
  }
};

// get all payroll records(with filters)
//access Admin,hr

const getAllPayroll = async (req, res) => {
  try {
    const { month, year, employee, status } = req.query;
    const filter = {};
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (employee) filter.employee = employee;
    if (status) filter.status = status;

    const payrolls = await Payroll.find(filter)
      .populate("employee", "firstName lastName employeeId department")
      .sort({ yearL: -1, month: -1 });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get logged-in employees own payroll histroy
// access any authenticated employee 
const getMyPayroll = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }
    const payrolls = await Payroll.find({ employee: employee._id }).sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single payroll by id
// access admin ,hr or employee themselves
const getPayrollById=async(req,res)=>{
  try{
     const payroll=await Payroll.findById(req.params.id)
     .populate('employee','firstName lastName employeeId department');

     if(!payroll){
      return res.status(404).json({message:'Payroll record not found'});
     }
     res.json(payroll);
  }catch(error){
     res.status(500).json({message:error.message});
  }
}

// update payroll status (draft -> processed -> paid)
// access admin, hr

const updatePayrollStatus=async(req,res)=>{
  try{
     const {status}=req.body;
     const validStatuses=['draft','processed','paid'];
     
     if(!validStatuses.includes(status)){
      return res.status(400),json({message:'Invalid status value'});
     }

     const payroll=await Payroll.findById(req.params.id);
     if(!payroll){
       return res.status(404).json({ message: 'Payroll record not found' });
     }

     payroll.status=status;
     if(status==='paid'){
      payroll.paymentDate=new Date();
     }

     await payroll.save();
     res.json(payroll);

  }catch(error){
      res.status(500).json({message:error.message});
  }
}

const deletePayroll=async(req,res)=>{
  try{
    const payroll=await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    if (payroll.status !== 'draft') {
      return res.status(400).json({ message: 'Only draft payroll records can be deleted' });
    }

    await payroll.deleteOne();
    res.json({ message: 'Payroll record deleted' });
  }catch(error){
     res.status(500).json({message:error.message});
  }
}

export{
  generatePayroll,
  getAllPayroll,
  getMyPayroll,
  getPayrollById,
  updatePayrollStatus,
  deletePayroll
};



