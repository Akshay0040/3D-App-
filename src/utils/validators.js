// Firebase-based validation functions
// These match Firebase authentication error codes

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email address is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null; // No error
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
    return 'Phone number must be exactly 10 digits';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  // Firebase doesn't require uppercase/lowercase rules by default
  // But we can add them for better security
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const validateEmailOrPhone = (input) => {
  if (!input || input.trim() === '') {
    return 'Email or phone number is required';
  }
  
  // Check if it's an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input)) {
    return null;
  }
  
  // Check if it's a phone number
  const phoneRegex = /^[0-9]{10}$/;
  if (phoneRegex.test(input.replace(/[^0-9]/g, ''))) {
    return null;
  }
  
  return 'Please enter a valid email or 10-digit phone number';
};

export const validateOTP = (otp) => {
  if (!otp || otp.trim() === '') {
    return 'OTP is required';
  }
  
  const otpRegex = /^[0-9]{6}$/;
  if (!otpRegex.test(otp)) {
    return 'OTP must be exactly 6 digits';
  }
  
  return null;
};

// Firebase error code to user-friendly message mapping
export const getFirebaseAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    // Registration errors
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    
    case 'auth/invalid-email':
      return 'Invalid email address format. Please check your email.';
    
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password with at least 6 characters.';
    
    case 'auth/missing-password':
      return 'Password is required.';
    
    // Login errors
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email or sign up.';
    
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or use "Forgot Password".';
    
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later or reset your password.';
    
    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Please contact support.';
    
    // Email verification
    case 'auth/email-not-verified':
      return 'Please verify your email address before signing in. Check your inbox for the verification email.';
    
    // Password reset
    case 'auth/invalid-email':
      return 'Invalid email address for password reset.';
    
    // General errors
    default:
      return 'An error occurred. Please try again.';
  }
};

// Complete form validation functions
export const validateLoginForm = (emailOrPhone, password) => {
  const errors = {};
  
  const emailOrPhoneError = validateEmailOrPhone(emailOrPhone);
  if (emailOrPhoneError) errors.emailOrPhone = emailOrPhoneError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationForm = (email, phone, password, confirmPassword) => {
  const errors = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Utility to check if form is valid
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export default {
  // Field validators
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateEmailOrPhone,
  validateOTP,
  
  // Firebase error handling
  getFirebaseAuthErrorMessage,
  
  // Form validators
  validateLoginForm,
  validateRegistrationForm,
  
  // Utility
  isFormValid,
};