
import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  
  basicSalary: { type: Number, required: true },
  allowances: {
    hra: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    unpaidLeave: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  
  grossSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  
  status: { type: String, enum: ['draft', 'processed', 'paid'], default: 'draft' },
  paymentDate: { type: Date },
  payslipUrl: { type: String } // generated PDF path
}, { timestamps: true });

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;