import  Joi  from 'joi';

// creating a schema validation using Joi
const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .trim()
      .max(20)
      .pattern(/^[A-Z][a-z]*$/, { name: 'capitalize' })
      .message(
        '{#label} must start with an uppercase letter and only contain alphabetical characters',
      ),
    middleName: Joi.string().trim().max(20),
    lastName: Joi.string()
      .required()
      .trim()
      .max(20)
      .pattern(/^[A-Z][a-z]*$/, { name: 'alphabetical' })
      .message('{#label} must only contain alphabetical characters'),
  });

  const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().required().trim(),
    fatherOccupation: Joi.string().required().trim(),
    fatherContactNo: Joi.string().required().trim(),
    motherName: Joi.string().required().trim(),
    motherOccupation: Joi.string().required().trim(),
    motherContactNo: Joi.string().required().trim(),
  });

  const localGuardianValidationSchema = Joi.object({
    name: Joi.string().required().trim(),
    occupation: Joi.string().required().trim(),
    contactNo: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
  });

  const studentValidationSchema = Joi.object({
    id: Joi.string().required().trim(),
    name: userNameValidationSchema.required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().email().required().trim(),
    dateOfBirth: Joi.string().trim(),
    contactNo: Joi.string().required().trim(),
    emergencyContactNo: Joi.string().required().trim(),
    bloodGroup: Joi.string()
      .valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')
      .trim(),
    presentAddress: Joi.string().required().trim(),
    guardian: guardianValidationSchema.required(),
    localGuardian: localGuardianValidationSchema.required(),
    profileImg: Joi.string().trim(),
    isActive: Joi.string().valid('active', 'blocked').default('active'),
  });

  export default studentValidationSchema;