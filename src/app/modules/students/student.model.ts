import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

// Create a Schema corresponding to the document interface.

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required.'],
    trim: true,
    maxlength: [20, 'First Name can not be more than 20 character'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr =
    //       value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize formate.',
    // },
  },
  middleName: {
    type: String,
    maxlength: [20, 'Middle Name can not be more than 20 character'],
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, 'Last Name is required.'],
    maxlength: [20, 'Last Name can not be more than 20 character'],
    trim: true,
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not valid.',
    // },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is required.'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required.'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact Number is required.'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required.'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required.'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Number is required.'],
    trim: true,
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is required.'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required.'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact Number is required.'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required.'],
    trim: true,
  },
});

const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: [true, 'Student ID is required.'],
    unique: true,
    trim: true,
  },
  name: {
    type: userNameSchema,
    required: [true, 'Student Name is required.'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "{VALUE} value is not valid. The gender field can only be one of the following 'male', 'female' or 'other'.",
    },
    required: [true, 'Gender is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    trim: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not valid email.'
    },
  },
  dateOfBirth: {
    type: String,
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Contact Number is required.'],
    trim: true,
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency Contact Number is required.'],
    trim: true,
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      message: '{VALUE} value is not a valid blood group.',
    },
    trim: true,
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address is required.'],
    trim: true,
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian information is required.'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian information is required.'],
  },
  profileImg: {
    type: String,
    trim: true,
  },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});

// Create a Model.
export const StudentModel = model<Student>('Student', studentSchema);
