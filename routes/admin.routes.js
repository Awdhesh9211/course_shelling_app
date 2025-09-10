import express from 'express';
import { AdminSignin, AdminSignup, bulkCourse, createCourse, updateCourse } from '../controllers/admin.controller.js';
import { isAdminAuth } from '../middleware/isAdminAuth.js';
const AdminRoute=express.Router();

// user apis   -> /user
AdminRoute.post("/signup",AdminSignup);
AdminRoute.post("/signin",AdminSignin);

AdminRoute.post("/course",isAdminAuth,createCourse);
AdminRoute.put("/course/:courseId",isAdminAuth,updateCourse);
AdminRoute.get("/course/bulk",isAdminAuth,bulkCourse);

export default AdminRoute;