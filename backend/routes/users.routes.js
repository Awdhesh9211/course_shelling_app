import express from 'express';
const UserRoute=express.Router();
import {userSignup,userSignin,userPurchase}from "../controllers/user.controller.js";
import { isUserAuth } from '../middleware/isUserAuth.js';
// user apis   -> /user
UserRoute.post("/signup",userSignup);
UserRoute.post("/signin",userSignin);



UserRoute.get("/purchases",isUserAuth,userPurchase);

export default UserRoute;