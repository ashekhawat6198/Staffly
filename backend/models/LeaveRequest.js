import mongoose from "mongoose";
const LeaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String, enum: ['Casual', 'Sick', 'Maternity', 'LWP'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);