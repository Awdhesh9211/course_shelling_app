import DBConnect from "./config/db.js";
import express from "express";

//route import
import {UserRoute,AdminRoute} from "./routes/index.js";
//constant import
import { DB_NAME,DB_URL,PORT } from "./constant/index.js";




const app=express();

// middeleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// routes
app.use("/api/v1/user",UserRoute);
app.use("/api/v1/admin",AdminRoute);
// app.use("/api/v1/couses",CourseRoute);


(async () => {
  try {
    // Try connecting to DB
    const conn = await DBConnect(DB_URL, DB_NAME);
    console.log("✅ DB connected");

    // Start server only if DB connected
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Handle uncaught exceptions (optional safety net)
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (error) {
   console.error("❌ DB connection failed due to:");

  // 1. Take the message (or stack if empty)
  const message = error?.message || error?.toString() || "Unknown error";

  // 2. Split by period, trim and filter out blanks
  message
    .split(".")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line, idx) => {
      console.error(`  ${idx + 1}. ${line}`);
    });
    process.exit(1); // exit with failure
  }
})();