import express from 'express';
const UserRoute=express.Router();
import {userSignup,userSignin,userPurchase}from "../controllers/user.controller.js";
// user apis   -> /user
UserRoute.post("/signup",userSignup);
UserRoute.post("/signin",userSignin);


// UserRoute.get("/profile",);
UserRoute.get("/purchases",userPurchase);

export default UserRoute;