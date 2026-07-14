import mongoose from "mongoose";

const JobPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

const JobPosition = mongoose.model("JobPosition", JobPositionSchema);

export default JobPosition;