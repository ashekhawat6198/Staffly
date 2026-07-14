import mongoose from "mongoose";

const LeaveBalanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  year: { type: Number, required: true }, // e.g., 2026
  allocated: {
    casual: { type: Number, default: 12 },
    sick: { type: Number, default: 10 },
    earned: { type: Number, default: 15 }
  },
  used: {
    casual: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    earned: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Enforces one balance document per employee per year
LeaveBalanceSchema.index({ employee: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.model("LeaveBalance", LeaveBalanceSchema);

export default LeaveBalance;