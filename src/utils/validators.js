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

// Update registration form validator
export const validateRegistrationForm = (firstName, lastName, phone, password, confirmPassword) => {
  const errors = {};
  
  const firstNameError = validateFirstName(firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateLastName(lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const phoneError = validatePhoneForAuth(phone);
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

// Update login form validator
export const validateLoginForm = (phone, password) => {
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