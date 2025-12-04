// Add console logs for debugging
console.log('📦 validators.js loaded successfully');

// Remove email validators, add name validators
export const validateFirstName = (firstName) => {
  if (!firstName || firstName.trim() === '') {
    return 'First name is required';
  }
  
  if (firstName.trim().length < 2) {
    return 'First name must be at least 2 characters';
  }
  
  const nameRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!nameRegex.test(firstName.trim())) {
    return 'First name can only contain letters and spaces';
  }
  
  return null;
};

export const validateLastName = (lastName) => {
  if (!lastName || lastName.trim() === '') {
    return 'Last name is required';
  }
  
  if (lastName.trim().length < 1) {
    return 'Last name must be at least 1 character';
  }
  
  const nameRegex = /^[a-zA-Z\s]{1,30}$/;
  if (!nameRegex.test(lastName.trim())) {
    return 'Last name can only contain letters and spaces';
  }
  
  return null;
};

export const validatePhoneForAuth = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  
  // Clean phone number (remove spaces, dashes, country code)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // Check if it's 10 digits (Indian number)
  if (cleanPhone.length !== 10) {
    return 'Phone number must be exactly 10 digits';
  }
  
  // Check if it starts with 6-9 (Indian mobile numbers)
  const firstDigit = cleanPhone.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return 'Please enter a valid Indian mobile number';
  }
  
  return null;
};

// ✅ ADD THESE MISSING FUNCTIONS:
export const validatePassword = (password) => {
  console.log('🔐 validatePassword called, length:', password?.length || 0);
  
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  // Optional password strength (comment out if too strict)
  /*
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Password must contain uppercase, lowercase letters and numbers';
  }
  */
  
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  console.log('🔐 validateConfirmPassword called');
  console.log('Password:', password ? '[HIDDEN]' : 'empty');
  console.log('Confirm Password:', confirmPassword ? '[HIDDEN]' : 'empty');
  
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Update registration form validator
export const validateRegistrationForm = (firstName, lastName, phone, password, confirmPassword) => {
  console.log('🔄 validateRegistrationForm called with:', {
    firstName: firstName || 'empty',
    lastName: lastName || 'empty',
    phone: phone || 'empty',
    password: password ? '[HIDDEN]' : 'empty',
    confirmPassword: confirmPassword ? '[HIDDEN]' : 'empty'
  });
  
  const errors = {};
  
  const firstNameError = validateFirstName(firstName);
  console.log('📝 First Name validation:', firstNameError || '✅ OK');
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateLastName(lastName);
  console.log('📝 Last Name validation:', lastNameError || '✅ OK');
  if (lastNameError) errors.lastName = lastNameError;
  
  const phoneError = validatePhoneForAuth(phone);
  console.log('📝 Phone validation:', phoneError || '✅ OK');
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(password);
  console.log('📝 Password validation:', passwordError || '✅ OK');
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  console.log('📝 Confirm Password validation:', confirmPasswordError || '✅ OK');
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  console.log('📊 Final errors object:', errors);
  console.log('✅ isValid:', Object.keys(errors).length === 0);
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Update login form validator
export const validateLoginForm = (phone, password) => {
  console.log('🔑 validateLoginForm called');
  
  const errors = {};
  
  const phoneError = validatePhoneForAuth(phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Keep existing Firebase error mapping and other functions...
// ... (rest of your existing code)

// Add debug export at the end
console.log('✅ All validators.js functions exported');