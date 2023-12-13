import { z } from 'zod';

// Define zod schemas for individual fields 

const userNameValidationSchema = z.object({
  firstName: z.string()
    .min(1)
    .max(20)
    .refine(value => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() === value, {
      message: 'First Name must be in capitalize format.'
    }),
  middleName: z.string().max(20).optional(),
  lastName: z.string()
    .min(1)
    .max(20)
    .refine(value => /^[A-Za-z]+$/.test(value), {
      message: 'Last Name must only contain alphabetical characters.'
    }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherContactNo: z.string().min(1),
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherContactNo: z.string().min(1),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1),
  occupation: z.string().min(1),
  contactNo: z.string().min(1),
  address: z.string().min(1),
});

const studentValidationSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(1).max(20),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email().min(1),
  dateOfBirth: z.string().optional(),
  contactNo: z.string().min(1),
  emergencyContactNo: z.string().min(1),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional(),
  presentAddress: z.string().min(1),
  permanentAddress: z.string().min(1),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean().default(false),
});

export default studentValidationSchema ;
