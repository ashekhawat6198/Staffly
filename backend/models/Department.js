import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // e.g., "ENG", "HR"
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' } // Department Head
}, { timestamps: true });

const Department = mongoose.model("Department", departmentSchema);

export default Department;

