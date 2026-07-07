import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // e.g., "ENG", "HR"
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Department Head
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);