import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

// Create a Schema corresponding to the document interface.

const userNameSchema = new Schema<TUserName>({
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

const guardianSchema = new Schema<TGuardian>({
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

const localGuardianSchema = new Schema<TLocalGuardian>({
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

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required.'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Student Password is required.'],
      maxlength: [20, 'Password can not more than 20 Characters.'],
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
        message: '{VALUE} is not valid email.',
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function () {
  return (
    this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
  );
});

// pre save middleware or hook
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save data');
  // hasing password and save into DB
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //referring doc
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_Round),
  );
  next();
});

// post save middleware or hook
studentSchema.post('save', function (doc, next) {
  // console.log(this, 'post hook: already save data');

  doc.password = '';
  next();
});

// Query middleware
studentSchema.pre('find', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  // console.log(this);
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom instance method for statics
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
};

// creating a custom instance methods
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });

//   return existingUser;
// };

// Create a Model.
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
