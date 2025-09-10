import DBConnect from "./config/db.js";
import express from "express";
import rateLimit from "express-rate-limit";

//route import
import {UserRoute,AdminRoute, CourseRoute} from "./routes/index.js";
//constant import
import { DB_NAME,DB_URL,PORT } from "./constant/index.js";




const app=express();

// middeleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Rate limiting middleware (apply to all API routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

// Apply rate limiter to all API routes
app.use("/api/", apiLimiter);

// routes
app.use("/api/v1/user",UserRoute);
app.use("/api/v1/admin",AdminRoute);
app.use("/api/v1/course",CourseRoute);




// ERROR MIDDELWARE
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details ?? undefined
    });
  }

  // For other errors
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// NOT FOUND 
// 404 Not Found Handler (should be after all route handlers)
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
    path: req.originalUrl,
  });
});


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