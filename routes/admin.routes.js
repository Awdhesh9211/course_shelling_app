import express from 'express';
import { AdminSignin, AdminSignup } from '../controllers/admin.controller.js';
const AdminRoute=express.Router();

// user apis   -> /user
AdminRoute.post("/signup",AdminSignup);
AdminRoute.post("/signin",AdminSignin);
AdminRoute.post("/course",()=>{});
AdminRoute.put("/course",()=>{});
AdminRoute.get("/course/bulk",()=>{});

export default AdminRoute;