import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"
import departmentRoutes from "./routes/departmentRoutes.js"
import jobPositionRoutes from "./routes/jobPositionRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import leaveRoutes from "./routes/leaveRoutes.js"
import candidateRoutes from "./routes/candidateRoutes.js"
import payrollRoutes from "./routes/payrollRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import cors from "cors"

dotenv.config();

connectDB();

const app=express();


app.use(cors());
app.use(express.json());    // This allows Express to read JSON data from the request body.
app.use(express.urlencoded({ extended: true }));   // This allows Express to read form data (HTML forms).

app.use("/api/auth", authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/job-positions', jobPositionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/payroll', payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);


// 404 handler — for routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — catches unexpected errors anywhere in the app
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});