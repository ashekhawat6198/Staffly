import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app=express();


app.use(express.json());    // This allows Express to read JSON data from the request body.
app.use(express.urlencoded({ extended: true }));   // This allows Express to read form data (HTML forms).
app.use("/api/auth", authRoutes);

const PORT=process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});