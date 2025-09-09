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

