import { Course, User } from "../models/index.js";

import { asyncHandler } from "../utils/asyncHandler.js";
// ✅ Purchase a course
export const purchaseCourse = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if already purchased
  const alreadyPurchased = user.purchasedCourses?.includes(courseId);
  if (alreadyPurchased) {
    return res
      .status(400)
      .json({ message: "You have already purchased this course" });
  }

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

  return res.status(200).json({
    message: "Courses fetched successfully",
    courses,
  });
});