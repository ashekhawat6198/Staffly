const PayrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true }, // 1 to 12
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPayable: { type: Number, required: true }, // Calculated dynamically: base + allowances - deductions
  status: { type: String, enum: ['Draft', 'Processed', 'Paid'], default: 'Draft' }
}, { timestamps: true });

PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', PayrollSchema);