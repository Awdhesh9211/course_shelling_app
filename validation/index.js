import {z} from 'zod';

// USER REQUEST VALIDATER 
export const UserSignupValidate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string(),
});

export const UserSigninValidate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


// ADMIN REQ VALIDATER 
export const AdminSignupValidate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string(),
});

export const AdminSigninValidate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const CreateCourseValidate = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive("Price must be greater than zero"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional()
});

export const UpdateCourseValidate = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().trim().min(1, "Description cannot be empty").optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than zero")
    .optional(),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
});

