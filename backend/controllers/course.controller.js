import { Course, User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Purchase a course
export const purchaseCourse = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Check if already purchased
  const alreadyPurchased = user.purchasedCourses?.includes(courseId);
  if (alreadyPurchased)
    throw new ApiError(400, "You have already purchased this course");

  // Add course to user's purchased list
  user.purchasedCourses = [...(user.purchasedCourses || []), courseId];
  await user.save();

  return res.status(200).json({
    message: "Course purchased successfully",
    courseId: course._id,
  });
});

// ✅ Preview public courses
export const previewCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find(
    {},
    "title description price imageUrl" // Select only safe fields
  );

  if (!courses.length)
    throw new ApiError(404, "No courses available at the moment");

  return res.status(200).json({
    message: "Courses fetched successfully",
    courses,
  });
});