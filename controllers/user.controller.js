import { JWT_USER_SECRET } from "../constant/index.js";
import  {User}  from "../models/index.js";
import { UserSigninValidate,UserSignupValidate } from "../validation/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ SIGNUP
export const userSignup = asyncHandler(async (req, res) => {
  // validate
  const parsed = UserSignupValidate.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }

  const { email, password, firstName, lastName } = parsed.data;

  // check existing
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

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
    return res.status(400).json(
      JSON.parse(parsed.error.message).map((p, i) => ({
        testFail: `${i + 1}) ${p.path.join(".")} => ${p.message}`,
      }))
    );
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    JWT_USER_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// ✅ PURCHASE
export const userPurchase = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. Find the user and populate their purchased courses
  const user = await User.findById(userId).populate("purchasedCourses");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2. Return the list of purchased courses
  return res.status(200).json({
    message: "Purchased courses retrieved successfully",
    courses: user.purchasedCourses || [],
  });
});