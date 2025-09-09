import { JWT_ADMIN_SECRET } from "../constant/index.js";
import  {Admin}  from "../models/index.js";
import {  AdminSigninValidate, AdminSignupValidate } from "../validation/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const  AdminSignup = async (req, res) => {
  try {
    // validate
    const parsed =  AdminSignupValidate.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(JSON.parse(parsed.error.message).map((p,i)=>({testFail:`${(i+1)}) ${p.path.join(".")} => ${p.message}`})));
    }
    const { email, password, firstName, lastName } = parsed.data;

    // check existing
    const existing = await  Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: " Admin already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create  Admin
    const  newAdmin = await  Admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return res.status(201).json({
      message: " Admin created successfully",
       Admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const  AdminSignin = async (req, res) => {
  try {
    // validate
    const parsed =  AdminSigninValidate.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(JSON.parse(parsed.error.message).map((p,i)=>({testFail:`${(i+1)}) ${p.path.join(".")} => ${p.message}`})));
    }
    const { email, password } = parsed.data;

    const  admin = await  Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password,  admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id:  admin._id, email:  admin.email },
      JWT_ADMIN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};