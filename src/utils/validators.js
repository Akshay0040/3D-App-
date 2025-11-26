import * as Yup from 'yup';

// Common validation patterns
export const emailValidation = Yup.string()
  .email('Please enter a valid email address')
  .required('Email address is required');

export const phoneValidation = Yup.string()
  .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
  .required('Phone number is required');

export const emailOrPhoneValidation = Yup.string()
  .required('Email or phone number is required')
  .test('email-or-phone', 'Please enter a valid email or 10-digit phone number', (value) => {
    if (!value) return false;
    
    // Check if it's a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) return true;
    
    // Check if it's a valid phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(value)) return true;
    
    return false;
  });

export const passwordValidation = Yup.string()
  .min(6, 'Password must be at least 6 characters')
  .required('Password is required');

export const confirmPasswordValidation = Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
  .required('Please confirm your password');

export const otpValidation = Yup.string()
  .length(6, 'OTP must be exactly 6 digits')
  .matches(/^[0-9]+$/, 'OTP must contain only numbers')
  .required('OTP is required');

export const nameValidation = Yup.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
  .required('Full name is required');

// Complete validation schemas
export const loginValidationSchema = Yup.object().shape({
  emailOrPhone: emailOrPhoneValidation,
  password: passwordValidation,
});

export const registrationValidationSchema = Yup.object().shape({
  email: emailValidation,
  phone: phoneValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

export const otpValidationSchema = Yup.object().shape({
  otp: otpValidation,
});

export const profileValidationSchema = Yup.object().shape({
  firstName: nameValidation,
  lastName: nameValidation,
  email: emailValidation,
  phone: phoneValidation,
});

// Individual field validators (for on-the-fly validation)
export const validateEmail = (email) => {
  try {
    emailValidation.validateSync(email);
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validatePhone = (phone) => {
  try {
    phoneValidation.validateSync(phone);
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validateEmailOrPhone = (emailOrPhone) => {
  try {
    emailOrPhoneValidation.validateSync(emailOrPhone);
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validatePassword = (password) => {
  try {
    passwordValidation.validateSync(password);
    return null;
  } catch (error) {
    return error.message;
  }
};

export const validateOTP = (otp) => {
  try {
    otpValidation.validateSync(otp);
    return null;
  } catch (error) {
    return error.message;
  }
};

// Utility functions for form validation
export const isFormValid = (schema, values) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return true;
  } catch (error) {
    return false;
  }
};

export const getFormErrors = (schema, values) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return errors;
  }
};

// Export everything
export default {
  // Schemas
  loginValidationSchema,
  registrationValidationSchema,
  otpValidationSchema,
  profileValidationSchema,
  
  // Individual validations
  emailValidation,
  phoneValidation,
  emailOrPhoneValidation,
  passwordValidation,
  confirmPasswordValidation,
  otpValidation,
  nameValidation,
  
  // Utility functions
  validateEmail,
  validatePhone,
  validateEmailOrPhone,
  validatePassword,
  validateOTP,
  isFormValid,
  getFormErrors,
};