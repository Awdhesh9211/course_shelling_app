import { JWT_USER_SECRET } from "../constant/index.js";
import  {User}  from "../models/index.js";
import { UserSigninValidate,UserSignupValidate } from "../validation/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ SIGNUP
export const userSignup = asyncHandler(async (req, res) => {
  // validate
  const parsed = UserSignupValidate.safeParse(req.body);
  if (!parsed.success) {
    // throw a custom error with details array
    throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }

  const { email, password, firstName, lastName } = parsed.data;

  // check existing
  const existing = await User.findOne({ email });
 
  if (existing) throw new ApiError(409, "User already exists");

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    },
  });
});

// ✅ SIGNIN
export const userSignin = asyncHandler(async (req, res) => {
  // validate
  const parsed = UserSigninValidate.safeParse(req.body);
  if (!parsed.success) {
      throw new ApiError(
      400,
      "Validation failed",
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_USER_SECRET,
    { expiresIn: "1h" }
  );

    // ✅ Set token in cookie
  res.cookie("userToken", token, {
    httpOnly: true,           // cannot be accessed by JS on client
    secure: false,            // false for localhost, true on HTTPS
    sameSite: "strict",       // CSRF protection
    maxAge: 60 * 60 * 1000    // 1 hour in ms
  });

  res.json({ message: "Login successful", token });
});

// ✅ PURCHASE
export const userPurchase = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. Find the user and populate their purchased courses
  const user = await User.findById(userId).populate("purchasedCourses");

  if (!user) throw new ApiError(404, "User not found");

  // 2. Return the list of purchased courses
  return res.status(200).json({
    message: "Purchased courses retrieved successfully",
    courses: user.purchasedCourses || [],
  });
});