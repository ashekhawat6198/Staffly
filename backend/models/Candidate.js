import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  jobPosition: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String }, // Link to cloud storage (S3/Cloudinary)
  status: { type: String, enum: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Rejected'], default: 'Applied' }
}, { timestamps: true });

const Candidate = mongoose.model("Candidate", CandidateSchema);

export default Candidate;