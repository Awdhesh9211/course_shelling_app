import express from 'express';
import { isUserAuth } from '../middleware/isUserAuth.js';
import { previewCourses, purchaseCourse } from '../controllers/course.controller.js';
const CourseRoute=express.Router();

// user apis   -> /courses
CourseRoute.post("/purchase/:courseId",isUserAuth,purchaseCourse);
CourseRoute.get("/preview",previewCourses);

export default CourseRoute;