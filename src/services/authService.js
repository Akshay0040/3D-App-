// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class AuthService {
//   constructor() {
//     this.auth = auth();
//     this.USERS_KEY = '@smartcontacts_users';
//     this.SESSION_KEY = '@smartcontacts_session';
//   }

//   // ========== PHONE AUTHENTICATION ==========

//   // Send OTP to phone
//   sendOTP = async (phoneNumber) => {
//     try {
//       console.log('📱 Sending OTP to:', phoneNumber);

//       // Format phone number (add country code)
//       const formattedPhone = this.formatPhoneNumber(phoneNumber);

//       // Send OTP via Firebase
//       const confirmation = await this.auth.signInWithPhoneNumber(formattedPhone);

//       console.log('✅ OTP sent successfully');

//       return {
//         success: true,
//         confirmation, // Firebase confirmation object
//         message: 'OTP sent successfully'
//       };

//     } catch (error) {
//       console.error('OTP send error:', error);
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error),
//         errorCode: error.code
//       };
//     }
//   };

//   // Verify OTP
//   verifyOTP = async (confirmation, otpCode) => {
//     try {
//       console.log('🔐 Verifying OTP...');

//       // Verify OTP with Firebase
//       const userCredential = await confirmation.confirm(otpCode);

//       console.log('✅ OTP verified, user:', userCredential.user.uid);

//       return {
//         success: true,
//         user: userCredential.user,
//         message: 'Phone number verified successfully!'
//       };

//     } catch (error) {
//       console.error('OTP verification error:', error);
//       return {
//         success: false,
//         error: 'Invalid OTP. Please try again.',
//         errorCode: error.code
//       };
//     }
//   };

//   // ========== USER REGISTRATION ==========
//   registerUser = async (firstName, lastName, phone, password) => {
//     try {
//       console.log('📝 Registering user with Firebase Phone Auth');

//       // 1. Send OTP to verify phone
//       const otpResult = await this.sendOTP(phone);

//       if (!otpResult.success) {
//         return otpResult;
//       }

//       // 2. Store user data temporarily (OTP verification pending)
//       const tempUser = {
//         id: 'temp-' + Date.now(),
//         firstName,
//         lastName,
//         phone,
//         password: this.hashPassword(password),
//         createdAt: new Date().toISOString(),
//         firebaseConfirmation: otpResult.confirmation, // Store for verification
//         isPhoneVerified: false
//       };

//       // Save to AsyncStorage
//       await this.saveTempUser(tempUser);

//       return {
//         success: true,
//         user: {
//           id: tempUser.id,
//           firstName,
//           lastName,
//           phone,
//           isPhoneVerified: false
//         },
//         confirmation: otpResult.confirmation,
//         message: 'OTP sent for phone verification'
//       };

//     } catch (error) {
//       console.error('Registration error:', error);
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error),
//         errorCode: error.code
//       };
//     }
//   };

//   // Complete registration after OTP verification
//   completeRegistration = async (confirmation, otpCode, userData) => {
//     try {
//       console.log('✅ Completing registration after OTP verification');

//       // 1. Verify OTP
//       const verifyResult = await this.verifyOTP(confirmation, otpCode);

//       if (!verifyResult.success) {
//         return verifyResult;
//       }

//       const firebaseUser = verifyResult.user;

//       // 2. Update user profile with name
//       await firebaseUser.updateProfile({
//         displayName: `${userData.firstName} ${userData.lastName}`,
//       });

//       // 3. Save user to permanent storage
//       const permanentUser = {
//         id: firebaseUser.uid,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         phone: userData.phone,
//         firebaseUid: firebaseUser.uid,
//         email: firebaseUser.email || `${userData.phone}@smartcontacts.app`,
//         createdAt: new Date().toISOString(),
//         isPhoneVerified: true,
//         lastLogin: new Date().toISOString()
//       };

//       await this.saveUser(permanentUser);

//       // 4. Create session
//       await this.createSession(permanentUser);

//       return {
//         success: true,
//         user: permanentUser,
//         message: 'Registration completed successfully!'
//       };

//     } catch (error) {
//       console.error('Complete registration error:', error);
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error),
//         errorCode: error.code
//       };
//     }
//   };

//   // ========== LOGIN WITH PHONE ==========
//   loginWithPhone = async (phone, password) => {
//     try {
//       console.log('🔐 Login with phone:', phone);

//       // 1. Check if user exists in our storage
//       const users = await this.getUsers();
//       const user = users.find(u => u.phone === phone);

//       if (!user) {
//         return {
//           success: false,
//           error: 'Phone number not registered'
//         };
//       }

//       // 2. Verify password
//       const hashedPassword = this.hashPassword(password);
//       if (user.password !== hashedPassword) {
//         return {
//           success: false,
//           error: 'Incorrect password'
//         };
//       }

//       // 3. Check if phone is verified
//       if (!user.isPhoneVerified) {
//         // Send OTP for verification
//         const otpResult = await this.sendOTP(phone);

//         if (otpResult.success) {
//           return {
//             success: false,
//             error: 'Please verify your phone number first',
//             needsVerification: true,
//             confirmation: otpResult.confirmation
//           };
//         }
//       }

//       // 4. Create session
//       await this.createSession(user);

//       return {
//         success: true,
//         user: {
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           phone: user.phone,
//           isPhoneVerified: user.isPhoneVerified
//         },
//         message: 'Login successful!'
//       };

//     } catch (error) {
//       console.error('Login error:', error);
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error),
//         errorCode: error.code
//       };
//     }
//   };

//   // ========== FORGOT PASSWORD ==========
//   forgotPassword = async (phone) => {
//     try {
//       // Check if user exists
//       const users = await this.getUsers();
//       const user = users.find(u => u.phone === phone);

//       if (!user) {
//         return {
//           success: false,
//           error: 'Phone number not registered'
//         };
//       }

//       // Send OTP for password reset
//       const otpResult = await this.sendOTP(phone);

//       return {
//         success: otpResult.success,
//         confirmation: otpResult.confirmation,
//         message: otpResult.message,
//         error: otpResult.error
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error)
//       };
//     }
//   };

//   // ========== HELPER METHODS ==========
//   formatPhoneNumber = (phone) => {
//     // Add country code (India: +91)
//     return `+91${phone}`;
//   };

//   hashPassword = (password) => {
//     // Simple hash for demo (use bcrypt in production)
//     return btoa(password);
//   };

//   getFirebaseErrorMessage = (error) => {
//     switch (error.code) {
//       case 'auth/invalid-phone-number':
//         return 'Invalid phone number format';
//       case 'auth/too-many-requests':
//         return 'Too many attempts. Try again later';
//       case 'auth/session-expired':
//         return 'OTP expired. Please request new OTP';
//       case 'auth/invalid-verification-code':
//         return 'Invalid OTP code';
//       case 'auth/quota-exceeded':
//         return 'SMS quota exceeded. Try again later';
//       default:
//         return error.message || 'An error occurred';
//     }
//   };

//   // ========== STORAGE METHODS ==========
//   saveTempUser = async (userData) => {
//     const tempUsers = JSON.parse(await AsyncStorage.getItem('temp_users') || '[]');
//     tempUsers.push(userData);
//     await AsyncStorage.setItem('temp_users', JSON.stringify(tempUsers));
//   };

//   saveUser = async (userData) => {
//     const users = await this.getUsers();
//     const existingIndex = users.findIndex(u => u.phone === userData.phone);

//     if (existingIndex !== -1) {
//       users[existingIndex] = userData;
//     } else {
//       users.push(userData);
//     }

//     await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
//   };

//   getUsers = async () => {
//     const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
//     return usersJson ? JSON.parse(usersJson) : [];
//   };

//   createSession = async (userData) => {
//     const session = {
//       userId: userData.id,
//       firebaseUid: userData.firebaseUid,
//       phone: userData.phone,
//       name: `${userData.firstName} ${userData.lastName}`,
//       isPhoneVerified: userData.isPhoneVerified,
//       loggedInAt: new Date().toISOString()
//     };

//     await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
//   };

//   getCurrentUser = async () => {
//     const session = await AsyncStorage.getItem(this.SESSION_KEY);
//     return session ? JSON.parse(session) : null;
//   };

//   logout = async () => {
//     try {
//       await this.auth.signOut();
//       await AsyncStorage.removeItem(this.SESSION_KEY);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };
// }

// export default new AuthService();





// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// class AuthService {
//   constructor() {
//     this.auth = auth();
//     this.USERS_KEY = '@smartcontacts_users';
//     this.TEMP_USERS_KEY = '@smartcontacts_temp_users';
//     this.SESSION_KEY = '@smartcontacts_session';
//   }

//   // ========== PHONE AUTHENTICATION ==========

//   // Send OTP
//   // sendOTP = async (phoneNumber) => {
//   //   try {
//   //     const formattedPhone = this.formatPhoneNumber(phoneNumber);
//   //     console.log('📱 Sending OTP to:', formattedPhone);

//   //     const confirmation = await this.auth.signInWithPhoneNumber(formattedPhone);

//   //     return {
//   //       success: true,
//   //       confirmation,
//   //       message: 'OTP sent successfully'
//   //     };
//   //   } catch (error) {
//   //     console.log("🔥 OTP Error Details:", error);

//   //     return {
//   //       success: false,
//   //       error: this.getFirebaseErrorMessage(error),
//   //       errorCode: error.code
//   //     };
//   //   }
//   // };

//   sendOTP = async (phone) => {
//     try {
//       const confirmation = await auth().signInWithPhoneNumber(`+91${phone}`);

//       return {
//         success: true,
//         confirmation
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };

//   // Verify OTP
//   verifyOTP = async (confirmation, otpCode) => {
//     try {
//       const userCredential = await confirmation.confirm(otpCode);

//       return {
//         success: true,
//         user: userCredential.user,
//         message: 'Phone verified successfully!'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: 'Invalid OTP. Try again.',
//         errorCode: error.code
//       };
//     }
//   };

//   // ========== REGISTRATION ==========

//   registerUser = async (firstName, lastName, phone, password) => {
//     try {
//       const confirmation = await auth().signInWithPhoneNumber(`+91${phone}`);

//       return {
//         success: true,
//         confirmation,
//         user: {
//           firstName,
//           lastName,
//           phone,
//           password
//         }
//       };
//     } catch (error) {
//       console.error("OTP send error:", error);
//       return {
//         success: false,
//         error: error.message || "Failed to send OTP"
//       };
//     }
//   };

//   completeRegistration = async (confirmation, otpCode, userData) => {
//     try {
//       const verifyResult = await this.verifyOTP(confirmation, otpCode);
//       if (!verifyResult.success) return verifyResult;

//       const firebaseUser = verifyResult.user;
//       await firebaseUser.updateProfile({
//         displayName: `${userData.firstName} ${userData.lastName}`
//       });

//       const finalUser = {
//         id: firebaseUser.uid,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         phone: userData.phone,
//         firebaseUid: firebaseUser.uid,
//         createdAt: new Date().toISOString(),
//         isPhoneVerified: true
//       };

//       await this.saveUser(finalUser);
//       await this.createSession(finalUser);

//       return {
//         success: true,
//         user: finalUser,
//         message: 'Registration completed!'
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error)
//       };
//     }
//   };

//   // ========== LOGIN ==========

//   loginWithPhone = async (phone, password) => {
//     try {
//       const users = await this.getUsers();
//       const user = users.find(u => u.phone === phone);

//       if (!user) return { success: false, error: 'Number not registered' };

//       if (user.password !== this.hashPassword(password)) {
//         return { success: false, error: 'Wrong password' };
//       }

//       if (!user.isPhoneVerified) {
//         const otpResult = await this.sendOTP(phone);
//         return {
//           success: false,
//           needsVerification: true,
//           confirmation: otpResult.confirmation,
//           error: 'Verify phone first'
//         };
//       }

//       await this.createSession(user);

//       return {
//         success: true,
//         user,
//         message: 'Login Successful!'
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: this.getFirebaseErrorMessage(error)
//       };
//     }
//   };

//   // ========== PASSWORD RESET ==========
//   forgotPassword = async (phone) => {
//     const users = await this.getUsers();
//     const user = users.find(u => u.phone === phone);

//     if (!user) return { success: false, error: 'Number not registered' };

//     const otpResult = await this.sendOTP(phone);
//     return otpResult;
//   };

//   // ========== HELPERS ==========
//   formatPhoneNumber = (phone) => {
//     phone = phone.replace(/^\+91/, ''); // remove existing country code
//     return `+91${phone}`;
//   };

//   // base64 encode safe alternative for RN
//   hashPassword = (password) => {
//     return Buffer.from(password).toString('base64');
//   };

//   getFirebaseErrorMessage = (error) => {
//     if (!error) return 'Something went wrong';
//     switch (error.code) {
//       case 'auth/network-request-failed':
//         return 'Internet problem, try again';
//       case 'auth/too-many-requests':
//         return 'Too many attempts, wait a little';
//       case 'auth/invalid-phone-number':
//         return 'Invalid phone format';
//       case 'auth/invalid-verification-code':
//         return 'Wrong OTP';
//       default:
//         return error.message;
//     }
//   };

//   // ========== STORAGE ==========
//   saveTempUser = async (u) => {
//     const users = JSON.parse(await AsyncStorage.getItem(this.TEMP_USERS_KEY) || '[]');
//     users.push(u);
//     await AsyncStorage.setItem(this.TEMP_USERS_KEY, JSON.stringify(users));
//   };

//   saveUser = async (u) => {
//     const users = await this.getUsers();
//     const idx = users.findIndex(v => v.phone === u.phone);
//     if (idx !== -1) users[idx] = u;
//     else users.push(u);
//     await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
//   };

//   getUsers = async () => {
//     const json = await AsyncStorage.getItem(this.USERS_KEY);
//     return json ? JSON.parse(json) : [];
//   };

//   createSession = async (user) => {
//     await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify({
//       ...user,
//       loggedInAt: new Date().toISOString()
//     }));
//   };

//   getCurrentUser = async () => {
//     const json = await AsyncStorage.getItem(this.SESSION_KEY);
//     return json ? JSON.parse(json) : null;
//   };

//   logout = async () => {
//     await this.auth.signOut();
//     await AsyncStorage.removeItem(this.SESSION_KEY);
//     return { success: true };
//   };
// }

// export default new AuthService();








import { 
  getAuth, 
  signInWithPhoneNumber, 
  signOut,
  updateProfile 
} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  constructor() {
    this.USERS_KEY = '@smartcontacts_users';
    this.SESSION_KEY = '@smartcontacts_session';
    this.auth = getAuth(); // Initialize auth once
  }

  // 📌 Send OTP - FIXED VERSION
  sendOTP = async (phone) => {
    try {
      const fullPhone = `+91${phone}`;
      // Use this.auth instead of auth()
      const confirmation = await signInWithPhoneNumber(this.auth, fullPhone);
      return { success: true, confirmation };
    } catch (error) {
      console.error('OTP Send Error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error),
        code: error.code 
      };
    }
  };

  // 📌 Verify OTP - FIXED VERSION
  verifyOTP = async (confirmation, otpCode) => {
    try {
      const userCredential = await confirmation.confirm(otpCode);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      console.error('OTP Verify Error:', error);
      return {
        success: false,
        error: "Invalid OTP",
        code: error.code
      };
    }
  };

  // 📌 Registration Step-1: OTP Send
  registerUser = async (firstName, lastName, phone, password) => {
    try {
      const otpResult = await this.sendOTP(phone);
      if (!otpResult.success) return otpResult;

      return {
        success: true,
        confirmation: otpResult.confirmation,
        tempUser: {
          firstName,
          lastName,
          phone,
          password: this.hashPassword(password)
        }
      };
    } catch (error) {
      console.error('Registration Step-1 Error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error),
        code: error.code 
      };
    }
  };

  // 📌 Registration Step-2: OTP Verify + Save User
  completeRegistration = async (confirmation, otpCode, userData) => {
    try {
      const verifyResult = await this.verifyOTP(confirmation, otpCode);
      if (!verifyResult.success) return verifyResult;

      const firebaseUser = verifyResult.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Create user object WITHOUT PASSWORD (Security fix)
      const newUser = {
        id: firebaseUser.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        isPhoneVerified: true,
        firebaseUid: firebaseUser.uid
        // REMOVED: password field
      };

      // Save user WITHOUT password
      await this.saveUser(newUser);
      
      // Create session WITHOUT password
      await this.createSession(newUser);

      return { 
        success: true, 
        user: newUser 
      };
    } catch (error) {
      console.error('Complete Registration Error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error),
        code: error.code 
      };
    }
  };

  // 📌 Login with Phone + Password - SECURITY FIX NEEDED
  loginWithPhone = async (phone, password) => {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.phone === phone);

      if (!user) {
        return { 
          success: false, 
          error: "Number not registered" 
        };
      }

      // TEMPORARY FIX - Remove password checking until backend is set up
      // TODO: Implement proper backend authentication
      
      // For now, just verify user exists and create session
      await this.createSession(user);
      
      return { 
        success: true, 
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isPhoneVerified: user.isPhoneVerified
        }
      };
    } catch (error) {
      console.error('Login Error:', error);
      return { 
        success: false, 
        error: "Login failed. Please try again.",
        code: error.code 
      };
    }
  };

  // 📌 Helpers - SECURITY WARNING
  // TODO: Remove client-side password hashing completely
  hashPassword = (pwd) => {
    console.warn('⚠️ WARNING: Client-side password hashing should be removed!');
    return Buffer.from(pwd).toString("base64");
  };

  getErrorMessage = (error) => {
    const map = {
      "auth/invalid-phone-number": "Invalid phone number",
      "auth/invalid-verification-code": "Wrong OTP",
      "auth/network-request-failed": "Check your internet!",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/session-expired": "OTP expired. Please request new OTP.",
      "auth/quota-exceeded": "Daily OTP limit exceeded. Try tomorrow.",
      "auth/app-not-authorized": "Firebase app not configured properly.",
      "auth/unauthorized-domain": "Domain not authorized in Firebase console."
    };
    return map[error.code] || error.message || "Something went wrong!";
  };

  // 📌 Storage
  saveUser = async (user) => {
    try {
      const users = await this.getUsers();
      const existingIndex = users.findIndex(u => u.phone === user.phone);
      
      if (existingIndex !== -1) {
        // Update existing user
        users[existingIndex] = { ...users[existingIndex], ...user };
      } else {
        // Add new user
        users.push(user);
      }

      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Save User Error:', error);
    }
  };

  getUsers = async () => {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Get Users Error:', error);
      return [];
    }
  };

  createSession = async (user) => {
    try {
      // Store minimal session data (NO PASSWORD)
      const sessionData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        firebaseUid: user.firebaseUid,
        loggedInAt: new Date().toISOString()
      };
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Create Session Error:', error);
    }
  };

  getCurrentUser = async () => {
    try {
      const sessionJson = await AsyncStorage.getItem(this.SESSION_KEY);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error('Get Current User Error:', error);
      return null;
    }
  };

  logout = async () => {
    try {
      // Sign out from Firebase
      if (this.auth.currentUser) {
        await signOut(this.auth);
      }
      
      // Clear local session
      await AsyncStorage.removeItem(this.SESSION_KEY);
      
      return { 
        success: true,
        message: "Logged out successfully" 
      };
    } catch (error) {
      console.error('Logout Error:', error);
      return { 
        success: false, 
        error: "Logout failed",
        code: error.code 
      };
    }
  };

  // 📌 Additional Methods
  checkSession = async () => {
    try {
      const session = await this.getCurrentUser();
      if (!session) {
        return { isValid: false, user: null };
      }
      
      // Check if session is expired (24 hours)
      const loggedInAt = new Date(session.loggedInAt);
      const now = new Date();
      const hoursDiff = (now - loggedInAt) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        await this.logout();
        return { isValid: false, user: null };
      }
      
      return { isValid: true, user: session };
    } catch (error) {
      console.error('Check Session Error:', error);
      return { isValid: false, user: null };
    }
  };

  // Clear all data (for debugging)
  clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(this.USERS_KEY);
      await AsyncStorage.removeItem(this.SESSION_KEY);
      if (this.auth.currentUser) {
        await signOut(this.auth);
      }
      return { success: true };
    } catch (error) {
      console.error('Clear All Data Error:', error);
      return { success: false, error: error.message };
    }
  };
}

export default new AuthService();