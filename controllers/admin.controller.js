import { JWT_ADMIN_SECRET } from "../constant/index.js";
import  {Admin, Course}  from "../models/index.js";
import {  AdminSigninValidate, AdminSignupValidate, CreateCourseValidate, UpdateCourseValidate } from "../validation/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Admin signup
export const AdminSignup = asyncHandler(async (req, res) => {
  const parsed = AdminSignupValidate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }
  const { email, password, firstName, lastName } = parsed.data;

  // check existing
  const existing = await Admin.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "Admin already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create Admin
  const newAdmin = await Admin.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return res.status(201).json({
    message: "Admin created successfully",
    admin: {
      id: newAdmin._id,
      email: newAdmin.email,
      firstName: newAdmin.firstName,
      lastName: newAdmin.lastName,
    },
  });
});

// ✅ Admin signin
export const AdminSignin = asyncHandler(async (req, res) => {
  const parsed = AdminSigninValidate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }
  const { email, password } = parsed.data;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    JWT_ADMIN_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// ✅ Create a course
export const createCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const parsed = CreateCourseValidate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }
  const { title, description, imageUrl, price } = parsed.data;

  const course = await Course.create({
    title,
    description,
    price,
    imageUrl,
    creatorId: adminId,
  });

  res.json({
    message: "Course Created",
    courseId: course._id,
  });
});

// ✅ Update a course
export const updateCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const courseId = req.params.courseId;

  // Check if the course exists and was created by the current admin
  const course = await Course.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!course) {
    return res.status(403).json({
      message: "You don't have permission to update this course.",
    });
  }

  // Validate the request body
  const parsed = UpdateCourseValidate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }

  const { title, description, imageUrl, price } = parsed.data;

  // Update fields if they are provided
  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;
  if (imageUrl !== undefined) course.imageUrl = imageUrl;
  if (price !== undefined) course.price = price;

  await course.save();

  res.json({
    message: "Course Updated",
    courseId: course._id,
  });
});

// ✅ Bulk courses
export const bulkCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const courses = await Course.find({ creatorId: adminId }).populate("creatorId");

  res.status(200).json({
    courses,
  });
});