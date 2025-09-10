import { JWT_ADMIN_SECRET } from "../constant/index.js";
import  {Admin, Course}  from "../models/index.js";
import {  AdminSigninValidate, AdminSignupValidate, CreateCourseValidate, UpdateCourseValidate } from "../validation/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Admin signup
export const AdminSignup = asyncHandler(async (req, res) => {
  const parsed = AdminSignupValidate.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        field: p.path.join("."),
        message: p.message,
      }))
    );
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existing = await Admin.findOne({ email });
  if (existing) throw new ApiError(409, "Admin already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await Admin.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return res.status(201).json({
    status: "success",
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
    throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        field: p.path.join("."),
        message: p.message,
      }))
    );
  }

  const { email, password } = parsed.data;

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    JWT_ADMIN_SECRET,
    { expiresIn: "1h" }
  );

  // ✅ Set token in cookie
  res.cookie("adminToken", token, {
    httpOnly: true,           // cannot be accessed by JS on client
    secure: false,            // false for localhost, true on HTTPS
    sameSite: "strict",       // CSRF protection
    maxAge: 60 * 60 * 1000    // 1 hour in ms
  });

  res.json({ status: "success", message: "Login successful", token });
});

// ✅ Create a course
export const createCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const parsed = CreateCourseValidate.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        field: p.path.join("."),
        message: p.message,
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

  res.status(201).json({
    status: "success",
    message: "Course Created",
    courseId: course._id,
  });
});

// ✅ Update a course
export const updateCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const courseId = req.params.courseId;

  const course = await Course.findOne({ _id: courseId, creatorId: adminId });
  if (!course) throw new ApiError(403, "You don't have permission to update this course");

  const parsed = UpdateCourseValidate.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        field: p.path.join("."),
        message: p.message,
      }))
    );
  }

  const { title, description, imageUrl, price } = parsed.data;

  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;
  if (imageUrl !== undefined) course.imageUrl = imageUrl;
  if (price !== undefined) course.price = price;

  await course.save();

  res.json({
    status: "success",
    message: "Course Updated",
    courseId: course._id,
  });
});

// ✅ Bulk courses
export const bulkCourse = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;
  const courses = await Course.find({ creatorId: adminId }).populate("creatorId");

  if (!courses.length) throw new ApiError(404, "No courses found for this admin");

  res.status(200).json({ status: "success", courses });
});