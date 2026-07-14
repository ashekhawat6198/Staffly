import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, // 1:1 Relationship
  employeeId: { type: String, required: true, unique: true }, // Custom ID like EMP001
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  joiningDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Terminated', 'On Leave'], default: 'Active' },
  
  // Relations
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  jobPosition: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition', required: true },
  reportingTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null } // Self-reference (1:N)
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;