import express from 'express';
const AdminRoute=express.Router();
// user apis   -> /user
AdminRoute.post("/signup",()=>{});
AdminRoute.post("/signin",()=>{});
AdminRoute.post("/course",()=>{});
AdminRoute.put("/course",()=>{});
AdminRoute.get("/course/bulk",()=>{});

export default AdminRoute;